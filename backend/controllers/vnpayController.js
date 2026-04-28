const DonHang = require('../models/DonHang');
const { createPaymentUrl, verifyIpnSignature, verifyReturnSignature } = require('../utils/vnpayHelper');

// CREATE PAYMENT
const createPayment = async (req, res) => {
  try {
    const { orderId, amount, orderInfo } = req.body;

    if (!orderId || !amount) {
      return res.status(400).json({
        success: false,
        message: 'Order ID and amount are required'
      });
    }

    const order = await DonHang.findById(orderId);
    if (!order) {
      return res.status(404).json({
        success: false,
        message: 'Order not found'
      });
    }

    if (order.nguoiDungId.toString() !== req.user._id.toString()) {
      return res.status(403).json({
        success: false,
        message: 'Not authorized'
      });
    }

    let ipAddr = req.headers['x-forwarded-for'] || req.socket.remoteAddress;
    // VNPay không chấp nhận IPv6 localhost
    if (ipAddr === '::1' || ipAddr === '::ffff:127.0.0.1') {
      ipAddr = '127.0.0.1';
    }

    const paymentUrl = createPaymentUrl({
      orderId,
      amount,
      orderInfo,
      ipAddr
    });

    res.json({
      success: true,
      data: { paymentUrl }
    });

  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message
    });
  }
};

// RETURN URL (FRONTEND HANDLE)
const returnPayment = async (req, res) => {
  const vnp_Params = req.query;

  const verify = verifyReturnSignature(vnp_Params);

  const orderId = vnp_Params['vnp_TxnRef'];
  const code = vnp_Params['vnp_ResponseCode'];
  const transactionId = vnp_Params['vnp_TransactionNo'];

  const FRONTEND = process.env.FRONTEND_URL || 'http://localhost:3000';

  if (code === '00' && verify.isSuccess) {
    return res.redirect(`${FRONTEND}/payment/success?orderId=${orderId}&transactionId=${transactionId}`);
  }

  // Hủy đơn hàng khi thanh toán thất bại
  try {
    const order = await DonHang.findById(orderId);
    if (order && order.tinhTrang === 0) {
      order.tinhTrang = 4; // Cancelled
      await order.save();
    }
  } catch (err) {
    console.error('Error cancelling order after VNPay failure:', err);
  }

  return res.redirect(`${FRONTEND}/payment/failure?orderId=${orderId}&code=${code}`);
};

// IPN CALLBACK (SERVER-TO-SERVER)
const ipnCallback = async (req, res) => {
  try {
    const vnp_Params = req.query;
    const verify = verifyIpnSignature(vnp_Params);

    const orderId = vnp_Params['vnp_TxnRef'];
    const code = vnp_Params['vnp_ResponseCode'];
    const transactionId = vnp_Params['vnp_TransactionNo'];

    if (code === '00' && verify.isSuccess) {
      const order = await DonHang.findById(orderId);
      if (order) {
        order.trangThaiThanhToan = 'da_thanh_toan';
        order.phuongThucThanhToan = 'vnpay';
        order.maGiaoDichVNPay = transactionId;
        await order.save();
      }
      return res.json({ RspCode: '00', Message: 'Success' });
    }

    return res.json({ RspCode: '99', Message: 'Fail' });
  } catch (error) {
    return res.json({ RspCode: '99', Message: error.message });
  }
};

module.exports = {
  createPayment,
  returnPayment,
  ipnCallback,
};