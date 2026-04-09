import React from 'react';
import { useAuth } from '../../../shared/hooks/useRedux';

const ProfilePage = () => {
  const { user } = useAuth();

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <div className="bg-white shadow overflow-hidden sm:rounded-lg">
        <div className="px-4 py-5 sm:px-6">
          <h3 className="text-lg leading-6 font-medium text-gray-900">
            Thông tin tài khoản
          </h3>
          <p className="mt-1 max-w-2xl text-sm text-gray-500">
            Quản lý thông tin cá nhân và cài đặt tài khoản
          </p>
        </div>
        <div className="border-t border-gray-200 px-4 py-5 sm:p-6">
          <div className="grid grid-cols-1 gap-6">
            <div>
              <label className="block text-sm font-medium text-gray-700">Họ và tên</label>
              <p className="mt-1 text-sm text-gray-900">{user?.hoTen || 'N/A'}</p>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700">Email</label>
              <p className="mt-1 text-sm text-gray-900">{user?.email || 'N/A'}</p>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700">Số điện thoại</label>
              <p className="mt-1 text-sm text-gray-900">{user?.soDienThoai || 'N/A'}</p>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700">Địa chỉ</label>
              <p className="mt-1 text-sm text-gray-900">{user?.diaChi || 'Chưa có địa chỉ'}</p>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700">Vai trò</label>
              <p className="mt-1 text-sm text-gray-900">
                {user?.role === 1 ? 'Quản trị viên' : 'Người dùng'}
              </p>
            </div>
          </div>
          <div className="mt-6">
            <p className="text-center text-gray-600">
              Trang quản lý thông tin đang được phát triển...
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProfilePage;
