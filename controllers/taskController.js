const Task = require('../models/task.model');
const { startStreaming } = require('../utils/streamingUtils');

const createTask = async (req, res) => {
    const { platform, url, frequency } = req.body;
    const task = new Task({
        platform,
        url,
        frequency,
        user: req.user._id,
    });
    try {
        await task.save();
        res.status(201).send(task);
    } catch (error) {
        res.status(400).send(error);
    }
};

const startTask = async (req, res) => {
    const { taskId } = req.params;
    try {
        const task = await Task.findById(taskId);
        if (!task) {
            return res.status(404).send({ error: 'Task not found' });
        }
        task.status = 'running';
        await task.save();
        await startStreaming(task);
        task.status = 'completed';
        await task.save();
        res.send(task);
    } catch (error) {
        res.status(400).send(error);
    }
};

module.exports = { createTask, startTask };
