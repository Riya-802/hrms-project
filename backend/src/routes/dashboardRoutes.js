const express = require('express');
const router = express.Router();
const {
  getDashboardStats,
  getDepartmentSummary,
  getRecentEmployees
} = require('../controllers/dashboardController');

router.get('/stats', getDashboardStats);
router.get('/department-summary', getDepartmentSummary);
router.get('/recent-employees', getRecentEmployees);

module.exports = router;
