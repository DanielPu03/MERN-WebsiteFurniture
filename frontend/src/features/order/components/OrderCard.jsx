import React from 'react';
import { Package, MapPin, CreditCard, ChevronRight, Clock, CheckCircle, Truck, XCircle } from 'lucide-react';
import { formatPrice, formatDate } from '../../../shared/utils/formatters';
import { ORDER_STATUS } from '../../../shared/constants';

const getStatusInfo = (status) => {
  switch (status) {
    case ORDER_STATUS.PENDING:
      return { label: 'Chờ xác nhận', color: 'text-yellow-600', bg: 'bg-yellow-100', icon: Clock };
    case ORDER_STATUS.CONFIRMED:
      return { label: 'Đã xác nhận', color: 'text-blue-600', bg: 'bg-blue-100', icon: CheckCircle };
    case ORDER_STATUS.SHIPPING:
      return { label: 'Đang giao', color: 'text-purple-600', bg: 'bg-purple-100', icon: Truck };
    case ORDER_STATUS.COMPLETED:
      return { label: 'Đã hoàn thành', color: 'text-green-600', bg: 'bg-green-100', icon: CheckCircle };
    case ORDER_STATUS.CANCELLED:
      return { label: 'Đã hủy', color: 'text-red-600', bg: 'bg-red-100', icon: XCircle };
    default:
      return { label: 'Không xác định', color: 'text-gray-600', bg: 'bg-gray-100', icon: Package };
  }
};

const OrderCard = ({ order, onCancel, onViewDetails }) => {
  const statusInfo = getStatusInfo(order.tinhTrang);
  const StatusIcon = statusInfo.icon;

  return (
    <div className="bg-white rounded-lg shadow-lg overflow-hidden">
      {/* Order Header */}
      <div className="bg-gray-50 px-6 py-4 border-b">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-4">
            <div>
              <p className="text-sm text-gray-600">Mã đơn hàng</p>
              <p className="font-semibold text-gray-900">{order._id}</p>
            </div>
            <div className="hidden md:block">
              <p className="text-sm text-gray-600">Ngày đặt</p>
              <p className="font-semibold text-gray-900">{formatDate(order.ngayTao)}</p>
            </div>
          </div>
          <div className="flex items-center space-x-3">
            <span className={`px-3 py-1 rounded-full text-sm font-medium ${statusInfo.bg} ${statusInfo.color}`}>
              <StatusIcon className="w-4 h-4 inline mr-1" />
              {statusInfo.label}
            </span>
          </div>
        </div>
      </div>

      {/* Order Items */}
      <div className="p-6">
        <div className="space-y-4">
          {order.sanPhams?.map((item, index) => (
            <div key={index} className="flex items-start space-x-4">
              <div className="w-20 h-20 flex-shrink-0">
                {item.hinhAnh ? (
                  <img
                    src={Array.isArray(item.hinhAnh) ? item.hinhAnh[0]?.url || item.hinhAnh[0] : (item.hinhAnh?.url || item.hinhAnh)}
                    alt={item.tenSanPham}
                    className="w-full h-full object-cover rounded-lg"
                  />
                ) : (
                  <div className="w-full h-full bg-gray-200 rounded-lg flex items-center justify-center">
                    <Package className="w-8 h-8 text-gray-400" />
                  </div>
                )}
              </div>
              <div className="flex-1">
                <h3 className="font-medium text-gray-900">{item.tenSanPham}</h3>
                <p className="text-sm text-gray-600">Số lượng: {item.soLuong}</p>
                <p className="text-sm font-medium text-purple-600">{formatPrice(item.gia * item.soLuong)}</p>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Order Info */}
      <div className="px-6 py-4 bg-gray-50 border-t">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <div className="flex items-center space-x-2 mb-2">
              <MapPin className="w-4 h-4 text-gray-600" />
              <span className="font-medium text-gray-900">Địa chỉ giao hàng</span>
            </div>
            <p className="text-sm text-gray-600">{order.diaChiGiaoHang}</p>
          </div>
          <div>
            <div className="flex items-center space-x-2 mb-2">
              <CreditCard className="w-4 h-4 text-gray-600" />
              <span className="font-medium text-gray-900">Thanh toán</span>
            </div>
            <p className="text-sm text-gray-600">
              {order.phuongThucThanhToan === 'VNPAY' ? 'Thanh toán qua VNPay' : 'Thanh toán khi nhận hàng (COD)'}
            </p>
          </div>
        </div>
      </div>

      {/* Order Footer */}
      <div className="px-6 py-4 border-t flex items-center justify-between">
        <div className="flex items-center space-x-4">
          <span className="text-gray-600">Tổng tiền:</span>
          <span className="text-xl font-bold text-purple-600">{formatPrice(order.tongTien)}</span>
        </div>
        <div className="flex items-center space-x-3">
          {order.tinhTrang === ORDER_STATUS.PENDING && (
            <button
              onClick={() => onCancel(order._id)}
              className="px-4 py-2 border border-red-500 text-red-500 rounded-lg font-medium hover:bg-red-50 transition-colors"
            >
              Hủy đơn
            </button>
          )}
          <button
            onClick={() => onViewDetails(order)}
            className="px-4 py-2 bg-purple-600 text-white rounded-lg font-medium hover:bg-purple-700 transition-colors flex items-center"
          >
            Chi tiết
            <ChevronRight className="w-4 h-4 ml-2" />
          </button>
        </div>
      </div>
    </div>
  );
};

export default OrderCard;
