import React, { useEffect } from 'react';
import { Heart, Trash2, ShoppingBag } from 'lucide-react';
import { useAppDispatch, useAppSelector } from '../../../shared/hooks/useRedux';
import { getWishlist, removeFromWishlist } from '../store/wishlistSlice';
import { useCart } from '../../../shared/hooks/useRedux';
import { formatCurrency } from '../../../shared/utils';
import Button from '../../../shared/components/Button';
import Loading from '../../../shared/components/Loading';
import toast from 'react-hot-toast';

const WishlistPage = () => {
  const dispatch = useAppDispatch();
  const { wishlist, isLoading } = useAppSelector((state) => state.wishlist);
  const { addToCart } = useCart();

  useEffect(() => {
    dispatch(getWishlist());
  }, [dispatch]);

  const handleRemoveFromWishlist = async (sanPhamId) => {
    try {
      await dispatch(removeFromWishlist(sanPhamId)).unwrap();
      toast.success('Đã xóa khỏi danh sách yêu thích');
    } catch (error) {
      toast.error('Có lỗi xảy ra');
    }
  };

  const handleAddToCart = (product) => {
    if (!product.trangThai) {
      toast.error('Sản phẩm đã ngừng kinh doanh!');
      return;
    }
    addToCart(product._id, 1);
    toast.success('Đã thêm vào giỏ hàng');
  };

  if (isLoading) {
    return (
      <div className="flex justify-center items-center min-h-96">
        <Loading size="lg" text="Đang tải..." />
      </div>
    );
  }

  const wishlistItems = wishlist?.danhSachSanPham || [];

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900 mb-2">Danh sách yêu thích</h1>
        <p className="text-gray-600">
          {wishlistItems.length} sản phẩm
        </p>
      </div>

      {wishlistItems.length === 0 ? (
        <div className="text-center py-16">
          <Heart className="w-24 h-24 mx-auto text-gray-300 mb-4" />
          <h2 className="text-xl font-semibold text-gray-900 mb-2">
            Chưa có sản phẩm yêu thích
          </h2>
          <p className="text-gray-600 mb-6">
            Thêm sản phẩm vào danh sách yêu thích để xem sau
          </p>
          <Button
            onClick={() => window.location.href = '/products'}
            icon={<ShoppingBag className="w-4 h-4" />}
          >
            Xem sản phẩm
          </Button>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {wishlistItems.map((item) => {
            const product = item.sanPhamId;
            if (!product) return null; // Skip if product is null
            return (
              <div
                key={item._id}
                className="bg-white rounded-lg shadow-md overflow-hidden hover:shadow-lg transition-shadow"
              >
                <div className="relative h-48 bg-gray-200">
                  {product.hinhAnh && product.hinhAnh.length > 0 ? (
                    <img
                      src={product.hinhAnh[0].url || product.hinhAnh[0]}
                      alt={product.tenSanPham}
                      className="w-full h-full object-cover"
                    />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center bg-gray-200">
                      <div className="text-gray-400 text-center">
                        <div className="text-4xl mb-2">?</div>
                        <p className="text-sm">No Image</p>
                      </div>
                    </div>
                  )}

                  <button
                    onClick={() => handleRemoveFromWishlist(product._id)}
                    className="absolute top-2 right-2 p-2 bg-white rounded-full shadow-md hover:bg-red-50 transition-colors"
                    title="Xóa khỏi danh sách yêu thích"
                  >
                    <Trash2 className="w-4 h-4 text-gray-600 hover:text-red-500" />
                  </button>
                </div>

                <div className="p-4">
                  <div className="flex items-start justify-between mb-2">
                    <h3 className="text-lg font-semibold text-gray-900 line-clamp-2 flex-1">
                      {product.tenSanPham}
                    </h3>
                    {!product.trangThai && (
                      <span className="ml-2 px-2 py-1 text-xs font-medium bg-red-100 text-red-800 rounded-full whitespace-nowrap">
                        Ngừng bán
                      </span>
                    )}
                  </div>

                  <div className="flex items-center justify-between mb-4">
                    <p className="text-xl font-bold text-blue-600">
                      {formatCurrency(product.gia)}
                    </p>
                    <p className="text-sm text-gray-600">
                      Còn: {product.soLuongTon}
                    </p>
                  </div>

                  <Button
                    variant="primary"
                    size="sm"
                    className="w-full"
                    disabled={!product.trangThai || product.soLuongTon === 0}
                    onClick={() => handleAddToCart(product)}
                  >
                    {!product.trangThai ? 'Ngừng bán' : product.soLuongTon === 0 ? 'Hết hàng' : 'Thêm vào giỏ'}
                  </Button>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
};

export default WishlistPage;
