import React, { useState, useEffect } from 'react';
import { useAuth } from '../../../shared/hooks/useRedux';
import { User, ShoppingBag, Lock, MapPin } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import toast from 'react-hot-toast';
import { updateProfile } from '../authSlice';
import { useAppDispatch } from '../../../shared/hooks/useRedux';
import authAPI from '../authAPI';

const ProfilePage = () => {
  const { user } = useAuth();
  const dispatch = useAppDispatch();
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState('profile');
  const [isEditing, setIsEditing] = useState(false);
  const [errors, setErrors] = useState({});
  const [formData, setFormData] = useState({
    hoTen: user?.hoTen || '',
    soDienThoai: user?.soDienThoai || '',
    diaChi: user?.diaChi || ''
  });
  const [passwordData, setPasswordData] = useState({
    currentPassword: '',
    newPassword: '',
    confirmPassword: ''
  });

  // Sync formData with user data when user changes (for persistence after reload)
  useEffect(() => {
    setFormData({
      hoTen: user?.hoTen || '',
      soDienThoai: user?.soDienThoai || '',
      diaChi: user?.diaChi || ''
    });
  }, [user]);

  const tabs = [
    { id: 'profile', label: 'Thông tin cá nhân', icon: User },
    { id: 'orders', label: 'Đơn hàng', icon: ShoppingBag },
    { id: 'address', label: 'Địa chỉ', icon: MapPin },
    { id: 'password', label: 'Đổi mật khẩu', icon: Lock },
  ];

  const handleSaveProfile = async () => {
    const newErrors = {};
    if (!formData.hoTen.trim()) {
      newErrors.hoTen = 'Họ tên không được để trống';
    }
    if (!/^[0-9]{10}$/.test(formData.soDienThoai)) {
      newErrors.soDienThoai = 'Số điện thoại phải có 10 chữ số';
    }

    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      return;
    }

    setErrors({});

    try {
      const result = await dispatch(updateProfile(formData));
      if (updateProfile.fulfilled.match(result)) {
        toast.success('Cập nhật thông tin thành công!');
        setIsEditing(false);
      } else {
        toast.error(result.payload || 'Cập nhật thông tin thất bại!');
      }
    } catch (error) {
      toast.error('Cập nhật thông tin thất bại!');
    }
  };

  const handleSaveAddress = async () => {
    if (!formData.diaChi.trim()) {
      toast.error('Địa chỉ không được để trống');
      return;
    }

    try {
      const result = await dispatch(updateProfile({ diaChi: formData.diaChi }));
      if (updateProfile.fulfilled.match(result)) {
        toast.success('Lưu địa chỉ thành công!');
      } else {
        toast.error(result.payload || 'Lưu địa chỉ thất bại!');
      }
    } catch (error) {
      toast.error('Lưu địa chỉ thất bại!');
    }
  };

  const handleChangePassword = async () => {
    if (!passwordData.currentPassword) {
      toast.error('Vui lòng nhập mật khẩu hiện tại');
      return;
    }
    if (!passwordData.newPassword) {
      toast.error('Vui lòng nhập mật khẩu mới');
      return;
    }
    if (passwordData.newPassword !== passwordData.confirmPassword) {
      toast.error('Mật khẩu xác nhận không khớp');
      return;
    }
    if (passwordData.newPassword.length < 6) {
      toast.error('Mật khẩu mới phải có ít nhất 6 ký tự');
      return;
    }

    try {
      const response = await authAPI.changePassword({
        currentPassword: passwordData.currentPassword,
        newPassword: passwordData.newPassword
      });
      if (response.success) {
        toast.success('Đổi mật khẩu thành công!');
        setPasswordData({ currentPassword: '', newPassword: '', confirmPassword: '' });
      } else {
        toast.error(response.message || 'Đổi mật khẩu thất bại!');
      }
    } catch (error) {
      toast.error('Đổi mật khẩu thất bại!');
    }
  };

  const renderProfileTab = () => (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-bold text-gray-900">Thông tin cá nhân</h2>
        {!isEditing && (
          <button
            onClick={() => setIsEditing(true)}
            className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition"
          >
            Chỉnh sửa
          </button>
        )}
      </div>

      <div className="bg-white rounded-lg shadow p-6">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Họ và tên</label>
            {isEditing ? (
              <input
                type="text"
                value={formData.hoTen}
                onChange={(e) => setFormData({ ...formData, hoTen: e.target.value })}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
            ) : (
              <p className="text-gray-900">{user?.hoTen || 'N/A'}</p>
            )}
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Email</label>
            <p className="text-gray-900">{user?.email || 'N/A'}</p>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Số điện thoại</label>
            {isEditing ? (
              <div>
                <input
                  type="text"
                  value={formData.soDienThoai}
                  onChange={(e) => {
                    setFormData({ ...formData, soDienThoai: e.target.value });
                    if (errors.soDienThoai) setErrors({ ...errors, soDienThoai: '' });
                  }}
                  className={`w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent ${
                    errors.soDienThoai ? 'border-red-500' : 'border-gray-300'
                  }`}
                  placeholder="10 chữ số"
                />
                {errors.soDienThoai && <p className="text-red-500 text-sm mt-1">{errors.soDienThoai}</p>}
              </div>
            ) : (
              <p className="text-gray-900">{user?.soDienThoai || 'N/A'}</p>
            )}
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Địa chỉ</label>
            {isEditing ? (
              <input
                type="text"
                value={formData.diaChi}
                onChange={(e) => setFormData({ ...formData, diaChi: e.target.value })}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                placeholder="Nhập địa chỉ của bạn"
              />
            ) : (
              <p className="text-gray-900">{user?.diaChi || 'Chưa có địa chỉ'}</p>
            )}
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Vai trò</label>
            <p className="text-gray-900">
              {user?.role === 1 ? 'Quản trị viên' : 'Người dùng'}
            </p>
          </div>
        </div>

        {isEditing && (
          <div className="mt-6 flex gap-3">
            <button
              onClick={handleSaveProfile}
              className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition"
            >
              Lưu thay đổi
            </button>
            <button
              onClick={() => {
                setIsEditing(false);
                setFormData({
                  hoTen: user?.hoTen || '',
                  soDienThoai: user?.soDienThoai || ''
                });
              }}
              className="px-6 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition"
            >
              Hủy
            </button>
          </div>
        )}
      </div>
    </div>
  );

  const renderOrdersTab = () => (
    <div className="space-y-6">
      <h2 className="text-2xl font-bold text-gray-900">Đơn hàng của bạn</h2>
      <div className="bg-white rounded-lg shadow p-6">
        <p className="text-gray-600 mb-4">Xem lịch sử đơn hàng của bạn</p>
        <button
          onClick={() => navigate('/orders')}
          className="px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition"
        >
          Xem đơn hàng
        </button>
      </div>
    </div>
  );

  const renderAddressTab = () => (
    <div className="space-y-6">
      <h2 className="text-2xl font-bold text-gray-900">Địa chỉ giao hàng</h2>
      <div className="bg-white rounded-lg shadow p-6">
        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Địa chỉ giao hàng</label>
            <div className="flex gap-2">
              <input
                type="text"
                value={formData.diaChi}
                onChange={(e) => setFormData({ ...formData, diaChi: e.target.value })}
                className="flex-1 px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                placeholder="Nhập địa chỉ giao hàng của bạn"
              />
              <button
                onClick={handleSaveAddress}
                className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition"
              >
                Lưu
              </button>
            </div>
            {formData.diaChi && (
              <p className="mt-2 text-gray-900">{formData.diaChi}</p>
            )}
          </div>
        </div>
      </div>
    </div>
  );

  const renderPasswordTab = () => (
    <div className="space-y-6">
      <h2 className="text-2xl font-bold text-gray-900">Đổi mật khẩu</h2>
      <div className="bg-white rounded-lg shadow p-6">
        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Mật khẩu hiện tại</label>
            <input
              type="password"
              value={passwordData.currentPassword}
              onChange={(e) => setPasswordData({ ...passwordData, currentPassword: e.target.value })}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              placeholder="Nhập mật khẩu hiện tại"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Mật khẩu mới</label>
            <input
              type="password"
              value={passwordData.newPassword}
              onChange={(e) => setPasswordData({ ...passwordData, newPassword: e.target.value })}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              placeholder="Nhập mật khẩu mới (ít nhất 6 ký tự)"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Xác nhận mật khẩu mới</label>
            <input
              type="password"
              value={passwordData.confirmPassword}
              onChange={(e) => setPasswordData({ ...passwordData, confirmPassword: e.target.value })}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              placeholder="Nhập lại mật khẩu mới"
            />
          </div>
          <button
            onClick={handleChangePassword}
            className="px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition"
          >
            Đổi mật khẩu
          </button>
        </div>
      </div>
    </div>
  );

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <h1 className="text-3xl font-bold text-gray-900 mb-8">Tài khoản của tôi</h1>

      <div className="flex flex-col lg:flex-row gap-8">
        {/* Sidebar Navigation */}
        <div className="lg:w-64">
          <div className="bg-white rounded-lg shadow p-4">
            <nav className="space-y-2">
              {tabs.map((tab) => {
                const Icon = tab.icon;
                return (
                  <button
                    key={tab.id}
                    onClick={() => setActiveTab(tab.id)}
                    className={`w-full flex items-center gap-3 px-4 py-3 rounded-lg transition ${
                      activeTab === tab.id
                        ? 'bg-blue-600 text-white'
                        : 'text-gray-700 hover:bg-gray-100'
                    }`}
                  >
                    <Icon className="w-5 h-5" />
                    <span>{tab.label}</span>
                  </button>
                );
              })}
            </nav>
          </div>
        </div>

        {/* Main Content */}
        <div className="flex-1">
          {activeTab === 'profile' && renderProfileTab()}
          {activeTab === 'orders' && renderOrdersTab()}
          {activeTab === 'address' && renderAddressTab()}
          {activeTab === 'password' && renderPasswordTab()}
        </div>
      </div>
    </div>
  );
};

export default ProfilePage;
