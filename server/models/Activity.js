const { Schema, model} = require('mongoose');;

const activitySchema = new Schema({
    title: {
        type: String,
        required: true
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
