import React from 'react';
import { Clock, ShoppingCart, TrendingUp, AlertTriangle } from 'lucide-react';

const DashboardOrderStats = ({ stats }) => {
  return (
    <div className="bg-white shadow rounded-lg mb-8">
      <div className="px-6 py-4 border-b border-gray-200">
        <h2 className="text-lg font-semibold text-gray-900">Thống kê đơn hàng</h2>
      </div>
      <div className="p-6">
        <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-4">
          <div className="bg-blue-50 rounded-lg p-4">
            <div className="flex items-center">
              <Clock className="h-5 w-5 text-blue-600 mr-2" />
              <div>
                <p className="text-sm text-gray-600">Hôm nay</p>
                <p className="text-xl font-bold text-blue-900">{stats.today}</p>
              </div>
            </div>
          </div>
          <div className="bg-yellow-50 rounded-lg p-4">
            <div className="flex items-center">
              <ShoppingCart className="h-5 w-5 text-yellow-600 mr-2" />
              <div>
                <p className="text-sm text-gray-600">Đang xử lý</p>
                <p className="text-xl font-bold text-yellow-900">{stats.processing}</p>
              </div>
            </div>
          </div>
          <div className="bg-green-50 rounded-lg p-4">
            <div className="flex items-center">
              <TrendingUp className="h-5 w-5 text-green-600 mr-2" />
              <div>
                <p className="text-sm text-gray-600">Hoàn thành</p>
                <p className="text-xl font-bold text-green-900">{stats.completed}</p>
              </div>
            </div>
          </div>
          <div className="bg-red-50 rounded-lg p-4">
            <div className="flex items-center">
              <AlertTriangle className="h-5 w-5 text-red-600 mr-2" />
              <div>
                <p className="text-sm text-gray-600">Đã hủy</p>
                <p className="text-xl font-bold text-red-900">{stats.cancelled}</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default DashboardOrderStats;
