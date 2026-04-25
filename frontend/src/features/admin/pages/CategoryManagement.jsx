import React, { useState, useEffect } from 'react';
import { Search, Plus, Tag } from 'lucide-react';
import toast from 'react-hot-toast';
import CategoryTable from '../components/CategoryTable';
import CategoryModal from '../components/CategoryModal';

const CategoryManagement = () => {
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(false);
  const [saving, setSaving] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [showModal, setShowModal] = useState(false);
  const [isEdit, setIsEdit] = useState(false);
  const [selectedCategory, setSelectedCategory] = useState(null);
  const [formData, setFormData] = useState({
    tenDanhMuc: '',
    moTa: ''
  });

  // Load categories
  useEffect(() => {
    loadCategories();
  }, [searchTerm]);

  const loadCategories = async () => {
    try {
      setLoading(true);
      const response = await fetch('http://localhost:5000/api/categories', {
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('token')}`
        }
      });
      const data = await response.json();
      if (data.success) {
        // Handle response structure - backend returns { data: { categories } }
        const categoriesList = data.data.categories || data.data || [];
        // Filter categories based on search term
        const filteredCategories = searchTerm 
          ? categoriesList.filter(cat => 
              cat.tenDanhMuc.toLowerCase().includes(searchTerm.toLowerCase())
            )
          : categoriesList;
        setCategories(filteredCategories);
      }
    } catch (error) {
      toast.error('Lỗi khi tải danh mục!');
    } finally {
      setLoading(false);
    }
  };

  const handleAddCategory = async () => {
    try {
      setSaving(true);
      const response = await fetch('http://localhost:5000/api/categories', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${localStorage.getItem('token')}`
        },
        body: JSON.stringify(formData)
      });

      const data = await response.json();
      if (data.success) {
        toast.success('Thêm danh mục thành công!');
        setShowModal(false);
        resetForm();
        loadCategories();
      } else {
        toast.error(data.message || 'Thêm danh mục thất bại!');
      }
    } catch (error) {
      toast.error('Lỗi khi thêm danh mục!');
    } finally {
      setSaving(false);
    }
  };

  const handleUpdateCategory = async () => {
    try {
      setSaving(true);
      const response = await fetch(`http://localhost:5000/api/categories/${selectedCategory._id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${localStorage.getItem('token')}`
        },
        body: JSON.stringify(formData)
      });

      const data = await response.json();
      if (data.success) {
        toast.success('Cập nhật danh mục thành công!');
        setShowModal(false);
        resetForm();
        loadCategories();
      } else {
        toast.error(data.message || 'Cập nhật danh mục thất bại!');
      }
    } catch (error) {
      toast.error('Lỗi khi cập nhật danh mục!');
    } finally {
      setSaving(false);
    }
  };

  const handleDeleteCategory = async (categoryId) => {
    if (!window.confirm('Bạn có chắc chắn muốn xóa danh mục này?')) return;

    try {
      const response = await fetch(`http://localhost:5000/api/categories/${categoryId}`, {
        method: 'DELETE',
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('token')}`
        }
      });

      const data = await response.json();
      if (data.success) {
        toast.success('Xóa danh mục thành công!');
        loadCategories();
      } else {
        toast.error(data.message || 'Xóa danh mục thất bại!');
      }
    } catch (error) {
      toast.error('Lỗi khi xóa danh mục!');
    }
  };

  const resetForm = () => {
    setFormData({
      tenDanhMuc: '',
      moTa: ''
    });
    setSelectedCategory(null);
  };

  const openEditModal = (category) => {
    setSelectedCategory(category);
    setFormData({
      tenDanhMuc: category.tenDanhMuc || '',
      moTa: category.moTa || ''
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
      handleUpdateCategory();
    } else {
      handleAddCategory();
    }
  };

  const handleCloseModal = () => {
    setShowModal(false);
    resetForm();
  };

  return (
    <div className="p-6">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="flex justify-between items-center mb-6">
          <h1 className="text-2xl font-bold text-gray-900">Quản lý danh mục</h1>
          <button
            onClick={handleAddClick}
            className="flex items-center gap-2 bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors"
          >
            <Plus className="w-4 h-4" />
            Thêm danh mục
          </button>
        </div>

        {/* Search */}
        <div className="mb-6">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
            <input
              type="text"
              placeholder="Tìm kiếm danh mục..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            />
          </div>
        </div>

        {/* Categories Table */}
        <CategoryTable
          categories={categories}
          loading={loading}
          onEdit={openEditModal}
          onDelete={handleDeleteCategory}
        />

        {/* Category Modal */}
        <CategoryModal
          isOpen={showModal}
          onClose={handleCloseModal}
          onSave={handleSave}
          formData={formData}
          setFormData={setFormData}
          isEdit={isEdit}
          loading={saving}
        />
      </div>
    </div>
  );
};

export default CategoryManagement;
