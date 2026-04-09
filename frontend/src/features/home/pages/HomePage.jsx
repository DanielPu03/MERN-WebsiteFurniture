import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { ShoppingCart, Heart, Star, Package, Eye } from 'lucide-react';
import { useHome } from '../hooks/useHome';
import { useCollections } from '../../collections/hooks/useCollections';
import { useAppSelector, useAppDispatch } from '../../../shared/hooks/useRedux';
import { formatCurrency } from '../../../shared/utils';
import Loading from '../../../shared/components/Loading';

// ProductCard Component
const ProductCard = ({ product }) => {
  const navigate = useNavigate();

  const renderStars = (rating) => {
    return Array.from({ length: 5 }, (_, i) => (
      <Star
        key={i}
        className={`h-4 w-4 ${
          i < Math.floor(rating) ? 'text-yellow-400 fill-current' : 'text-gray-300'
        }`}
      />
    ));
  };

  const handleCardClick = () => {
    navigate(`/product/${product._id}`);
  };

  const handleAddToCart = (e) => {
    e.stopPropagation();
    // Add to cart functionality
  };

  const handleQuickView = (e) => {
    e.stopPropagation();
    navigate(`/product/${product._id}`);
  };

  return (
    <div className="group relative bg-white rounded-2xl shadow-lg hover:shadow-2xl transition-all duration-500 overflow-hidden cursor-pointer transform hover:-translate-y-2">
      {/* Product Badge */}
      {!product.trangThai && (
        <div className="absolute top-4 left-4 z-10">
          <span className="bg-red-500 text-white px-3 py-1 rounded-full text-sm font-semibold shadow-lg">
            Hết Hàng
          </span>
        </div>
      )}
      
      {/* Quick Actions */}
      <div className="absolute top-4 right-4 z-10 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
        <div className="flex flex-col gap-2">
          <button
            onClick={handleQuickView}
            className="p-2 bg-white rounded-full shadow-lg hover:bg-gray-100 transition-colors"
            title="Xem nhanh"
          >
            <Eye className="h-4 w-4 text-gray-700" />
          </button>
          <button className="p-2 bg-white rounded-full shadow-lg hover:bg-gray-100 transition-colors hover:text-red-500" title="Yêu thích">
            <Heart className="h-4 w-4 text-gray-700" />
          </button>
        </div>
      </div>

      {/* Product Image */}
      <div onClick={handleCardClick} className="relative overflow-hidden">
        <div className="aspect-square bg-gradient-to-br from-gray-100 to-gray-200">
          {(() => {
            let imageUrl = null;
            let hasValidImage = false;
            
            // Handle different image data structures
            if (product.hinhAnh) {
              if (Array.isArray(product.hinhAnh) && product.hinhAnh.length > 0) {
                // Array of objects or strings
                const firstImage = product.hinhAnh[0];
                if (firstImage && typeof firstImage === 'object' && firstImage.url) {
                  imageUrl = firstImage.url;
                  hasValidImage = true;
                } else if (typeof firstImage === 'string' && firstImage.trim().length > 0) {
                  imageUrl = firstImage;
                  hasValidImage = true;
                }
              } else if (typeof product.hinhAnh === 'string' && product.hinhAnh.trim().length > 0) {
                // Single string URL
                imageUrl = product.hinhAnh;
                hasValidImage = true;
              } else if (typeof product.hinhAnh === 'object' && product.hinhAnh.url) {
                // Single object with url
                imageUrl = product.hinhAnh.url;
                hasValidImage = true;
              }
            }
            
            return hasValidImage && imageUrl ? (
              <img
                src={imageUrl}
                alt={product.tenSanPham}
                className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700"
                onError={(e) => {
                  e.target.style.display = 'none';
                  e.target.parentElement.innerHTML = `
                    <div class="w-full h-full flex items-center justify-center bg-gray-100">
                      <svg class="w-12 h-12 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z"></path>
                      </svg>
                    </div>
                  `;
                }}
              />
            ) : (
              <div className="w-full h-full flex items-center justify-center bg-gray-100">
                <Package className="w-12 h-12 text-gray-400" />
              </div>
            );
          })()}
        </div>
        
        {/* Overlay on hover */}
        <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
      </div>
      
      {/* Product Info */}
      <div className="p-6">
        <div className="mb-4">
          <h3 className="text-lg font-bold text-gray-800 mb-2 line-clamp-2 group-hover:text-purple-600 transition-colors">
            {product.tenSanPham}
          </h3>
          
          <p className="text-gray-600 text-sm mb-3 line-clamp-2">
            {product.moTa || 'Sản phẩm chất lượng cao'}
          </p>
          
          {/* Rating */}
          <div className="flex items-center mb-3">
            <div className="flex items-center">
              {renderStars(product.danhGiaTrungBinh || 0)}
            </div>
            <span className="ml-2 text-sm text-gray-500">
              ({product.soLuongDanhGia || 0})
            </span>
          </div>
        </div>
        
        {/* Price and Add to Cart */}
        <div className="flex items-center justify-between">
          <div>
            <span className="text-2xl font-bold bg-gradient-to-r from-purple-600 to-pink-600 bg-clip-text text-transparent">
              {formatCurrency(product.gia)}
            </span>
          </div>
          
          <button
            onClick={handleAddToCart}
            disabled={!product.trangThai || product.soLuongTon === 0}
            className={`px-4 py-2 rounded-full font-medium transition-all duration-300 transform hover:scale-105 ${
              product.trangThai && product.soLuongTon > 0
                ? 'bg-gradient-to-r from-purple-600 to-pink-600 text-white hover:from-purple-700 hover:to-pink-700 shadow-lg'
                : 'bg-gray-300 text-gray-500 cursor-not-allowed'
            }`}
          >
            <ShoppingCart className="h-4 w-4 inline mr-2" />
            Thêm
          </button>
        </div>
      </div>

      {/* Hover effect border */}
      <div className="absolute inset-0 border-2 border-transparent group-hover:border-purple-200 rounded-2xl transition-colors duration-300 pointer-events-none"></div>
    </div>
  );
};

