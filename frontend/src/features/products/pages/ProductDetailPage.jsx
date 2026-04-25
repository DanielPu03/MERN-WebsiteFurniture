import React from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { ShoppingCart, Heart, Package, ArrowLeft, Share2 } from 'lucide-react';
import { useProduct } from '../hooks/useProduct';
import { useCart } from '../../../shared/hooks/useRedux';
import Loading from '../../../shared/components/Loading';
import Button from '../../../shared/components/Button';
import toast from 'react-hot-toast';
import ProductGallery from '../components/ProductGallery';
import ProductInfo from '../components/ProductInfo';
import QuantitySelector from '../components/QuantitySelector';
import ProductFeatures from '../components/ProductFeatures';
import RelatedProducts from '../components/RelatedProducts';
import { useDispatch, useSelector } from 'react-redux';
import { addToWishlist, removeFromWishlist, getWishlist } from '../../wishlist/store/wishlistSlice';
import { useAuth } from '../../../shared/hooks/useRedux';

const ProductDetailPage = () => {
    const { id } = useParams();
  const navigate = useNavigate();
  const { currentProduct, isLoading, error, getProductById, getRelatedProducts, relatedProducts, dispatch } = useProduct();
  const { addToCart } = useCart();
  const { user } = useAuth();
  const wishlistDispatch = useDispatch();
  const wishlistProductIds = useSelector(state => state.wishlist.wishlistProductIds || []);
  const [quantity, setQuantity] = React.useState(1);
  const [selectedImage, setSelectedImage] = React.useState(0);
  
  const isInWishlist = currentProduct && wishlistProductIds.includes(currentProduct._id);

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

  React.useEffect(() => {
    if (user) {
      wishlistDispatch(getWishlist());
    }
  }, [user]);

  const handleAddToCart = async () => {
    if (!currentProduct || !currentProduct._id) {
      toast.error('Không tìm thấy sản phẩm!');
      return;
    }

    if (!currentProduct.trangThai) {
      toast.error('Sản phẩm đã ngừng kinh doanh!');
      return;
    }

    if (currentProduct.soLuongTon === 0) {
      toast.error('Sản phẩm đã hết hàng!');
      return;
    }

    if (quantity < 1 || quantity > currentProduct.soLuongTon) {
      toast.error('Số lượng không hợp lệ!');
      return;
    }

    try {
      await addToCart(currentProduct._id, quantity);
      toast.success('Đã thêm sản phẩm vào giỏ hàng!');
    } catch (error) {
      toast.error('Không thể thêm sản phẩm vào giỏ hàng!');
    }
  };

  const handleQuantityChange = (change) => {
    const newQuantity = quantity + change;

    if (newQuantity >= 1 && newQuantity <= (currentProduct?.soLuongTon || 1)) {
      setQuantity(newQuantity);
    }
  };

  const handleToggleWishlist = async () => {
    if (!user) {
      toast.error('Vui lòng đăng nhập để thêm vào danh sách yêu thích!');
      navigate('/login');
      return;
    }

    if (!currentProduct || !currentProduct._id) {
      toast.error('Không tìm thấy sản phẩm!');
      return;
    }

    try {
      if (isInWishlist) {
        await wishlistDispatch(removeFromWishlist(currentProduct._id)).unwrap();
        toast.success('Đã xóa khỏi danh sách yêu thích!');
      } else {
        await wishlistDispatch(addToWishlist(currentProduct._id)).unwrap();
        toast.success('Đã thêm vào danh sách yêu thích!');
      }
    } catch (error) {
      toast.error('Không thể cập nhật danh sách yêu thích!');
    }
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
        {/* Product Gallery */}
        <ProductGallery product={currentProduct} selectedImage={selectedImage} setSelectedImage={setSelectedImage} />

        {/* Product Info */}
        <div className="space-y-6">
          <ProductInfo product={currentProduct} />

          {/* Status Warning */}
          {!currentProduct.trangThai && (
            <div className="bg-red-50 border border-red-200 rounded-lg p-4">
              <p className="text-red-800 font-medium">⚠️ Sản phẩm đã ngừng kinh doanh</p>
              <p className="text-red-600 text-sm mt-1">Sản phẩm này hiện không khả dụng để mua.</p>
            </div>
          )}

          {/* Quantity and Add to Cart */}
          <div className="space-y-4">
            <QuantitySelector
              quantity={quantity}
              onQuantityChange={handleQuantityChange}
              maxQuantity={currentProduct?.soLuongTon || 1}
            />

            <div className="flex space-x-4">
              <Button
                onClick={handleAddToCart}
                disabled={!currentProduct.trangThai || currentProduct.soLuongTon === 0}
                className="flex-1 bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700"
              >
                <ShoppingCart className="h-5 w-5 mr-2" />
                {!currentProduct.trangThai ? 'Ngừng bán' : currentProduct.soLuongTon === 0 ? 'Hết hàng' : 'Thêm vào giỏ hàng'}
              </Button>
              <Button
                variant="outline"
                className="p-3"
                onClick={handleToggleWishlist}
              >
                <Heart className={`h-5 w-5 ${isInWishlist ? 'fill-red-500 text-red-500' : ''}`} />
              </Button>
              <Button variant="outline" className="p-3">
                <Share2 className="h-5 w-5" />
              </Button>
            </div>
          </div>

          {/* Product Features */}
          <ProductFeatures />
        </div>
      </div>

      {/* Related Products */}
      {currentProduct && (
        <RelatedProducts relatedProducts={relatedProducts} />
      )}
    </div>
  );
};

export default ProductDetailPage;
