const express = require('express');
const { protect } = require('../middleware/auth');
const {
  getWishlist,
  addToWishlist,
  removeFromWishlist,
  checkProductInWishlist,
  clearWishlist
} = require('../controllers/wishlistController');

const router = express.Router();

// GET /api/wishlist
router.get('/', protect, getWishlist);

// POST /api/wishlist
router.post('/', protect, addToWishlist);

// DELETE /api/wishlist/:sanPhamId
router.delete('/:sanPhamId', protect, removeFromWishlist);

// GET /api/wishlist/check/:sanPhamId
router.get('/check/:sanPhamId', protect, checkProductInWishlist);

// DELETE /api/wishlist/clear
router.delete('/clear', protect, clearWishlist);

module.exports = router;
