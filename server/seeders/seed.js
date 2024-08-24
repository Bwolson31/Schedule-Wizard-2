const mongoose = require('mongoose');
const bcrypt = require('bcrypt');
const { User, Schedule, Activity, Comment } = require('../models/index'); 
require('dotenv').config({
    path: `.env.${process.env.NODE_ENV}`
  });

// Connect to MongoDB
mongoose.connect('mongodb://localhost:27017/scheduleDatabase2', {
  useNewUrlParser: true,
  useUnifiedTopology: true,
})
.then(() => console.log('MongoDB connected successfully!'))
.catch(err => console.error('MongoDB connection error:', err));

const users = [
  {
    username: 'johnDoe',
    email: 'john@example.com',
    password: bcrypt.hashSync('123456', 10),
  },
  {
    username: 'janeDoe',
    email: 'jane@example.com',
    password: bcrypt.hashSync('123456', 10),
  }
];

const schedules = [
  {
    title: 'Workout Routine',
    activities: [],
    ratings: [],
    // comments: []
  }
];

const activities = [
    {
      title: 'Morning Run',
      description: 'A 30-minute light run.',
      startTime: new Date(`2024-01-01T07:00:00`), 
      endTime: new Date(`2024-01-01T07:30:00`), 
      day: 'Monday'
    }
  ];



const seedDB = async () => {
  await User.deleteMany({});
  await Schedule.deleteMany({});
  await Activity.deleteMany({});
//   await Comment.deleteMany({});

  const createdUsers = await User.insertMany(users);
  const user1 = createdUsers[0]._id;
  const user2 = createdUsers[1]._id;

  schedules.forEach(schedule => {
    schedule.user = user1; // Assign first user as the creator
  });

  const createdSchedules = await Schedule.insertMany(schedules);

  activities.forEach(activity => {
    activity.schedule = createdSchedules[0]._id; // Assign to the first schedule
  });

  const createdActivities = await Activity.insertMany(activities);

  // Update schedule with activities
  await Schedule.findByIdAndUpdate(createdSchedules[0]._id, {
    $push: { activities: { $each: createdActivities.map(a => a._id) } }
  });



  console.log('Database seeded!');
};

seedDB().then(() => {
  mongoose.connection.close();
});
