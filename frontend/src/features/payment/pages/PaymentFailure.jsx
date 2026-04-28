import React, { useEffect } from 'react';
import { useSearchParams, useNavigate } from 'react-router-dom';
import { XCircle, Home, ShoppingCart, FileText } from 'lucide-react';
import { Link } from 'react-router-dom';

const PaymentFailure = () => {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const orderId = searchParams.get('orderId');
  const code = searchParams.get('code');
  const reason = searchParams.get('reason');

  useEffect(() => {
    if (!orderId && !reason) {
      navigate('/');
    }
  }, [orderId, reason, navigate]);

  const getErrorMessage = () => {
    if (reason === 'order_not_found') return 'Đơn hàng không tồn tại';
    if (reason === 'system_error') return 'Lỗi hệ thống';
    if (code === '24') return 'Giao dịch bị hủy';
    if (code === '51') return 'Số tiền không hợp lệ';
    if (code === '75') return 'Quá số lần giao dịch cho phép';
    return 'Thanh toán thất bại';
  };

  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-md w-full">
        <div className="bg-white rounded-lg shadow-lg p-8 text-center">
          <div className="mx-auto flex items-center justify-center h-20 w-20 rounded-full bg-red-100 mb-6">
            <XCircle className="h-12 w-12 text-red-600" />
          </div>
          
          <h2 className="text-3xl font-bold text-gray-900 mb-2">
            Thanh toán thất bại
          </h2>
          <p className="text-gray-600 mb-6">
            {getErrorMessage()}
          </p>

          {orderId && (
            <div className="bg-gray-50 rounded-lg p-4 mb-6 text-left">
              <div className="flex justify-between">
                <span className="text-gray-600">Mã đơn hàng:</span>
                <span className="font-medium text-gray-900">{orderId}</span>
              </div>
            </div>
          )}

          <div className="space-y-3">
            <Link
              to="/cart"
              className="w-full flex items-center justify-center px-6 py-3 bg-purple-600 text-white rounded-lg font-semibold hover:bg-purple-700 transition-colors"
            >
              <ShoppingCart className="w-5 h-5 mr-2" />
              Thử lại thanh toán
            </Link>
            
            <Link
              to="/orders"
              className="w-full flex items-center justify-center px-6 py-3 bg-gray-200 text-gray-900 rounded-lg font-semibold hover:bg-gray-300 transition-colors"
            >
              <FileText className="w-5 h-5 mr-2" />
              Xem đơn hàng
            </Link>
            
            <Link
              to="/"
              className="w-full flex items-center justify-center px-6 py-3 bg-gray-100 text-gray-700 rounded-lg font-semibold hover:bg-gray-200 transition-colors"
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

export default PaymentFailure;
