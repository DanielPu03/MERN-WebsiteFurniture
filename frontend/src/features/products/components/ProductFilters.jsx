import React from 'react';
import Input from '../../../shared/components/Input';

const ProductFilters = ({ showFilters, filters, handleFilterChange }) => {
  if (!showFilters) return null;

  return (
    <div className="bg-gray-50 p-4 rounded-lg mb-6">
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Input
          placeholder="Danh mục"
          value={filters.category}
          onChange={(e) => handleFilterChange('category', e.target.value)}
        />
        <Input
          placeholder="Thương hiệu"
          value={filters.brand}
          onChange={(e) => handleFilterChange('brand', e.target.value)}
        />
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
