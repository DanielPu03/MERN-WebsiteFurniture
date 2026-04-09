const express = require('express');
const { protect } = require('../middleware/auth');
const {
  getOrders,
  getOrderById,
  createOrder,
  updateOrderStatus,
  cancelOrder
} = require('../controllers/orderController');

const router = express.Router();

// Protected routes (user orders)
router.get('/', protect, getOrders);
router.get('/:id', protect, getOrderById);
router.post('/', protect, createOrder);
router.put('/:id/cancel', protect, cancelOrder);

// Admin only routes
// router.put('/:id/status', protect, adminOnly, updateOrderStatus);

module.exports = router;
