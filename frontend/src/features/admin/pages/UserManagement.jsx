import React, { useState, useEffect } from 'react';
import { Search, Shield } from 'lucide-react';
import toast from 'react-hot-toast';
import UserTable from '../components/UserTable';
import UserModal from '../components/UserModal';

const UserManagement = () => {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(false);
  const [saving, setSaving] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [showEditModal, setShowEditModal] = useState(false);
  const [selectedUser, setSelectedUser] = useState(null);
  const [formData, setFormData] = useState({
    hoTen: '',
    email: '',
    soDienThoai: '',
    role: 0,
    trangThai: true
  });

  // Load users
  useEffect(() => {
    loadUsers();
  }, [searchTerm]);

  const loadUsers = async () => {
    try {
      setLoading(true);
      const response = await fetch(`https://mern-websitefurniture.onrender.com/api/users?search=${searchTerm}`, {
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('token')}`
        }
      });
      const data = await response.json();
      if (data.success) {
        // Handle response structure - backend returns { data: { users } }
        const usersList = data.data.users || data.data || [];
        setUsers(usersList);
      }
    } catch (error) {
      toast.error('Lỗi khi tải người dùng!');
    } finally {
      setLoading(false);
    }
  };

  const handleUpdateUser = async () => {
    try {
      setSaving(true);
      const response = await fetch(`https://mern-websitefurniture.onrender.com/api/users/${selectedUser._id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${localStorage.getItem('token')}`
        },
        body: JSON.stringify(formData)
      });

      const data = await response.json();
      if (data.success) {
        toast.success('Cập nhật người dùng thành công!');
        setShowEditModal(false);
        resetForm();
        loadUsers();
      } else {
        toast.error(data.message || 'Cập nhật người dùng thất bại!');
      }
    } catch (error) {
      toast.error('Lỗi khi cập nhật người dùng!');
    } finally {
      setSaving(false);
    }
  };

  const handleDeleteUser = async (userId) => {
    if (!window.confirm('Bạn có chắc chắn muốn xóa người dùng này?')) return;

    try {
      const response = await fetch(`https://mern-websitefurniture.onrender.com/api/users/${userId}`, {
        method: 'DELETE',
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('token')}`
        }
      });

      const data = await response.json();
      if (data.success) {
        toast.success('Xóa người dùng thành công!');
        loadUsers();
      } else {
        toast.error(data.message || 'Xóa người dùng thất bại!');
      }
    } catch (error) {
      toast.error('Lỗi khi xóa người dùng!');
    }
  };

  const resetForm = () => {
    setFormData({
      hoTen: '',
      email: '',
      soDienThoai: '',
      role: 0,
      trangThai: true
    });
    setSelectedUser(null);
  };

  const openEditModal = (user) => {
    setSelectedUser(user);
    setFormData({
      hoTen: user.hoTen || '',
      email: user.email || '',
      soDienThoai: user.soDienThoai || '',
      role: user.role || 0,
      trangThai: user.trangThai !== false
    });
    setShowEditModal(true);
  };

  const handleCloseModal = () => {
    setShowEditModal(false);
    resetForm();
  };

  return (
    <div className="p-6">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="mb-6">
          <h1 className="text-2xl font-bold text-gray-900">Quản lý người dùng</h1>
        </div>

        {/* Search */}
        <div className="mb-6">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
            <input
              type="text"
              placeholder="Tìm kiếm người dùng..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            />
          </div>
        </div>

        {/* Users Table */}
        <UserTable
          users={users}
          loading={loading}
          onEdit={openEditModal}
          onDelete={handleDeleteUser}
        />

        {/* Edit User Modal */}
        <UserModal
          isOpen={showEditModal}
          onClose={handleCloseModal}
          onSave={handleUpdateUser}
          formData={formData}
          setFormData={setFormData}
          loading={saving}
        />
      </div>
    </div>
  );
};

export default UserManagement;
