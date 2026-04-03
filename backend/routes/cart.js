const express = require('express');
const { protect } = require('../middleware/auth');
const asyncHandler = require('../utils/asyncHandler');
const {
  getCart,
  addToCart,
  updateCartItem,
  removeFromCart,
  clearCart,
  getCartSummary
} = require('../controllers/cartController');

const router = express.Router();

// GET /api/cart
router.get('/', protect, asyncHandler(getCart));

// POST /api/cart/add
router.post('/add', protect, asyncHandler(addToCart));

// PUT /api/cart/update
router.put('/update', protect, asyncHandler(updateCartItem));

// DELETE /api/cart/remove/:sanPhamId
router.delete('/remove/:sanPhamId', protect, asyncHandler(removeFromCart));

// DELETE /api/cart/clear
router.delete('/clear', protect, asyncHandler(clearCart));

// GET /api/cart/summary
router.get('/summary', protect, asyncHandler(getCartSummary));

module.exports = router;
