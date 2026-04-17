import React, { useState, useEffect } from 'react';
import { Plus, Edit, Trash2, Search, X } from 'lucide-react';
import { toast } from 'react-hot-toast';

const BrandManagement = () => {
  const [brands, setBrands] = useState([]);
  const [loading, setLoading] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [showAddModal, setShowAddModal] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);
  const [selectedBrand, setSelectedBrand] = useState(null);
  const [formData, setFormData] = useState({
    tenThuongHieu: '',
    moTa: '',
    logo: '',
    trangThai: true
  });

  // Load brands
  useEffect(() => {
    loadBrands();
  }, [searchTerm]);

  const loadBrands = async () => {
    try {
      setLoading(true);
      const response = await fetch('http://localhost:5000/api/brands', {
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('token')}`
        }
      });
      const data = await response.json();
      if (data.success) {
        const brandsList = data.data.brands || data.data || [];
        const filteredBrands = searchTerm 
          ? brandsList.filter(brand => 
              brand.tenThuongHieu.toLowerCase().includes(searchTerm.toLowerCase())
            )
          : brandsList;
        setBrands(filteredBrands);
      }
    } catch (error) {
      toast.error('Lỗi khi tải thương hiệu!');
    } finally {
      setLoading(false);
    }
  };

  const resetForm = () => {
    setFormData({
      tenThuongHieu: '',
      moTa: '',
      logo: '',
      trangThai: true
    });
    setSelectedBrand(null);
  };

  const handleAddBrand = async () => {
    try {
      const response = await fetch('http://localhost:5000/api/brands', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${localStorage.getItem('token')}`
        },
        body: JSON.stringify(formData)
      });

      const data = await response.json();
      if (data.success) {
        toast.success('Thêm thương hiệu thành công!');
        setShowAddModal(false);
        resetForm();
        loadBrands();
      } else {
        toast.error(data.message || 'Thêm thương hiệu thất bại!');
      }
    } catch (error) {
      toast.error('Lỗi khi thêm thương hiệu!');
    }
  };

  const handleUpdateBrand = async () => {
    try {
      const response = await fetch(`http://localhost:5000/api/brands/${selectedBrand._id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${localStorage.getItem('token')}`
        },
        body: JSON.stringify(formData)
      });

      const data = await response.json();
      if (data.success) {
        toast.success('Cập nhật thương hiệu thành công!');
        setShowEditModal(false);
        resetForm();
        loadBrands();
      } else {
        toast.error(data.message || 'Cập nhật thương hiệu thất bại!');
      }
    } catch (error) {
      toast.error('Lỗi khi cập nhật thương hiệu!');
    }
  };

  const handleDeleteBrand = async (brandId) => {
    if (!window.confirm('Bạn có chắc chắn muốn xóa thương hiệu này?')) return;

    try {
      const response = await fetch(`http://localhost:5000/api/brands/${brandId}`, {
        method: 'DELETE',
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('token')}`
        }
      });

      const data = await response.json();
      if (data.success) {
        toast.success('Xóa thương hiệu thành công!');
        loadBrands();
      } else {
        toast.error(data.message || 'Xóa thương hiệu thất bại!');
      }
    } catch (error) {
      toast.error('Lỗi khi xóa thương hiệu!');
    }
  };

  const openEditModal = (brand) => {
    setSelectedBrand(brand);
    setFormData({
      tenThuongHieu: brand.tenThuongHieu || '',
      moTa: brand.moTa || '',
      logo: brand.logo || '',
      trangThai: brand.trangThai !== undefined ? brand.trangThai : true
    });
    setShowEditModal(true);
  };

  return (
    <div className="p-6">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="flex justify-between items-center mb-6">
          <h1 className="text-2xl font-bold text-gray-900">Quản lý thương hiệu</h1>
          <button
            onClick={() => setShowAddModal(true)}
            className="flex items-center gap-2 bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors"
          >
            <Plus className="w-4 h-4" />
            Thêm thương hiệu
          </button>
        </div>

        {/* Search */}
        <div className="mb-6">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
            <input
              type="text"
              placeholder="Tìm kiếm thương hiệu..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-blue-500 focus:border-blue-500"
            />
          </div>
        </div>

        {/* Brands Table */}
        <div className="bg-white rounded-lg shadow overflow-hidden">
          {loading ? (
            <div className="p-6 text-center">Đang tải...</div>
          ) : brands.length === 0 ? (
            <div className="p-6 text-center text-gray-500">Không có thương hiệu nào</div>
          ) : (
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Logo</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Tên thương hiệu</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Mô tả</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Trạng thái</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Hành động</th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {brands.map((brand) => (
                  <tr key={brand._id} className="hover:bg-gray-50">
                    <td className="px-6 py-4 whitespace-nowrap">
                      {brand.logo ? (
                        <img src={brand.logo} alt={brand.tenThuongHieu} className="w-12 h-12 object-cover rounded" />
                      ) : (
                        <div className="w-12 h-12 bg-gray-200 rounded flex items-center justify-center text-gray-400">
                          -
                        </div>
                      )}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm font-medium text-gray-900">{brand.tenThuongHieu}</div>
                    </td>
                    <td className="px-6 py-4">
                      <div className="text-sm text-gray-500 max-w-xs truncate">{brand.moTa || '-'}</div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className={`px-2 py-1 inline-flex text-xs leading-5 font-semibold rounded-full ${
                        brand.trangThai ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'
                      }`}>
                        {brand.trangThai ? 'Đang hoạt động' : 'Ngừng hoạt động'}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                      <button
                        onClick={() => openEditModal(brand)}
                        className="text-indigo-600 hover:text-indigo-900 mr-3"
                      >
                        <Edit className="w-4 h-4 inline" />
                      </button>
                      <button
                        onClick={() => handleDeleteBrand(brand._id)}
                        className="text-red-600 hover:text-red-900"
                      >
                        <Trash2 className="w-4 h-4 inline" />
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}
        </div>

        {/* Add Brand Modal */}
        {showAddModal && (
          <div className="fixed inset-0 bg-gray-600 bg-opacity-50 overflow-y-auto h-full w-full z-50">
            <div className="relative min-h-screen flex items-center justify-center p-4">
              <div className="relative bg-white rounded-lg text-left overflow-hidden shadow-xl max-w-md w-full">
                <div className="flex justify-between items-center px-6 py-4 border-b">
                  <h3 className="text-lg font-medium text-gray-900">Thêm thương hiệu mới</h3>
                  <button
                    onClick={() => {
                      setShowAddModal(false);
                      resetForm();
                    }}
                    className="text-gray-400 hover:text-gray-600"
                  >
                    <X className="w-6 h-6" />
                  </button>
                </div>
                <div className="px-6 py-4">
                  <div className="space-y-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">Tên thương hiệu *</label>
                      <input
                        type="text"
                        value={formData.tenThuongHieu}
                        onChange={(e) => setFormData(prev => ({ ...prev, tenThuongHieu: e.target.value }))}
                        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
                        required
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">Mô tả</label>
                      <textarea
                        value={formData.moTa}
                        onChange={(e) => setFormData(prev => ({ ...prev, moTa: e.target.value }))}
                        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
                        rows="3"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">Logo URL</label>
                      <input
                        type="text"
                        value={formData.logo}
                        onChange={(e) => setFormData(prev => ({ ...prev, logo: e.target.value }))}
                        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
                        placeholder="https://..."
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">Trạng thái</label>
                      <select
                        value={formData.trangThai}
                        onChange={(e) => setFormData(prev => ({ ...prev, trangThai: e.target.value === 'true' }))}
                        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
                      >
                        <option value="true">Đang hoạt động</option>
                        <option value="false">Ngừng hoạt động</option>
                      </select>
                    </div>
                  </div>
                </div>
                <div className="flex justify-end px-6 py-4 bg-gray-50 border-t">
                  <button
                    onClick={() => {
                      setShowAddModal(false);
                      resetForm();
                    }}
                    className="mr-3 px-4 py-2 border border-gray-300 rounded-md text-gray-700 hover:bg-gray-50"
                  >
                    Hủy
                  </button>
                  <button
                    onClick={handleAddBrand}
                    className="px-4 py-2 bg-blue-600 border border-transparent rounded-md font-medium text-white hover:bg-blue-700"
                  >
                    Thêm thương hiệu
                  </button>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Edit Brand Modal */}
        {showEditModal && selectedBrand && (
          <div className="fixed inset-0 bg-gray-600 bg-opacity-50 overflow-y-auto h-full w-full z-50">
            <div className="relative min-h-screen flex items-center justify-center p-4">
              <div className="relative bg-white rounded-lg text-left overflow-hidden shadow-xl max-w-md w-full">
                <div className="flex justify-between items-center px-6 py-4 border-b">
                  <h3 className="text-lg font-medium text-gray-900">Cập nhật thương hiệu</h3>
                  <button
                    onClick={() => {
                      setShowEditModal(false);
                      resetForm();
                    }}
                    className="text-gray-400 hover:text-gray-600"
                  >
                    <X className="w-6 h-6" />
                  </button>
                </div>
                <div className="px-6 py-4">
                  <div className="space-y-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">Tên thương hiệu *</label>
                      <input
                        type="text"
                        value={formData.tenThuongHieu}
                        onChange={(e) => setFormData(prev => ({ ...prev, tenThuongHieu: e.target.value }))}
                        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
                        required
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">Mô tả</label>
                      <textarea
                        value={formData.moTa}
                        onChange={(e) => setFormData(prev => ({ ...prev, moTa: e.target.value }))}
                        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
                        rows="3"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">Logo URL</label>
                      <input
                        type="text"
                        value={formData.logo}
                        onChange={(e) => setFormData(prev => ({ ...prev, logo: e.target.value }))}
                        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
                        placeholder="https://..."
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">Trạng thái</label>
                      <select
                        value={formData.trangThai}
                        onChange={(e) => setFormData(prev => ({ ...prev, trangThai: e.target.value === 'true' }))}
                        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
                      >
                        <option value="true">Đang hoạt động</option>
                        <option value="false">Ngừng hoạt động</option>
                      </select>
                    </div>
                  </div>
                </div>
                <div className="flex justify-end px-6 py-4 bg-gray-50 border-t">
                  <button
                    onClick={() => {
                      setShowEditModal(false);
                      resetForm();
                    }}
                    className="mr-3 px-4 py-2 border border-gray-300 rounded-md text-gray-700 hover:bg-gray-50"
                  >
                    Hủy
                  </button>
                  <button
                    onClick={handleUpdateBrand}
                    className="px-4 py-2 bg-blue-600 border border-transparent rounded-md font-medium text-white hover:bg-blue-700"
                  >
                    Cập nhật thương hiệu
                  </button>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default BrandManagement;
