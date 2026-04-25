import React from 'react';
import { AlertTriangle } from 'lucide-react';

const DashboardLowStock = ({ lowStockProducts }) => {
  if (lowStockProducts.length === 0) return null;

  return (
    <div className="bg-red-50 border border-red-200 rounded-lg p-6 mb-8">
      <div className="flex items-center mb-4">
        <AlertTriangle className="h-5 w-5 text-red-600 mr-2" />
        <h2 className="text-lg font-semibold text-red-900">Cảnh báo: Sản phẩm sắp hết hàng</h2>
      </div>
      <div className="space-y-2">
        {lowStockProducts.map((product) => (
          <div key={product._id} className="flex items-center justify-between bg-white rounded p-3">
            <p className="text-sm font-medium text-gray-900">{product.tenSanPham}</p>
            <p className="text-sm font-bold text-red-600">Còn: {product.soLuongTon}</p>
          </div>
        ))}
      </div>
    </div>
  );
};

export default DashboardLowStock;
