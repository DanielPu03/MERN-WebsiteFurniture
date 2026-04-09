import React from 'react';
import { useOrder } from '../../../shared/hooks/useRedux';

const OrderPage = () => {
  const { orders } = useOrder();

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <div className="bg-white shadow rounded-lg p-6">
        <h2 className="text-2xl font-bold text-gray-900 mb-4">Đơn hàng của tôi</h2>
        
        {orders.length === 0 ? (
          <p className="text-gray-600">Bạn chưa có đơn hàng nào</p>
        ) : (
          <div className="space-y-4">
            {orders.map((order) => (
              <div key={order._id} className="border rounded-lg p-4">
                <p className="font-medium">Mã đơn: {order._id}</p>
                <p>Tổng tiền: {order.tongTien.toLocaleString('vi-VN')} VNĐ</p>
                <p>Trạng thái: {order.tinhTrang}</p>
              </div>
            ))}
          </div>
        )}
        
        <div className="mt-6">
          <p className="text-center text-gray-600">
            Trang đơn hàng đang được phát triển...
          </p>
        </div>
      </div>
    </div>
  );
};

export default OrderPage;
