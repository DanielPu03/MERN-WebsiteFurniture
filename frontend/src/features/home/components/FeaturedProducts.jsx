import React from 'react';
import { Link } from 'react-router-dom';
import { Package } from 'lucide-react';
import Loading from '../../../shared/components/Loading';
import Image from '../../../shared/components/Image';
import { formatCurrency } from '../../../shared/utils';

const ProductCard = ({ product }) => {

  const renderStars = (rating) => {
    return Array.from({ length: 5 }, (_, i) => (
      <span
        key={i}
        className={`text-sm ${
          i < Math.floor(rating) ? 'text-yellow-400' : 'text-gray-300'
        }`}
      >
        ★
      </span>
    ));
  };

  return (
    <Link to={`/product/${product._id}`} className="block">
      <div className="bg-white rounded-2xl shadow-lg hover:shadow-2xl transition-all duration-500 overflow-hidden group cursor-pointer">
        <div className="relative aspect-square bg-gradient-to-br from-purple-50 to-pink-50 overflow-hidden">
          <Image
            src={product.hinhAnh}
            alt={product.tenSanPham}
            className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700"
            fallback={
              <div className="w-full h-full flex items-center justify-center bg-gradient-to-br from-purple-100 to-pink-100">
                <Package className="w-16 h-16 text-purple-400" />
              </div>
            }
          />

          {product.soLuongTon === 0 && (
            <div className="absolute top-2 left-2">
              <span className="bg-red-100 text-red-800 text-xs px-2 py-1 rounded-full">
                Hết hàng
              </span>
            </div>
          )}

          {product.soLuongTon > 0 && product.soLuongTon <= 5 && (
            <div className="absolute top-2 left-2">
              <span className="bg-orange-100 text-orange-800 text-xs px-2 py-1 rounded-full">
                Sắp hết hàng
              </span>
            </div>
          )}
        </div>

        <div className="p-4">
          <h3 className="text-lg font-semibold text-gray-900 mb-2 line-clamp-2 group-hover:text-purple-600 transition-colors">
            {product.tenSanPham}
          </h3>

          <div className="flex items-center justify-between mb-2">
            <span className="text-2xl font-bold text-purple-600">
              {formatCurrency(product.gia)}
            </span>
            {product.danhGiaTrungBinh && (
              <div className="flex items-center">
                {renderStars(product.danhGiaTrungBinh)}
              </div>
            )}
          </div>

          <div className="flex items-center justify-between text-sm text-gray-600">
            <span>Tồn kho: {product.soLuongTon}</span>
            <span className={product.trangThai ? 'text-green-600' : 'text-red-600'}>
              {product.trangThai ? 'Đang bán' : 'Ngừng bán'}
            </span>
          </div>
        </div>
      </div>
    </Link>
  );
};

const FeaturedProducts = ({ products, isLoading, error }) => {
  if (isLoading && products.length === 0) {
    return (
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-center items-center min-h-96">
          <Loading size="lg" text="Đang tải sản phẩm..." />
        </div>
      </section>
    );
  }

  if (error) {
    return (
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-center items-center min-h-96">
          <div className="text-red-500">
            <p className="text-xl font-semibold mb-2">Lỗi tải sản phẩm</p>
            <p className="text-sm">{error}</p>
          </div>
        </div>
      </section>
    );
  }

  return (
    <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
      <div className="text-center mb-12">
        <h2 className="text-3xl font-bold text-gray-900 mb-4">Sản phẩm nổi bật</h2>
        <p className="text-lg text-gray-600">Khám phá những sản phẩm bán chạy nhất của chúng tôi</p>
      </div>

      {products.length === 0 ? (
        <div className="text-center py-12">
          <Package className="w-16 h-16 mx-auto text-gray-400 mb-4" />
          <p className="text-gray-600">Chưa có sản phẩm nào</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {products.map((product) => (
            <ProductCard key={product._id} product={product} />
          ))}
        </div>
      )}

      <div className="text-center mt-12">
        <Link
          to="/products"
          className="inline-flex items-center px-6 py-3 bg-gradient-to-r from-purple-600 to-pink-600 text-white rounded-full font-semibold hover:from-purple-700 hover:to-pink-700 transition-colors"
        >
          Xem tất cả sản phẩm
        </Link>
      </div>
    </section>
  );
};

export default FeaturedProducts;
