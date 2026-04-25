import React from 'react';
import { ArrowRight } from 'lucide-react';
import { formatPrice } from '../../../shared/utils/formatters';

const DashboardTopProducts = ({ topSellingProducts, topWishlistProducts, onNavigate }) => {
  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-8">
      {/* Top Selling Products */}
      <div className="bg-white shadow rounded-lg">
        <div className="px-6 py-4 border-b border-gray-200 flex justify-between items-center">
          <h2 className="text-lg font-semibold text-gray-900">Top sản phẩm bán chạy</h2>
          <button onClick={() => onNavigate('/admin/products')} className="text-blue-600 hover:text-blue-700 text-sm font-medium">
            Xem tất cả <ArrowRight className="h-4 w-4 inline" />
          </button>
        </div>
        <div className="p-6">
          {topSellingProducts.length === 0 ? (
            <p className="text-gray-500 text-center py-4">Chưa có dữ liệu</p>
          ) : (
            <div className="space-y-4">
              {topSellingProducts.map((product, index) => (
                <div key={product._id} className="flex items-center space-x-4">
                  <div className="flex-shrink-0 w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center">
                    <span className="text-sm font-bold text-blue-600">{index + 1}</span>
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-medium text-gray-900 truncate">{product.tenSanPham}</p>
                    <p className="text-xs text-gray-500">Đã bán: {product.totalSold}</p>
                  </div>
                  <div className="text-right">
                    <p className="text-sm font-medium text-gray-900">{formatPrice(product.totalRevenue)}</p>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>

      {/* Top Wishlist Products */}
      <div className="bg-white shadow rounded-lg">
        <div className="px-6 py-4 border-b border-gray-200 flex justify-between items-center">
          <h2 className="text-lg font-semibold text-gray-900">Sản phẩm được yêu thích</h2>
          <button onClick={() => onNavigate('/admin/wishlist')} className="text-blue-600 hover:text-blue-700 text-sm font-medium">
            Xem tất cả <ArrowRight className="h-4 w-4 inline" />
          </button>
        </div>
        <div className="p-6">
          {topWishlistProducts.length === 0 ? (
            <p className="text-gray-500 text-center py-4">Chưa có dữ liệu</p>
          ) : (
            <div className="space-y-4">
              {topWishlistProducts.map((product, index) => (
                <div key={product._id} className="flex items-center space-x-4">
                  <div className="flex-shrink-0 w-8 h-8 bg-red-100 rounded-full flex items-center justify-center">
                    <span className="text-sm font-bold text-red-600">{index + 1}</span>
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-medium text-gray-900 truncate">{product.tenSanPham}</p>
                    <p className="text-xs text-gray-500">Yêu thích: {product.wishlistCount}</p>
                  </div>
                  <div className="text-right">
                    <p className="text-sm font-medium text-gray-900">{formatPrice(product.gia)}</p>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default DashboardTopProducts;
