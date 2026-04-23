import React from 'react';
import Input from '../../../shared/components/Input';

const ProductFilters = ({ showFilters, filters, handleFilterChange, categories = [] }) => {
  if (!showFilters) return null;

  return (
    <div className="bg-gray-50 p-4  rounded-lg mb-6">
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div>
          <select
            value={filters.category}
            onChange={(e) => handleFilterChange('category', e.target.value)}
            className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-purple-500 focus:border-transparent"
          >
            <option value="">Tất cả danh mục</option>
            {categories.map((category) => (
              <option key={category._id} value={category._id}>
                {category.tenDanhMuc}
              </option>
            ))}
          </select>
        </div>
        <Input
          placeholder="Giá từ thấp"
          type="number"
          value={filters.minPrice}
          onChange={(e) => handleFilterChange('minPrice', e.target.value)}
        />
        <Input
          placeholder="Giá đến cao"
          type="number"
          value={filters.maxPrice}
          onChange={(e) => handleFilterChange('maxPrice', e.target.value)}
        />
      </div>
    </div>
  );
};

export default ProductFilters;
