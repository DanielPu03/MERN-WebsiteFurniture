import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { ShoppingBag, ArrowLeft, Check } from 'lucide-react';
import { useCart, useAppDispatch, useAuth } from '../../../shared/hooks/useRedux';
import { createOrder } from '../orderSlice';
import { PAYMENT_METHODS } from '../../../shared/constants';
import toast from 'react-hot-toast';
import AddressSelectModal from '../components/AddressSelectModal';
import ShippingForm from '../components/ShippingForm';
import BillingForm from '../components/BillingForm';
import PaymentMethodSelector from '../components/PaymentMethodSelector';
import OrderSummary from '../components/OrderSummary';
import { formatPrice } from '../../../shared/utils/formatters';

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
            <ShippingForm
              formData={formData}
              selectedAddress={selectedAddress}
              onChange={handleChange}
              onShowAddressModal={() => setShowAddressModal(true)}
            />

            {/* Payment Method */}
            <PaymentMethodSelector
              selectedMethod={formData.paymentMethod}
              onChange={handleChange}
            />

            {/* Billing Information */}
            <BillingForm
              formData={formData}
              onChange={handleChange}
            />
          </div>

          {/* Right Column - Order Summary */}
          <div className="lg:col-span-1">
            <div className="bg-white rounded-lg shadow-lg p-6 sticky top-8">
              <OrderSummary
                items={items}
                totalAmount={totalAmount}
                itemCount={itemCount}
              />

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
