import React, { useState, useEffect } from 'react';
import { Search, Eye, Package, CheckCircle, XCircle, Clock, Truck, ChevronLeft, ChevronRight } from 'lucide-react';
import toast from 'react-hot-toast';
import axios from 'axios';
import { ORDER_STATUS } from '../../../shared/constants';

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
      let url = `http://localhost:5000/api/orders/admin/all?page=${page}&limit=10`;

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

  const handleUpdateStatus = async (orderId, newStatus) => {
    try {
      const response = await axios.put(`http://localhost:5000/api/orders/${orderId}/status`, 
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

  const handlePageChange = (page) => {
    loadOrders(page);
  };

  const formatCurrency = (amount) => {
    return new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(amount || 0);
  };

  const formatDate = (dateString) => {
    if (!dateString) return 'N/A';
    const date = new Date(dateString);
    return new Intl.DateTimeFormat('vi-VN', {
      year: 'numeric',
      month: '2-digit',
      day: '2-digit',
      hour: '2-digit',
      minute: '2-digit',
    }).format(date);
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
                    const StatusIcon = statusInfo.icon;
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
                          <div className="text-sm font-medium text-gray-900">{formatCurrency(order.tongTien)}</div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full flex items-center gap-1 ${statusInfo.bg} ${statusInfo.color}`}>
                            <StatusIcon className="w-4 h-4" />
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
                              onClick={() => openDetailModal(order)}
                              className="text-blue-600 hover:text-blue-900"
                              title="Xem chi tiết"
                            >
                              <Eye className="w-4 h-4" />
                            </button>
                            {order.tinhTrang === ORDER_STATUS.PENDING && (
                              <button
                                onClick={() => handleUpdateStatus(order._id, ORDER_STATUS.CONFIRMED)}
                                className="text-green-600 hover:text-green-900"
                                title="Xác nhận đơn hàng"
                              >
                                <CheckCircle className="w-4 h-4" />
                              </button>
                            )}
                            {order.tinhTrang === ORDER_STATUS.CONFIRMED && (
                              <button
                                onClick={() => handleUpdateStatus(order._id, ORDER_STATUS.SHIPPING)}
                                className="text-green-600 hover:text-green-900"
                                title="Bắt đầu giao hàng"
                              >
                                <Truck className="w-4 h-4" />
                              </button>
                            )}
                            {order.tinhTrang === ORDER_STATUS.SHIPPING && (
                              <button
                                onClick={() => handleUpdateStatus(order._id, ORDER_STATUS.COMPLETED)}
                                className="text-green-600 hover:text-green-900"
                                title="Hoàn thành đơn hàng"
                              >
                                <CheckCircle className="w-4 h-4" />
                              </button>
                            )}
                            {(order.tinhTrang === ORDER_STATUS.PENDING || order.tinhTrang === ORDER_STATUS.CONFIRMED) && (
                              <button
                                onClick={() => handleUpdateStatus(order._id, ORDER_STATUS.CANCELLED)}
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

        {/* Order Detail Modal */}
        {showDetailModal && selectedOrder && (
          <div className="fixed inset-0 bg-gray-600 bg-opacity-50 overflow-y-auto h-full w-full z-50">
            <div className="relative min-h-screen flex items-center justify-center p-4">
              <div className="relative bg-white rounded-lg text-left overflow-hidden shadow-xl max-w-4xl w-full max-h-[90vh] overflow-y-auto">
                <div className="flex justify-between items-center px-6 py-4 border-b">
                  <h3 className="text-lg font-medium text-gray-900">Chi tiết đơn hàng #{selectedOrder._id?.slice(-6)}</h3>
                  <button
                    onClick={() => {
                      setShowDetailModal(false);
                      setSelectedOrder(null);
                    }}
                    className="text-gray-400 hover:text-gray-600"
                  >
                    <XCircle className="w-6 h-6" />
                  </button>
                </div>

                <div className="px-6 py-4">
                  {/* Order Info */}
                  <div className="mb-6 grid grid-cols-2 gap-4">
                    <div>
                      <h4 className="font-medium text-gray-900 mb-2">Thông tin khách hàng</h4>
                      <p className="text-sm text-gray-600">Họ tên: {selectedOrder.nguoiDungId?.hoTen || 'N/A'}</p>
                      <p className="text-sm text-gray-600">Email: {selectedOrder.nguoiDungId?.email || 'N/A'}</p>
                      <p className="text-sm text-gray-600">SĐT: {selectedOrder.nguoiDungId?.soDienThoai || 'N/A'}</p>
                    </div>
                    <div>
                      <h4 className="font-medium text-gray-900 mb-2">Thông tin đơn hàng</h4>
                      <p className="text-sm text-gray-600">Ngày đặt: {formatDate(selectedOrder.ngayTao)}</p>
                      <p className="text-sm text-gray-600">Trạng thái: {getStatusInfo(selectedOrder.tinhTrang).label}</p>
                      <p className="text-sm text-gray-600">Tổng tiền: {formatCurrency(selectedOrder.tongTien)}</p>
                    </div>
                  </div>

                  {/* Shipping Info */}
                  <div className="mb-6">
                    <h4 className="font-medium text-gray-900 mb-2">Địa chỉ giao hàng</h4>
                    <p className="text-sm text-gray-600">
                      {selectedOrder.diaChiGiaoHang || 'N/A'}
                    </p>
                  </div>

                  {/* Customer Notes */}
                  <div className="mb-6">
                    <h4 className="font-medium text-gray-900 mb-2">Ghi chú</h4>
                    <div className="bg-yellow-50 p-4 rounded-lg">
                      <p className="text-sm text-gray-700">
                        {selectedOrder.ghiChu || 'Không có ghi chú'}
                      </p>
                    </div>
                  </div>

                  {/* Order Items */}
                  <div>
                    <h4 className="font-medium text-gray-900 mb-2">Sản phẩm</h4>
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
                          {selectedOrder.chiTietDonHang?.map((item, index) => (
                            <tr key={index}>
                              <td className="px-4 py-2">
                                <div className="w-12 h-12 flex-shrink-0">
                                  {item.sanPhamId?.hinhAnh ? (
                                    <img
                                      src={Array.isArray(item.sanPhamId.hinhAnh) ? item.sanPhamId.hinhAnh[0]?.url || item.sanPhamId.hinhAnh[0] : (item.sanPhamId.hinhAnh?.url || item.sanPhamId.hinhAnh)}
                                      alt={item.sanPhamId?.tenSanPham}
                                      className="w-full h-full object-cover rounded"
                                    />
                                  ) : (
                                    <div className="w-full h-full bg-gray-200 rounded flex items-center justify-center">
                                      <Package className="w-6 h-6 text-gray-400" />
                                    </div>
                                  )}
                                </div>
                              </td>
                              <td className="px-4 py-2 text-sm text-gray-900">
                                {item.sanPhamId?.tenSanPham || 'N/A'}
                              </td>
                              <td className="px-4 py-2 text-sm text-gray-900">{item.soLuong}</td>
                              <td className="px-4 py-2 text-sm text-gray-900">{formatCurrency(item.gia)}</td>
                              <td className="px-4 py-2 text-sm text-gray-900">{formatCurrency(item.soLuong * item.gia)}</td>
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}

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
      </div>
    </div>
  );
};

export default OrderManagement;
