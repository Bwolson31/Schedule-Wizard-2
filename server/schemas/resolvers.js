const { User, Schedule, Activity, Rating } = require('../models');
const mongoose = require('mongoose');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const { signToken, AuthenticationError } = require('../auth/auth');
const stripe = require('stripe')(process.env.STRIPE_SECRET_KEY);

const resolvers = {
  Query: {
    // Fetch all users
    users: async () => User.find(),

    // Fetch a single user by username with schedules and activities
    user: async (parent, { username }) => {
      return User.findOne({ username }).populate({
        path: 'schedules',
        populate: {
          path: 'activities',
        },
      });
    },

    // Fetch the logged-in user's data with schedules, including sorting ability
    me: async (parent, { sortBy, sortOrder }, context) => {
      console.log('Received sortBy:', sortBy);
      console.log('Received sortOrder:', sortOrder);

      if (!context.user) {
        throw new Error('You must be logged in.');
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

      console.log('User schedules:', user.schedules);

      return user;
    },

    // Fetch all schedules with sorting ability and  activities
    getSchedules: async (parent, { sortBy, sortOrder }) => {
      let sort = {};
      if (sortBy && sortOrder) {
        sort[sortBy.toLowerCase()] = sortOrder === 'ASC' ? 1 : -1;
      }

      return Schedule.find().populate('activities').sort(sort);
    },

    // Fetch all schedules with sorting capability and populated activities and ratings
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

    // Fetch a single schedule by ID with activities, comments (TODO), and ratings
    getOneSchedule: async (parent, { scheduleId }) => {
      try {
        const schedule = await Schedule.findById(scheduleId)
          .populate('activities')
          .populate('comments.user', 'username')
          .populate({
            path: 'ratings',
            populate: { path: 'user', select: 'username' }
          });

        return schedule;
      } catch (error) {
        console.error(`Error fetching schedule: ${error}`);
        throw new Error('Error fetching schedule.');
      }
    },

    // Search users by username or email (case-insensitve)
    searchUsers: async (_, { term }) => {
      return User.find({
        $or: [
          { username: { $regex: new RegExp(term, 'i') } },
          { email: { $regex: new RegExp(term, 'i') } },
        ],
      });
    },

    // Search schedules by title (case-insensitive) and activities and ratings
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

    // Check if the logged-in user has rated a specific schedule
    checkUserRating: async (parent, { scheduleId }, context) => {
      if (!context.user) {
        throw new AuthenticationError('You must be logged in to check your rating.');
      }
  
      const rating = await Rating.findOne({ user: context.user._id, schedule: scheduleId }).populate('user');
      return rating;
    },

    // Fetch the logged-in user's rated schedules with optional sorting
    getRatedSchedules: async (parent, { sortBy, sortOrder }, context) => {
      if (!context.user) {
        throw new Error('You must be logged in.');
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
    // Add a new user with unique email and hashed password
    addUser: async (parent, { username, email, password }) => {
      const existingUser = await User.findOne({ email });
      if (existingUser) {
        throw new Error('A user with this email already exists.');
      }
      const user = await User.create({ username, email, password });
      const token = signToken(user);
      return { token, user };
    },

    // Log in a user by email and password
    login: async (parent, { email, password }) => {
      const user = await User.findOne({ email });
      if (!user) {
        throw AuthenticationError;
      }
      const correctPw = await user.isCorrectPassword(password);
      if (!correctPw) {
        throw AuthenticationError;
      }
      const token = signToken(user);
      return { token, user };
    },

    // Add or update a rating for a schedule by user
    addRating: async (parent, { scheduleId, rating }, context) => {
      if (!context.user) {
        throw new AuthenticationError('You must be logged in to rate schedules.');
      }
    
      console.log(`Received request to rate schedule ${scheduleId} with rating ${rating} by user ${context.user._id}`);
    
      try {
        const existingRating = await Rating.findOne({ user: context.user._id, schedule: scheduleId });
    
        if (existingRating) {
          existingRating.rating = rating;
          existingRating.createdAt = new Date();
          await existingRating.save();
          console.log(`Existing rating updated successfully: ${JSON.stringify(existingRating)}`);
    
          return {
            message: 'Rating updated successfully.',
            schedule: await Schedule.findById(scheduleId)
              .populate('activities')
              .populate('comments.user', 'username')
              .populate({
                path: 'ratings',
                populate: { path: 'user', select: 'username' }
              })
          };
        } else {
          const newRating = await Rating.create({
            user: context.user._id,
            schedule: scheduleId,
            rating,
            createdAt: new Date()
          });
          console.log(`New rating created successfully: ${JSON.stringify(newRating)}`);
    
          return {
            message: 'New rating created successfully.',
            schedule: await Schedule.findById(scheduleId)
              .populate('activities')
              .populate('comments.user', 'username')
              .populate({
                path: 'ratings',
                populate: { path: 'user', select: 'username' }
              })
          };
        }
      } catch (error) {
        console.error(`Error updating/creating rating: ${error}`);
        throw new Error('Error processing your rating.');
      }
    },
    
    // Add a comment to a schedule by user
    addComment: async (parent, { scheduleId, comment }, context) => {
      if (!context.user) {
        throw new AuthenticationError('You must be logged in to comment on schedules.');
      }
      return Schedule.findByIdAndUpdate(
        scheduleId,
        { $push: { comments: { user: context.user._id, comment: comment, createdAt: new Date() } } },
        { new: true }
      ).populate('comments.user');
    },

    // Add a new schedule with optional activities for user
    addSchedule: async (parent, { title, activities }, context) => {
      if (!context.user) {
        throw AuthenticationError;
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
              startTime: new Date(activity.startTime), // Correctly parses date
              endTime: new Date(activity.endTime), // Correctly parses date
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

    // Update an existing schedule's title
    updateSchedule: async (parent, { scheduleId, title }, context) => {
      if (!context.user) {
        throw AuthenticationError;
      }
      return Schedule.findByIdAndUpdate(
        scheduleId,
        { $set: { title: title } },
        { new: true });
    },

    // Delete a schedule 
    deleteSchedule: async (parent, { scheduleId, userId }, context) => {
      if (!context.user) {
        throw AuthenticationError;
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

    // Add a new activity to a schedule
    addActivity: async (parent, { scheduleId, activityData }, context) => {
      if (!context.user) {
        throw new AuthenticationError('You need to be logged in!');
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

    // Remove an activity from a schedule
    removeActivity: async (parent, { activityId }) => {
      const activity = await Activity.findByIdAndDelete(activityId);
      return Schedule.findOneAndUpdate(
        { activities: activityId },
        { $pull: { activities: activityId } },
        { new: true }
      ).populate('activities');
    },

    // Update an existing activity's details
    updateActivity: async (parent, { activityId, title, description, startTime, endTime, day }, context) => {
      if (!context.user) {
        throw new AuthenticationError('You need to be logged in!');
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
  }
};

module.exports = resolvers;
