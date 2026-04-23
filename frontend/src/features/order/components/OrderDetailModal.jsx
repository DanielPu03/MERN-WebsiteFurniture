import React from 'react';
import { Package, MapPin } from 'lucide-react';
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

const OrderDetailModal = ({ order, onClose }) => {
  if (!order) return null;

  return (
    <Modal
      isOpen={!!order}
      onClose={onClose}
      title="Chi tiết đơn hàng"
      size="lg"
    >
      <div className="space-y-6">
        {/* Order Info */}
        <div>
          <h3 className="font-bold text-gray-900 mb-3">Thông tin đơn hàng</h3>
          <div className="grid grid-cols-2 gap-4 text-sm">
            <div>
              <span className="text-gray-600">Mã đơn hàng:</span>
              <p className="font-medium">{order._id}</p>
            </div>
            <div>
              <span className="text-gray-600">Ngày đặt:</span>
              <p className="font-medium">{formatDate(order.ngayTao)}</p>
            </div>
            <div>
              <span className="text-gray-600">Trạng thái:</span>
              <p className="font-medium">{getStatusInfo(order.tinhTrang)}</p>
            </div>
            <div>
              <span className="text-gray-600">Phương thức thanh toán:</span>
              <p className="font-medium">Thanh toán khi nhận hàng (COD)</p>
            </div>
          </div>
        </div>

        {/* Customer Info */}
        <div>
          <h3 className="font-bold text-gray-900 mb-3">Thông tin khách hàng</h3>
          <div className="grid grid-cols-2 gap-4 text-sm">
            <div>
              <span className="text-gray-600">Họ tên:</span>
              <p className="font-medium">{order.nguoiDungId?.hoTen || 'N/A'}</p>
            </div>
            <div>
              <span className="text-gray-600">Email:</span>
              <p className="font-medium">{order.nguoiDungId?.email || 'N/A'}</p>
            </div>
            <div>
              <span className="text-gray-600">SĐT:</span>
              <p className="font-medium">{order.nguoiDungId?.soDienThoai || 'N/A'}</p>
            </div>
          </div>
        </div>

        {/* Products */}
        <div>
          <h3 className="font-bold text-gray-900 mb-3">Sản phẩm</h3>
          <div className="border rounded-lg overflow-hidden">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase">Hình ảnh</th>
                  <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase">Sản phẩm</th>
                  <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase">Số lượng</th>
                  <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase">Đơn giá</th>
                  <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase">Thành tiền</th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {order.chiTietDonHang?.map((item, index) => (
                  <tr key={index}>
                    <td className="px-4 py-2">
                      <div className="w-12 h-12 flex-shrink-0">
                        <Image
                          src={item.sanPhamId?.hinhAnh}
                          alt={item.sanPhamId?.tenSanPham}
                          className="w-full h-full object-cover rounded"
                        />
                      </div>
                    </td>
                    <td className="px-4 py-2 text-sm text-gray-900">
                      {item.sanPhamId?.tenSanPham || 'N/A'}
                    </td>
                    <td className="px-4 py-2 text-sm text-gray-900">{item.soLuong}</td>
                    <td className="px-4 py-2 text-sm text-gray-900">{formatPrice(item.gia)}</td>
                    <td className="px-4 py-2 text-sm text-gray-900">{formatPrice(item.soLuong * item.gia)}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* Shipping Info */}
        <div>
          <h3 className="font-bold text-gray-900 mb-3">Thông tin giao hàng</h3>
          <div className="bg-gray-50 p-4 rounded-lg">
            <div className="flex items-start space-x-2">
              <MapPin className="w-4 h-4 text-gray-600 mt-0.5" />
              <span className="text-sm">{order.diaChiGiaoHang}</span>
            </div>
          </div>
        </div>

        {/* Customer Notes */}
        <div>
          <h3 className="font-bold text-gray-900 mb-3">Ghi chú</h3>
          <div className="bg-yellow-50 p-4 rounded-lg">
            <p className="text-sm text-gray-700">{order.ghiChu || 'Không có ghi chú'}</p>
          </div>
        </div>

        {/* Total */}
        <div className="border-t pt-4">
          <div className="flex justify-between items-center">
            <span className="text-lg font-bold text-gray-900">Tổng cộng</span>
            <span className="text-2xl font-bold text-purple-600">{formatPrice(order.tongTien)}</span>
          </div>
        </div>
      </div>
    </Modal>
  );
};

export default OrderDetailModal;
