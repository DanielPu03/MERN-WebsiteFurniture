import React, { useState, useEffect } from 'react';
import { Search, Plus, Package } from 'lucide-react';
import toast from 'react-hot-toast';
import CollectionTable from '../components/CollectionTable';
import CollectionModal from '../components/CollectionModal';

const CollectionsManagement = () => {
  const [collections, setCollections] = useState([]);
  const [loading, setLoading] = useState(false);
  const [saving, setSaving] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [showModal, setShowModal] = useState(false);
  const [isEdit, setIsEdit] = useState(false);
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
      setSaving(true);
      const fileImages = formData.hinhAnh.filter(img => img.file);
      const urlImages = formData.hinhAnh.filter(img => !img.file);
      
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
        setShowModal(false);
        resetForm();
        loadCollections();
        
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
    } finally {
      setSaving(false);
    }
  };

  const handleUpdateCollection = async () => {
    try {
      setSaving(true);
      const fileImages = formData.hinhAnh.filter(img => img.file);
      const urlImages = formData.hinhAnh.filter(img => !img.file);

      const existingImages = selectedCollection.hinhAnh || [];
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
        setShowModal(false);
        resetForm();
        loadCollections();

        if (fileImages.length > 0) {
          await uploadCollectionImages(selectedCollection._id, fileImages);
        }
      } else {
        toast.error(data.message || 'Cập nhật bộ sưu tập thất bại!');
      }
    } catch (error) {
      toast.error('Lỗi khi cập nhật bộ sưu tập!');
    } finally {
      setSaving(false);
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
    setIsEdit(true);
    setShowModal(true);
  };

  const handleAddClick = () => {
    resetForm();
    setIsEdit(false);
    setShowModal(true);
  };

  const handleSave = () => {
    if (isEdit) {
      handleUpdateCollection();
    } else {
      handleAddCollection();
    }
  };

  const handleCloseModal = () => {
    setShowModal(false);
    resetForm();
  };

  const uploadCollectionImages = async (collectionId, fileImages = null) => {
    const imageFormData = new FormData();
    
    const actualFiles = fileImages || formData.hinhAnh.filter(img => img.file).map(img => img.file);
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
          onClick={handleAddClick}
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
        <CollectionTable
          collections={collections}
          onEdit={handleEditClick}
          onDelete={handleDeleteCollection}
        />
      )}

      {/* Collection Modal */}
      <CollectionModal
        isOpen={showModal}
        onClose={handleCloseModal}
        onSave={handleSave}
        formData={formData}
        setFormData={setFormData}
        isEdit={isEdit}
        loading={saving}
      />
    </div>
  );
};

export default CollectionsManagement;
