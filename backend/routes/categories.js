const express = require('express');
const { protect, adminOnly } = require('../middleware/auth');
const asyncHandler = require('../utils/asyncHandler');
const {
  getAllCategories,
  getCategoryById,
  createCategory,
  updateCategory,
  deleteCategory
} = require('../controllers/categoryController');

const router = express.Router();

// GET /api/categories
router.get('/', asyncHandler(getAllCategories));

// GET /api/categories/:id
router.get('/:id', asyncHandler(getCategoryById));

// POST /api/categories (admin only)
router.post('/', protect, adminOnly, asyncHandler(createCategory));

// PUT /api/categories/:id (admin only)
router.put('/:id', protect, adminOnly, asyncHandler(updateCategory));

// DELETE /api/categories/:id (admin only)
router.delete('/:id', protect, adminOnly, asyncHandler(deleteCategory));

module.exports = router;
