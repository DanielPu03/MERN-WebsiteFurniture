const express = require('express');
const { protect, adminOnly } = require('../middleware/auth');
const asyncHandler = require('../utils/asyncHandler');
const {
  getProducts,
  getProductById,
  createProduct,
  updateProduct,
  deleteProduct,
  getRelatedProducts
} = require('../controllers/productController');

const router = express.Router();

// GET /api/products
router.get('/', asyncHandler(getProducts));

// GET /api/products/:id
router.get('/:id', asyncHandler(getProductById));

// POST /api/products
router.post('/', protect, adminOnly, asyncHandler(createProduct));

// PUT /api/products/:id
router.put('/:id', protect, adminOnly, asyncHandler(updateProduct));

// DELETE /api/products/:id
router.delete('/:id', protect, adminOnly, asyncHandler(deleteProduct));

// GET /api/products/:id/related
router.get('/:id/related', asyncHandler(getRelatedProducts));

module.exports = router;
