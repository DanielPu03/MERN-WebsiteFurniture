import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Package } from 'lucide-react';
import { formatCurrency } from '../../../shared/utils';

const RelatedProducts = ({ relatedProducts }) => {
  const navigate = useNavigate();

  const getImageUrl = (product) => {
    if (!product.hinhAnh) return null;
    
    if (Array.isArray(product.hinhAnh) && product.hinhAnh.length > 0) {
      const firstImage = product.hinhAnh[0];
      if (firstImage && typeof firstImage === 'object' && firstImage.url) {
        return firstImage.url;
      } else if (typeof firstImage === 'string' && firstImage.trim().length > 0) {
        return firstImage;
      }
    } else if (typeof product.hinhAnh === 'string' && product.hinhAnh.trim().length > 0) {
      return product.hinhAnh;
    }
    
    return null;
  };

  return (
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
                  const imageUrl = getImageUrl(relatedProduct);
                  
                  return imageUrl ? (
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
  );
};

export default RelatedProducts;
