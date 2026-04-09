import React from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { ShoppingCart, Heart, Star, Package, ArrowLeft, Minus, Plus, Share2, Truck, Shield, RefreshCw } from 'lucide-react';
import { useProduct } from '../hooks/useProduct';
import { useCart } from '../../../shared/hooks/useRedux';
import { formatCurrency } from '../../../shared/utils';
import Loading from '../../../shared/components/Loading';
import Button from '../../../shared/components/Button';

const ProductDetailPage = () => {
    const { id } = useParams();
  const navigate = useNavigate();
  const { currentProduct, isLoading, error, getProductById, getRelatedProducts, relatedProducts, dispatch } = useProduct();
  const { addItem } = useCart();
  const [quantity, setQuantity] = React.useState(1);
  const [selectedImage, setSelectedImage] = React.useState(0);
  
  
  React.useEffect(() => {
    if (id) {
      dispatch(getProductById(id));
    }
  }, [id]);

  React.useEffect(() => {
    if (currentProduct && currentProduct.danhMucId) {
      dispatch(getRelatedProducts({ 
        categoryId: currentProduct.danhMucId._id || currentProduct.danhMucId, 
        excludeId: currentProduct._id,
        limit: 4 
      }));
    }
  }, [currentProduct, id]);

  const handleAddToCart = () => {
    if (currentProduct && currentProduct.trangThai && currentProduct.soLuongTon > 0) {
      addItem({
        productId: currentProduct._id,
        quantity: quantity
      });
    }
  };

  const handleQuantityChange = (change) => {
    const newQuantity = quantity + change;
    if (newQuantity >= 1 && newQuantity <= (currentProduct?.soLuongTon || 1)) {
      setQuantity(newQuantity);
    }
  };

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

  if (isLoading) {
    return (
      <div className="flex justify-center items-center min-h-96">
        <Loading size="lg" text="Đang tải sản phẩm..." />
      </div>
    );
  }

  if (error || !currentProduct) {
    return (
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="bg-white shadow rounded-lg p-6 text-center">
          <Package className="w-16 h-16 mx-auto text-gray-400 mb-4" />
          <h2 className="text-2xl font-bold text-gray-900 mb-2">Không tìm thấy sản phẩm</h2>
          <p className="text-gray-600 mb-4">{error || 'Sản phẩm không tồn tại'}</p>
          <Button onClick={() => navigate('/products')}>
            <ArrowLeft className="h-4 w-4 mr-2" />
            Quay lại sản phẩm
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      {/* Breadcrumb */}
      <nav className="mb-8">
        <ol className="flex items-center space-x-2 text-sm text-gray-500">
          <li>
            <button onClick={() => navigate('/')} className="hover:text-purple-600">
              Trang chủ
            </button>
          </li>
          <li>/</li>
          <li>
            <button onClick={() => navigate('/products')} className="hover:text-purple-600">
              Sản phẩm
            </button>
          </li>
          <li>/</li>
          <li className="text-gray-900 font-medium">{currentProduct.tenSanPham}</li>
        </ol>
      </nav>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
        {/* Product Images */}
        <div className="space-y-4">
          {/* Main Image */}
          <div className="aspect-square bg-gray-100 rounded-2xl overflow-hidden">
            {(() => {
              let imageUrl = null;
              let hasValidImage = false;
              
              if (currentProduct.hinhAnh) {
                if (Array.isArray(currentProduct.hinhAnh) && currentProduct.hinhAnh.length > 0) {
                  const image = currentProduct.hinhAnh[selectedImage];
                  if (image && typeof image === 'object' && image.url) {
                    imageUrl = image.url;
                    hasValidImage = true;
                  } else if (typeof image === 'string' && image.trim().length > 0) {
                    imageUrl = image;
                    hasValidImage = true;
                  }
                } else if (typeof currentProduct.hinhAnh === 'string' && currentProduct.hinhAnh.trim().length > 0) {
                  imageUrl = currentProduct.hinhAnh;
                  hasValidImage = true;
                } else if (typeof currentProduct.hinhAnh === 'object' && currentProduct.hinhAnh.url) {
                  imageUrl = currentProduct.hinhAnh.url;
                  hasValidImage = true;
                }
              }
              
              return hasValidImage && imageUrl ? (
                <img
                  src={imageUrl}
                  alt={currentProduct.tenSanPham}
                  className="w-full h-full object-cover"
                  onError={(e) => {
                    e.target.style.display = 'none';
                    e.target.parentElement.innerHTML = `
                      <div class="w-full h-full flex items-center justify-center">
                        <svg class="w-24 h-24 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z"></path>
                        </svg>
                      </div>
                    `;
                  }}
                />
              ) : (
                <div className="w-full h-full flex items-center justify-center">
                  <Package className="w-24 h-24 text-gray-400" />
                </div>
              );
            })()}
          </div>

          {/* Thumbnail Images */}
          {currentProduct.hinhAnh && (
            (() => {
              const images = Array.isArray(currentProduct.hinhAnh) 
                ? currentProduct.hinhAnh 
                : [currentProduct.hinhAnh];
              
              if (images.length > 1) {
                return (
                  <div className="flex space-x-4">
                    {images.map((image, index) => {
                      let thumbnailUrl = null;
                      
                      if (image && typeof image === 'object' && image.url) {
                        thumbnailUrl = image.url;
                      } else if (typeof image === 'string' && image.trim().length > 0) {
                        thumbnailUrl = image;
                      }
                      
                      return thumbnailUrl ? (
                        <button
                          key={index}
                          onClick={() => setSelectedImage(index)}
                          className={`w-20 h-20 rounded-lg overflow-hidden border-2 transition-colors ${
                            selectedImage === index ? 'border-purple-600' : 'border-gray-200'
                          }`}
                        >
                          <img
                            src={thumbnailUrl}
                            alt={`${currentProduct.tenSanPham} ${index + 1}`}
                            className="w-full h-full object-cover"
                            onError={(e) => {
                              e.target.style.display = 'none';
                              e.target.parentElement.innerHTML = `
                                <div class="w-full h-full flex items-center justify-center bg-gray-100">
                                  <svg class="w-6 h-6 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z"></path>
                                  </svg>
                                </div>
                              `;
                            }}
                          />
                        </button>
                      ) : null;
                    }).filter(Boolean)}
                  </div>
                );
              }
              return null;
            })()
          )}
        </div>

        {/* Product Info */}
        <div className="space-y-6">
          {/* Product Name */}
          <div>
            <h1 className="text-3xl font-bold text-gray-900 mb-2">{currentProduct.tenSanPham}</h1>
            <p className="text-gray-600">{currentProduct.moTa || 'Sản phẩm chất lượng cao'}</p>
          </div>

          {/* Rating */}
          <div className="flex items-center space-x-4">
            <div className="flex items-center">
              {renderStars(currentProduct.danhGiaTrungBinh || 0)}
            </div>
            <span className="text-gray-600">
              {currentProduct.danhGiaTrungBinh || 0} ({currentProduct.soLuongDanhGia || 0} đánh giá)
            </span>
          </div>

          {/* Price */}
          <div className="flex items-baseline space-x-2">
            <span className="text-4xl font-bold bg-gradient-to-r from-purple-600 to-pink-600 bg-clip-text text-transparent">
              {formatCurrency(currentProduct.gia)}
            </span>
          </div>

          {/* Stock Status */}
          <div className="flex items-center space-x-2">
            {currentProduct.trangThai && currentProduct.soLuongTon > 0 ? (
              <>
                <div className="w-3 h-3 bg-green-500 rounded-full"></div>
                <span className="text-green-600 font-medium">Còn hàng ({currentProduct.soLuongTon} sản phẩm)</span>
              </>
            ) : (
              <>
                <div className="w-3 h-3 bg-red-500 rounded-full"></div>
                <span className="text-red-600 font-medium">Hết hàng</span>
              </>
            )}
          </div>

          {/* Quantity and Add to Cart */}
          <div className="space-y-4">
            <div className="flex items-center space-x-4">
              <span className="text-gray-700 font-medium">Số lượng:</span>
              <div className="flex items-center border border-gray-300 rounded-lg">
                <button
                  onClick={() => handleQuantityChange(-1)}
                  disabled={quantity <= 1}
                  className="p-2 hover:bg-gray-100 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  <Minus className="h-4 w-4" />
                </button>
                <span className="px-4 py-2 min-w-[60px] text-center">{quantity}</span>
                <button
                  onClick={() => handleQuantityChange(1)}
                  disabled={quantity >= (currentProduct?.soLuongTon || 1)}
                  className="p-2 hover:bg-gray-100 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  <Plus className="h-4 w-4" />
                </button>
              </div>
            </div>

            <div className="flex space-x-4">
              <Button
                onClick={handleAddToCart}
                disabled={!currentProduct.trangThai || currentProduct.soLuongTon === 0}
                className="flex-1 bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700"
              >
                <ShoppingCart className="h-5 w-5 mr-2" />
                Thêm vào giỏ hàng
              </Button>
              <Button variant="outline" className="p-3">
                <Heart className="h-5 w-5" />
              </Button>
              <Button variant="outline" className="p-3">
                <Share2 className="h-5 w-5" />
              </Button>
            </div>
          </div>

          {/* Product Features */}
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

          {/* Category and Brand */}
          <div className="border-t pt-6">
            <div className="grid grid-cols-2 gap-4 text-sm">
              <div>
                <span className="text-gray-500">Danh mục:</span>
                <span className="ml-2 text-gray-900 font-medium">
                  {currentProduct.danhMucId?.tenDanhMuc || 'N/A'}
                </span>
              </div>
              <div>
                <span className="text-gray-500">Thương hiệu:</span>
                <span className="ml-2 text-gray-900 font-medium">
                  {currentProduct.thuongHieuId?.tenThuongHieu || 'N/A'}
                </span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Related Products */}
      {currentProduct && (
        <div className="mt-16">
          <h2 className="text-2xl font-bold text-gray-900 mb-8">Sản phẩm cùng danh mục</h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {relatedProducts && relatedProducts.length > 0 ? (
              relatedProducts.map((relatedProduct) => (
                <div 
                  key={relatedProduct._id}
                  className="bg-white rounded-lg shadow-md overflow-hidden hover:shadow-lg transition-shadow duration-300 cursor-pointer"
                  onClick={() => navigate(`/product/${relatedProduct._id}`)}
                >
                  <div className="h-48 bg-gray-200">
                    {(() => {
                      let imageUrl = null;
                      let hasValidImage = false;
                      
                      if (relatedProduct.hinhAnh) {
                        if (Array.isArray(relatedProduct.hinhAnh) && relatedProduct.hinhAnh.length > 0) {
                          const firstImage = relatedProduct.hinhAnh[0];
                          if (firstImage && typeof firstImage === 'object' && firstImage.url) {
                            imageUrl = firstImage.url;
                            hasValidImage = true;
                          } else if (typeof firstImage === 'string' && firstImage.trim().length > 0) {
                            imageUrl = firstImage;
                            hasValidImage = true;
                          }
                        } else if (typeof relatedProduct.hinhAnh === 'string' && relatedProduct.hinhAnh.trim().length > 0) {
                          imageUrl = relatedProduct.hinhAnh;
                          hasValidImage = true;
                        }
                      }
                      
                      return hasValidImage && imageUrl ? (
                        <img
                          src={imageUrl}
                          alt={relatedProduct.tenSanPham}
                          className="w-full h-full object-cover"
                          onError={(e) => {
                            e.target.style.display = 'none';
                            e.target.parentElement.innerHTML = `
                              <div class="w-full h-full flex items-center justify-center bg-gray-200">
                                <svg class="w-12 h-12 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10"></path>
                                </svg>
                              </div>
                            `;
                          }}
                        />
                      ) : (
                        <div className="w-full h-full flex items-center justify-center bg-gray-200">
                          <Package className="w-12 h-12 text-gray-400" />
                        </div>
                      );
                    })()}
                  </div>
                  <div className="p-4">
                    <h3 className="font-semibold text-gray-900 mb-2 line-clamp-2">{relatedProduct.tenSanPham}</h3>
                    <p className="text-blue-600 font-bold">{formatCurrency(relatedProduct.gia)}</p>
                    <p className="text-sm text-gray-600 mt-1">Còn lại: {relatedProduct.soLuongTon}</p>
                  </div>
                </div>
              ))
            ) : (
              <div className="col-span-full text-center py-8">
                <p className="text-gray-600">Không có sản phẩm nào cùng danh mục</p>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
};

export default ProductDetailPage;
