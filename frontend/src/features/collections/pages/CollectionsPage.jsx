import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { Package, ChevronLeft, ChevronRight } from 'lucide-react';
import { useCollections } from '../hooks/useCollections';
import Loading from '../../../shared/components/Loading';

const CollectionsPage = () => {
  const { collections, isLoading, error, loadCollections } = useCollections();
  const [currentImageIndices, setCurrentImageIndices] = useState({});
  const [touchStart, setTouchStart] = useState(0);
  const [touchEnd, setTouchEnd] = useState(0);
  const [isDragging, setIsDragging] = useState(false);
  const [draggingCollectionId, setDraggingCollectionId] = useState(null);
  const [dragOccurred, setDragOccurred] = useState(false);

  React.useEffect(() => {
    loadCollections();
  }, []);

  const getImageUrls = (collection) => {
    if (!collection.hinhAnh) return [];

    if (Array.isArray(collection.hinhAnh) && collection.hinhAnh.length > 0) {
      return collection.hinhAnh.map(img => {
        if (typeof img === 'object' && img.url) return img.url;
        if (typeof img === 'string' && img.trim().length > 0) return img;
        return null;
      }).filter(Boolean);
    } else if (typeof collection.hinhAnh === 'string' && collection.hinhAnh.trim().length > 0) {
      return [collection.hinhAnh];
    } else if (typeof collection.hinhAnh === 'object' && collection.hinhAnh.url) {
      return [collection.hinhAnh.url];
    }

    return [];
  };

  const nextImage = (collectionId, imageCount) => {
    setCurrentImageIndices(prev => ({
      ...prev,
      [collectionId]: ((prev[collectionId] || 0) + 1) % imageCount
    }));
  };

  const prevImage = (collectionId, imageCount) => {
    setCurrentImageIndices(prev => ({
      ...prev,
      [collectionId]: ((prev[collectionId] || 0) - 1 + imageCount) % imageCount
    }));
  };

  // Touch handlers for mobile swipe
  const handleTouchStart = (e, collectionId) => {
    setTouchStart(e.targetTouches[0].clientX);
    setIsDragging(true);
    setDraggingCollectionId(collectionId);
  };

  const handleTouchMove = (e) => {
    setTouchEnd(e.targetTouches[0].clientX);
  };

  const handleTouchEnd = (imageCount, collectionId) => {
    if (!isDragging || draggingCollectionId !== collectionId) return;
    setIsDragging(false);
    setDraggingCollectionId(null);
    
    const swipeDistance = touchStart - touchEnd;
    const minSwipeDistance = 50;

    if (swipeDistance > minSwipeDistance) {
      nextImage(collectionId, imageCount);
      setDragOccurred(true);
    } else if (swipeDistance < -minSwipeDistance) {
      prevImage(collectionId, imageCount);
      setDragOccurred(true);
    }

    setTimeout(() => setDragOccurred(false), 100);
  };

  // Mouse handlers for desktop drag
  const handleMouseDown = (e, collectionId) => {
    setTouchStart(e.clientX);
    setIsDragging(true);
    setDraggingCollectionId(collectionId);
  };

  const handleMouseMove = (e) => {
    if (isDragging) {
      setTouchEnd(e.clientX);
    }
  };

  const handleMouseUp = (imageCount, collectionId) => {
    if (!isDragging || draggingCollectionId !== collectionId) return;
    setIsDragging(false);
    setDraggingCollectionId(null);
    
    const dragDistance = touchStart - touchEnd;
    const minDragDistance = 50;

    if (dragDistance > minDragDistance) {
      nextImage(collectionId, imageCount);
      setDragOccurred(true);
    } else if (dragDistance < -minDragDistance) {
      prevImage(collectionId, imageCount);
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

  if (isLoading) {
    return (
      <div className="flex justify-center items-center min-h-96">
        <Loading size="lg" text="Đang tải bộ sưu tập..." />
      </div>
    );
  }

  if (error) {
    return (
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="bg-red-50 border border-red-200 rounded-lg p-6 text-center">
          <Package className="w-16 h-16 mx-auto text-red-400 mb-4" />
          <h2 className="text-xl font-bold text-red-900 mb-2">Lỗi tải bộ sưu tập</h2>
          <p className="text-red-700">{error}</p>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      {/* Header */}
      <div className="text-center mb-12">
        <h1 className="text-4xl font-bold text-gray-900 mb-4">Bộ Sưu Tập</h1>
        <p className="text-lg text-gray-600">Khám phá những bộ sưu tập đặc biệt của chúng tôi</p>
      </div>

      {/* Collections Grid */}
      {collections && collections.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {collections.map((collection) => {
            const imageUrls = getImageUrls(collection);
            const currentIndex = currentImageIndices[collection._id] || 0;
            const hasImages = imageUrls.length > 0;

            return (
              <div key={collection._id} className="group relative bg-white rounded-2xl shadow-lg hover:shadow-2xl transition-all duration-500 overflow-hidden">
                {/* Collection Image Carousel */}
                <div className="aspect-video bg-gradient-to-br from-purple-100 to-pink-100 overflow-hidden relative">
                  {hasImages ? (
                    <>
                      <div
                        className="w-full h-full cursor-grab active:cursor-grabbing select-none"
                        onTouchStart={(e) => handleTouchStart(e, collection._id)}
                        onTouchMove={handleTouchMove}
                        onTouchEnd={() => handleTouchEnd(imageUrls.length, collection._id)}
                        onMouseDown={(e) => handleMouseDown(e, collection._id)}
                        onMouseMove={handleMouseMove}
                        onMouseUp={() => handleMouseUp(imageUrls.length, collection._id)}
                        onMouseLeave={() => setIsDragging(false)}
                        onDragStart={(e) => e.preventDefault()}
                      >
                        <img
                          src={imageUrls[currentIndex]}
                          alt={collection.tenBoSuuTap}
                          className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700 pointer-events-none"
                          draggable={false}
                        />
                      </div>
                      {/* Image Navigation */}
                      {imageUrls.length > 1 && (
                        <>
                          <button
                            onClick={(e) => {
                              e.preventDefault();
                              prevImage(collection._id, imageUrls.length);
                            }}
                            className="absolute left-2 top-1/2 -translate-y-1/2 p-3 bg-white/95 hover:bg-white rounded-full shadow-xl z-10 transition-all hover:scale-110"
                          >
                            <ChevronLeft className="w-6 h-6 text-gray-800" />
                          </button>
                          <button
                            onClick={(e) => {
                              e.preventDefault();
                              nextImage(collection._id, imageUrls.length);
                            }}
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
                                  idx === currentIndex ? 'bg-white' : 'bg-white/50'
                                }`}
                              />
                            ))}
                          </div>
                        </>
                      )}
                    </>
                  ) : (
                    <div className="w-full h-full flex items-center justify-center bg-gradient-to-br from-purple-100 to-pink-100">
                      <Package className="w-16 h-16 text-purple-400" />
                    </div>
                  )}
                </div>

                {/* Collection Info */}
                <Link to={`/collections/${collection._id}`} className="block">
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
                  <div className="absolute inset-0 bg-gradient-to-t from-purple-900/20 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none"></div>
                </Link>
              </div>
            );
          })}
        </div>
      ) : (
        <div className="text-center py-12">
          <Package className="w-16 h-16 mx-auto text-gray-400 mb-4" />
          <p className="text-gray-600">Chưa có bộ sưu tập nào</p>
        </div>
      )}
    </div>
  );
};

export default CollectionsPage;
