import React from 'react';

const UserForm = ({ formData, setFormData }) => {
  return (
    <div className="space-y-4">
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">Họ tên</label>
        <input
          type="text"
          value={formData.hoTen}
          onChange={(e) => setFormData(prev => ({ ...prev, hoTen: e.target.value }))}
          className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
        />
      </div>
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">Email</label>
        <input
          type="email"
          value={formData.email}
          onChange={(e) => setFormData(prev => ({ ...prev, email: e.target.value }))}
          className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
          disabled
        />
      </div>
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">Số điện thoại</label>
        <input
          type="text"
          value={formData.soDienThoai}
          onChange={(e) => setFormData(prev => ({ ...prev, soDienThoai: e.target.value }))}
          className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
        />
      </div>
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">Vai trò</label>
        <select
          value={formData.role}
          onChange={(e) => setFormData(prev => ({ ...prev, role: parseInt(e.target.value) }))}
          className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
        >
          <option value={0}>Người dùng</option>
          <option value={1}>Admin</option>
        </select>
      </div>
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">Trạng thái</label>
        <select
          value={formData.trangThai}
          onChange={(e) => setFormData(prev => ({ ...prev, trangThai: e.target.value === 'true' }))}
          className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
        >
          <option value="true">Hoạt động</option>
          <option value="false">Đã khóa</option>
        </select>
      </div>
    </div>
  );
};

export default UserForm;
