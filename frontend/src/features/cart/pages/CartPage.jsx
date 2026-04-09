import React from 'react';
import { useCart } from '../../../shared/hooks/useRedux';

const CartPage = () => {
  const { items, totalAmount, itemCount } = useCart();

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <div className="bg-white shadow rounded-lg p-6">
        <h2 className="text-2xl font-bold text-gray-900 mb-4">Giỏ hàng</h2>
        
        <div className="mb-6">
          <p className="text-gray-600">
            Số lượng sản phẩm: {itemCount} | Tổng tiền: {totalAmount.toLocaleString('vi-VN')} VNĐ
          </p>
        </div>

        {items.length === 0 ? (
          <p className="text-gray-600">Giỏ hàng trống</p>
        ) : (
          <div className="space-y-4">
            {items.map((item) => (
              <div key={item.sanPhamId} className="border rounded-lg p-4">
                <p className="font-medium">{item.sanPhamId}</p>
                <p>Số lượng: {item.soLuong}</p>
                <p>Giá: {item.gia.toLocaleString('vi-VN')} VNĐ</p>
              </div>
            ))}
          </div>
        )}
        
        <div className="mt-6">
          <p className="text-center text-gray-600">
            Trang giỏ hàng đang được phát triển...
          </p>
        </div>
      </div>
    </div>
  );
};

export default CartPage;
