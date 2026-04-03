const express = require('express');
const { protect } = require('../middleware/auth');
const asyncHandler = require('../utils/asyncHandler');
const {
  register,
  login,
  getMe,
  updateProfile,
  changePassword
} = require('../controllers/authController');

const router = express.Router();

// POST /api/auth/register
router.post('/register', asyncHandler(register));

// POST /api/auth/login
router.post('/login', asyncHandler(login));

// GET /api/auth/me
router.get('/me', protect, asyncHandler(getMe));

// PUT /api/auth/profile
router.put('/profile', protect, asyncHandler(updateProfile));

// PUT /api/auth/password
router.put('/password', protect, asyncHandler(changePassword));

module.exports = router;
