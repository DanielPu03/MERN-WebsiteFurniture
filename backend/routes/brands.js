const express = require('express');
const { protect, adminOnly } = require('../middleware/auth');
const {
  getAllBrands,
  getBrandById,
  createBrand,
  updateBrand,
  deleteBrand
} = require('../controllers/brandController');

const router = express.Router();

// Public routes
router.get('/', getAllBrands);
router.get('/:id', getBrandById);

// Admin only routes
router.post('/', protect, adminOnly, createBrand);
router.put('/:id', protect, adminOnly, updateBrand);
router.delete('/:id', protect, adminOnly, deleteBrand);

module.exports = router;
