const express = require('express');
const { protect, adminOnly } = require('../middleware/auth');
const multer = require('multer');
const path = require('path');
const {
  getCollections,
  getCollectionById,
  createCollection,
  updateCollection,
  deleteCollection,
  uploadCollectionImages
} = require('../controllers/collectionController');

const router = express.Router();

// Configure multer for collection image uploads
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    const uploadPath = path.join(__dirname, '../uploads/collections');
    cb(null, uploadPath);
  },
  filename: function (req, file, cb) {
    const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
    cb(null, 'collection-' + uniqueSuffix + path.extname(file.originalname));
  }
});

const upload = multer({ storage: storage });

// Public routes
router.get('/', getCollections);
router.get('/:id', getCollectionById);

// Admin only routes
router.post('/', protect, adminOnly, createCollection);
router.put('/:id', protect, adminOnly, updateCollection);
router.delete('/:id', protect, adminOnly, deleteCollection);

// Image management routes
router.post('/:collectionId/images', protect, adminOnly, upload.array('images', 10), uploadCollectionImages);

module.exports = router;
