import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { ChevronLeft, ChevronRight } from 'lucide-react';

const CategoryCarousel = ({ categories }) => {
  const [currentCategoryIndex, setCurrentCategoryIndex] = useState(0);
  const categoriesPerPage = 4;

  const getDisplayCategories = () => {
    if (!categories || categories.length === 0) return [];
    const duplicated = [...categories, ...categories, ...categories, ...categories];
    return duplicated;
  };

  const displayCategories = getDisplayCategories().slice(
    currentCategoryIndex,
    currentCategoryIndex + categoriesPerPage
  );

  const handlePrevCategories = () => {
    setCurrentCategoryIndex((prev) => {
      if (prev === 0) {
        return getDisplayCategories().length - categoriesPerPage;
      }
      return prev - 1;
    });
  };

  const handleNextCategories = () => {
    setCurrentCategoryIndex((prev) => {
      const maxIndex = getDisplayCategories().length - categoriesPerPage;
      return prev >= maxIndex ? 0 : prev + 1;
    });
  };

  if (!categories || categories.length === 0) {
    return (
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="text-center py-12">
          <p className="text-gray-600">Chưa có danh mục nào</p>
        </div>
      </section>
    );
  }

  return (
    <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
      <div className="text-center mb-12">
        <h2 className="text-3xl font-bold text-gray-900 mb-4">Danh Mục Sản Phẩm</h2>
        <p className="text-lg text-gray-600">Khám phá các danh mục sản phẩm của chúng tôi</p>
      </div>

      <div className="flex items-center justify-center gap-4">
        {/* Navigation Button - Left */}
        <button
          onClick={handlePrevCategories}
          className={`w-12 h-12 bg-white rounded-full shadow-lg flex items-center justify-center hover:bg-gray-100 transition-colors shrink-0 ${
            currentCategoryIndex === 0 ? 'opacity-50 cursor-not-allowed' : ''
          }`}
        >
          <ChevronLeft className="w-6 h-6 text-gray-700" />
        </button>

        {/* Carousel Container */}
        <div className="flex-1 overflow-hidden">
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
            {displayCategories.map((category, index) => (
              <Link
                key={`${category._id}-${index}`}
                to={`/products?category=${encodeURIComponent(category.tenDanhMuc)}`}
                className="group relative bg-white rounded-2xl shadow-lg hover:shadow-2xl transition-all duration-500 overflow-hidden cursor-pointer"
              >
                <div className="aspect-square bg-gradient-to-br from-purple-100 to-pink-100 overflow-hidden">
                  {category.hinhAnh ? (
                    <img
                      src={category.hinhAnh}
                      alt={category.tenDanhMuc}
                      className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700"
                    />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center bg-gradient-to-br from-purple-100 to-pink-100">
                    </div>
                  )}
                </div>

                <div className="p-4">
                  <h3 className="text-lg font-bold text-gray-800 text-center group-hover:text-purple-600 transition-colors">
                    {category.tenDanhMuc}
                  </h3>
                </div>
              </Link>
            ))}
          </div>
        </div>

        {/* Navigation Button - Right */}
        <button
          onClick={handleNextCategories}
          className="w-12 h-12 bg-white rounded-full shadow-lg flex items-center justify-center hover:bg-gray-100 transition-colors shrink-0"
        >
          <ChevronRight className="w-6 h-6 text-gray-700" />
        </button>
      </div>
    </section>
  );
};

export default CategoryCarousel;
