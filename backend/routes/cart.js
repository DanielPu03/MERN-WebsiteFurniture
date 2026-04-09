const express = require('express');
const { protect } = require('../middleware/auth');
const {
  getCart,
  addToCart,
  updateCartItem,
  removeFromCart,
  clearCart,
  getCartSummary
} = require('../controllers/cartController');

const router = express.Router();

// Cart routes
router.get('/', protect, getCart);
router.post('/add', protect, addToCart);
router.put('/update', protect, updateCartItem);
router.delete('/remove/:sanPhamId', protect, removeFromCart);
router.delete('/clear', protect, clearCart);
router.get('/summary', protect, getCartSummary);

module.exports = router;
