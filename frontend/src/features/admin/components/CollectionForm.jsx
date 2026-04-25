import React from 'react';
import { Upload, X, Image as ImageIcon } from 'lucide-react';

const CollectionForm = ({ formData, setFormData }) => {
  const handleImageUpload = (e) => {
    const files = Array.from(e.target.files);
    
    if (formData.hinhAnh.length + files.length > 10) {
      alert('Chỉ được tải tối đa 10 ảnh!');
      return;
    }

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

  const handleAddImageUrl = () => {
    if (!formData.imageUrl) {
      alert('Vui lòng nhập URL hình ảnh!');
      return;
    }

    if (formData.hinhAnh.length >= 10) {
      alert('Chỉ được tải tối đa 10 ảnh!');
      return;
    }

    const newImage = {
      url: formData.imageUrl,
      laAnhChinh: formData.hinhAnh.length === 0
    };

    setFormData(prev => ({
      ...prev,
      hinhAnh: [...prev.hinhAnh, newImage],
      imageUrl: ''
    }));
  };

  const removeImage = (index) => {
    const newImages = formData.hinhAnh.filter((_, i) => i !== index);
    
    if (newImages.length > 0 && formData.hinhAnh[index]?.laAnhChinh) {
      newImages[0].laAnhChinh = true;
    }

    setFormData(prev => ({
      ...prev,
      hinhAnh: newImages
    }));
  };

  const setMainImage = (index) => {
    const newImages = formData.hinhAnh.map((img, i) => ({
      ...img,
      laAnhChinh: i === index
    }));

    setFormData(prev => ({
      ...prev,
      hinhAnh: newImages
    }));
  };

  return (
    <div className="space-y-4">
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">
          Tên Bộ Sưu Tập <span className="text-red-500">*</span>
        </label>
        <input
          type="text"
          value={formData.tenBoSuuTap}
          onChange={(e) => setFormData({ ...formData, tenBoSuuTap: e.target.value })}
          className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
          required
        />
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">
          Mô Tả
        </label>
        <textarea
          value={formData.moTa}
          onChange={(e) => setFormData({ ...formData, moTa: e.target.value })}
          className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
          rows={3}
        />
      </div>

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
                      alt={`Collection ${index}`}
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
                    className="p-1 bg-red-500 text-white rounded hover:bg-red-600"
                    title="Xóa"
                  >
                    <X className="h-4 w-4" />
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">
          Hoặc thêm URL hình ảnh
        </label>
        <div className="flex gap-2">
          <input
            type="text"
            value={formData.imageUrl}
            onChange={(e) => setFormData({ ...formData, imageUrl: e.target.value })}
            className="flex-1 px-3 py-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
            placeholder="https://example.com/image.jpg"
          />
          <button
            onClick={handleAddImageUrl}
            className="px-4 py-2 bg-gray-600 text-white rounded-md hover:bg-gray-700"
          >
            Thêm
          </button>
        </div>
      </div>
    </div>
  );
};

export default CollectionForm;
