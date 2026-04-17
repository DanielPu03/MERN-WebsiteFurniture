import React from 'react';
import { Truck, Shield, RefreshCw } from 'lucide-react';

const ProductFeatures = () => {
  return (
    <div className="border-t pt-6">
      <h3 className="text-lg font-semibold text-gray-900 mb-4">Đặc điểm nổi bật</h3>
      <div className="space-y-3">
        <div className="flex items-center space-x-3">
          <Truck className="h-5 w-5 text-purple-600" />
          <span className="text-gray-700">Giao hàng miễn phí cho đơn hàng từ 2 triệu</span>
        </div>
        <div className="flex items-center space-x-3">
          <Shield className="h-5 w-5 text-purple-600" />
          <span className="text-gray-700">Bảo hành chính hãng 12 tháng</span>
        </div>
        <div className="flex items-center space-x-3">
          <RefreshCw className="h-5 w-5 text-purple-600" />
          <span className="text-gray-700">Đổi trả trong 30 ngày</span>
        </div>
      </div>
    </div>
  );
};

export default ProductFeatures;
