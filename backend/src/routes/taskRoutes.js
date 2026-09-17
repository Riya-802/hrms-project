const express = require('express');
const router = express.Router();
const {
  getTasks,
  getTaskById,
  createTask,
  updateTask,
  deleteTask,
  getTaskReports
} = require('../controllers/taskController');

// Task Reports Endpoint (placed before /:id)
router.get('/reports', getTaskReports);

// Standard CRUD Endpoints
router.get('/', getTasks);
router.get('/:id', getTaskById);
router.post('/', createTask);
router.put('/:id', updateTask);
router.delete('/:id', deleteTask);

module.exports = router;
