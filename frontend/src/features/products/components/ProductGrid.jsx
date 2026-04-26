import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Heart } from 'lucide-react';
import { formatCurrency } from '../../../shared/utils';
import Button from '../../../shared/components/Button';
import { useAppDispatch, useAppSelector } from '../../../shared/hooks/useRedux';
import { addToWishlist, removeFromWishlist } from '../../wishlist/store/wishlistSlice';
import toast from 'react-hot-toast';

const ProductCard = ({ product, onAddToCart }) => {
  const navigate = useNavigate();
  const dispatch = useAppDispatch();
  const { wishlistProductIds } = useAppSelector((state) => state.wishlist);
  const { user } = useAppSelector((state) => state.auth);

  const isInWishlist = wishlistProductIds.includes(product._id);

  const handleToggleWishlist = async (e) => {
    e.stopPropagation();
    if (!user) {
      toast.error('Vui lòng đăng nhập để thêm vào danh sách yêu thích');
      return;
    }

    try {
      if (isInWishlist) {
        await dispatch(removeFromWishlist(product._id)).unwrap();
        toast.success('Đã xóa khỏi danh sách yêu thích');
      } else {
        await dispatch(addToWishlist(product._id)).unwrap();
        toast.success('Đã thêm vào danh sách yêu thích');
      }
    } catch (error) {
      toast.error('Có lỗi xảy ra');
    }
  };

  const getImageUrl = () => {
    if (product.hinhAnh && product.hinhAnh.length > 0) {
      const firstImage = product.hinhAnh[0];
      return firstImage.url || firstImage;
    }
    return null;
  };

  const imageUrl = getImageUrl();

  return (
    <div 
      className="bg-white rounded-lg shadow-md overflow-hidden hover:shadow-lg transition-shadow duration-300 cursor-pointer"
      onClick={() => navigate(`/product/${product._id}`)}
    >
      <div className="relative h-48 bg-gray-200">
        {imageUrl ? (
          <img
            src={imageUrl}
            alt={product.tenSanPham}
            className="w-full h-full object-cover"
            onError={(e) => {
              e.target.style.display = 'none';
              e.target.parentElement.innerHTML = `
                <div class="w-full h-full flex items-center justify-center bg-gray-200">
                  <div class="text-gray-400 text-center">
                    <div class="text-4xl mb-2">?</div>
                    <p class="text-sm">No Image</p>
                  </div>
                </div>
              `;
            }}
          />
        ) : (
          <div className="w-full h-full flex items-center justify-center bg-gray-200">
            <div className="text-gray-400 text-center">
              <div className="text-4xl mb-2">?</div>
              <p className="text-sm">No Image</p>
            </div>
          </div>
        )}
        
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

        <button
          onClick={handleToggleWishlist}
          className="absolute top-2 right-2 p-2 bg-white rounded-full shadow-md hover:bg-gray-100 transition-colors"
        >
          <Heart
            className={`w-4 h-4 ${isInWishlist ? 'text-red-500 fill-current' : 'text-gray-600 hover:text-red-500'}`}
          />
        </button>
      </div>

      <div className="p-4">
        <h3 className="text-lg font-semibold text-gray-900 mb-2 line-clamp-2">
          {product.tenSanPham}
        </h3>

        <div className="flex items-center justify-between mb-4">
          <div>
            <p className="text-xl font-bold text-blue-600">
              {formatCurrency(product.gia)}
            </p>
            <p className="text-sm text-gray-600">
              Còn lại: {product.soLuongTon}
            </p>
          </div>
        </div>

        <div className="flex gap-2">
          <Button 
            variant="outline" 
            size="sm"
            onClick={(e) => {
              e.stopPropagation();
              navigate(`/product/${product._id}`);
            }}
          >
            Chi tiết
          </Button>
          <Button
            variant="primary"
            size="sm"
            disabled={product.soLuongTon === 0}
            onClick={(e) => onAddToCart(product, e)}
          >
            Thêm vào giỏ
          </Button>
        </div>
      </div>
    </div>
  );
};

const ProductGrid = ({ products, viewMode, onAddToCart }) => {
  if (products.length === 0) {
    return (
      <div className="text-center py-12">
        <div className="w-16 h-16 mx-auto bg-gray-100 rounded-full flex items-center justify-center mb-4">
          <svg className="w-8 h-8 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
          </svg>
        </div>
        <h3 className="text-lg font-medium text-gray-900 mb-2">Không tìm thấy sản phẩm</h3>
        <p className="text-gray-600">Thử thay đổi bộ lọc hoặc tìm kiếm</p>
      </div>
    );
  }

  return (
    <div className={viewMode === 'grid'
      ? "grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6"
      : "space-y-4"
    }>
      {products.map((product) => (
        <ProductCard key={product._id} product={product} onAddToCart={onAddToCart} />
      ))}
    </div>
  );
};

export default ProductGrid;
