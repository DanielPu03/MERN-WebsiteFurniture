import React, { useEffect } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { CheckCircle } from 'lucide-react';

const PaymentSuccess = () => {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const orderId = searchParams.get('orderId');
  const transactionId = searchParams.get('transactionId');

  useEffect(() => {
    if (!orderId) {
      navigate('/orders');
    }
  }, [orderId, navigate]);

  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-md w-full bg-white rounded-lg shadow-lg p-8 text-center">
        <div className="mx-auto flex items-center justify-center h-20 w-20 rounded-full bg-green-100 mb-6">
          <CheckCircle className="h-12 w-12 text-green-600" />
        </div>
        <h2 className="text-3xl font-bold text-gray-900 mb-2">Thanh toán thành công!</h2>
        <p className="text-gray-600 mb-6">
          Cảm ơn bạn đã thanh toán. Đơn hàng của bạn đang được xử lý.
        </p>
        
        <div className="bg-gray-50 rounded-lg p-4 mb-6 text-left">
          <div className="mb-3">
            <span className="text-sm text-gray-500">Mã đơn hàng:</span>
            <p className="font-semibold text-gray-900">{orderId || 'N/A'}</p>
          </div>
          {transactionId && (
            <div>
              <span className="text-sm text-gray-500">Mã giao dịch VNPay:</span>
              <p className="font-semibold text-gray-900">{transactionId}</p>
            </div>
          )}
        </div>

        <button
          onClick={() => navigate('/orders')}
          className="w-full bg-indigo-600 text-white py-3 px-4 rounded-lg hover:bg-indigo-700 transition-colors font-medium"
        >
          Xem đơn hàng
        </button>
      </div>
    </div>
  );
};

export default PaymentSuccess;
