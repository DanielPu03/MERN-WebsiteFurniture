import React, { useState, useEffect, useCallback } from 'react';
import { Link } from 'react-router-dom';
import { Minus, Plus, Trash2, ShoppingBag, ArrowLeft } from 'lucide-react';
import { useCart, useAppDispatch } from '../../../shared/hooks/useRedux';
import { updateQuantityOptimistic } from '../cartSlice';
import toast from 'react-hot-toast';

const CartPage = () => {
  const { items, totalAmount, itemCount, isLoading, addToCart, updateCartItem, removeFromCart, clearCart, getCart } = useCart();
  const dispatch = useAppDispatch();
  const [updatingItems, setUpdatingItems] = useState(new Set());

  // Check if any items are inactive
  const hasInactiveItems = items.some(item => !item.trangThai);
  const inactiveItems = items.filter(item => !item.trangThai);

  // Load cart data when component mounts
  useEffect(() => {
    getCart();
  }, []); // Remove getCart from dependency to prevent infinite loop

  const handleQuantityChange = async (productId, currentQuantity, change) => {
    const newQuantity = currentQuantity + change;

    if (newQuantity < 1) return;

    // Find the product to check stock
    const product = items.find(item => item.sanPhamId === productId);
    if (product && newQuantity > product.soLuongTon) {
      toast.error(`Chỉ có thể đặt tối đa ${product.soLuongTon} sản phẩm!`);
      return;
    }

    // Optimistic update - update UI immediately
    dispatch(updateQuantityOptimistic({ productId, quantity: newQuantity }));

    setUpdatingItems(prev => new Set(prev).add(productId));

    try {
      await updateCartItem(productId, newQuantity);
      toast.success('Cập nhật giỏ hàng thành công!');
    } catch (error) {
      toast.error('Cập nhật giỏ hàng thất bại!');
      // Revert optimistic update on error by refreshing cart
      await getCart();
    } finally {
      setUpdatingItems(prev => {
        const newSet = new Set(prev);
        newSet.delete(productId);
        return newSet;
      });
    }
  };

  const handleRemoveItem = async (productId) => {
    try {
      await removeFromCart(productId);
      toast.success('Xóa thành công!');
    } catch (error) {
      toast.error('Xóa failed!');
    }
  };

  const handleClearCart = async () => {
    try {
      await clearCart();
      toast.success('Xóa giỏ hàng thành công!');
    } catch (error) {
      toast.error('Xóa giỏ hàng thất bại!');
    }
  };

  const formatPrice = (price) => {
    return new Intl.NumberFormat('vi-VN', {
      style: 'currency',
      currency: 'VND',
    }).format(price || 0);
  };

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-purple-600"></div>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <div className="bg-white rounded-lg shadow-lg p-6">
        {/* Header */}
        <div className="flex items-center justify-between mb-6">
          <h1 className="text-3xl font-bold text-gray-900">Giỏ hàng</h1>
          <Link
            to="/products"
            className="flex items-center text-purple-600 hover:text-purple-700 transition-colors"
          >
            <ArrowLeft className="h-5 w-5 mr-2" />
            Tiếp tục mua sắm
          </Link>
        </div>

        {/* Inactive Items Warning */}
        {hasInactiveItems && (
          <div className="bg-red-50 border border-red-200 rounded-lg p-4 mb-6">
            <p className="text-red-800 font-medium">⚠️ Cảnh báo: Có sản phẩm đã ngừng kinh doanh</p>
            <p className="text-red-600 text-sm mt-1">
              {inactiveItems.length} sản phẩm trong giỏ hàng đã ngừng bán. Vui lòng xóa chúng trước khi thanh toán.
            </p>
          </div>
        )}

        {items.length === 0 ? (
          /* Empty Cart */
          <div className="text-center py-12">
            <ShoppingBag className="w-16 h-16 mx-auto text-gray-400 mb-4" />
            <h3 className="text-xl font-semibold text-gray-900 mb-2">Giỏ hàng trống</h3>
            <p className="text-gray-600 mb-6">Bạn chưa có sản phẩm nào trong giỏ hàng</p>
            <Link
              to="/products"
              className="inline-flex items-center px-6 py-3 bg-purple-600 text-white rounded-lg font-semibold hover:bg-purple-700 transition-colors"
            >
              <ShoppingBag className="w-5 h-5 mr-2" />
              Mua sắm ngay
            </Link>
          </div>
        ) : (
          /* Cart Items */
          <div className="space-y-6">
            {/* Items List */}
            <div className="space-y-4">
              {items.map((item) => (
                <div key={item.sanPhamId} className="bg-white border rounded-lg p-4 shadow-sm">
                  <div className="flex items-start space-x-4">
                    {/* Product Image */}
                    <div className="w-20 h-20 flex-shrink-0">
                      {item.hinhAnh ? (
                        <img
                          src={Array.isArray(item.hinhAnh) ? item.hinhAnh[0]?.url || item.hinhAnh[0] : (item.hinhAnh?.url || item.hinhAnh)}
                          alt={item.tenSanPham}
                          className="w-full h-full object-cover rounded-lg"
                        />
                      ) : (
                        <div className="w-full h-full bg-gray-200 rounded-lg flex items-center justify-center">
                          <ShoppingBag className="w-8 h-8 text-gray-400" />
                        </div>
                      )}
                    </div>

                    {/* Product Info */}
                    <div className="flex-1 min-w-0">
                      <div className="flex justify-between items-start mb-2">
                        <div className="flex-1">
                          <h3 className="text-lg font-semibold text-gray-900 line-clamp-2">
                            {item.tenSanPham}
                          </h3>
                          {!item.trangThai && (
                            <span className="inline-block mt-1 px-2 py-1 text-xs font-medium bg-red-100 text-red-800 rounded-full">
                              Ngừng bán
                            </span>
                          )}
                        </div>
                        <button
                          onClick={() => handleRemoveItem(item.sanPhamId)}
                          className="text-red-500 hover:text-red-700 transition-colors ml-2"
                          disabled={updatingItems.has(item.sanPhamId)}
                        >
                          <Trash2 className="w-5 h-5" />
                        </button>
                      </div>

                      <div className="space-y-2">
                        <p className="text-sm text-gray-600">
                          Đơn giá: {formatPrice(item.gia)}
                        </p>
                        <div className="flex items-center space-x-2">
                          <span className="text-sm text-gray-600">Số lượng:</span>
                          <div className="flex items-center space-x-2">
                            <button
                              onClick={() => handleQuantityChange(item.sanPhamId, item.soLuong, -1)}
                              className="w-8 h-8 rounded-full border border-gray-300 flex items-center justify-center hover:bg-gray-100 transition-colors disabled:opacity-50"
                              disabled={updatingItems.has(item.sanPhamId) || item.soLuong <= 1}
                            >
                              <Minus className="w-4 h-4" />
                            </button>
                            <span className="w-12 text-center font-medium">{item.soLuong}</span>
                            <button
                              onClick={() => handleQuantityChange(item.sanPhamId, item.soLuong, 1)}
                              className="w-8 h-8 rounded-full border border-gray-300 flex items-center justify-center hover:bg-gray-100 transition-colors disabled:opacity-50"
                              disabled={updatingItems.has(item.sanPhamId) || item.soLuong >= item.soLuongTon}
                            >
                              <Plus className="w-4 h-4" />
                            </button>
                          </div>
                        </div>
                        <p className="text-sm font-medium text-gray-900">
                          Thành tiền: {formatPrice(item.gia * item.soLuong)}
                        </p>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>

            {/* Cart Summary */}
            <div className="border-t pt-6">
              <div className="space-y-4">
                <div className="flex justify-between items-center">
                  <span className="text-lg font-semibold text-gray-900">Tổng cộng:</span>
                  <span className="text-lg font-medium text-gray-900">
                    {formatPrice(totalAmount)}
                  </span>
                </div>

                <div className="flex justify-between items-center">
                  <span className="text-sm text-gray-600">Phí vận chuyển:</span>
                  <span className="text-sm font-medium text-gray-900">Miễn phí</span>
                </div>

                <div className="flex justify-between items-center">
                  <span className="text-lg font-bold text-gray-900">Tổng cộng:</span>
                  <span className="text-lg font-bold text-purple-600">
                    {formatPrice(totalAmount)}
                  </span>
                </div>
              </div>

              {/* Action Buttons */}
              <div className="space-y-4 pt-6">
                <button
                  onClick={handleClearCart}
                  className="w-full px-4 py-3 border border-red-500 text-red-500 rounded-lg font-medium hover:bg-red-50 transition-colors"
                  disabled={isLoading || items.length === 0}
                >
                  Xóa giỏ hàng
                </button>
                <Link
                  to="/checkout"
                  className={`w-full px-6 py-3 text-white rounded-lg font-semibold transition-colors text-center ${
                    hasInactiveItems
                      ? 'bg-gray-400 cursor-not-allowed'
                      : 'bg-purple-600 hover:bg-purple-700'
                  }`}
                  onClick={(e) => {
                    if (hasInactiveItems) {
                      e.preventDefault();
                      toast.error('Vui lòng xóa các sản phẩm đã ngừng bán trước khi thanh toán!');
                    }
                  }}
                >
                  Thanh toán
                </Link>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default CartPage;
