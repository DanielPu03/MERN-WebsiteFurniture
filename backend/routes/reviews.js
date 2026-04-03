const express = require('express');
const { protect, adminOnly } = require('../middleware/auth');
const asyncHandler = require('../utils/asyncHandler');
const {
  getProductReviews,
  createReview,
  updateReview,
  deleteReview,
  getUserReviews
} = require('../controllers/reviewController');

const router = express.Router();

// @desc    Get reviews for a product
// @route   GET /api/reviews/product/:sanPhamId
// @access  Public
router.get('/product/:sanPhamId', asyncHandler(getProductReviews));

// @desc    Create new review
// @route   POST /api/reviews
// @access  Private
router.post('/', protect, asyncHandler(createReview));

// @desc    Update review
// @route   PUT /api/reviews/:id
// @access  Private
router.put('/:id', protect, asyncHandler(updateReview));

// @desc    Delete review
// @route   DELETE /api/reviews/:id
// @access  Private
router.delete('/:id', protect, asyncHandler(deleteReview));

// @desc    Get my reviews
// @route   GET /api/reviews/my-reviews
// @access  Private
router.get('/my-reviews', protect, asyncHandler(getUserReviews));

module.exports = router;
