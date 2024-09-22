require('dotenv').config({
  path: `.env.${process.env.NODE_ENV}`
});



const { User, Schedule, Activity, Rating } = require('../models');
const mongoose = require('mongoose');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const { signToken } = require('../auth/auth');
const stripe = require('stripe')(process.env.STRIPE_SECRET_KEY);
console.log('Stripe initialized:', !!stripe);

console.log('Environment:', process.env.NODE_ENV);
console.log('Stripe Secret Key:', process.env.STRIPE_SECRET_KEY);

console.log('Loaded Stripe Secret Key:', stripe);

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

      const user = await User.findById(context.user._id).populate({
        path: 'schedules',
        options: {
          sort,
        },
      });

      return user;
    },

    getSchedules: async (_, { category, tags, sortBy = 'DateCreated', sortOrder = 'NewestFirst' }) => {

      if (category) query.category = { $in: [category] };
      if (tags) query.tags = { $in: tags };

      const sortFieldMap = {
          DateCreated: 'createdAt',
          DateUpdated: 'updatedAt',
          Title: 'title',
          Popularity: 'averageRating'
      };
  
      const sortOrderMap = {
        NewestFirst: -1,  
        OldestFirst: 1,   
        HighestFirst: -1,
        LowestFirst: 1   
    };
  
      const sortField = sortFieldMap[sortBy];
      const order = sortOrderMap[sortOrder];
  
      const schedules = await Schedule.find().sort({ [sortField]: order }).populate('activities').populate('category');

    



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

    searchSchedules: async (_, { term, category, tags }) => {
      const query = {
        title: { $regex: new RegExp(term, 'i') }
    };

    if (category) query.category = { $in: [category] };
    if (tags) query.tags = { $in: tags };

    const schedules = await Schedule.find(query).populate('activities');
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

      const ratings = await Rating.find({ user: context.user._id }).populate({
        path: 'schedule',
        populate: {
          path: 'activities',
          model: 'Activity',
        },
      }).sort(sort);

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

    createDonationSession: async (_, { amount }) => {
      try {
        console.log('Creating Stripe session with key:', process.env.STRIPE_SECRET_KEY);
        const session = await stripe.checkout.sessions.create({
          payment_method_types: ['card'],
          line_items: [{
            price_data: {
              currency: 'usd',
              product_data: {
                name: 'Custom Donation',
              },
              unit_amount: Math.round(amount * 100), // Convert amount to cents
            },
            quantity: 1,
          }],
          mode: 'payment',
          success_url: `${process.env.FRONTEND_URL}/success?amount=${amount}`,
          cancel_url: `${process.env.FRONTEND_URL}/cancel`,
        });

        console.log('Session ID:', session.id);
        return { sessionId: session.id };

      } catch (error) {
        console.error('Error creating Stripe session:', error);
        return {
          error: error.message
        };
      }
    },


    addRating: async (parent, { scheduleId, rating }, context) => {
      if (!context.user) {
        throw new CustomAuthError('You must be logged in to rate schedules.');
      }

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
        })
        .populate('category'); // Ensure category is populated

        if (!updatedSchedule) {
          throw new Error('Failed to fetch updated schedule');
        }

        // Ensure the schedule has a category, set to 'GENERAL' if null
        if (!updatedSchedule.category) {
          updatedSchedule.category = 'GENERAL';
          await updatedSchedule.save(); // Save the schedule if category is missing and set to default
        }

        return updatedSchedule;
      } catch (error) {
        console.error(`Error in addRating resolver: ${error}`);
        throw new Error('Error processing your rating.');
      }
    },
    
    
    addSchedule: async (parent, { title, activities, category, tags }, context) => {
      if (!context.user) {
        throw new CustomAuthError('You must be logged in to create a schedule.');
      }

      if (!category) {
        category = 'GENERAL';
      }

      const validCategories = ['EXERCISE', 'NUTRITION', 'WORK_PRODUCTIVITY', 'HOBBIES_CRAFTS', 'EDUCATION', 'HOMELIFE', 'SOCIAL_LIFE', 'MINDFULNESS', 'GENERAL'];
      if (!validCategories.includes(category)) {
        throw new Error('Invalid or missing category');
      }
   
    
    
      try {
        // Create a new schedule with categories and tags
        const schedule = await Schedule.create({
          title,
          category,
          tags,
          creator: context.user._id
        });
    
        // Handle activities
        let activityIds = [];
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
          activityIds = activityDocs.map(doc => doc._id);
          await Schedule.findByIdAndUpdate(schedule._id, { $set: { activities: activityIds } });
        }
    
        await User.findByIdAndUpdate(
          context.user._id,
          { $push: { schedules: schedule._id } },
          { new: true }
        );
    
       
        const populatedSchedule = await Schedule.findById(schedule._id)
          .populate('activities')
          .populate('creator', 'username'); // 
    
        console.log("Returning populated schedule:", populatedSchedule);
        return populatedSchedule;
      } catch ( error ) {
        console.error("Error in addSchedule resolver:", error);
        throw new Error("Failed to create schedule due to an error.");
      }
    },


    updateSchedule: async (parent, { scheduleId, title, category, tags }, context) => {
      if (!context.user) {
          throw new CustomAuthError('You must be logged in to update a schedule.');
      }
      const update = { title };
      if (category) update.category = category;
      if (tags) update.tags = tags;
  
      return Schedule.findByIdAndUpdate(
          scheduleId,
          { $set: update },
          { new: true }
      ).populate('activities').populate('comments.user').populate({
          path: 'ratings',
          populate: {
              path: 'user',
              select: 'username'
          }
      });
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
