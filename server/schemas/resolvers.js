const { User, Schedule, Activity, Rating } = require('../models');
const mongoose = require('mongoose');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const { signToken } = require('../auth/auth');
const stripe = require('stripe')(process.env.STRIPE_SECRET_KEY);

// Custom error class to replace AuthenticationError temporarily
class CustomAuthError extends Error {
  constructor(message) {
    super(message);
    this.name = 'CustomAuthError';
    this.code = 'AUTHENTICATION_ERROR';
  }
}

const resolvers = {
  Query: {
    users: async () => User.find(),

    user: async (parent, { username }) => {
      return User.findOne({ username }).populate({
        path: 'schedules',
        populate: {
          path: 'activities',
        },
      });
    },

    me: async (parent, { sortBy, sortOrder }, context) => {
      console.log('Resolver - Context', context.user); 
      if (!context.user) {
        throw new CustomAuthError('You must be logged in to perform this action.');
      }

      const sort = {};
      if (sortBy && sortOrder) {
        sort[sortBy.toLowerCase()] = sortOrder === 'ASC' ? 1 : -1;
      }

      console.log('Sort object:', sort);

      const user = await User.findById(context.user._id).populate({
        path: 'schedules',
        options: {
          sort,
        },
      });

      console.log('User data fetched:', user);

      return user;
    },

    getSchedules: async (_, { sortBy = 'CREATED_AT', sortOrder = 'DESC' }) => {
      let sortField;
      switch (sortBy) {
        case 'CREATED_AT':
          sortField = 'createdAt';
          break;
        case 'UPDATED_AT':
          sortField = 'updatedAt';
          break;
        case 'TITLE':
          sortField = 'title';
          break;
        case 'RATING':
          sortField = 'averageRating';
          break;
        default:
          sortField = 'createdAt';
      }

      const order = sortOrder === 'ASC' ? 1 : -1;
      const schedules = await Schedule.find().sort({ [sortField]: order }).populate('activities');
      for (const schedule of schedules) {
        const ratings = await Rating.find({ schedule: schedule._id }).populate('user');
        schedule.ratings = ratings;
      }
      return schedules;
    },

    getOneSchedule: async (parent, { scheduleId }) => {
      try {
        const schedule = await Schedule.findById(scheduleId)
          .populate('activities')
          .populate('comments.user', 'username')
          .populate({
            path: 'ratings',
            populate: { path: 'user', select: 'username' }
          });

          const ratings = await Rating.find({ schedule: schedule._id });
          if (ratings.length) {
              const averageRating = ratings.reduce((acc, r) => acc + r.rating, 0) / ratings.length;
              schedule.averageRating = averageRating;  
          } else {
              schedule.averageRating = 0;  // Default to 0 if no ratings
          }
  
          return schedule;
      } catch (error) {
        console.error(`Error fetching schedule: ${error}`);
        throw new Error('Error fetching schedule.');
      }
    },

    searchUsers: async (_, { term }) => {
      return User.find({
        $or: [
          { username: { $regex: new RegExp(term, 'i') } },
          { email: { $regex: new RegExp(term, 'i') } },
        ],
      });
    },

    searchSchedules: async (_, { term }) => {
      const schedules = await Schedule.find({
        title: { $regex: new RegExp(term, 'i') },
      }).populate('activities');
      for (const schedule of schedules) {
        const ratings = await Rating.find({ schedule: schedule._id }).populate('user');
        schedule.ratings = ratings;
      }
      return schedules;
    },

    checkUserRating: async (parent, { scheduleId }, context) => {
      if (!context.user) {
        throw new CustomAuthError('You must be logged in to check your rating.');
      }

      const rating = await Rating.findOne({ user: context.user._id, schedule: scheduleId }).populate('user');
      return rating;
    },

    getRatedSchedules: async (parent, { sortBy, sortOrder }, context) => {
      if (!context.user) {
        throw new CustomAuthError('You must be logged in to perform this action.');
      }

      let sort = {};
      if (sortBy && sortOrder) {
        const sortField = sortBy === 'CREATED_AT' ? 'createdAt' : sortBy.toLowerCase();
        sort[sortField] = sortOrder === 'ASC' ? 1 : -1;
      }

      console.log("Sort object: ", sort);

      const ratings = await Rating.find({ user: context.user._id }).populate({
        path: 'schedule',
        populate: {
          path: 'activities',
          model: 'Activity',
        },
      }).sort(sort);

      console.log("Ratings fetched: ", ratings);

      return ratings.map(rating => ({
        schedule: rating.schedule,
        rating: rating.rating,
      }));
    },
  },

  Mutation: {
    addUser: async (parent, { username, email, password }) => {
      const user = await User.create({ username, email, password });
      const token = signToken(user); 
      return { token, user };
    },

    login: async (parent, { email, password }, context) => {
      const user = await User.findOne({ email });
      if (!user) {
        throw new CustomAuthError('No user found with this email address');
      }

      const correctPw = await user.isCorrectPassword(password);

      if (!correctPw) {
        throw new CustomAuthError('Incorrect credentials');
      }

      const token = signToken(user); 
      return { token, user };
    },



    addRating: async (parent, { scheduleId, rating }, context) => {
      if (!context.user) {
        throw new CustomAuthError('You must be logged in to rate schedules.');
      }
    
      console.log(`Received request to rate schedule ${scheduleId} with rating ${rating} by user ${context.user._id}`);
    
      try {
        // Check if rating already exists
        const existingRating = await Rating.findOne({ user: context.user._id, schedule: scheduleId });
    
        // Update existing or create new rating
        if (existingRating) {
          existingRating.rating = rating;
          await existingRating.save();
        } else {
          await Rating.create({ user: context.user._id, schedule: scheduleId, rating });
        }
    
        // Recalculate the average rating
        const ratings = await Rating.find({ schedule: scheduleId });
        const averageRating = ratings.reduce((acc, curr) => acc + curr.rating, 0) / (ratings.length || 1);
    
        // Update the schedule with the new average rating
        const updatedSchedule = await Schedule.findByIdAndUpdate(
          scheduleId, 
          { $set: { averageRating } },
          { new: true }
        )
        .populate('activities')
        .populate({
          path: 'comments.user',
          select: 'username'
        })
        .populate({
          path: 'ratings',
          populate: {
            path: 'user',
            select: 'username'
          }
        });
    
        if (!updatedSchedule) {
          throw new Error('Failed to fetch updated schedule');
        }
    
        return updatedSchedule;
      } catch (error) {
        console.error(`Error in addRating resolver: ${error}`);
        throw new Error('Error processing your rating.');
      }
    },
    

    addComment: async (parent, { scheduleId, comment }, context) => {
      if (!context.user) {
        throw new CustomAuthError('You must be logged in to comment on schedules.');
      }
      
      try {
        // Correctly creating a new ObjectId instance from the user's ID
        const userId = new mongoose.Types.ObjectId(context.user._id);
        
        const updatedSchedule = await Schedule.findByIdAndUpdate(
          scheduleId,
          { 
            $push: { 
              comments: {
                user: userId, 
                comment: comment,
                createdAt: new Date()
              } 
            }
          },
          { new: true }
        )
        .populate({
          path: 'comments.user',
          select: 'username'
        });
    
        if (!updatedSchedule) {
          throw new Error('Failed to fetch updated schedule after adding comment');
        }
    
        return updatedSchedule;
      } catch (error) {
        console.error(`Error in addComment resolver: ${error}`);
        throw new Error('Error processing your comment.');
      }
    },
    
    
    addSchedule: async (parent, { title, activities }, context) => {
      if (!context.user) {
        throw new CustomAuthError('You must be logged in to create a schedule.');
      }

      try {
        console.log("Creating new schedule with title:", title);
        const schedule = await Schedule.create({ title });
        console.log("Schedule created with ID:", schedule._id);

        if (activities && activities.length > 0) {
          console.log("Inserting activities:", activities);
          const activityDocs = await Activity.insertMany(
            activities.map(activity => ({
              ...activity,
              startTime: new Date(activity.startTime), 
              endTime: new Date(activity.endTime), 
              schedule: schedule._id
            }))
          );

          if (activityDocs.length) {
            const activityIds = activityDocs.map(doc => doc._id);
            console.log("Activities created with IDs:", activityIds);
            await Schedule.findByIdAndUpdate(schedule._id, { $set: { activities: activityIds } });
            console.log("Schedule updated with activity IDs:", schedule._id);
          } else {
            console.log("No activities were created, check input data and model constraints.");
          }
        } else {
          console.log("No activities provided to insert.");
        }

        console.log("Linking schedule to user:", context.user._id);
        await User.findByIdAndUpdate(
          context.user._id,
          { $push: { schedules: schedule._id } },
          { new: true }
        );

        console.log("Fetching the complete schedule to return.");
        const populatedSchedule = await Schedule.findById(schedule._id).populate('activities');
        console.log("Returning populated schedule:", populatedSchedule);

        return populatedSchedule;
      } catch (error) {
        console.error("Error creating schedule:", error);
        throw new Error("Failed to create schedule due to an error.");
      }
    },

    updateSchedule: async (parent, { scheduleId, title }, context) => {
      if (!context.user) {
        throw new CustomAuthError('You must be logged in to update a schedule.');
      }
      return Schedule.findByIdAndUpdate(
        scheduleId,
        { $set: { title: title } },
        { new: true });
    },

    deleteSchedule: async (parent, { scheduleId, userId }, context) => {
      if (!context.user) {
        throw new CustomAuthError('You must be logged in to delete a schedule.');
      }
      const schedule = await Schedule.findByIdAndDelete(scheduleId);
      if (!schedule) {
        throw new Error('Schedule not found');
      }
      await User.findByIdAndUpdate(
        userId,
        { $pull: { schedules: schedule._id } },
        { new: true }
      );
      const user = await User.findById(userId).populate('schedules');
      return user;
    },

    addActivity: async (parent, { scheduleId, activityData }, context) => {
      if (!context.user) {
        throw new CustomAuthError('You need to be logged in!');
      }

      const { title, description, startTime, endTime, day } = activityData;
      const newActivity = await Activity.create({
        title,
        description,
        startTime: new Date(startTime).toISOString(),
        endTime: new Date(endTime).toISOString(),
        day,
      });

      await Schedule.findByIdAndUpdate(
        scheduleId,
        { $push: { activities: newActivity._id } },
        { new: true }
      );

      return Schedule.findById(scheduleId).populate('activities');
    },

    removeActivity: async (parent, { activityId }) => {
      const activity = await Activity.findByIdAndDelete(activityId);
      return Schedule.findOneAndUpdate(
        { activities: activityId },
        { $pull: { activities: activityId } },
        { new: true }
      ).populate('activities');
    },

    updateActivity: async (parent, { activityId, title, description, startTime, endTime, day }, context) => {
      if (!context.user) {
        throw new CustomAuthError('You need to be logged in!');
      }

      const updatedActivity = await Activity.findByIdAndUpdate(
        activityId,
        {
          title,
          description,
          startTime: new Date(startTime).toISOString(),
          endTime: new Date(endTime).toISOString(),
          day
        },
        { new: true, runValidators: true }
      );

      if (!updatedActivity) {
        throw new Error('Activity not found');
      }

      return updatedActivity;
    }
  },
};

module.exports = resolvers;
