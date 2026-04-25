import React from 'react';
import { ArrowRight } from 'lucide-react';
import { formatPrice, formatDate } from '../../../shared/utils/formatters';

const DashboardRecentActivity = ({ recentOrders, recentUsers, onNavigate }) => {
  const getOrderStatus = (status) => {
    switch (status) {
      case 0: return 'Chờ xác nhận';
      case 1: return 'Đang xử lý';
      case 2: return 'Hoàn thành';
      case 3: return 'Đã giao';
      default: return 'Đã hủy';
    }
  };

  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-8">
      {/* Recent Orders */}
      <div className="bg-white shadow rounded-lg">
        <div className="px-6 py-4 border-b border-gray-200 flex justify-between items-center">
          <h2 className="text-lg font-semibold text-gray-900">Đơn hàng mới nhất</h2>
          <button onClick={() => onNavigate('/admin/orders')} className="text-blue-600 hover:text-blue-700 text-sm font-medium">
            Xem tất cả <ArrowRight className="h-4 w-4 inline" />
          </button>
        </div>
        <div className="p-6">
          {recentOrders.length === 0 ? (
            <p className="text-gray-500 text-center py-4">Chưa có đơn hàng</p>
          ) : (
            <div className="space-y-4">
              {recentOrders.map((order) => (
                <div key={order._id} className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-gray-900">
                      {order.nguoiDungId?.hoTen || 'Khách hàng'}
                    </p>
                    <p className="text-xs text-gray-500">{formatDate(order.ngayTao)}</p>
                  </div>
                  <div className="text-right">
                    <p className="text-sm font-medium text-gray-900">{formatPrice(order.tongTien)}</p>
                    <p className="text-xs text-gray-500">{getOrderStatus(order.tinhTrang)}</p>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>

      {/* Recent Users */}
      <div className="bg-white shadow rounded-lg">
        <div className="px-6 py-4 border-b border-gray-200 flex justify-between items-center">
          <h2 className="text-lg font-semibold text-gray-900">Người dùng mới</h2>
          <button onClick={() => onNavigate('/admin/users')} className="text-blue-600 hover:text-blue-700 text-sm font-medium">
            Xem tất cả <ArrowRight className="h-4 w-4 inline" />
          </button>
        </div>
        <div className="p-6">
          {recentUsers.length === 0 ? (
            <p className="text-gray-500 text-center py-4">Chưa có người dùng</p>
          ) : (
            <div className="space-y-4">
              {recentUsers.map((user) => (
                <div key={user._id} className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-gray-900">{user.hoTen}</p>
                    <p className="text-xs text-gray-500">{user.email}</p>
                  </div>
                  <div className="text-right">
                    <p className="text-xs text-gray-500">{formatDate(user.createdAt)}</p>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default DashboardRecentActivity;