const HomePage = () => {
  const { featuredProducts: products, isLoading, error, loadFeaturedProducts } = useHome();
  const { collections, loadCollections } = useCollections();
  
  // Direct Redux state test
  const directProducts = useAppSelector(state => state.product.products);
  const directLoading = useAppSelector(state => state.product.isLoading);
  const directError = useAppSelector(state => state.product.error);
  
  React.useEffect(() => {
    loadFeaturedProducts(4); // Ch? hi?n 4 s?n ph?m
    loadCollections();
  }, []);

  
  if (isLoading && products.length === 0) {
    return (
      <div className="flex justify-center items-center min-h-96">
        <Loading size="lg" text="Đang tải sản phẩm..." />
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex justify-center items-center min-h-96">
        <div className="text-red-500">
          <p className="text-xl font-semibold mb-2">Lỗi tải sản phẩm</p>
          <p className="text-sm">{error}</p>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-12">
      {/* Hero Section */}
      <section className="bg-gradient-to-r from-purple-600 to-pink-600 text-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-24">
          <div className="text-center">
            <h1 className="text-4xl md:text-6xl font-bold mb-6">
              <span className="text-purple-300">havy</span>
              <span className="text-white">Store</span>
            </h1>
            <p className="text-xl md:text-2xl mb-8 text-purple-100">
              Khám phá những sản phẩm nội thất đẹp và hiện đại
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link
                to="/products"
                className="px-8 py-3 bg-white text-purple-600 rounded-full font-semibold hover:bg-purple-50 transition-colors"
              >
                Khám phá ngay
              </Link>
              <Link
                to="/about"
                className="px-8 py-3 bg-transparent border-2 border-white text-white rounded-full font-semibold hover:bg-white hover:text-purple-600 transition-colors"
              >
                Tìm hiểu thêm
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* Featured Products */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-12">
          <h2 className="text-3xl font-bold text-gray-900 mb-4">Sản phẩm nổi bật</h2>
          <p className="text-lg text-gray-600">Khám phá những sản phẩm bán chạy nhất của chúng tôi</p>
        </div>

        {products.length === 0 ? (
          <div className="text-center py-12">
            <Package className="w-16 h-16 mx-auto text-gray-400 mb-4" />
            <p className="text-gray-600">Chưa có sản phẩm nào</p>
            {error && <p className="text-red-500 text-sm mt-2">Error: {error}</p>}
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

      {/* Collections Section */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-12">
          <h2 className="text-3xl font-bold text-gray-900 mb-4">Bộ Sưu Tập</h2>
          <p className="text-lg text-gray-600">Khám phá những bộ sưu tập đặc biệt của chúng tôi</p>
        </div>

        {collections && collections.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {collections.slice(0, 3).map((collection) => (
              <div key={collection._id} className="group relative bg-white rounded-2xl shadow-lg hover:shadow-2xl transition-all duration-500 overflow-hidden cursor-pointer">
                <Link to={`/collections/${collection._id}`}>
                  {/* Collection Image */}
                  <div className="aspect-video bg-gradient-to-br from-purple-100 to-pink-100 overflow-hidden">
                    {(() => {
                      let imageUrl = null;
                      let hasValidImage = false;
                      
                      // Handle different image data structures
                      if (collection.hinhAnh) {
                        if (Array.isArray(collection.hinhAnh) && collection.hinhAnh.length > 0) {
                          const firstImage = collection.hinhAnh[0];
                          if (firstImage && typeof firstImage === 'object' && firstImage.url) {
                            imageUrl = firstImage.url;
                            hasValidImage = true;
                          } else if (typeof firstImage === 'string' && firstImage.trim().length > 0) {
                            imageUrl = firstImage;
                            hasValidImage = true;
                          }
                        } else if (typeof collection.hinhAnh === 'string' && collection.hinhAnh.trim().length > 0) {
                          imageUrl = collection.hinhAnh;
                          hasValidImage = true;
                        } else if (typeof collection.hinhAnh === 'object' && collection.hinhAnh.url) {
                          imageUrl = collection.hinhAnh.url;
                          hasValidImage = true;
                        }
                      }
                      
                      return hasValidImage && imageUrl ? (
                        <img
                          src={imageUrl}
                          alt={collection.tenBoSuuTap}
                          className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700"
                          onError={(e) => {
                            e.target.style.display = 'none';
                            e.target.parentElement.innerHTML = `
                              <div class="w-full h-full flex items-center justify-center bg-gradient-to-br from-purple-100 to-pink-100">
                                <svg class="w-16 h-16 text-purple-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10"></path>
                                </svg>
                              </div>
                            `;
                          }}
                        />
                      ) : (
                        <div className="w-full h-full flex items-center justify-center bg-gradient-to-br from-purple-100 to-pink-100">
                          <Package className="w-16 h-16 text-purple-400" />
                        </div>
                      );
                    })()}
                  </div>
                  
                  {/* Collection Info */}
                  <div className="p-6">
                    <h3 className="text-xl font-bold text-gray-900 mb-2 group-hover:text-purple-600 transition-colors">
                      {collection.tenBoSuuTap}
                    </h3>
                    <p className="text-gray-600 mb-4 line-clamp-2">
                      {collection.moTa || 'Bộ sưu tập sản phẩm chất lượng cao'}
                    </p>
                    <div className="flex items-center justify-between">
                      <span className="text-sm text-gray-500">
                        {collection.soLuongSanPham || 0} sản phẩm
                      </span>
                      <span className="text-purple-600 font-medium group-hover:text-purple-700 transition-colors">
                        Xem thêm
                      </span>
                    </div>
                  </div>

                  {/* Hover overlay */}
                  <div className="absolute inset-0 bg-gradient-to-t from-purple-900/20 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                </Link>
              </div>
            ))}
          </div>
        ) : (
          <div className="text-center py-12">
            <Package className="w-16 h-16 mx-auto text-gray-400 mb-4" />
            <p className="text-gray-600">Chưa có bộ sưu tập nào</p>
          </div>
        )}

        <div className="text-center mt-12">
          <Link
            to="/collections"
            className="inline-flex items-center px-6 py-3 bg-gradient-to-r from-purple-600 to-pink-600 text-white rounded-full font-semibold hover:from-purple-700 hover:to-pink-700 transition-colors"
          >
            Xem tất cả bộ sưu tập
          </Link>
        </div>
      </section>

      {/* Features Section */}
      <section className="bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-gray-900 mb-4">Tại sao chọn havyStore?</h2>
            <p className="text-lg text-gray-600">Chúng tôi cam kết mang đến trải nghiệm mua sắm tốt nhất</p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="text-center">
              <div className="w-16 h-16 bg-purple-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <Package className="w-8 h-8 text-purple-600" />
              </div>
              <h3 className="text-xl font-semibold text-gray-900 mb-2">Sản phẩm chất lượng</h3>
              <p className="text-gray-600">Cam kết sản phẩm chính hãng, chất lượng đảm bảo</p>
            </div>
            
            <div className="text-center">
              <div className="w-16 h-16 bg-pink-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <Heart className="w-8 h-8 text-pink-600" />
              </div>
              <h3 className="text-xl font-semibold text-gray-900 mb-2">Dịch vụ tận tâm</h3>
              <p className="text-gray-600">Đội ngũ tư vấn chuyên nghiệp, hỗ trợ 24/7</p>
            </div>
            
            <div className="text-center">
              <div className="w-16 h-16 bg-purple-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <ShoppingCart className="w-8 h-8 text-purple-600" />
              </div>
              <h3 className="text-xl font-semibold text-gray-900 mb-2">Giao hàng nhanh chóng</h3>
              <p className="text-gray-600">Miễn phí vận chuyển cho đơn hàng từ 2 triệu</p>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};

export default HomePage;
