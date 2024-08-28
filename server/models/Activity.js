const { Schema, model} = require('mongoose');

function titleCase(title) {
    return title.toLowerCase().replace(/\b(\w)/g, s => s.toUpperCase());
  }



const activitySchema = new Schema({
    title: {
        type: String,
        required: true,
        set: titleCase
    },
    startTime: {
        type: Date,
        required: true, 
        default: Date.now
    },
    endTime: {
        type: Date,
        required: true,
        default: Date.now
    },
    description: {
        type: String
    },
    day: {
        type: String,
        required: true
    }
});

const Activity = model('Activity', activitySchema);

module.exports = Activity;
