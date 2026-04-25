import React from 'react';
import { Package, ShoppingCart, Users, DollarSign } from 'lucide-react';
import { formatPrice } from '../../../shared/utils/formatters';

const DashboardOverviewCards = ({ stats, onNavigate }) => {
  return (
    <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-4 mb-8">
      <div className="bg-white overflow-hidden shadow rounded-lg hover:shadow-lg transition-shadow cursor-pointer" onClick={() => onNavigate('/admin/products')}>
        <div className="p-5">
          <div className="flex items-center">
            <div className="flex-shrink-0 bg-blue-500 rounded-md p-3">
              <Package className="h-6 w-6 text-white" />
            </div>
            <div className="ml-5 w-0 flex-1">
              <dl>
                <dt className="text-sm font-medium text-gray-500 truncate">Tổng Sản Phẩm</dt>
                <dd className="text-2xl font-bold text-gray-900">{stats.totalProducts}</dd>
              </dl>
            </div>
          </div>
        </div>
      </div>

      <div className="bg-white overflow-hidden shadow rounded-lg hover:shadow-lg transition-shadow cursor-pointer" onClick={() => onNavigate('/admin/orders')}>
        <div className="p-5">
          <div className="flex items-center">
            <div className="flex-shrink-0 bg-green-500 rounded-md p-3">
              <ShoppingCart className="h-6 w-6 text-white" />
            </div>
            <div className="ml-5 w-0 flex-1">
              <dl>
                <dt className="text-sm font-medium text-gray-500 truncate">Tổng Đơn Hàng</dt>
                <dd className="text-2xl font-bold text-gray-900">{stats.totalOrders}</dd>
              </dl>
            </div>
          </div>
        </div>
      </div>

      <div className="bg-white overflow-hidden shadow rounded-lg hover:shadow-lg transition-shadow cursor-pointer" onClick={() => onNavigate('/admin/users')}>
        <div className="p-5">
          <div className="flex items-center">
            <div className="flex-shrink-0 bg-yellow-500 rounded-md p-3">
              <Users className="h-6 w-6 text-white" />
            </div>
            <div className="ml-5 w-0 flex-1">
              <dl>
                <dt className="text-sm font-medium text-gray-500 truncate">Tổng Người Dùng</dt>
                <dd className="text-2xl font-bold text-gray-900">{stats.totalUsers}</dd>
              </dl>
            </div>
          </div>
        </div>
      </div>

      <div className="bg-white overflow-hidden shadow rounded-lg hover:shadow-lg transition-shadow cursor-pointer">
        <div className="p-5">
          <div className="flex items-center">
            <div className="flex-shrink-0 bg-purple-500 rounded-md p-3">
              <DollarSign className="h-6 w-6 text-white" />
            </div>
            <div className="ml-5 w-0 flex-1">
              <dl>
                <dt className="text-sm font-medium text-gray-500 truncate">Tổng Doanh Thu</dt>
                <dd className="text-2xl font-bold text-gray-900">{formatPrice(stats.totalRevenue)}</dd>
              </dl>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default DashboardOverviewCards;
