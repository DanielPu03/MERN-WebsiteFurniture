import React from 'react';
import { X, MapPin } from 'lucide-react';
import { formatPrice, formatDate } from '../../../shared/utils/formatters';
import { ORDER_STATUS } from '../../../shared/constants';
import Modal from '../../../shared/components/Modal';
import Image from '../../../shared/components/Image';

const getStatusInfo = (status) => {
  switch (status) {
    case ORDER_STATUS.PENDING:
      return 'Chờ xác nhận';
    case ORDER_STATUS.CONFIRMED:
      return 'Đã xác nhận';
    case ORDER_STATUS.SHIPPING:
      return 'Đang giao';
    case ORDER_STATUS.COMPLETED:
      return 'Đã hoàn thành';
    case ORDER_STATUS.CANCELLED:
      return 'Đã hủy';
    default:
      return 'Không xác định';
  }
};

const OrderDetailModal = ({ isOpen, onClose, order }) => {
  if (!order) return null;

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title="Chi tiết đơn hàng"
      size="lg"
      footer={
        <div className="flex justify-between items-center">
          <span className="text-lg font-bold text-gray-900">Tổng cộng</span>
          <span className="text-2xl font-bold text-purple-600">{formatPrice(order.tongTien)}</span>
        </div>
      }
    >
      <div className="space-y-3">
        {/* Order & Customer Info - Compact */}
        <div className="bg-gray-50 p-3 rounded-lg">
          <h3 className="font-bold text-gray-900 text-sm mb-2">Thông tin đơn hàng</h3>
          <div className="grid grid-cols-2 gap-x-4 gap-y-1 text-xs">
            <div><span className="text-gray-500">Mã:</span> <span className="font-medium">{order._id?.slice(-8)}</span></div>
            <div><span className="text-gray-500">Ngày:</span> <span className="font-medium">{formatDate(order.ngayTao)}</span></div>
            <div><span className="text-gray-500">Trạng thái:</span> <span className="font-medium">{getStatusInfo(order.tinhTrang)}</span></div>
            <div><span className="text-gray-500">Thanh toán:</span> <span className="font-medium">{order.phuongThucThanhToan === 'VNPAY' ? 'VNPay' : 'COD'}</span></div>
          </div>
        </div>

        {/* Customer Info - Compact */}
        <div className="bg-gray-50 p-3 rounded-lg">
          <h3 className="font-bold text-gray-900 text-sm mb-2">Khách hàng</h3>
          <div className="grid grid-cols-3 gap-x-4 gap-y-1 text-xs">
            <div><span className="text-gray-500">Tên:</span> <span className="font-medium">{order.nguoiDungId?.hoTen || 'N/A'}</span></div>
            <div><span className="text-gray-500">Email:</span> <span className="font-medium">{order.nguoiDungId?.email || 'N/A'}</span></div>
            <div><span className="text-gray-500">SĐT:</span> <span className="font-medium">{order.nguoiDungId?.soDienThoai || 'N/A'}</span></div>
          </div>
        </div>

        {/* Products - Scrollable like OrderSummary */}
        <div>
          <h3 className="font-bold text-gray-900 text-sm mb-2">Sản phẩm ({order.chiTietDonHang?.length || 0})</h3>
          <div className="space-y-2 max-h-48 overflow-y-auto pr-1">
            {order.chiTietDonHang?.map((item, index) => (
              <div key={index} className="flex items-center space-x-3 bg-gray-50 p-2 rounded">
                <div className="flex-shrink-0 h-12 w-12">
                  <Image
                    src={item.sanPhamId?.hinhAnh}
                    alt={item.sanPhamId?.tenSanPham}
                    className="h-12 w-12 rounded object-cover"
                  />
                </div>
                <div className="flex-1 min-w-0">
                  <h4 className="text-xs font-medium text-gray-900 truncate">{item.sanPhamId?.tenSanPham || 'N/A'}</h4>
                  <p className="text-xs text-gray-500">SL: {item.soLuong}</p>
                </div>
                <div className="text-right">
                  <p className="text-xs font-semibold text-gray-900">{formatPrice(item.soLuong * item.gia)}</p>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Shipping & Notes - Compact */}
        <div className="bg-gray-50 p-3 rounded-lg">
          <h3 className="font-bold text-gray-900 text-sm mb-1">Giao hàng & Ghi chú</h3>
          <div className="flex items-start space-x-1 mb-1">
            <MapPin className="w-3 h-3 text-gray-600 mt-0.5 flex-shrink-0" />
            <span className="text-xs text-gray-700">{order.diaChiGiaoHang}</span>
          </div>
          <p className="text-xs text-gray-500 italic">{order.ghiChu || 'Không có ghi chú'}</p>
        </div>
      </div>
    </Modal>
  );
};

export default OrderDetailModal;
