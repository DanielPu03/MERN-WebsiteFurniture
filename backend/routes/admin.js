const express = require('express');
const { protect, adminOnly } = require('../middleware/auth');
const { updateUserRole } = require('../controllers/adminController');

const router = express.Router();

// Admin routes
router.put('/users/role', protect, adminOnly, updateUserRole);

module.exports = router;
