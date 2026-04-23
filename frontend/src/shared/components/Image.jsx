import React from 'react';
import { Package } from 'lucide-react';

const Image = ({ src, alt, className = '', fallback = null, ...props }) => {
  const getImageUrl = (image) => {
    if (!image) return null;

    const images = [];
    if (Array.isArray(image)) {
      image.forEach(img => {
        if (typeof img === 'object' && img.url) {
          images.push(img.url);
        } else if (typeof img === 'string' && img.trim().length > 0) {
          images.push(img);
        }
      });
    } else if (typeof image === 'string' && image.trim().length > 0) {
      images.push(image);
    } else if (typeof image === 'object' && image.url) {
      images.push(image.url);
    }

    return images.length > 0 ? images[0] : null;
  };

  const imageUrl = getImageUrl(src);

  if (!imageUrl) {
    return fallback || (
      <div className={`flex items-center justify-center bg-gray-100 ${className}`} {...props}>
        <Package className="w-8 h-8 text-gray-400" />
      </div>
    );
  }

  return (
    <img
      src={imageUrl}
      alt={alt}
      className={className}
      {...props}
    />
  );
};

export default Image;
