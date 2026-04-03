const express = require('express');
const { protect, adminOnly } = require('../middleware/auth');
const asyncHandler = require('../utils/asyncHandler');
const {
  getOrders,
  getOrderById,
  createOrder,
  cancelOrder,
  updateOrderStatus,
  getAllOrders
} = require('../controllers/orderController');

const router = express.Router();

// GET /api/orders
router.get('/', protect, asyncHandler(getOrders));

// GET /api/orders/:id
router.get('/:id', protect, asyncHandler(getOrderById));

// POST /api/orders
router.post('/', protect, asyncHandler(createOrder));

// PUT /api/orders/:id/cancel
router.put('/:id/cancel', protect, asyncHandler(cancelOrder));

// PUT /api/orders/:id/status (admin only)
router.put('/:id/status', protect, adminOnly, asyncHandler(updateOrderStatus));

// GET /api/orders/all (admin only)
router.get('/all/orders', protect, adminOnly, asyncHandler(getAllOrders));

module.exports = router;
