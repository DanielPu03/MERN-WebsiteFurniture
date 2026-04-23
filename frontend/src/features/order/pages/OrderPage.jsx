import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Package, ChevronLeft, ChevronRight } from 'lucide-react';
import { useOrder, useAppDispatch } from '../../../shared/hooks/useRedux';
import { getOrders, cancelOrder } from '../orderSlice';
import Loading from '../../../shared/components/Loading';
import OrderCard from '../components/OrderCard';
import OrderDetailModal from '../components/OrderDetailModal';
import FilterSection from '../components/FilterSection';

const OrderPage = () => {
  const { orders, isLoading, pagination } = useOrder();
  const dispatch = useAppDispatch();
  const [selectedOrder, setSelectedOrder] = useState(null);
  const [filterStatus, setFilterStatus] = useState('all');
  const [isCancelling, setIsCancelling] = useState(false);

  useEffect(() => {
    dispatch(getOrders({ page: 1, limit: 5, status: filterStatus === 'all' ? undefined : parseInt(filterStatus) }));
  }, [filterStatus, dispatch]);

  const handleCancelOrder = async (orderId) => {
    if (!window.confirm('Bạn có chắc chắn muốn hủy đơn hàng này?')) {
      return;
    }

    setIsCancelling(true);
    try {
      await dispatch(cancelOrder(orderId));
      await dispatch(getOrders({ page: 1, limit: 5, status: filterStatus === 'all' ? undefined : parseInt(filterStatus) }));
      alert('Hủy đơn hàng thành công!');
    } catch (error) {
      alert('Hủy đơn hàng thất bại!');
    } finally {
      setIsCancelling(false);
    }
  };

  const handlePageChange = (page) => {
    dispatch(getOrders({ page, limit: 5, status: filterStatus === 'all' ? undefined : parseInt(filterStatus) }));
  };

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <Loading size="lg" text="Đang tải đơn hàng..." />
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      {/* Header */}
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900">Đơn hàng của tôi</h1>
        <p className="text-gray-600 mt-2">Quản lý và theo dõi đơn hàng của bạn</p>
      </div>

      {orders.length === 0 ? (
        /* Empty State */
        <div className="bg-white rounded-lg shadow-lg p-12 text-center">
          <Package className="w-16 h-16 mx-auto text-gray-400 mb-4" />
          <h3 className="text-xl font-semibold text-gray-900 mb-2">Chưa có đơn hàng</h3>
          <p className="text-gray-600 mb-6">Bạn chưa có đơn hàng nào</p>
          <Link
            to="/products"
            className="inline-flex items-center px-6 py-3 bg-purple-600 text-white rounded-lg font-semibold hover:bg-purple-700 transition-colors"
          >
            <Package className="w-5 h-5 mr-2" />
            Mua sắm ngay
          </Link>
        </div>
      ) : (
        <>
          {/* Filter */}
          <FilterSection
            filterStatus={filterStatus}
            onFilterChange={setFilterStatus}
            totalOrders={orders.length}
          />

          {/* Order List */}
          <div className="space-y-6">
            {orders.map((order) => (
              <OrderCard
                key={order._id}
                order={order}
                onCancel={handleCancelOrder}
                onViewDetails={setSelectedOrder}
              />
            ))}
          </div>
        </>
      )}

      {/* Pagination */}
      {pagination && pagination.totalPages > 1 && (
        <div className="flex justify-center items-center mt-8 gap-2">
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
                  ? 'bg-purple-600 text-white'
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
        order={selectedOrder}
        onClose={() => setSelectedOrder(null)}
      />
    </div>
  );
};

export default OrderPage;
