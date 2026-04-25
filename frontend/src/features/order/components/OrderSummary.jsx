import React from 'react';
import { formatPrice } from '../../../shared/utils/formatters';

const OrderSummary = ({ items, totalAmount, itemCount }) => {
  const shippingFee = 0;
  const total = totalAmount + shippingFee;

  return (
    <div className="bg-white rounded-lg shadow-lg p-6">
      <h2 className="text-xl font-bold text-gray-900 mb-6">Tóm tắt đơn hàng</h2>

      {/* Cart Items */}
      <div className="space-y-4 mb-6 max-h-80 overflow-y-auto">
        {items.map((item) => (
          <div key={item._id || item.sanPhamId} className="flex items-center space-x-4">
            <div className="flex-shrink-0 h-16 w-16">
              {item.hinhAnh && item.hinhAnh.length > 0 ? (
                <img
                  className="h-16 w-16 rounded object-cover"
                  src={item.hinhAnh[0].url || item.hinhAnh[0]}
                  alt={item.tenSanPham}
                />
              ) : (
                <div className="h-16 w-16 rounded bg-gray-200 flex items-center justify-center">
                  <span className="text-gray-400 text-xs">No img</span>
                </div>
              )}
            </div>
            <div className="flex-1">
              <h4 className="text-sm font-medium text-gray-900">{item.tenSanPham}</h4>
              <p className="text-sm text-gray-600">Số lượng: {item.soLuong}</p>
              <p className="text-sm font-semibold text-purple-600">{formatPrice(item.gia)}</p>
            </div>
            <div className="text-right">
              <p className="text-sm font-semibold text-gray-900">
                {formatPrice(item.gia * item.soLuong)}
              </p>
            </div>
          </div>
        ))}
      </div>

      {/* Order Totals */}
      <div className="border-t border-gray-200 pt-4 space-y-3">
        <div className="flex justify-between text-sm">
          <span className="text-gray-600">Tạm tính ({itemCount} sản phẩm)</span>
          <span className="text-gray-900">{formatPrice(totalAmount)}</span>
        </div>
        <div className="flex justify-between text-sm">
          <span className="text-gray-600">Phí vận chuyển</span>
          <span className="text-gray-900">{shippingFee === 0 ? 'Miễn phí' : formatPrice(shippingFee)}</span>
        </div>
        <div className="flex justify-between text-lg font-bold border-t border-gray-200 pt-3">
          <span className="text-gray-900">Tổng cộng</span>
          <span className="text-purple-600">{formatPrice(total)}</span>
        </div>
      </div>
    </div>
  );
};

export default OrderSummary;
