const express = require('express');
const router = express.Router();
const { protect } = require('../middleware/auth');
const {
  createPayment,
  ipnCallback,
  returnPayment
} = require('../controllers/vnpayController');

//    Create VNPay payment URL
router.post('/create', protect, createPayment);

// VNPay IPN callback (server-to-server)
router.get('/ipn', ipnCallback);

//    VNPay return URL (client redirect)
router.get('/return', returnPayment);

module.exports = router;
