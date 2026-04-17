import React from 'react';
import { Link } from 'react-router-dom';
import { Package } from 'lucide-react';

const Collections = ({ collections }) => {
  const getImageUrl = (collection) => {
    if (!collection.hinhAnh) return null;

    if (Array.isArray(collection.hinhAnh) && collection.hinhAnh.length > 0) {
      const firstImage = collection.hinhAnh[0];
      if (typeof firstImage === 'object' && firstImage.url) return firstImage.url;
      if (typeof firstImage === 'string' && firstImage.trim().length > 0) return firstImage;
    } else if (typeof collection.hinhAnh === 'string' && collection.hinhAnh.trim().length > 0) {
      return collection.hinhAnh;
    } else if (typeof collection.hinhAnh === 'object' && collection.hinhAnh.url) {
      return collection.hinhAnh.url;
    }

    return null;
  };

  return (
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
                    const imageUrl = getImageUrl(collection);

                    return imageUrl ? (
                      <img
                        src={imageUrl}
                        alt={collection.tenBoSuuTap}
                        className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700"
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
  );
};

export default Collections;
