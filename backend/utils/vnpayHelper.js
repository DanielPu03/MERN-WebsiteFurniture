const { VNPay } = require('vnpay');

// VNPay Configuration
const vnp_TmnCode = process.env.VNP_TMN_CODE || 'QF3W4F68';
const vnp_HashSecret = process.env.VNP_HASH_SECRET || 'R38LEUYVEIV9VDR8LWUFDKAMZRTCUE74';
const vnp_Url = process.env.VNP_URL || 'https://sandbox.vnpayment.vn/paymentv2/vpcpay.html';
const vnp_ReturnUrl = process.env.VNP_RETURN_URL || 'http://localhost:5000/api/payment/vnpay/return';
const vnp_IpnUrl = process.env.VNP_IPN_URL || 'http://localhost:5000/api/payment/vnpay/ipn';

// Initialize VNPay
const vnpay = new VNPay({
  tmnCode: vnp_TmnCode,
  secureSecret: vnp_HashSecret,
  vnpayHost: 'https://sandbox.vnpayment.vn',
  testMode: true,
  hashAlgorithm: 'SHA512',
  enableLog: true,
});

function createPaymentUrl(orderData) {
  const { orderId, amount, orderInfo, ipAddr } = orderData;

  const paymentUrl = vnpay.buildPaymentUrl({
    vnp_Amount: amount, // Package tự nhân *100
    vnp_IpAddr: ipAddr || '127.0.0.1',
    vnp_ReturnUrl: vnp_ReturnUrl,
    vnp_TxnRef: orderId,
    vnp_OrderInfo: orderInfo || `Thanh toan don hang ${orderId}`,
    vnp_OrderType: '250000',
  });

  return paymentUrl;
}

function verifyReturnSignature(query) {
  const verify = vnpay.verifyReturnUrl(query);
  return verify;
}


function verifyIpnSignature(query) {
  const verify = vnpay.verifyReturnUrl(query);
  return verify;
}

module.exports = {
  createPaymentUrl,
  verifyIpnSignature,
  verifyReturnSignature,
  vnp_IpnUrl
};

