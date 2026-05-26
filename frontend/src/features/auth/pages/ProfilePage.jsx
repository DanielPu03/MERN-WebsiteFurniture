import React, { useState, useEffect } from 'react';
import { useAuth } from '../../../shared/hooks/useRedux';
import { User, ShoppingBag, Lock, MapPin, Plus } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import toast from 'react-hot-toast';
import { updateProfile } from '../authSlice';
import { useAppDispatch } from '../../../shared/hooks/useRedux';
import authAPI from '../authAPI';
import AddressSelectModal from '../../order/components/AddressSelectModal';

const ProfilePage = () => {
  const { user } = useAuth();
  const dispatch = useAppDispatch();
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState('profile');
  const [isEditing, setIsEditing] = useState(false);
  const [errors, setErrors] = useState({});
  const [showAddressModal, setShowAddressModal] = useState(false);
  const [addresses, setAddresses] = useState([]);
  const [formData, setFormData] = useState({
    hoTen: user?.hoTen || '',
    soDienThoai: user?.soDienThoai || ''
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
      soDienThoai: user?.soDienThoai || ''
    });
  }, [user]);

  // Load addresses when address tab is active
  useEffect(() => {
    if (activeTab === 'address') {
      loadAddresses();
    }
  }, [activeTab]);

  const loadAddresses = async () => {
    try {
      const token = localStorage.getItem('token');
      const response = await fetch('https://mern-websitefurniture.onrender.com/api/addresses', {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });
      const data = await response.json();
      if (data.success) {
        setAddresses(data.data.addresses);
      }
    } catch (error) {
      console.error('Error loading addresses:', error);
    }
  };

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
                setErrors({});
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
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-bold text-gray-900">Địa chỉ giao hàng</h2>
        <button
          onClick={() => setShowAddressModal(true)}
          className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition"
        >
          <Plus className="w-4 h-4" />
          Thêm địa chỉ mới
        </button>
      </div>

      <div className="bg-white rounded-lg shadow p-6">
        {addresses.length === 0 ? (
          <div className="text-center py-8">
            <MapPin className="w-16 h-16 mx-auto text-gray-400 mb-4" />
            <p className="text-gray-600 mb-4">Bạn chưa có địa chỉ nào</p>
            <button
              onClick={() => setShowAddressModal(true)}
              className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition"
            >
              Thêm địa chỉ đầu tiên
            </button>
          </div>
        ) : (
          <div className="space-y-4">
            {addresses.map((address) => (
              <div
                key={address._id}
                className={`p-4 border-2 rounded-lg ${
                  address.macDinh
                    ? 'border-blue-600 bg-blue-50'
                    : 'border-gray-200'
                }`}
              >
                <div className="flex items-start justify-between">
                  <div className="flex-1">
                    {address.macDinh && (
                      <span className="inline-block mb-2 bg-blue-100 text-blue-800 text-xs px-2 py-1 rounded-full">
                        Mặc định
                      </span>
                    )}
                    <h4 className="font-semibold text-gray-900">{address.tenNguoiNhan}</h4>
                    <p className="text-gray-600 text-sm">{address.soDienThoai}</p>
                    <p className="text-gray-700 mt-1">
                      {address.diaChiCuThe}, {address.phuongXa}, {address.quanHuyen}, {address.tinhThanh}
                    </p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      <AddressSelectModal
        isOpen={showAddressModal}
        onClose={() => {
          setShowAddressModal(false);
          loadAddresses();
        }}
        onSelectAddress={() => {}}
        selectedAddressId={null}
      />
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
