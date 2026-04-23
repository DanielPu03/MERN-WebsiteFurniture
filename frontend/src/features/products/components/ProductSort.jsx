import React from 'react';

const ProductSort = ({ filters, onSortChange, productCount, selectedSort }) => {
  return (
    <select
      value={selectedSort}
      onChange={(e) => onSortChange(e.target.value)}
      className="border rounded-lg px-3 py-2 flex-1"
    >
      <option value="createdAt-desc">Mới nhất</option>
      <option value="createdAt-asc">Cũ nhất</option>
      <option value="gia-asc">Giá: Thấp Đến Cao</option>
      <option value="gia-desc">Giá: Cao Đến Thấp</option>
      <option value="tenSanPham-asc">Tên: A-Z</option>
      <option value="tenSanPham-desc">Tên: Z-A</option>
    </select>
  );
};

export default ProductSort;
