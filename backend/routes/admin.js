const express = require('express');
const { protect, adminOnly } = require('../middleware/auth');
const asyncHandler = require('../utils/asyncHandler');
const { updateUserRole } = require('../controllers/adminController');

const router = express.Router();

// PUT /api/admin/users/role - Update user role
router.put('/users/role', protect, adminOnly, asyncHandler(updateUserRole));

module.exports = router;
