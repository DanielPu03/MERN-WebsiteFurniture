import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Package, Calendar, MapPin, CreditCard, Truck, CheckCircle, Clock, XCircle, ChevronRight, Filter, ChevronLeft } from 'lucide-react';
import { useOrder, useAppDispatch } from '../../../shared/hooks/useRedux';
import { getOrders, cancelOrder } from '../orderSlice';
import { ORDER_STATUS } from '../../../shared/constants';
import Loading from '../../../shared/components/Loading';

const OrderPage = () => {
  const { orders, isLoading, pagination } = useOrder();
  const dispatch = useAppDispatch();
  const [selectedOrder, setSelectedOrder] = useState(null);
  const [filterStatus, setFilterStatus] = useState('all');
  const [isCancelling, setIsCancelling] = useState(false);

  useEffect(() => {
    dispatch(getOrders({ page: 1, limit: 5 }));
  }, []);

  const formatPrice = (price) => {
    return new Intl.NumberFormat('vi-VN', {
      style: 'currency',
      currency: 'VND',
    }).format(price || 0);
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

  const filteredOrders = orders.filter(order => {
    if (filterStatus === 'all') return true;
    return order.tinhTrang === parseInt(filterStatus);
  });

  const handleCancelOrder = async (orderId) => {
    if (!window.confirm('Bạn có chắc chắn muốn hủy đơn hàng này?')) {
      return;
    }

    setIsCancelling(true);
    try {
      await dispatch(cancelOrder(orderId));
      await dispatch(getOrders({ page: 1, limit: 5 }));
      alert('Hủy đơn hàng thành công!');
    } catch (error) {
      alert('Hủy đơn hàng thất bại!');
      console.error('Cancel order error:', error);
    } finally {
      setIsCancelling(false);
    }
  };

  const handlePageChange = (page) => {
    dispatch(getOrders({ page, limit: 5 }));
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
          <div className="bg-white rounded-lg shadow-lg p-4 mb-6">
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-4">
                <Filter className="w-5 h-5 text-gray-600" />
                <select
                  value={filterStatus}
                  onChange={(e) => setFilterStatus(e.target.value)}
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
                {filteredOrders.length} / {orders.length} đơn hàng
              </div>
            </div>
          </div>

          {/* Order List */}
          <div className="space-y-6">
            {filteredOrders.map((order) => {
              const statusInfo = getStatusInfo(order.tinhTrang);
              const StatusIcon = statusInfo.icon;

              return (
                <div key={order._id} className="bg-white rounded-lg shadow-lg overflow-hidden">
                  {/* Order Header */}
                  <div className="bg-gray-50 px-6 py-4 border-b">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center space-x-4">
                        <div>
                          <p className="text-sm text-gray-600">Mã đơn hàng</p>
                          <p className="font-semibold text-gray-900">{order._id}</p>
                        </div>
                        <div className="hidden md:block">
                          <p className="text-sm text-gray-600">Ngày đặt</p>
                          <p className="font-semibold text-gray-900">{formatDate(order.ngayTao)}</p>
                        </div>
                      </div>
                      <div className="flex items-center space-x-3">
                        <span className={`px-3 py-1 rounded-full text-sm font-medium ${statusInfo.bg} ${statusInfo.color}`}>
                          <StatusIcon className="w-4 h-4 inline mr-1" />
                          {statusInfo.label}
                        </span>
                      </div>
                    </div>
                  </div>

                  {/* Order Items */}
                  <div className="p-6">
                    <div className="space-y-4">
                      {order.sanPhams?.map((item, index) => (
                        <div key={index} className="flex items-start space-x-4">
                          <div className="w-20 h-20 flex-shrink-0">
                            {item.hinhAnh ? (
                              <img
                                src={Array.isArray(item.hinhAnh) ? item.hinhAnh[0]?.url || item.hinhAnh[0] : (item.hinhAnh?.url || item.hinhAnh)}
                                alt={item.tenSanPham}
                                className="w-full h-full object-cover rounded-lg"
                              />
                            ) : (
                              <div className="w-full h-full bg-gray-200 rounded-lg flex items-center justify-center">
                                <Package className="w-8 h-8 text-gray-400" />
                              </div>
                            )}
                          </div>
                          <div className="flex-1">
                            <h3 className="font-medium text-gray-900">{item.tenSanPham}</h3>
                            <p className="text-sm text-gray-600">Số lượng: {item.soLuong}</p>
                            <p className="text-sm font-medium text-purple-600">{formatPrice(item.gia * item.soLuong)}</p>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* Order Info */}
                  <div className="px-6 py-4 bg-gray-50 border-t">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div>
                        <div className="flex items-center space-x-2 mb-2">
                          <MapPin className="w-4 h-4 text-gray-600" />
                          <span className="font-medium text-gray-900">Địa chỉ giao hàng</span>
                        </div>
                        <p className="text-sm text-gray-600">
                          {order.diaChiGiaoHang}
                        </p>
                      </div>
                      <div>
                        <div className="flex items-center space-x-2 mb-2">
                          <CreditCard className="w-4 h-4 text-gray-600" />
                          <span className="font-medium text-gray-900">Thanh toán</span>
                        </div>
                        <p className="text-sm text-gray-600">
                          Thanh toán khi nhận hàng (COD)
                        </p>
                      </div>
                    </div>
                  </div>

                  {/* Order Footer */}
                  <div className="px-6 py-4 border-t flex items-center justify-between">
                    <div className="flex items-center space-x-4">
                      <span className="text-gray-600">Tổng tiền:</span>
                      <span className="text-xl font-bold text-purple-600">{formatPrice(order.tongTien)}</span>
                    </div>
                    <div className="flex items-center space-x-3">
                      {order.tinhTrang === ORDER_STATUS.PENDING && (
                        <button
                          onClick={() => handleCancelOrder(order._id)}
                          disabled={isCancelling}
                          className="px-4 py-2 border border-red-500 text-red-500 rounded-lg font-medium hover:bg-red-50 transition-colors disabled:opacity-50"
                        >
                          Hủy đơn
                        </button>
                      )}
                      <button
                        onClick={() => setSelectedOrder(order)}
                        className="px-4 py-2 bg-purple-600 text-white rounded-lg font-medium hover:bg-purple-700 transition-colors flex items-center"
                      >
                        Chi tiết
                        <ChevronRight className="w-4 h-4 ml-2" />
                      </button>
                    </div>
                  </div>
                </div>
              );
            })}
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
      {selectedOrder && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-lg shadow-xl max-w-3xl w-full max-h-[90vh] overflow-y-auto">
            {/* Modal Header */}
            <div className="bg-purple-600 text-white px-6 py-4 flex items-center justify-between sticky top-0">
              <h2 className="text-xl font-bold">Chi tiết đơn hàng</h2>
              <button
                onClick={() => setSelectedOrder(null)}
                className="text-white hover:text-gray-200"
              >
                <XCircle className="w-6 h-6" />
              </button>
            </div>

            {/* Modal Content */}
            <div className="p-6">
              <div className="space-y-6">
                {/* Order Info */}
                <div>
                  <h3 className="font-bold text-gray-900 mb-3">Thông tin đơn hàng</h3>
                  <div className="grid grid-cols-2 gap-4 text-sm">
                    <div>
                      <span className="text-gray-600">Mã đơn hàng:</span>
                      <p className="font-medium">{selectedOrder._id}</p>
                    </div>
                    <div>
                      <span className="text-gray-600">Ngày đặt:</span>
                      <p className="font-medium">{formatDate(selectedOrder.ngayTao)}</p>
                    </div>
                    <div>
                      <span className="text-gray-600">Trạng thái:</span>
                      <p className="font-medium">{getStatusInfo(selectedOrder.tinhTrang).label}</p>
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
                      <p className="font-medium">{selectedOrder.nguoiDungId?.hoTen || 'N/A'}</p>
                    </div>
                    <div>
                      <span className="text-gray-600">Email:</span>
                      <p className="font-medium">{selectedOrder.nguoiDungId?.email || 'N/A'}</p>
                    </div>
                    <div>
                      <span className="text-gray-600">SĐT:</span>
                      <p className="font-medium">{selectedOrder.nguoiDungId?.soDienThoai || 'N/A'}</p>
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
                      <span className="text-sm">
                        {selectedOrder.diaChiGiaoHang}
                      </span>
                    </div>
                  </div>
                </div>

                {/* Customer Notes */}
                {selectedOrder.ghiChu && (
                  <div>
                    <h3 className="font-bold text-gray-900 mb-3">Ghi chú</h3>
                    <div className="bg-yellow-50 p-4 rounded-lg">
                      <p className="text-sm text-gray-700">
                        {selectedOrder.ghiChu}
                      </p>
                    </div>
                  </div>
                )}

                {/* Total */}
                <div className="border-t pt-4">
                  <div className="flex justify-between items-center">
                    <span className="text-lg font-bold text-gray-900">Tổng cộng</span>
                    <span className="text-2xl font-bold text-purple-600">{formatPrice(selectedOrder.tongTien)}</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default OrderPage;
