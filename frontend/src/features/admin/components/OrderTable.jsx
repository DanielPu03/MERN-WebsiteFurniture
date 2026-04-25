import React from 'react';
import { Eye, CheckCircle, XCircle, Truck } from 'lucide-react';
import { ORDER_STATUS } from '../../../shared/constants';
import { formatPrice, formatDate } from '../../../shared/utils/formatters';

const OrderTable = ({ orders, loading, onViewDetail, onUpdateStatus }) => {
  const getStatusInfo = (status) => {
    switch (status) {
      case ORDER_STATUS.PENDING:
        return { label: 'Chờ xác nhận', color: 'text-yellow-600', bg: 'bg-yellow-100', icon: null };
      case ORDER_STATUS.CONFIRMED:
        return { label: 'Đã xác nhận', color: 'text-blue-600', bg: 'bg-blue-100', icon: null };
      case ORDER_STATUS.SHIPPING:
        return { label: 'Đang giao', color: 'text-purple-600', bg: 'bg-purple-100', icon: null };
      case ORDER_STATUS.COMPLETED:
        return { label: 'Đã hoàn thành', color: 'text-green-600', bg: 'bg-green-100', icon: null };
      case ORDER_STATUS.CANCELLED:
        return { label: 'Đã hủy', color: 'text-red-600', bg: 'bg-red-100', icon: null };
      default:
        return { label: 'Không xác định', color: 'text-gray-600', bg: 'bg-gray-100', icon: null };
    }
  };

  return (
    <div className="bg-white rounded-lg shadow overflow-hidden">
      <div className="overflow-x-auto">
        <table className="min-w-full divide-y divide-gray-200">
          <thead className="bg-gray-50">
            <tr>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Mã đơn hàng</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Khách hàng</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Tổng tiền</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Trạng thái</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Ngày đặt</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Thao tác</th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {loading ? (
              <tr>
                <td colSpan="6" className="px-6 py-4 text-center">
                  <div className="flex justify-center">
                    <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
                  </div>
                </td>
              </tr>
            ) : orders.length === 0 ? (
              <tr>
                <td colSpan="6" className="px-6 py-4 text-center text-gray-500">
                  Không có đơn hàng nào
                </td>
              </tr>
            ) : (
              orders.map((order) => {
                const statusInfo = getStatusInfo(order.tinhTrang);
                return (
                  <tr key={order._id} className="hover:bg-gray-50">
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm font-medium text-gray-900">#{order._id?.slice(-6)}</div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm text-gray-900">{order.nguoiDungId?.hoTen || 'N/A'}</div>
                      <div className="text-xs text-gray-500">{order.nguoiDungId?.email || ''}</div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm font-medium text-gray-900">{formatPrice(order.tongTien)}</div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${statusInfo.bg} ${statusInfo.color}`}>
                        {statusInfo.label}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm text-gray-900">
                        {formatDate(order.ngayTao)}
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                      <div className="flex gap-2">
                        <button
                          onClick={() => onViewDetail(order)}
                          className="text-blue-600 hover:text-blue-900"
                          title="Xem chi tiết"
                        >
                          <Eye className="w-4 h-4" />
                        </button>
                        {order.tinhTrang === ORDER_STATUS.PENDING && (
                          <button
                            onClick={() => onUpdateStatus(order._id, ORDER_STATUS.CONFIRMED)}
                            className="text-green-600 hover:text-green-900"
                            title="Xác nhận đơn hàng"
                          >
                            <CheckCircle className="w-4 h-4" />
                          </button>
                        )}
                        {order.tinhTrang === ORDER_STATUS.CONFIRMED && (
                          <button
                            onClick={() => onUpdateStatus(order._id, ORDER_STATUS.SHIPPING)}
                            className="text-green-600 hover:text-green-900"
                            title="Bắt đầu giao hàng"
                          >
                            <Truck className="w-4 h-4" />
                          </button>
                        )}
                        {order.tinhTrang === ORDER_STATUS.SHIPPING && (
                          <button
                            onClick={() => onUpdateStatus(order._id, ORDER_STATUS.COMPLETED)}
                            className="text-green-600 hover:text-green-900"
                            title="Hoàn thành đơn hàng"
                          >
                            <CheckCircle className="w-4 h-4" />
                          </button>
                        )}
                        {(order.tinhTrang === ORDER_STATUS.PENDING || order.tinhTrang === ORDER_STATUS.CONFIRMED) && (
                          <button
                            onClick={() => onUpdateStatus(order._id, ORDER_STATUS.CANCELLED)}
                            className="text-red-600 hover:text-red-900"
                            title="Hủy đơn hàng"
                          >
                            <XCircle className="w-4 h-4" />
                          </button>
                        )}
                      </div>
                    </td>
                  </tr>
                );
              })
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default OrderTable;
