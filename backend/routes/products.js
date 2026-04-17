const express = require('express');
const { protect, adminOnly } = require('../middleware/auth');
const {
  getProducts,
  getProductById,
  createProduct,
  updateProduct,
  deleteProduct,
  getProductCollections,
  uploadProductImages,
  deleteProductImage,
  setMainProductImage,
  upload
} = require('../controllers/productController');

const router = express.Router();

// Public routes
router.get('/', getProducts);
router.get('/collections', getProductCollections);
router.get('/:id', getProductById);

// Admin only routes
router.post('/', protect, adminOnly, createProduct);
router.put('/:id', protect, adminOnly, updateProduct);
router.delete('/:id', protect, adminOnly, deleteProduct);

// Image management routes
router.post('/:id/images', protect, adminOnly, upload.array('images', 10), uploadProductImages);
router.delete('/:id/images/:imageIndex', protect, adminOnly, deleteProductImage);
router.put('/:id/images/:imageIndex/main', protect, adminOnly, setMainProductImage);

module.exports = router;
