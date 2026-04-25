const express = require('express');
const { protect, adminOnly } = require('../middleware/auth');
const { updateUserRole } = require('../controllers/adminController');
const { getDashboardStats } = require('../controllers/dashboardController');

const router = express.Router();

// Admin routes
router.put('/users/role', protect, adminOnly, updateUserRole);
router.get('/dashboard/stats', protect, adminOnly, getDashboardStats);

module.exports = router;
