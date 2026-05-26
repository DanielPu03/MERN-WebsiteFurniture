import React, { useState, useEffect } from 'react';
import { Search, ChevronLeft, ChevronRight } from 'lucide-react';
import toast from 'react-hot-toast';
import axios from 'axios';
import { ORDER_STATUS } from '../../../shared/constants';
import OrderTable from '../components/OrderTable';
import OrderDetailModal from '../components/OrderDetailModal';

const OrderManagement = () => {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('');
  const [selectedOrder, setSelectedOrder] = useState(null);
  const [showDetailModal, setShowDetailModal] = useState(false);
  const [pagination, setPagination] = useState({ page: 1, limit: 10, total: 0, totalPages: 0 });

  // Load orders
  useEffect(() => {
    loadOrders();
  }, [searchTerm, statusFilter]);

  const loadOrders = async (page = 1) => {
    try {
      setLoading(true);
      let url = `https://mern-websitefurniture.onrender.com/api/orders/admin/all?page=${page}&limit=10`;

      // Add filters to URL
      if (searchTerm) {
        url += `&search=${encodeURIComponent(searchTerm)}`;
      }
      if (statusFilter !== '') {
        url += `&status=${statusFilter}`;
      }

      const response = await axios.get(url, {
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('token')}`
        }
      });
      if (response.data.success) {
        setOrders(response.data.data.orders || []);
        const paginationData = response.data.data.pagination || response.data.pagination || {};
        setPagination({
          page: paginationData.page || 1,
          limit: paginationData.limit || 10,
          total: paginationData.total || 0,
          totalPages: paginationData.pages || 0,
        });
      }
    } catch (error) {
      toast.error('Lỗi khi tải đơn hàng!');
    } finally {
      setLoading(false);
    }
  };

  const handleUpdateStatus = async (orderId, newStatus) => {
    try {
      const response = await axios.put(`https://mern-websitefurniture.onrender.com/api/orders/${orderId}/status`, 
        { tinhTrang: newStatus },
        {
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${localStorage.getItem('token')}`
          }
        }
      );

      if (response.data.success) {
        toast.success('Cập nhật trạng thái đơn hàng thành công!');
        loadOrders();
      } else {
        toast.error(response.data.message || 'Cập nhật trạng thái thất bại!');
      }
    } catch (error) {
      toast.error('Lỗi khi cập nhật trạng thái!');
    }
  };

  const openDetailModal = (order) => {
    setSelectedOrder(order);
    setShowDetailModal(true);
  };

  const closeDetailModal = () => {
    setShowDetailModal(false);
    setSelectedOrder(null);
  };

  const handlePageChange = (page) => {
    loadOrders(page);
  };

  return (
    <div className="p-6">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="mb-6">
          <h1 className="text-2xl font-bold text-gray-900">Quản lý đơn hàng</h1>
        </div>

        {/* Filters */}
        <div className="mb-6 grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
            <input
              type="text"
              placeholder="Tìm kiếm đơn hàng..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            />
          </div>
          <select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          >
            <option value="">Tất cả trạng thái</option>
            <option value={ORDER_STATUS.PENDING}>Chờ xác nhận</option>
            <option value={ORDER_STATUS.CONFIRMED}>Đã xác nhận</option>
            <option value={ORDER_STATUS.SHIPPING}>Đang giao</option>
            <option value={ORDER_STATUS.COMPLETED}>Đã hoàn thành</option>
            <option value={ORDER_STATUS.CANCELLED}>Đã hủy</option>
          </select>
        </div>

        {/* Orders Table */}
        <OrderTable
          orders={orders}
          loading={loading}
          onViewDetail={openDetailModal}
          onUpdateStatus={handleUpdateStatus}
        />

        {/* Pagination */}
        {pagination.totalPages > 1 && (
          <div className="flex justify-center items-center mt-6 gap-2">
            <button
              onClick={() => handlePageChange(pagination.page - 1)}
              disabled={pagination.page === 1}
              className="px-3 py-2 rounded bg-white border text-gray-700 hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed flex items-center"
            >
              <ChevronLeft className="w-4 h-4" />
            </button>

            {Array.from({ length: pagination.totalPages }, (_, i) => i + 1).map(page => (
              <button
                key={page}
                onClick={() => handlePageChange(page)}
                className={`px-3 py-2 rounded ${
                  pagination.page === page
                    ? 'bg-blue-600 text-white'
                    : 'bg-white text-gray-700 border hover:bg-gray-50'
                }`}
              >
                {page}
              </button>
            ))}

            <button
              onClick={() => handlePageChange(pagination.page + 1)}
              disabled={pagination.page === pagination.totalPages}
              className="px-3 py-2 rounded bg-white border text-gray-700 hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed flex items-center"
            >
              <ChevronRight className="w-4 h-4" />
            </button>
          </div>
        )}

        {/* Order Detail Modal */}
        <OrderDetailModal
          isOpen={showDetailModal}
          onClose={closeDetailModal}
          order={selectedOrder}
        />
      </div>
    </div>
  );
};

export default OrderManagement;
