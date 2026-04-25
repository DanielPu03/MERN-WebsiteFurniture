import React from 'react';
import { Upload, X, Image as ImageIcon } from 'lucide-react';

const ProductForm = ({ formData, setFormData, categories, brands, collections, isEdit }) => {
  const handleImageUpload = (e) => {
    const files = Array.from(e.target.files);
    const newImages = files.map(file => ({
      file,
      url: URL.createObjectURL(file),
      laAnhChinh: formData.hinhAnh.length === 0
    }));
    setFormData(prev => ({
      ...prev,
      hinhAnh: [...prev.hinhAnh, ...newImages]
    }));
  };

  const removeImage = (index) => {
    setFormData(prev => ({
      ...prev,
      hinhAnh: prev.hinhAnh.filter((_, i) => i !== index)
    }));
  };

  const setMainImage = (index) => {
    setFormData(prev => ({
      ...prev,
      hinhAnh: prev.hinhAnh.map((img, i) => ({
        ...img,
        laAnhChinh: i === index
      }))
    }));
  };

  return (
    <div className="space-y-4">
      {/* Product Name */}
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">
          Tên sản phẩm <span className="text-red-500">*</span>
        </label>
        <input
          type="text"
          value={formData.tenSanPham}
          onChange={(e) => setFormData({ ...formData, tenSanPham: e.target.value })}
          className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
          required
        />
      </div>

      {/* Price */}
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">
          Giá <span className="text-red-500">*</span>
        </label>
        <input
          type="number"
          value={formData.gia}
          onChange={(e) => setFormData({ ...formData, gia: e.target.value })}
          className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
          required
          min="0"
        />
      </div>

      {/* Stock */}
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">
          Số lượng tồn <span className="text-red-500">*</span>
        </label>
        <input
          type="number"
          value={formData.soLuongTon}
          onChange={(e) => setFormData({ ...formData, soLuongTon: e.target.value })}
          className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
          required
          min="0"
        />
      </div>

      {/* Category */}
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">
          Danh mục <span className="text-red-500">*</span>
        </label>
        <select
          value={formData.danhMucId}
          onChange={(e) => setFormData({ ...formData, danhMucId: e.target.value })}
          className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
          required
        >
          <option value="">Chọn danh mục</option>
          {categories.map((cat) => (
            <option key={cat._id} value={cat._id}>
              {cat.tenDanhMuc}
            </option>
          ))}
        </select>
      </div>

      {/* Brand */}
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">
          Thương hiệu
        </label>
        <select
          value={formData.thuongHieuId}
          onChange={(e) => setFormData({ ...formData, thuongHieuId: e.target.value })}
          className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
        >
          <option value="">Chọn thương hiệu</option>
          {brands.map((brand) => (
            <option key={brand._id} value={brand._id}>
              {brand.tenThuongHieu}
            </option>
          ))}
        </select>
      </div>

      {/* Collections */}
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">
          Bộ sưu tập
        </label>
        <div className="space-y-2">
          {collections.map((collection) => (
            <label key={collection._id} className="flex items-center">
              <input
                type="checkbox"
                checked={formData.boSuuTapIds?.includes(collection._id)}
                onChange={(e) => {
                  if (e.target.checked) {
                    setFormData({
                      ...formData,
                      boSuuTapIds: [...(formData.boSuuTapIds || []), collection._id]
                    });
                  } else {
                    setFormData({
                      ...formData,
                      boSuuTapIds: formData.boSuuTapIds?.filter(id => id !== collection._id) || []
                    });
                  }
                }}
                className="mr-2"
              />
              <span className="text-sm text-gray-700">{collection.tenBoSuuTap}</span>
            </label>
          ))}
        </div>
      </div>

      {/* Description */}
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">
          Mô tả
        </label>
        <textarea
          value={formData.moTa}
          onChange={(e) => setFormData({ ...formData, moTa: e.target.value })}
          className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
          rows="3"
        />
      </div>

      {/* Status */}
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">
          Trạng thái
        </label>
        <select
          value={formData.trangThai ? 'true' : 'false'}
          onChange={(e) => setFormData({ ...formData, trangThai: e.target.value === 'true' })}
          className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
        >
          <option value="true">Đang bán</option>
          <option value="false">Ngừng bán</option>
        </select>
      </div>

      {/* Featured */}
      <div>
        <label className="flex items-center">
          <input
            type="checkbox"
            checked={formData.noiBat}
            onChange={(e) => setFormData({ ...formData, noiBat: e.target.checked })}
            className="mr-2"
          />
          <span className="text-sm font-medium text-gray-700">Sản phẩm nổi bật</span>
        </label>
      </div>

      {/* Images */}
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">
          Hình ảnh
        </label>
        <div className="mt-1 flex justify-center px-6 pt-5 pb-6 border-2 border-gray-300 border-dashed rounded-md">
          <div className="space-y-1 text-center">
            <Upload className="mx-auto h-12 w-12 text-gray-400" />
            <div className="flex text-sm text-gray-600">
              <label htmlFor="file-upload" className="relative cursor-pointer bg-white rounded-md font-medium text-blue-600 hover:text-blue-500 focus-within:outline-none">
                <span>Tải ảnh lên</span>
                <input
                  id="file-upload"
                  type="file"
                  multiple
                  accept="image/*"
                  className="sr-only"
                  onChange={handleImageUpload}
                />
              </label>
              <p className="pl-1">hoặc kéo và thả</p>
            </div>
            <p className="text-xs text-gray-500">PNG, JPG, GIF tối đa 10MB</p>
          </div>
        </div>

        {/* Image Preview */}
        {formData.hinhAnh.length > 0 && (
          <div className="mt-4 grid grid-cols-4 gap-4">
            {formData.hinhAnh.map((img, index) => (
              <div key={index} className="relative group">
                <div className="aspect-w-1 aspect-h-1 w-full overflow-hidden rounded-lg bg-gray-200">
                  {img.file ? (
                    <img
                      src={img.url}
                      alt={`Preview ${index}`}
                      className="w-full h-full object-cover"
                    />
                  ) : (
                    <img
                      src={img.url || img}
                      alt={`Product ${index}`}
                      className="w-full h-full object-cover"
                    />
                  )}
                </div>
                {img.laAnhChinh && (
                  <div className="absolute top-2 left-2 bg-blue-500 text-white text-xs px-2 py-1 rounded">
                    Chính
                  </div>
                )}
                <div className="absolute top-2 right-2 opacity-0 group-hover:opacity-100 transition-opacity flex space-x-1">
                  <button
                    onClick={() => setMainImage(index)}
                    className="p-1 bg-white rounded shadow hover:bg-gray-100"
                    title="Đặt làm ảnh chính"
                  >
                    <ImageIcon className="h-4 w-4 text-blue-600" />
                  </button>
                  <button
                    onClick={() => removeImage(index)}
                    className="p-1 bg-white rounded shadow hover:bg-gray-100"
                    title="Xóa"
                  >
                    <X className="h-4 w-4 text-red-600" />
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default ProductForm;
