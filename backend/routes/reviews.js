const express = require('express');
const { protect, adminOnly } = require('../middleware/auth');
const {
  getProductReviews,
  createReview,
  updateReview,
  deleteReview,
  getUserReviews
} = require('../controllers/reviewController');

const router = express.Router();

// Public routes
router.get('/product/:sanPhamId', getProductReviews);

// Protected routes
router.post('/', protect, createReview);
router.put('/:id', protect, updateReview);
router.delete('/:id', protect, deleteReview);
router.get('/my-reviews', protect, getUserReviews);

module.exports = router;
