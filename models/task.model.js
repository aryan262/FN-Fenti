const mongoose = require('mongoose');

const taskSchema = new mongoose.Schema({
    platform: {
        type: String,
        required: true,
    },
    url: {
        type: String,
        required: true,
    },
    frequency: {
        type: Number,
        required: true,
    },
    status: {
        type: String,
        enum: ['pending', 'running', 'completed'],
        default: 'pending',
    },
    user: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true,
    }
});

const Task = mongoose.model('Task', taskSchema);
module.exports = Task;
