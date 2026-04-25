import React from 'react';
import { formatPrice } from '../../../shared/utils/formatters';

const DashboardCharts = ({ revenueChartData, ordersChartData }) => {
  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-8">
      {/* Revenue Chart */}
      <div className="bg-white shadow rounded-lg">
        <div className="px-6 py-4 border-b border-gray-200">
          <h2 className="text-lg font-semibold text-gray-900">Doanh thu (7 ngày gần nhất)</h2>
        </div>
        <div className="p-6">
          <div className="h-64 flex items-end justify-between gap-2">
            {revenueChartData.map((item, index) => (
              <div key={index} className="flex-1 flex flex-col items-center">
                <div
                  className="w-full bg-blue-500 rounded-t transition-all duration-300 hover:bg-blue-600"
                  style={{
                    height: `${Math.max((item.revenue / Math.max(...revenueChartData.map(d => d.revenue), 1)) * 100, 5)}%`
                  }}
                />
                <p className="text-xs text-gray-600 mt-2">{item.date.split('-').slice(1).join('/')}</p>
                <p className="text-xs font-medium text-gray-900">{formatPrice(item.revenue)}</p>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Orders Chart */}
      <div className="bg-white shadow rounded-lg">
        <div className="px-6 py-4 border-b border-gray-200">
          <h2 className="text-lg font-semibold text-gray-900">Số đơn hàng (7 ngày gần nhất)</h2>
        </div>
        <div className="p-6">
          <div className="h-64 flex items-end justify-between gap-2">
            {ordersChartData.map((item, index) => (
              <div key={index} className="flex-1 flex flex-col items-center">
                <div
                  className="w-full bg-green-500 rounded-t transition-all duration-300 hover:bg-green-600"
                  style={{
                    height: `${Math.max((item.orders / Math.max(...ordersChartData.map(d => d.orders), 1)) * 100, 5)}%`
                  }}
                />
                <p className="text-xs text-gray-600 mt-2">{item.date.split('-').slice(1).join('/')}</p>
                <p className="text-xs font-medium text-gray-900">{item.orders} đơn</p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default DashboardCharts;
