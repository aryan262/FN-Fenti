const express = require('express');
const { createTask, startTask } = require('../controllers/taskController');
const authMiddleware = require('../middlewares/authMiddleware');
const router = express.Router();

router.post('/task', authMiddleware, createTask);
router.post('/task/start/:taskId', authMiddleware, startTask);

module.exports = router;
