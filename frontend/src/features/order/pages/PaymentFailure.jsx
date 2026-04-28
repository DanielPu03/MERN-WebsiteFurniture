import React, { useEffect } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { XCircle } from 'lucide-react';

const PaymentFailure = () => {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const orderId = searchParams.get('orderId');
  const code = searchParams.get('code');

  useEffect(() => {
    if (!orderId) {
      navigate('/orders');
    }
  }, [orderId, navigate]);

  const getErrorMessage = (errorCode) => {
    const errorMessages = {
      '00': 'Giao dịch thành công',
      '01': 'Giao dịch chưa hoàn tất',
      '02': 'Lỗi giao dịch',
      '04': 'Giao dịch đảo (Khách hàng đã hủy giao dịch)',
      '05': 'VNPAY phản hồi lỗi khác',
      '06': 'VNPAY phản hồi lỗi hệ thống',
      '07': 'Hết hạn chờ thanh toán',
      '09': 'Kiểm tra checksum thất bại',
      '10': 'Giao dịch không thành công do người dùng hủy',
      '24': 'Giao dịch bị từ chối',
    };
    return errorMessages[errorCode] || 'Giao dịch thất bại';
  };

  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-md w-full bg-white rounded-lg shadow-lg p-8 text-center">
        <div className="mx-auto flex items-center justify-center h-20 w-20 rounded-full bg-red-100 mb-6">
          <XCircle className="h-12 w-12 text-red-600" />
        </div>
        <h2 className="text-3xl font-bold text-gray-900 mb-2">Thanh toán thất bại</h2>
        <p className="text-gray-600 mb-6">
          {getErrorMessage(code)}
        </p>
        
        <div className="bg-gray-50 rounded-lg p-4 mb-6 text-left">
          <div className="mb-3">
            <span className="text-sm text-gray-500">Mã đơn hàng:</span>
            <p className="font-semibold text-gray-900">{orderId || 'N/A'}</p>
          </div>
          {code && (
            <div>
              <span className="text-sm text-gray-500">Mã lỗi:</span>
              <p className="font-semibold text-gray-900">{code}</p>
            </div>
          )}
        </div>

        <div className="space-y-3">
          <button
            onClick={() => navigate(`/checkout?orderId=${orderId}`)}
            className="w-full bg-indigo-600 text-white py-3 px-4 rounded-lg hover:bg-indigo-700 transition-colors font-medium"
          >
            Thử thanh toán lại
          </button>
          <button
            onClick={() => navigate('/orders')}
            className="w-full bg-gray-200 text-gray-800 py-3 px-4 rounded-lg hover:bg-gray-300 transition-colors font-medium"
          >
            Xem đơn hàng
          </button>
        </div>
      </div>
    </div>
  );
};

export default PaymentFailure;
