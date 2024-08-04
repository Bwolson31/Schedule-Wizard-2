const mongoose = require('mongoose');
const { User, Schedule, Activity } = require('../models');
require('dotenv').config(); 

mongoose.connect(process.env.MONGODB_URI || 'mongodb://127.0.0.1:27017/scheduleDatabase', {
  useNewUrlParser: true,
  useUnifiedTopology: true
}).then(() => console.log("Connected to MongoDB for seeding"))
  .catch(err => console.error("Could not connect to MongoDB for seeding:", err));

const seedUsers = [
    { username: 'alice', email: 'alice@example.com', password: 'password123' },
    { username: 'bob', email: 'bob@example.com', password: 'password123' }
];

const seedSchedules = [
    { title: 'Alice’s Workout Plan', owner: null },
    { title: 'Bob’s Work Schedule', owner: null }
];

const seedActivities = [
  { 
      title: 'Gym', 
      startTime: new Date('2022-01-01T07:00:00Z'), 
      endTime: new Date('2022-01-01T08:00:00Z'), 
      description: 'Leg day!' 
  },
  { 
      title: 'Office', 
      startTime: new Date('2022-01-01T09:00:00Z'), 
      endTime: new Date('2022-01-01T17:00:00Z'), 
      description: 'Work at office' 
  }
];


const seedDB = async () => {
    await mongoose.connection.dropDatabase();

    const createdUsers = await User.insertMany(seedUsers);
    seedSchedules[0].owner = createdUsers[0]._id;
    seedSchedules[1].owner = createdUsers[1]._id;

    const createdSchedules = await Schedule.insertMany(seedSchedules);

    seedActivities[0].schedule = createdSchedules[0]._id; 
    seedActivities[1].schedule = createdSchedules[1]._id;

    await Activity.insertMany(seedActivities);

    console.log('Database seeded!');
};

seedDB().then(() => {
    mongoose.connection.close();
});
