const express = require('express');
const { protect, adminOnly } = require('../middleware/auth');
const asyncHandler = require('../utils/asyncHandler');
const {
  getAllUsers,
  getUserById,
  updateUser,
  deleteUser,
  getUserAddresses,
  addAddress,
  updateAddress,
  deleteAddress
} = require('../controllers/userController');

const router = express.Router();

// GET /api/users (admin only)
router.get('/', protect, adminOnly, asyncHandler(getAllUsers));

// GET /api/users/:id (admin only)
router.get('/:id', protect, adminOnly, asyncHandler(getUserById));

// PUT /api/users/:id (admin only)
router.put('/:id', protect, adminOnly, asyncHandler(updateUser));

// DELETE /api/users/:id (admin only)
router.delete('/:id', protect, adminOnly, asyncHandler(deleteUser));

// GET /api/users/addresses
router.get('/addresses', protect, asyncHandler(getUserAddresses));

// POST /api/users/addresses
router.post('/addresses', protect, asyncHandler(addAddress));

// PUT /api/users/addresses/:addressId
router.put('/addresses/:addressId', protect, asyncHandler(updateAddress));

// DELETE /api/users/addresses/:addressId
router.delete('/addresses/:addressId', protect, asyncHandler(deleteAddress));

module.exports = router;
