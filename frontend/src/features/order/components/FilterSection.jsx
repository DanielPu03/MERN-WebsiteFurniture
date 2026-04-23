import React from 'react';
import { Filter } from 'lucide-react';
import { ORDER_STATUS } from '../../../shared/constants';

const FilterSection = ({ filterStatus, onFilterChange, totalOrders }) => {
  return (
    <div className="bg-white rounded-lg shadow-lg p-4 mb-6">
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-4">
          <Filter className="w-5 h-5 text-gray-600" />
          <select
            value={filterStatus}
            onChange={(e) => onFilterChange(e.target.value)}
            className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
          >
            <option value="all">Tất cả đơn hàng</option>
            <option value={ORDER_STATUS.PENDING}>Chờ xác nhận</option>
            <option value={ORDER_STATUS.CONFIRMED}>Đã xác nhận</option>
            <option value={ORDER_STATUS.SHIPPING}>Đang giao</option>
            <option value={ORDER_STATUS.COMPLETED}>Đã hoàn thành</option>
            <option value={ORDER_STATUS.CANCELLED}>Đã hủy</option>
          </select>
        </div>
        <div className="text-sm text-gray-600">
          {totalOrders} đơn hàng
        </div>
      </div>
    </div>
  );
};

export default FilterSection;
