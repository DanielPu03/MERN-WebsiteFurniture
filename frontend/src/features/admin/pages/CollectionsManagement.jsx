import React, { useState, useEffect } from 'react';
import { Search, Plus, Edit2, Trash2, Package, Upload, X, Star } from 'lucide-react';
import toast from 'react-hot-toast';

const CollectionsManagement = () => {
  const [collections, setCollections] = useState([]);
  const [loading, setLoading] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [showAddModal, setShowAddModal] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);
  const [selectedCollection, setSelectedCollection] = useState(null);
  const [formData, setFormData] = useState({
    tenBoSuuTap: '',
    moTa: '',
    hinhAnh: [],
    imageUrl: ''
  });

  // Load collections
  useEffect(() => {
    loadCollections();
  }, [searchTerm]);

  const loadCollections = async () => {
    try {
      setLoading(true);
      const response = await fetch('http://localhost:5000/api/collections', {
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('token')}`
        }
      });
      const data = await response.json();
      if (data.success) {
        const collectionsList = data.data.collections || data.data || [];
        const filteredCollections = searchTerm 
          ? collectionsList.filter(col => 
              col.tenBoSuuTap.toLowerCase().includes(searchTerm.toLowerCase())
            )
          : collectionsList;
        setCollections(filteredCollections);
      }
    } catch (error) {
      toast.error('Lỗi khi tải bộ sưu tập!');
    } finally {
      setLoading(false);
    }
  };

  const handleAddCollection = async () => {
    try {
      // Separate file images and URL images
      const fileImages = formData.hinhAnh.filter(img => img.type === 'file');
      const urlImages = formData.hinhAnh.filter(img => img.type === 'url');
      
      const collectionData = {
        ...formData,
        hinhAnh: urlImages.map(img => ({ url: img.url, laAnhChinh: img.laAnhChinh }))
      };

      const response = await fetch('http://localhost:5000/api/collections', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${localStorage.getItem('token')}`
        },
        body: JSON.stringify(collectionData)
      });

      const data = await response.json();
      if (data.success) {
        toast.success('Thêm bộ sưu tập thành công!');
        setShowAddModal(false);
        resetForm();
        loadCollections();
        
        // Upload file images if any
        if (fileImages.length > 0) {
          const collectionId = data.data.collection?._id || data.data._id;
          if (collectionId) {
            await uploadCollectionImages(collectionId, fileImages);
          }
        }
      } else {
        toast.error(data.message || 'Thêm bộ sưu tập thất bại!');
      }
    } catch (error) {
      toast.error('Lỗi khi thêm bộ sưu tập!');
    }
  };

  const handleUpdateCollection = async () => {
    try {
      // Separate file images and URL images
      const fileImages = formData.hinhAnh.filter(img => img.type === 'file');
      const urlImages = formData.hinhAnh.filter(img => img.type === 'url');

      // Preserve existing images from the collection
      const existingImages = selectedCollection.hinhAnh || [];

      // Combine existing images with new URL images
      const allImages = [
        ...existingImages,
        ...urlImages.map(img => ({ url: img.url, laAnhChinh: img.laAnhChinh }))
      ];

      const collectionData = {
        ...formData,
        hinhAnh: allImages
      };

      const response = await fetch(`http://localhost:5000/api/collections/${selectedCollection._id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${localStorage.getItem('token')}`
        },
        body: JSON.stringify(collectionData)
      });

      const data = await response.json();
      if (data.success) {
        toast.success('Cập nhật bộ sưu tập thành công!');
        setShowEditModal(false);
        resetForm();
        loadCollections();

        // Upload file images if any
        if (fileImages.length > 0) {
          await uploadCollectionImages(selectedCollection._id, fileImages);
        }
      } else {
        toast.error(data.message || 'Cập nhật bộ sưu tập thất bại!');
      }
    } catch (error) {
      toast.error('Lỗi khi cập nhật bộ sưu tập!');
    }
  };

  const handleDeleteCollection = async (collectionId) => {
    if (!window.confirm('Bạn có chắc chắn muốn xóa bộ sưu tập này?')) return;

    try {
      const response = await fetch(`http://localhost:5000/api/collections/${collectionId}`, {
        method: 'DELETE',
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('token')}`
        }
      });

      const data = await response.json();
      if (data.success) {
        toast.success('Xóa bộ sưu tập thành công!');
        loadCollections();
      } else {
        toast.error(data.message || 'Xóa bộ sưu tập thất bại!');
      }
    } catch (error) {
      toast.error('Lỗi khi xóa bộ sưu tập!');
    }
  };

  const handleEditClick = (collection) => {
    setSelectedCollection(collection);
    setFormData({
      tenBoSuuTap: collection.tenBoSuuTap,
      moTa: collection.moTa || '',
      hinhAnh: collection.hinhAnh || [],
      imageUrl: ''
    });
    setShowEditModal(true);
  };

  const handleImageUpload = (e) => {
    const files = Array.from(e.target.files);
    
    if (formData.hinhAnh.length + files.length > 10) {
      toast.error('Chỉ được tải tối đa 10 ảnh!');
      return;
    }

    const newImages = files.map(file => ({
      file,
      url: URL.createObjectURL(file),
      laAnhChinh: formData.hinhAnh.length === 0,
      type: 'file'
    }));

    setFormData(prev => ({
      ...prev,
      hinhAnh: [...prev.hinhAnh, ...newImages]
    }));
  };

  const handleAddImageUrl = () => {
    if (!formData.imageUrl) {
      toast.error('Vui lòng nhập URL hình ảnh!');
      return;
    }

    if (formData.hinhAnh.length >= 10) {
      toast.error('Chỉ được tải tối đa 10 ảnh!');
      return;
    }

    const newImage = {
      url: formData.imageUrl,
      laAnhChinh: formData.hinhAnh.length === 0,
      type: 'url'
    };

    setFormData(prev => ({
      ...prev,
      hinhAnh: [...prev.hinhAnh, newImage],
      imageUrl: ''
    }));

    toast.success('Đã thêm hình ảnh từ URL!');
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

  const uploadCollectionImages = async (collectionId, fileImages = null) => {
    const imageFormData = new FormData();
    
    // Use provided fileImages or filter from formData
    const actualFiles = fileImages || formData.hinhAnh.filter(img => img.type === 'file').map(img => img.file);
    actualFiles.forEach(file => {
      imageFormData.append('images', file);
    });

    try {
      const response = await fetch(`http://localhost:5000/api/collections/${collectionId}/images`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('token')}`
        },
        body: imageFormData
      });

      const data = await response.json();
      if (data.success) {
        toast.success('Upload hình ảnh thành công!');
      } else {
        toast.error(data.message || 'Upload hình ảnh thất bại!');
      }
    } catch (error) {
      toast.error('Lỗi khi upload hình ảnh!');
    }
  };

  const resetForm = () => {
    setFormData({
      tenBoSuuTap: '',
      moTa: '',
      hinhAnh: [],
      imageUrl: ''
    });
    setSelectedCollection(null);
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Quản lý Bộ Sưu Tập</h1>
          <p className="text-gray-600">Quản lý các bộ sưu tập sản phẩm</p>
        </div>
        <button
          onClick={() => {
            resetForm();
            setShowAddModal(true);
          }}
          className="flex items-center px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
        >
          <Plus className="w-5 h-5 mr-2" />
          Thêm Bộ Sưu Tập
        </button>
      </div>

      {/* Search */}
      <div className="relative">
        <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
        <input
          type="text"
          placeholder="Tìm kiếm bộ sưu tập..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
        />
      </div>

      {/* Collections Table */}
      {loading ? (
        <div className="text-center py-12">
          <div className="inline-block animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
          <p className="mt-2 text-gray-600">Đang tải...</p>
        </div>
      ) : collections.length === 0 ? (
        <div className="text-center py-12 bg-white rounded-lg shadow">
          <Package className="w-16 h-16 mx-auto text-gray-400 mb-4" />
          <p className="text-gray-600">Không có bộ sưu tập nào</p>
        </div>
      ) : (
        <div className="bg-white rounded-lg shadow overflow-hidden">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Tên Bộ Sưu Tập
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Mô Tả
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Số Lượng Sản Phẩm
                </th>
                <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Hành Động
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {collections.map((collection) => (
                <tr key={collection._id} className="hover:bg-gray-50">
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm font-medium text-gray-900">
                      {collection.tenBoSuuTap}
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    <div className="text-sm text-gray-600 max-w-xs truncate">
                      {collection.moTa || 'N/A'}
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm text-gray-600">
                      {collection.soLuongSanPham || 0}
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                    <button
                      onClick={() => handleEditClick(collection)}
                      className="text-blue-600 hover:text-blue-900 mr-4"
                    >
                      <Edit2 className="w-4 h-4 inline" />
                    </button>
                    <button
                      onClick={() => handleDeleteCollection(collection._id)}
                      className="text-red-600 hover:text-red-900"
                    >
                      <Trash2 className="w-4 h-4 inline" />
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {/* Add Modal */}
      {showAddModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-6 w-full max-w-md">
            <h2 className="text-xl font-bold mb-4">Thêm Bộ Sưu Tập Mới</h2>
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Tên Bộ Sưu Tập
                </label>
                <input
                  type="text"
                  value={formData.tenBoSuuTap}
                  onChange={(e) => setFormData({ ...formData, tenBoSuuTap: e.target.value })}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
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
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  rows="3"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Hình Ảnh</label>
                
                {/* Image Upload Options */}
                <div className="space-y-3">
                  {/* File Upload */}
                  <div className="flex items-center gap-2">
                    <input
                      type="file"
                      multiple
                      accept="image/*"
                      onChange={handleImageUpload}
                      className="hidden"
                      id="image-upload"
                    />
                    <label
                      htmlFor="image-upload"
                      className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 cursor-pointer"
                    >
                      <Upload className="w-4 h-4" />
                      Tải ảnh từ máy
                    </label>
                    <span className="text-sm text-gray-500">Tối đa 10 ảnh</span>
                  </div>

                  {/* URL Input */}
                  <div className="flex gap-2">
                    <input
                      type="text"
                      value={formData.imageUrl}
                      onChange={(e) => setFormData({ ...formData, imageUrl: e.target.value })}
                      className="flex-1 px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      placeholder="Nhập URL hình ảnh"
                    />
                    <button
                      onClick={handleAddImageUrl}
                      className="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700"
                    >
                      Thêm
                    </button>
                  </div>
                </div>

                {/* Image Preview */}
                {formData.hinhAnh.length > 0 && (
                  <div className="mt-4 grid grid-cols-4 gap-3">
                    {formData.hinhAnh.map((img, index) => (
                      <div key={index} className="relative group">
                        <img
                          src={img.url}
                          alt={`Collection image ${index + 1}`}
                          className="w-full h-24 object-cover rounded-lg border-2 border-gray-200"
                        />
                        <div className="absolute inset-0 bg-black bg-opacity-50 opacity-0 group-hover:opacity-100 transition-opacity rounded-lg flex items-center justify-center gap-2">
                          <button
                            onClick={() => setMainImage(index)}
                            className="p-1 bg-blue-600 text-white rounded hover:bg-blue-700"
                            title="Đặt làm ảnh chính"
                          >
                            <Star className="w-4 h-4" />
                          </button>
                          <button
                            onClick={() => removeImage(index)}
                            className="p-1 bg-red-600 text-white rounded hover:bg-red-700"
                            title="Xóa ảnh"
                          >
                            <X className="w-4 h-4" />
                          </button>
                        </div>
                        {img.laAnhChinh && (
                          <div className="absolute top-1 left-1">
                            <Star className="w-5 h-5 text-yellow-400 fill-current" />
                          </div>
                        )}
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </div>
            <div className="flex justify-end gap-3 mt-6">
              <button
                onClick={() => {
                  setShowAddModal(false);
                  resetForm();
                }}
                className="px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50"
              >
                Hủy
              </button>
              <button
                onClick={handleAddCollection}
                className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
              >
                Thêm
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Edit Modal */}
      {showEditModal && selectedCollection && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-6 w-full max-w-md">
            <h2 className="text-xl font-bold mb-4">Cập Nhật Bộ Sưu Tập</h2>
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Tên Bộ Sưu Tập
                </label>
                <input
                  type="text"
                  value={formData.tenBoSuuTap}
                  onChange={(e) => setFormData({ ...formData, tenBoSuuTap: e.target.value })}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
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
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  rows="3"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Hình Ảnh</label>
                
                {/* Image Upload Options */}
                <div className="space-y-3">
                  {/* File Upload */}
                  <div className="flex items-center gap-2">
                    <input
                      type="file"
                      multiple
                      accept="image/*"
                      onChange={handleImageUpload}
                      className="hidden"
                      id="image-upload-edit"
                    />
                    <label
                      htmlFor="image-upload-edit"
                      className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 cursor-pointer"
                    >
                      <Upload className="w-4 h-4" />
                      Tải ảnh từ máy
                    </label>
                    <span className="text-sm text-gray-500">Tối đa 10 ảnh</span>
                  </div>

                  {/* URL Input */}
                  <div className="flex gap-2">
                    <input
                      type="text"
                      value={formData.imageUrl}
                      onChange={(e) => setFormData({ ...formData, imageUrl: e.target.value })}
                      className="flex-1 px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      placeholder="Nhập URL hình ảnh"
                    />
                    <button
                      onClick={handleAddImageUrl}
                      className="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700"
                    >
                      Thêm
                    </button>
                  </div>
                </div>

                {/* Image Preview */}
                {formData.hinhAnh.length > 0 && (
                  <div className="mt-4 grid grid-cols-4 gap-3">
                    {formData.hinhAnh.map((img, index) => (
                      <div key={index} className="relative group">
                        <img
                          src={img.url}
                          alt={`Collection image ${index + 1}`}
                          className="w-full h-24 object-cover rounded-lg border-2 border-gray-200"
                        />
                        <div className="absolute inset-0 bg-black bg-opacity-50 opacity-0 group-hover:opacity-100 transition-opacity rounded-lg flex items-center justify-center gap-2">
                          <button
                            onClick={() => setMainImage(index)}
                            className="p-1 bg-blue-600 text-white rounded hover:bg-blue-700"
                            title="Đặt làm ảnh chính"
                          >
                            <Star className="w-4 h-4" />
                          </button>
                          <button
                            onClick={() => removeImage(index)}
                            className="p-1 bg-red-600 text-white rounded hover:bg-red-700"
                            title="Xóa ảnh"
                          >
                            <X className="w-4 h-4" />
                          </button>
                        </div>
                        {img.laAnhChinh && (
                          <div className="absolute top-1 left-1">
                            <Star className="w-5 h-5 text-yellow-400 fill-current" />
                          </div>
                        )}
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </div>
            <div className="flex justify-end gap-3 mt-6">
              <button
                onClick={() => {
                  setShowEditModal(false);
                  resetForm();
                }}
                className="px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50"
              >
                Hủy
              </button>
              <button
                onClick={handleUpdateCollection}
                className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
              >
                Cập Nhật
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default CollectionsManagement;
