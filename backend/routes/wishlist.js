const express = require('express');
const { protect, adminOnly } = require('../middleware/auth');
const {
  getWishlist,
  getAllWishlists,
  addToWishlist,
  removeFromWishlist,
  removeFromWishlistAdmin,
  checkProductInWishlist,
  clearWishlist
} = require('../controllers/wishlistController');

const router = express.Router();

// GET /api/wishlist - Get user's wishlist
router.get('/', protect, getWishlist);

// GET /api/wishlist/all - Get all wishlists (admin)
router.get('/all', protect, adminOnly, getAllWishlists);

// POST /api/wishlist
router.post('/', protect, addToWishlist);

// DELETE /api/wishlist/:sanPhamId - Remove from user's wishlist
router.delete('/:sanPhamId', protect, removeFromWishlist);

// DELETE /api/wishlist/admin/:wishlistId/:sanPhamId - Remove from any user's wishlist (admin)
router.delete('/admin/:wishlistId/:sanPhamId', protect, adminOnly, removeFromWishlistAdmin);

// GET /api/wishlist/check/:sanPhamId
router.get('/check/:sanPhamId', protect, checkProductInWishlist);

// DELETE /api/wishlist/clear
router.delete('/clear', protect, clearWishlist);

module.exports = router;
