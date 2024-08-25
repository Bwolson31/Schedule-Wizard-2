const mongoose = require('mongoose');
const { Schema, model } = mongoose;

// Define the schema for schedules
const scheduleSchema = new Schema({
  // Title of the schedule, required, trimmed, with a maximum length of 100 characters
  title: {
    type: String,
    required: true,
    trim: true,
    maxlength: 100,
  },
  // Array of activities associated with the schedule, referenced by ObjectId
  activities: [{
    type: Schema.Types.ObjectId,
    ref: 'Activity'
  }],
  // Array of comments on the schedule, each with a reference related to user, comment text (TODO), and creation date
  comments: [{
    user: { type: Schema.Types.ObjectId, ref: 'User' },
    comment: String,
    createdAt: { type: Date, default: Date.now }
  }],
  averageRating: {
    type: Number, 
    default: 0
  }
}, { timestamps: true }); // Automatically add createdAt and updatedAt timestamps

// Create a virtual relationship between schedule and rating model. Helps get related raitings for a schedule without needing to store them in the Schedule document. More Efficient. Cleaner. 
scheduleSchema.virtual('ratings', {
  ref: 'Rating',
  localField: '_id',
  foreignField: 'schedule'
});

// Ensure virtual fields are included in toObject and toJSON output
scheduleSchema.set('toObject', { virtuals: true });
scheduleSchema.set('toJSON', { virtuals: true });

// Create the Schedule model using the schema
const Schedule = model('Schedule', scheduleSchema);

module.exports = Schedule;
