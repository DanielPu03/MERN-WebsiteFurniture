import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { ShoppingBag, ArrowLeft, CreditCard, Truck, MapPin, User, Phone, Mail, Check, Edit2 } from 'lucide-react';
import { useCart, useAppDispatch, useAuth } from '../../../shared/hooks/useRedux';
import { createOrder } from '../orderSlice';
import { PAYMENT_METHODS } from '../../../shared/constants';
import toast from 'react-hot-toast';
import AddressSelectModal from '../components/AddressSelectModal';

const CheckoutPage = () => {
  const { items, totalAmount, itemCount, isLoading: cartLoading, clearCart, getCart } = useCart();
  const { user } = useAuth();
  const dispatch = useAppDispatch();
  const navigate = useNavigate();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [showAddressModal, setShowAddressModal] = useState(false);
  const [selectedAddress, setSelectedAddress] = useState(null);
  const [formData, setFormData] = useState({
    // Shipping Info
    fullName: '',
    phone: '',
    email: '',
    address: '',
    city: '',
    district: '',
    ward: '',
    notes: '',
    // Payment Info
    paymentMethod: PAYMENT_METHODS.COD,
    // Billing Info (same as shipping by default)
    sameAsShipping: true,
    billingFullName: '',
    billingPhone: '',
    billingEmail: '',
    billingAddress: '',
    billingCity: '',
    billingDistrict: '',
    billingWard: '',
  });

  // Load cart data when component mounts
  useEffect(() => {
    getCart();
  }, []);

  // Load user data if available
  useEffect(() => {
    const user = JSON.parse(localStorage.getItem('user'));
    if (user) {
      setFormData(prev => ({
        ...prev,
        fullName: user.tenNguoiDung || '',
        email: user.email || '',
        phone: user.soDienThoai || '',
        address: user.diaChi || '',
      }));
    }
  }, []);

  // Load default address
  useEffect(() => {
    const loadDefaultAddress = async () => {
      try {
        const token = localStorage.getItem('token');
        const response = await fetch('http://localhost:5000/api/addresses', {
          headers: {
            'Authorization': `Bearer ${token}`
          }
        });
        const data = await response.json();
        if (data.success && data.data.addresses.length > 0) {
          const defaultAddress = data.data.addresses.find(addr => addr.macDinh);
          if (defaultAddress) {
            setSelectedAddress(defaultAddress);
            setFormData(prev => ({
              ...prev,
              fullName: defaultAddress.tenNguoiNhan,
              phone: defaultAddress.soDienThoai,
              address: defaultAddress.diaChiCuThe,
              city: defaultAddress.tinhThanh,
              district: defaultAddress.quanHuyen,
              ward: defaultAddress.phuongXa
            }));
          }
        }
      } catch (error) {
        console.error('Error loading default address:', error);
      }
    };
    loadDefaultAddress();
  }, []);

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value
    }));
  };

  const handleSelectAddress = (address) => {
    setSelectedAddress(address);
    setFormData(prev => ({
      ...prev,
      fullName: address.tenNguoiNhan,
      phone: address.soDienThoai,
      address: address.diaChiCuThe,
      city: address.tinhThanh,
      district: address.quanHuyen,
      ward: address.phuongXa
    }));
  };

  const formatPrice = (price) => {
    return new Intl.NumberFormat('vi-VN', {
      style: 'currency',
      currency: 'VND',
    }).format(price || 0);
  };

  const validateForm = () => {
    if (!formData.fullName.trim()) {
      toast.error('Vui lòng nhập họ tên');
      return false;
    }
    if (!formData.phone.trim()) {
      toast.error('Vui lòng nhập số điện thoại');
      return false;
    }
    if (!formData.email.trim()) {
      toast.error('Vui lòng nhập email');
      return false;
    }
    if (!formData.address.trim()) {
      toast.error('Vui lòng nhập địa chỉ');
      return false;
    }
    if (!formData.city.trim()) {
      toast.error('Vui lòng nhập thành phố');
      return false;
    }
    if (!formData.district.trim()) {
      toast.error('Vui lòng nhập quận/huyện');
      return false;
    }

    // Validate billing info if different from shipping
    if (!formData.sameAsShipping) {
      if (!formData.billingFullName.trim()) {
        toast.error('Vui lòng nhập họ tên người thanh toán');
        return false;
      }
      if (!formData.billingAddress.trim()) {
        toast.error('Vui lòng nhập địa chỉ thanh toán');
        return false;
      }
    }

    return true;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!validateForm()) {
      return;
    }

    if (items.length === 0) {
      toast.error('Giỏ hàng trống!');
      return;
    }

    if (!user || !user._id) {
      toast.error('Vui lòng đăng nhập để đặt hàng!');
      navigate('/login');
      return;
    }

    setIsSubmitting(true);

    try {
      const addressToUse = selectedAddress || {
        tenNguoiNhan: formData.fullName,
        soDienThoai: formData.phone,
        diaChiCuThe: formData.address,
        phuongXa: formData.ward,
        quanHuyen: formData.district,
        tinhThanh: formData.city
      };

      const orderData = {
        nguoiDungId: user._id,
        chiTietDonHang: items.map(item => ({
          sanPhamId: item.sanPhamId,
          soLuong: item.soLuong,
          gia: item.gia
        })),
        diaChiGiaoHang: `${addressToUse.tenNguoiNhan}, ${addressToUse.soDienThoai}, ${formData.email}, ${addressToUse.diaChiCuThe}, ${addressToUse.phuongXa}, ${addressToUse.quanHuyen}, ${addressToUse.tinhThanh}`,
        ghiChu: formData.notes || '',
        phiVanChuyen: 0,
        phuongThucThanhToan: formData.paymentMethod,
      };

      await dispatch(createOrder(orderData));
      toast.success('Đặt hàng thành công!');
      navigate('/orders');
    } catch (error) {
      toast.error('Đặt hàng thất bại!');
    } finally {
      setIsSubmitting(false);
    }
  };

  if (cartLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-purple-600"></div>
      </div>
    );
  }

  if (items.length === 0) {
    return (
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="bg-white rounded-lg shadow-lg p-6 text-center">
          <ShoppingBag className="w-16 h-16 mx-auto text-gray-400 mb-4" />
          <h3 className="text-xl font-semibold text-gray-900 mb-2">Giỏ hàng trống</h3>
          <p className="text-gray-600 mb-6">Bạn chưa có sản phẩm nào trong giỏ hàng</p>
          <Link
            to="/products"
            className="inline-flex items-center px-6 py-3 bg-purple-600 text-white rounded-lg font-semibold hover:bg-purple-700 transition-colors"
          >
            <ShoppingBag className="w-5 h-5 mr-2" />
            Mua sắm ngay
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      {/* Header */}
      <div className="flex items-center justify-between mb-8">
        <div className="flex items-center">
          <Link
            to="/cart"
            className="flex items-center text-purple-600 hover:text-purple-700 transition-colors mr-4"
          >
            <ArrowLeft className="h-5 w-5" />
          </Link>
          <h1 className="text-3xl font-bold text-gray-900">Thanh toán</h1>
        </div>
        <div className="text-sm text-gray-600">
          {itemCount} sản phẩm trong giỏ hàng
        </div>
      </div>

      <form onSubmit={handleSubmit}>
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Left Column - Forms */}
          <div className="lg:col-span-2 space-y-6">
            {/* Shipping Information */}
            <div className="bg-white rounded-lg shadow-lg p-6">
              <div className="flex items-center justify-between mb-6">
                <div className="flex items-center">
                  <Truck className="w-6 h-6 text-purple-600 mr-3" />
                  <h2 className="text-xl font-bold text-gray-900">Thông tin giao hàng</h2>
                </div>
                <button
                  type="button"
                  onClick={() => setShowAddressModal(true)}
                  className="flex items-center text-purple-600 hover:text-purple-700 text-sm font-medium"
                >
                  <Edit2 className="w-4 h-4 mr-1" />
                  Thay đổi địa chỉ
                </button>
              </div>

              {selectedAddress ? (
                <div className="bg-purple-50 border border-purple-200 rounded-lg p-4 mb-4">
                  <div className="flex items-start">
                    <MapPin className="w-5 h-5 text-purple-600 mr-3 mt-0.5" />
                    <div className="flex-1">
                      <h4 className="font-semibold text-gray-900">{selectedAddress.tenNguoiNhan}</h4>
                      <p className="text-gray-600 text-sm">{selectedAddress.soDienThoai}</p>
                      <p className="text-gray-700 mt-1">
                        {selectedAddress.diaChiCuThe}, {selectedAddress.phuongXa}, {selectedAddress.quanHuyen}, {selectedAddress.tinhThanh}
                      </p>
                      {selectedAddress.macDinh && (
                        <span className="inline-block mt-2 bg-purple-100 text-purple-800 text-xs px-2 py-1 rounded-full">
                          Địa chỉ mặc định
                        </span>
                      )}
                    </div>
                  </div>
                </div>
              ) : null}

              <div className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Họ tên *
                    </label>
                    <input
                      type="text"
                      name="fullName"
                      value={formData.fullName}
                      onChange={handleChange}
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                      placeholder="Nhập họ tên"
                      required
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Số điện thoại *
                    </label>
                    <input
                      type="tel"
                      name="phone"
                      value={formData.phone}
                      onChange={handleChange}
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                      placeholder="Nhập số điện thoại"
                      required
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Email *
                  </label>
                  <input
                    type="email"
                    name="email"
                    value={formData.email}
                    onChange={handleChange}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                    placeholder="Nhập email"
                    required
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Địa chỉ *
                  </label>
                  <input
                    type="text"
                    name="address"
                    value={formData.address}
                    onChange={handleChange}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                    placeholder="Nhập địa chỉ"
                    required
                  />
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Thành phố *
                    </label>
                    <input
                      type="text"
                      name="city"
                      value={formData.city}
                      onChange={handleChange}
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                      placeholder="Thành phố"
                      required
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Quận/Huyện *
                    </label>
                    <input
                      type="text"
                      name="district"
                      value={formData.district}
                      onChange={handleChange}
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                      placeholder="Quận/Huyện"
                      required
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Phường/Xã
                    </label>
                    <input
                      type="text"
                      name="ward"
                      value={formData.ward}
                      onChange={handleChange}
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                      placeholder="Phường/Xã"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Ghi chú
                  </label>
                  <textarea
                    name="notes"
                    value={formData.notes}
                    onChange={handleChange}
                    rows={3}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                    placeholder="Ghi chú thêm cho đơn hàng"
                  />
                </div>
              </div>
            </div>

            {/* Payment Method */}
            <div className="bg-white rounded-lg shadow-lg p-6">
              <div className="flex items-center mb-6">
                <CreditCard className="w-6 h-6 text-purple-600 mr-3" />
                <h2 className="text-xl font-bold text-gray-900">Phương thức thanh toán</h2>
              </div>

              <div className="space-y-3">
                <label className="flex items-center p-4 border-2 border-purple-600 rounded-lg cursor-pointer bg-purple-50">
                  <input
                    type="radio"
                    name="paymentMethod"
                    value={PAYMENT_METHODS.COD}
                    checked={formData.paymentMethod === PAYMENT_METHODS.COD}
                    onChange={handleChange}
                    className="w-5 h-5 text-purple-600"
                  />
                  <div className="ml-3 flex-1">
                    <div className="font-medium text-gray-900">Thanh toán khi nhận hàng (COD)</div>
                    <div className="text-sm text-gray-600">Thanh toán tiền mặt khi nhận sản phẩm</div>
                  </div>
                  <Check className="w-5 h-5 text-purple-600" />
                </label>

                <label className="flex items-center p-4 border-2 border-gray-300 rounded-lg cursor-pointer hover:border-gray-400">
                  <input
                    type="radio"
                    name="paymentMethod"
                    value={PAYMENT_METHODS.BANK_TRANSFER}
                    checked={formData.paymentMethod === PAYMENT_METHODS.BANK_TRANSFER}
                    onChange={handleChange}
                    className="w-5 h-5 text-purple-600"
                  />
                  <div className="ml-3 flex-1">
                    <div className="font-medium text-gray-900">Chuyển khoản ngân hàng</div>
                    <div className="text-sm text-gray-600">Chuyển khoản qua ngân hàng</div>
                  </div>
                </label>

                <label className="flex items-center p-4 border-2 border-gray-300 rounded-lg cursor-pointer hover:border-gray-400">
                  <input
                    type="radio"
                    name="paymentMethod"
                    value={PAYMENT_METHODS.CREDIT_CARD}
                    checked={formData.paymentMethod === PAYMENT_METHODS.CREDIT_CARD}
                    onChange={handleChange}
                    className="w-5 h-5 text-purple-600"
                  />
                  <div className="ml-3 flex-1">
                    <div className="font-medium text-gray-900">Thẻ tín dụng/Ghi nợ</div>
                    <div className="text-sm text-gray-600">Thanh toán qua thẻ Visa/Mastercard</div>
                  </div>
                </label>

                <label className="flex items-center p-4 border-2 border-gray-300 rounded-lg cursor-pointer hover:border-gray-400">
                  <input
                    type="radio"
                    name="paymentMethod"
                    value={PAYMENT_METHODS.E_WALLET}
                    checked={formData.paymentMethod === PAYMENT_METHODS.E_WALLET}
                    onChange={handleChange}
                    className="w-5 h-5 text-purple-600"
                  />
                  <div className="ml-3 flex-1">
                    <div className="font-medium text-gray-900">Ví điện tử</div>
                    <div className="text-sm text-gray-600">Thanh toán qua Momo, ZaloPay, v.v.</div>
                  </div>
                </label>
              </div>
            </div>

            {/* Billing Information */}
            <div className="bg-white rounded-lg shadow-lg p-6">
              <div className="flex items-center justify-between mb-6">
                <div className="flex items-center">
                  <MapPin className="w-6 h-6 text-purple-600 mr-3" />
                  <h2 className="text-xl font-bold text-gray-900">Thông tin thanh toán</h2>
                </div>
                <label className="flex items-center cursor-pointer">
                  <input
                    type="checkbox"
                    name="sameAsShipping"
                    checked={formData.sameAsShipping}
                    onChange={handleChange}
                    className="w-5 h-5 text-purple-600 rounded"
                  />
                  <span className="ml-2 text-sm text-gray-700">Giống thông tin giao hàng</span>
                </label>
              </div>

              {!formData.sameAsShipping && (
                <div className="space-y-4">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Họ tên người thanh toán *
                      </label>
                      <input
                        type="text"
                        name="billingFullName"
                        value={formData.billingFullName}
                        onChange={handleChange}
                        className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                        placeholder="Nhập họ tên"
                        required={!formData.sameAsShipping}
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Số điện thoại thanh toán
                      </label>
                      <input
                        type="tel"
                        name="billingPhone"
                        value={formData.billingPhone}
                        onChange={handleChange}
                        className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                        placeholder="Nhập số điện thoại"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Email thanh toán
                    </label>
                    <input
                      type="email"
                      name="billingEmail"
                      value={formData.billingEmail}
                      onChange={handleChange}
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                      placeholder="Nhập email"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Địa chỉ thanh toán *
                    </label>
                    <input
                      type="text"
                      name="billingAddress"
                      value={formData.billingAddress}
                      onChange={handleChange}
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                      placeholder="Nhập địa chỉ"
                      required={!formData.sameAsShipping}
                    />
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Thành phố thanh toán
                      </label>
                      <input
                        type="text"
                        name="billingCity"
                        value={formData.billingCity}
                        onChange={handleChange}
                        className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                        placeholder="Thành phố"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Quận/Huyện thanh toán
                      </label>
                      <input
                        type="text"
                        name="billingDistrict"
                        value={formData.billingDistrict}
                        onChange={handleChange}
                        className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                        placeholder="Quận/Huyện"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Phường/Xã thanh toán
                      </label>
                      <input
                        type="text"
                        name="billingWard"
                        value={formData.billingWard}
                        onChange={handleChange}
                        className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                        placeholder="Phường/Xã"
                      />
                    </div>
                  </div>
                </div>
              )}
            </div>
          </div>

          {/* Right Column - Order Summary */}
          <div className="lg:col-span-1">
            <div className="bg-white rounded-lg shadow-lg p-6 sticky top-8">
              <h2 className="text-xl font-bold text-gray-900 mb-6">Tóm tắt đơn hàng</h2>

              {/* Order Items */}
              <div className="space-y-4 mb-6">
                {items.map((item) => (
                  <div key={item.sanPhamId} className="flex items-start space-x-3">
                    <div className="w-16 h-16 flex-shrink-0">
                      {item.hinhAnh ? (
                        <img
                          src={Array.isArray(item.hinhAnh) ? item.hinhAnh[0]?.url || item.hinhAnh[0] : (item.hinhAnh?.url || item.hinhAnh)}
                          alt={item.tenSanPham}
                          className="w-full h-full object-cover rounded-lg"
                        />
                      ) : (
                        <div className="w-full h-full bg-gray-200 rounded-lg flex items-center justify-center">
                          <ShoppingBag className="w-6 h-6 text-gray-400" />
                        </div>
                      )}
                    </div>
                    <div className="flex-1 min-w-0">
                      <h3 className="text-sm font-medium text-gray-900 line-clamp-2">
                        {item.tenSanPham}
                      </h3>
                      <p className="text-xs text-gray-600">Số lượng: {item.soLuong}</p>
                      <p className="text-sm font-medium text-purple-600">
                        {formatPrice(item.gia * item.soLuong)}
                      </p>
                    </div>
                  </div>
                ))}
              </div>

              {/* Order Summary */}
              <div className="border-t pt-6 space-y-3">
                <div className="flex justify-between text-sm">
                  <span className="text-gray-600">Tạm tính</span>
                  <span className="font-medium">{formatPrice(totalAmount)}</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-gray-600">Phí vận chuyển</span>
                  <span className="font-medium text-green-600">Miễn phí</span>
                </div>
                <div className="border-t pt-3">
                  <div className="flex justify-between">
                    <span className="text-lg font-bold text-gray-900">Tổng cộng</span>
                    <span className="text-lg font-bold text-purple-600">{formatPrice(totalAmount)}</span>
                  </div>
                </div>
              </div>

              {/* Submit Button */}
              <button
                type="submit"
                disabled={isSubmitting}
                className="w-full mt-6 px-6 py-4 bg-purple-600 text-white rounded-lg font-semibold hover:bg-purple-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center"
              >
                {isSubmitting ? (
                  <>
                    <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white mr-2"></div>
                    Đang xử lý...
                  </>
                ) : (
                  'Đặt hàng ngay'
                )}
              </button>

              {/* Security Note */}
              <div className="mt-4 text-center text-xs text-gray-500">
                <div className="flex items-center justify-center space-x-2">
                  <Check className="w-4 h-4 text-green-600" />
                  <span>Thông tin thanh toán được bảo mật</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </form>

      {/* Address Select Modal */}
      <AddressSelectModal
        isOpen={showAddressModal}
        onClose={() => setShowAddressModal(false)}
        onSelectAddress={handleSelectAddress}
        selectedAddressId={selectedAddress?._id}
      />
    </div>
  );
};

export default CheckoutPage;
