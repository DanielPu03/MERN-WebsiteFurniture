import React from 'react';
import { Package } from 'lucide-react';

const ProductGallery = ({ product, selectedImage, setSelectedImage }) => {
  const getImageUrl = (images, index) => {
    if (!images) return null;
    
    const image = Array.isArray(images) ? images[index] : images;
    
    if (image && typeof image === 'object' && image.url) {
      return image.url;
    } else if (typeof image === 'string' && image.trim().length > 0) {
      return image;
    }
    
    return null;
  };

  const images = Array.isArray(product.hinhAnh) ? product.hinhAnh : [product.hinhAnh].filter(Boolean);

  return (
    <div className="space-y-4">
      {/* Main Image */}
      <div className="aspect-square bg-gray-100 rounded-2xl overflow-hidden">
        {(() => {
          const imageUrl = getImageUrl(product.hinhAnh, selectedImage);
          
          return imageUrl ? (
            <img
              src={imageUrl}
              alt={product.tenSanPham}
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
      {images.length > 1 && (
        <div className="flex space-x-4">
          {images.map((image, index) => {
            const thumbnailUrl = getImageUrl(images, index);
            
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
                  alt={`${product.tenSanPham} ${index + 1}`}
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
          })}
        </div>
      )}
    </div>
  );
};

export default ProductGallery;
