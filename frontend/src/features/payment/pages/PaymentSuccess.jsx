import React, { useEffect } from 'react';
import { useSearchParams, useNavigate } from 'react-router-dom';
import { CheckCircle, Home, FileText } from 'lucide-react';
import { Link } from 'react-router-dom';

const PaymentSuccess = () => {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const orderId = searchParams.get('orderId');
  const transactionId = searchParams.get('transactionId');

  useEffect(() => {
    if (!orderId) {
      navigate('/');
    }
  }, [orderId, navigate]);

  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-md w-full">
        <div className="bg-white rounded-lg shadow-lg p-8 text-center">
          <div className="mx-auto flex items-center justify-center h-20 w-20 rounded-full bg-green-100 mb-6">
            <CheckCircle className="h-12 w-12 text-green-600" />
          </div>
          
          <h2 className="text-3xl font-bold text-gray-900 mb-2">
            Thanh toán thành công!
          </h2>
          <p className="text-gray-600 mb-6">
            Đơn hàng của bạn đã được thanh toán thành công qua VNPay
          </p>

          <div className="bg-gray-50 rounded-lg p-4 mb-6 text-left">
            <div className="space-y-2">
              <div className="flex justify-between">
                <span className="text-gray-600">Mã đơn hàng:</span>
                <span className="font-medium text-gray-900">{orderId}</span>
              </div>
              {transactionId && (
                <div className="flex justify-between">
                  <span className="text-gray-600">Mã giao dịch VNPay:</span>
                  <span className="font-medium text-gray-900">{transactionId}</span>
                </div>
              )}
            </div>
          </div>

          <div className="space-y-3">
            <Link
              to="/orders"
              className="w-full flex items-center justify-center px-6 py-3 bg-purple-600 text-white rounded-lg font-semibold hover:bg-purple-700 transition-colors"
            >
              <FileText className="w-5 h-5 mr-2" />
              Xem đơn hàng
            </Link>
            
            <Link
              to="/"
              className="w-full flex items-center justify-center px-6 py-3 bg-gray-200 text-gray-900 rounded-lg font-semibold hover:bg-gray-300 transition-colors"
            >
              <Home className="w-5 h-5 mr-2" />
              Về trang chủ
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PaymentSuccess;
