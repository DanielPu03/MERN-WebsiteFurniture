import React from 'react';
import { Star } from 'lucide-react';
import { formatCurrency } from '../../../shared/utils';

const ProductInfo = ({ product }) => {
  const renderStars = (rating) => {
    return Array.from({ length: 5 }, (_, i) => (
      <Star
        key={i}
        className={`h-5 w-5 ${
          i < Math.floor(rating) ? 'text-yellow-400 fill-current' : 'text-gray-300'
        }`}
      />
    ));
  };

  return (
    <div className="space-y-6">
      {/* Product Name */}
      <div>
        <h1 className="text-3xl font-bold text-gray-900 mb-2">{product.tenSanPham}</h1>
        <p className="text-gray-600">{product.moTa || 'Sản phẩm chất lượng cao'}</p>
      </div>

      {/* Rating */}
      <div className="flex items-center space-x-4">
        <div className="flex items-center">
          {renderStars(product.danhGiaTrungBinh || 0)}
        </div>
        <span className="text-gray-600">
          {product.danhGiaTrungBinh || 0} ({product.soLuongDanhGia || 0} đánh giá)
        </span>
      </div>

      {/* Price */}
      <div className="flex items-baseline space-x-2">
        <span className="text-4xl font-bold bg-gradient-to-r from-purple-600 to-pink-600 bg-clip-text text-transparent">
          {formatCurrency(product.gia)}
        </span>
      </div>

      {/* Stock Status */}
      <div className="flex items-center space-x-2">
        {product.soLuongTon === 0 ? (
          <>
            <div className="w-3 h-3 bg-red-500 rounded-full"></div>
            <span className="text-red-600 font-medium">Hết hàng</span>
          </>
        ) : product.soLuongTon <= 5 ? (
          <>
            <div className="w-3 h-3 bg-orange-500 rounded-full"></div>
            <span className="text-orange-600 font-medium">Sắp hết hàng ({product.soLuongTon} sản phẩm)</span>
          </>
        ) : (
          <>
            <div className="w-3 h-3 bg-green-500 rounded-full"></div>
            <span className="text-green-600 font-medium">Còn hàng ({product.soLuongTon} sản phẩm)</span>
          </>
        )}
      </div>

      {/* Category */}
      <div className="border-t pt-6">
        <div className="text-sm">
          <span className="text-gray-500">Danh mục:</span>
          <span className="ml-2 text-gray-900 font-medium">
            {product.danhMucId?.tenDanhMuc || 'N/A'}
          </span>
        </div>
      </div>
    </div>
  );
};

export default ProductInfo;
