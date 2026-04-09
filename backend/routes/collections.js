const express = require('express');
const { protect, adminOnly } = require('../middleware/auth');
const {
  getCollections,
  getCollectionById,
  createCollection,
  updateCollection,
  deleteCollection
} = require('../controllers/collectionController');

const router = express.Router();

// Public routes
router.get('/', getCollections);
router.get('/:id', getCollectionById);

// Admin only routes
router.post('/', protect, adminOnly, createCollection);
router.put('/:id', protect, adminOnly, updateCollection);
router.delete('/:id', protect, adminOnly, deleteCollection);

module.exports = router;
