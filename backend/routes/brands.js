const express = require('express');
const { protect, adminOnly } = require('../middleware/auth');
const asyncHandler = require('../utils/asyncHandler');
const {
  getAllBrands,
  getBrandById,
  createBrand,
  updateBrand,
  deleteBrand
} = require('../controllers/brandController');

const router = express.Router();

// GET /api/brands
router.get('/', asyncHandler(getAllBrands));

// GET /api/brands/:id
router.get('/:id', asyncHandler(getBrandById));

// POST /api/brands (admin only)
router.post('/', protect, adminOnly, asyncHandler(createBrand));

// PUT /api/brands/:id (admin only)
router.put('/:id', protect, adminOnly, asyncHandler(updateBrand));

// DELETE /api/brands/:id (admin only)
router.delete('/:id', protect, adminOnly, asyncHandler(deleteBrand));

module.exports = router;
