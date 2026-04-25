import React from 'react';
import { XCircle } from 'lucide-react';
import { formatPrice, formatDate } from '../../../shared/utils/formatters';
import { ORDER_STATUS } from '../../../shared/constants';

const OrderDetailModal = ({ isOpen, onClose, order }) => {
  if (!isOpen || !order) return null;

  const getStatusInfo = (status) => {
    switch (status) {
      case ORDER_STATUS.PENDING:
        return { label: 'Chờ xác nhận', color: 'text-yellow-600', bg: 'bg-yellow-100' };
      case ORDER_STATUS.CONFIRMED:
        return { label: 'Đã xác nhận', color: 'text-blue-600', bg: 'bg-blue-100' };
      case ORDER_STATUS.SHIPPING:
        return { label: 'Đang giao', color: 'text-purple-600', bg: 'bg-purple-100' };
      case ORDER_STATUS.COMPLETED:
        return { label: 'Đã hoàn thành', color: 'text-green-600', bg: 'bg-green-100' };
      case ORDER_STATUS.CANCELLED:
        return { label: 'Đã hủy', color: 'text-red-600', bg: 'bg-red-100' };
      default:
        return { label: 'Không xác định', color: 'text-gray-600', bg: 'bg-gray-100' };
    }
  };

  const statusInfo = getStatusInfo(order.tinhTrang);

  return (
    <div className="fixed inset-0 bg-gray-600 bg-opacity-50 overflow-y-auto h-full w-full z-50">
      <div className="relative min-h-screen flex items-center justify-center p-4">
        <div className="relative bg-white rounded-lg text-left overflow-hidden shadow-xl max-w-4xl w-full max-h-[90vh] overflow-y-auto">
          <div className="flex justify-between items-center px-6 py-4 border-b">
            <h3 className="text-lg font-medium text-gray-900">Chi tiết đơn hàng #{order._id?.slice(-6)}</h3>
            <button
              onClick={onClose}
              className="text-gray-400 hover:text-gray-600"
            >
              <XCircle className="w-6 h-6" />
            </button>
          </div>

          <div className="px-6 py-4">
            {/* Order Info */}
            <div className="mb-6 grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <h4 className="font-medium text-gray-900 mb-2">Thông tin khách hàng</h4>
                <p className="text-sm text-gray-600">Họ tên: {order.nguoiDungId?.hoTen || 'N/A'}</p>
                <p className="text-sm text-gray-600">Email: {order.nguoiDungId?.email || 'N/A'}</p>
                <p className="text-sm text-gray-600">SĐT: {order.nguoiDungId?.soDienThoai || 'N/A'}</p>
              </div>
              <div>
                <h4 className="font-medium text-gray-900 mb-2">Thông tin đơn hàng</h4>
                <p className="text-sm text-gray-600">Ngày đặt: {formatDate(order.ngayTao)}</p>
                <p className="text-sm text-gray-600">
                  Trạng thái: <span className={`px-2 py-1 rounded-full text-xs font-semibold ${statusInfo.bg} ${statusInfo.color}`}>{statusInfo.label}</span>
                </p>
                <p className="text-sm text-gray-600">Tổng tiền: {formatPrice(order.tongTien)}</p>
              </div>
            </div>

            {/* Shipping Address */}
            <div className="mb-6">
              <h4 className="font-medium text-gray-900 mb-2">Địa chỉ giao hàng</h4>
              <p className="text-sm text-gray-600">{order.diaChiGiaoHang || 'N/A'}</p>
            </div>

            {/* Order Items */}
            <div className="mb-6">
              <h4 className="font-medium text-gray-900 mb-2">Sản phẩm</h4>
              <div className="space-y-2">
                {order.chiTietDonHang?.map((item, index) => (
                  <div key={index} className="flex justify-between items-center p-3 bg-gray-50 rounded">
                    <div>
                      <p className="text-sm font-medium text-gray-900">{item.tenSanPham || 'Sản phẩm'}</p>
                      <p className="text-xs text-gray-600">Số lượng: {item.soLuong}</p>
                    </div>
                    <p className="text-sm font-medium text-gray-900">{formatPrice(item.gia)}</p>
                  </div>
                )) || <p className="text-sm text-gray-500">Không có sản phẩm</p>}
              </div>
            </div>

            {/* Notes */}
            {order.ghiChu && (
              <div className="mb-6">
                <h4 className="font-medium text-gray-900 mb-2">Ghi chú</h4>
                <p className="text-sm text-gray-600">{order.ghiChu}</p>
              </div>
            )}

            {/* Payment Info */}
            <div className="mb-6">
              <h4 className="font-medium text-gray-900 mb-2">Phương thức thanh toán</h4>
              <p className="text-sm text-gray-600">{order.phuongThucThanhToan || 'N/A'}</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default OrderDetailModal;
