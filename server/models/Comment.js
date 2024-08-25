const mongoose = require('mongoose');
const { Schema } = mongoose;

const commentSchema = new Schema({
  schedule: { 
    type: Schema.Types.ObjectId, 
    ref: 'Schedule', 
    required: true 
  },
  user: { 
    type: Schema.Types.ObjectId, 
    ref: 'User', 
    required: true 
  },
  comment: { 
    type: String, 
    required: true 
  },
  createdAt: { 
    type: Date, 
    default: Date.now 
  }
});

const Comment = mongoose.model('Comment', commentSchema);

module.exports = Comment;
