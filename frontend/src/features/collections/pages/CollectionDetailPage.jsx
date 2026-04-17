import React, { useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { ArrowLeft, Package, ChevronLeft, ChevronRight } from 'lucide-react';
import { useCollections } from '../hooks/useCollections';
import { useProduct } from '../../products/hooks/useProduct';
import Loading from '../../../shared/components/Loading';
import { formatCurrency } from '../../../shared/utils';
import Button from '../../../shared/components/Button';

const CollectionDetailPage = () => {
  const { id } = useParams();
  const { collections, isLoading: collectionsLoading, loadCollections } = useCollections();
  const { products, isLoading: productsLoading, getProducts, dispatch } = useProduct();
  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  const [touchStart, setTouchStart] = useState(0);
  const [touchEnd, setTouchEnd] = useState(0);
  const [isDragging, setIsDragging] = useState(false);
  const [imageCount, setImageCount] = useState(0);
  const [dragOccurred, setDragOccurred] = useState(false);

  React.useEffect(() => {
    loadCollections();
  }, []);

  React.useEffect(() => {
    if (id) {
      dispatch(getProducts({ collection: id, limit: 100 }));
    }
  }, [id]);

  // Add window mouseup event listener
  React.useEffect(() => {
    const handleWindowMouseUp = () => {
      if (isDragging) {
        const dragDistance = touchStart - touchEnd;
        const minDragDistance = 50;

        console.log('Window mouse up - Drag distance:', dragDistance, 'Min distance:', minDragDistance);

        if (dragDistance > minDragDistance) {
          console.log('Window mouse up - Dragging left - next image');
          nextImage(imageCount);
          setDragOccurred(true);
        } else if (dragDistance < -minDragDistance) {
          console.log('Window mouse up - Dragging right - prev image');
          prevImage(imageCount);
          setDragOccurred(true);
        }

        setIsDragging(false);
        
        // Reset dragOccurred after a short delay
        setTimeout(() => setDragOccurred(false), 100);
      }
    };

    window.addEventListener('mouseup', handleWindowMouseUp);
    return () => window.removeEventListener('mouseup', handleWindowMouseUp);
  }, [isDragging, touchStart, touchEnd, imageCount]);

  const collection = collections?.find(c => c._id === id);

  const getImageUrls = (item) => {
    if (!item.hinhAnh) return [];

    if (Array.isArray(item.hinhAnh) && item.hinhAnh.length > 0) {
      return item.hinhAnh.map(img => {
        if (typeof img === 'object' && img.url) return img.url;
        if (typeof img === 'string' && img.trim().length > 0) return img;
        return null;
      }).filter(Boolean);
    } else if (typeof item.hinhAnh === 'string' && item.hinhAnh.trim().length > 0) {
      return [item.hinhAnh];
    } else if (typeof item.hinhAnh === 'object' && item.hinhAnh.url) {
      return [item.hinhAnh.url];
    }

    return [];
  };

  const getImageUrl = (item) => {
    const imageUrls = getImageUrls(item);
    return imageUrls.length > 0 ? imageUrls[0] : null;
  };

  const nextImage = (imageCount) => {
    setCurrentImageIndex(prev => (prev + 1) % imageCount);
  };

  const prevImage = (imageCount) => {
    setCurrentImageIndex(prev => (prev - 1 + imageCount) % imageCount);
  };

  // Touch handlers for mobile swipe
  const handleTouchStart = (e) => {
    setTouchStart(e.targetTouches[0].clientX);
    setIsDragging(true);
  };

  const handleTouchMove = (e) => {
    setTouchEnd(e.targetTouches[0].clientX);
  };

  const handleTouchEnd = (imageCount) => {
    if (!isDragging) return;
    setIsDragging(false);
    
    const swipeDistance = touchStart - touchEnd;
    const minSwipeDistance = 50;

    if (swipeDistance > minSwipeDistance) {
      nextImage(imageCount);
      setDragOccurred(true);
    } else if (swipeDistance < -minSwipeDistance) {
      prevImage(imageCount);
      setDragOccurred(true);
    }

    setTimeout(() => setDragOccurred(false), 100);
  };

  // Mouse handlers for desktop drag
  const handleMouseDown = (e, count) => {
    setTouchStart(e.clientX);
    setIsDragging(true);
    setImageCount(count);
  };

  const handleMouseMove = (e) => {
    if (isDragging) {
      setTouchEnd(e.clientX);
    }
  };

  const handleMouseUp = (imageCount) => {
    if (!isDragging) return;
    setIsDragging(false);
    
    const dragDistance = touchStart - touchEnd;
    const minDragDistance = 50;

    if (dragDistance > minDragDistance) {
      nextImage(imageCount);
      setDragOccurred(true);
    } else if (dragDistance < -minDragDistance) {
      prevImage(imageCount);
      setDragOccurred(true);
    }

    setTimeout(() => setDragOccurred(false), 100);
  };

  const handleClick = (e) => {
    if (dragOccurred) {
      e.preventDefault();
      e.stopPropagation();
    }
  };

  if (collectionsLoading || productsLoading) {
    return (
      <div className="flex justify-center items-center min-h-96">
        <Loading size="lg" text="Đang tải..." />
      </div>
    );
  }

  if (!collection) {
    return (
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="bg-red-50 border border-red-200 rounded-lg p-6 text-center">
          <Package className="w-16 h-16 mx-auto text-red-400 mb-4" />
          <h2 className="text-xl font-bold text-red-900 mb-2">Không tìm thấy bộ sưu tập</h2>
          <Link to="/collections" className="text-purple-600 hover:text-purple-700">
            Quay lại danh sách bộ sưu tập
          </Link>
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
            <Link to="/" className="hover:text-purple-600">
              Trang chủ
            </Link>
          </li>
          <li>/</li>
          <li>
            <Link to="/collections" className="hover:text-purple-600">
              Bộ sưu tập
            </Link>
          </li>
          <li>/</li>
          <li className="text-gray-900 font-medium">{collection.tenBoSuuTap}</li>
        </ol>
      </nav>

      {/* Collection Header */}
      <div className="bg-gradient-to-r from-purple-600 to-pink-600 rounded-2xl shadow-lg overflow-hidden mb-12">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 p-8">
          <div className="aspect-video bg-white/20 rounded-xl overflow-hidden relative">
            {(() => {
              const imageUrls = getImageUrls(collection);
              const hasImages = imageUrls.length > 0;
              const shouldShowNav = imageUrls.length > 1;

              return hasImages ? (
                <>
                  <div
                    className="w-full h-full cursor-grab active:cursor-grabbing select-none"
                    onTouchStart={handleTouchStart}
                    onTouchMove={handleTouchMove}
                    onTouchEnd={() => handleTouchEnd(imageUrls.length)}
                    onMouseDown={(e) => handleMouseDown(e, imageUrls.length)}
                    onMouseMove={handleMouseMove}
                    onMouseUp={() => handleMouseUp(imageUrls.length)}
                    onMouseLeave={() => setIsDragging(false)}
                    onClick={handleClick}
                    onDragStart={(e) => e.preventDefault()}
                  >
                    <img
                      src={imageUrls[currentImageIndex]}
                      alt={collection.tenBoSuuTap}
                      className="w-full h-full object-cover pointer-events-none"
                      draggable={false}
                    />
                  </div>
                  {/* Image Navigation */}
                  {shouldShowNav ? (
                    <>
                      <button
                        onClick={() => prevImage(imageUrls.length)}
                        className="absolute left-2 top-1/2 -translate-y-1/2 p-3 bg-white/95 hover:bg-white rounded-full shadow-xl z-10 transition-all hover:scale-110"
                      >
                        <ChevronLeft className="w-6 h-6 text-gray-800" />
                      </button>
                      <button
                        onClick={() => nextImage(imageUrls.length)}
                        className="absolute right-2 top-1/2 -translate-y-1/2 p-3 bg-white/95 hover:bg-white rounded-full shadow-xl z-10 transition-all hover:scale-110"
                      >
                        <ChevronRight className="w-6 h-6 text-gray-800" />
                      </button>
                      {/* Image Indicator */}
                      <div className="absolute bottom-2 left-1/2 -translate-x-1/2 flex gap-1 z-10">
                        {imageUrls.map((_, idx) => (
                          <div
                            key={idx}
                            className={`w-2 h-2 rounded-full transition-colors ${
                              idx === currentImageIndex ? 'bg-white' : 'bg-white/50'
                            }`}
                          />
                        ))}
                      </div>
                    </>
                  ) : (
                    <div className="absolute top-2 right-2 bg-red-500 text-white px-2 py-1 rounded text-xs z-20">
                      Only 1 image
                    </div>
                  )}
                </>
              ) : (
                <div className="w-full h-full flex items-center justify-center">
                  <Package className="w-16 h-16 text-white/50" />
                </div>
              );
            })()}
          </div>
          <div className="flex flex-col justify-center text-white">
            <h1 className="text-4xl font-bold mb-4">{collection.tenBoSuuTap}</h1>
            <p className="text-lg text-white/90 mb-6">
              {collection.moTa || 'Bộ sưu tập sản phẩm chất lượng cao'}
            </p>
            <div className="flex items-center gap-4">
              <span className="bg-white/20 px-4 py-2 rounded-full">
                {collection.soLuongSanPham || 0} sản phẩm
              </span>
            </div>
          </div>
        </div>
      </div>

      {/* Products Grid */}
      <div>
        <h2 className="text-2xl font-bold text-gray-900 mb-6">Sản phẩm trong bộ sưu tập</h2>
        
        {products && products.length > 0 ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {products.map((product) => (
              <div 
                key={product._id}
                className="bg-white rounded-lg shadow-md overflow-hidden hover:shadow-lg transition-shadow duration-300 cursor-pointer"
              >
                <Link to={`/product/${product._id}`}>
                  <div className="h-48 bg-gray-200">
                    {(() => {
                      const imageUrl = getImageUrl(product);

                      return imageUrl ? (
                        <img
                          src={imageUrl}
                          alt={product.tenSanPham}
                          className="w-full h-full object-cover"
                        />
                      ) : (
                        <div className="w-full h-full flex items-center justify-center">
                          <Package className="w-12 h-12 text-gray-400" />
                        </div>
                      );
                    })()}
                  </div>
                  <div className="p-4">
                    <h3 className="font-semibold text-gray-900 mb-2 line-clamp-2">
                      {product.tenSanPham}
                    </h3>
                    <p className="text-blue-600 font-bold mb-2">
                      {formatCurrency(product.gia)}
                    </p>
                    <p className="text-sm text-gray-600">
                      Còn lại: {product.soLuongTon}
                    </p>
                  </div>
                </Link>
              </div>
            ))}
          </div>
        ) : (
          <div className="text-center py-12">
            <Package className="w-16 h-16 mx-auto text-gray-400 mb-4" />
            <p className="text-gray-600">Không có sản phẩm nào trong bộ sưu tập này</p>
          </div>
        )}
      </div>

      {/* Back Button */}
      <div className="mt-8">
        <Link to="/collections">
          <Button variant="outline">
            <ArrowLeft className="w-4 h-4 mr-2" />
            Quay lại danh sách bộ sưu tập
          </Button>
        </Link>
      </div>
    </div>
  );
};

export default CollectionDetailPage;
