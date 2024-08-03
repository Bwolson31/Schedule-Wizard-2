const mongoose = require('mongoose');
const { Schema, model } = mongoose;

// Define the schema for the Rating model
const ratingSchema = new Schema({
  // Reference to the Schedule model
  schedule: {
    type: Schema.Types.ObjectId,
    ref: 'Schedule',
    required: true
  },
  // Reference to the User model
  user: {
    type: Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  // Rating value
  rating: {
    type: Number,
    required: true
  },
  // Timestamp for when the rating was created
  createdAt: {
    type: Date,
    default: Date.now
  }
});

//  Forces user to only be able to rate a schedule once
ratingSchema.index({ user: 1, schedule: 1 }, { unique: true });

// Create the Rating model
const Rating = model('Rating', ratingSchema);

// Export the Rating model
module.exports = Rating;
