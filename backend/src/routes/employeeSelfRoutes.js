const express = require('express');
const router = express.Router();
const { getSelfDashboard } = require('../controllers/employeeSelfController');
const { verifyToken, requireRole } = require('../middleware/authMiddleware');

// GET /api/employee/me/dashboard (Protected: Employee role)
router.get('/me/dashboard', verifyToken, requireRole('employee', 'admin'), getSelfDashboard);

module.exports = router;
