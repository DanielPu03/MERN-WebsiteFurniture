import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { ShoppingBag, ArrowLeft, Check } from 'lucide-react';
import { useCart, useAppDispatch, useAuth } from '../../../shared/hooks/useRedux';
import { createOrder } from '../orderSlice';
import { PAYMENT_METHODS } from '../../../shared/constants';
import toast from 'react-hot-toast';
import AddressSelectModal from '../components/AddressSelectModal';
import ShippingForm from '../components/ShippingForm';
import PaymentMethodSelector from '../components/PaymentMethodSelector';
import OrderSummary from '../components/OrderSummary';

const CheckoutPage = () => {
  const { items, totalAmount, itemCount, isLoading: cartLoading, getCart } = useCart();
  const { user } = useAuth();
  const dispatch = useAppDispatch();
  const navigate = useNavigate();

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [showAddressModal, setShowAddressModal] = useState(false);
  const [selectedAddress, setSelectedAddress] = useState(null);

  const [formData, setFormData] = useState({
    fullName: '',
    phone: '',
    email: '',
    address: '',
    city: '',
    district: '',
    ward: '',
    notes: '',
    paymentMethod: PAYMENT_METHODS.COD,
  });

  // Load cart
  useEffect(() => {
    getCart();
  }, []);

  // Load user
  useEffect(() => {
    const userStr = localStorage.getItem('user');
    if (userStr) {
      try {
        const userLocal = JSON.parse(userStr);
        if (userLocal) {
          setFormData(prev => ({
            ...prev,
            fullName: userLocal.tenNguoiDung || '',
            email: userLocal.email || '',
            phone: userLocal.soDienThoai || '',
            address: userLocal.diaChi || '',
          }));
        }
      } catch (error) {
        console.error('Error parsing user from localStorage:', error);
      }
    }
  }, []);

  // Load default address
  useEffect(() => {
    const loadDefaultAddress = async () => {
      try {
        const token = localStorage.getItem('token');
        const res = await fetch('https://mern-websitefurniture.onrender.com/api/addresses', {
          headers: { Authorization: `Bearer ${token}` }
        });

        const data = await res.json();

        if (data.success && data.data.addresses.length > 0) {
          const def = data.data.addresses.find(a => a.macDinh);
          if (def) {
            setSelectedAddress(def);
            setFormData(prev => ({
              ...prev,
              fullName: def.tenNguoiNhan,
              phone: def.soDienThoai,
              address: def.diaChiCuThe,
              city: def.tinhThanh,
              district: def.quanHuyen,
              ward: def.phuongXa
            }));
          }
        }
      } catch (err) {
        console.error(err);
      }
    };

    loadDefaultAddress();
  }, []);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
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
    if (!selectedAddress) {
      toast.error('Vui lòng chọn địa chỉ giao hàng');
      return false;
    }
    return true;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!validateForm()) return;
    if (items.length === 0) return toast.error('Giỏ hàng trống');
    if (!user?._id) {
      toast.error('Vui lòng đăng nhập');
      return navigate('/login');
    }

    setIsSubmitting(true);

    try {
      const addr = selectedAddress;

      const orderData = {
        nguoiDungId: user._id,
        chiTietDonHang: items.map(i => ({
          sanPhamId: i.sanPhamId,
          soLuong: i.soLuong,
          gia: i.gia
        })),
        diaChiGiaoHang: `${addr.tenNguoiNhan}, ${addr.soDienThoai}, ${formData.email}, ${addr.diaChiCuThe}, ${addr.phuongXa}, ${addr.quanHuyen}, ${addr.tinhThanh}`,
        ghiChu: formData.notes,
        phiVanChuyen: 0,
        phuongThucThanhToan: formData.paymentMethod
      };

      // ===== VNPAY =====
      if (formData.paymentMethod === 'VNPAY') {
        const orderRes = await dispatch(createOrder(orderData)).unwrap();

        const orderId = orderRes.data?.order?._id || orderRes.order?._id || orderRes._id;
        const amount = orderRes.data?.order?.tongTien || orderRes.order?.tongTien || orderRes.tongTien;

        if (!orderId || !amount) {
          toast.error('Lỗi tạo đơn hàng. Vui lòng thử lại.');
          setIsSubmitting(false);
          return;
        }

        const token = localStorage.getItem('token');

        try {
          const res = await fetch('https://mern-websitefurniture.onrender.com/api/payment/vnpay/create', {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
              Authorization: `Bearer ${token}`
            },
            body: JSON.stringify({
              orderId,
              amount,
              orderInfo: `Thanh toan don hang ${orderId}`
            })
          });

          const data = await res.json();

          if (data.success && data.data?.paymentUrl) {
            window.location.href = data.data.paymentUrl;
            return;
          }

          // Nếu tạo link thanh toán thất bại, hủy đơn hàng
          toast.error('Không tạo được link thanh toán VNPay. Đơn hàng sẽ bị hủy.');
          const cancelRes = await fetch(`https://mern-websitefurniture.onrender.com/api/orders/${orderId}/cancel`, {
            method: 'PUT',
            headers: { Authorization: `Bearer ${token}` }
          });
          if (cancelRes.ok) {
            toast.success('Đơn hàng đã bị hủy do thanh toán thất bại');
          }
          navigate('/orders');
          return;
        } catch (fetchError) {
          // Nếu fetch lỗi, hủy đơn hàng
          toast.error('Lỗi kết nối VNPay. Đơn hàng sẽ bị hủy.');
          await fetch(`https://mern-websitefurniture.onrender.com/api/orders/${orderId}/cancel`, {
            method: 'PUT',
            headers: { Authorization: `Bearer ${token}` }
          });
          navigate('/orders');
          return;
        }
      }

      // ===== COD =====
      else {
        await dispatch(createOrder(orderData));
        toast.success('Đặt hàng thành công');
        navigate('/orders');
      }

    } catch (err) {
      toast.error(err.message || 'Lỗi đặt hàng');
    }

    setIsSubmitting(false);
  };

  // ===== UI =====

  if (cartLoading) {
    return (
      <div className="flex justify-center items-center h-screen">
        Loading...
      </div>
    );
  }

  if (items.length === 0) {
    return (
      <div className="text-center mt-20">
        <ShoppingBag className="mx-auto mb-4" size={50} />
        <p>Giỏ hàng trống</p>
        <Link to="/products">Mua ngay</Link>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto p-6">
      
      {/* Header */}
      <div className="flex items-center mb-6">
        <Link to="/cart"><ArrowLeft /></Link>
        <h1 className="ml-4 text-2xl font-bold">Thanh toán</h1>
      </div>

      <form onSubmit={handleSubmit} className="grid lg:grid-cols-3 gap-6">

        {/* LEFT */}
        <div className="lg:col-span-2 space-y-6">

          <ShippingForm
            formData={formData}
            selectedAddress={selectedAddress}
            onChange={handleChange}
            onShowAddressModal={() => setShowAddressModal(true)}
          />

          <PaymentMethodSelector
            selectedMethod={formData.paymentMethod}
            onChange={handleChange}
          />

        </div>

        {/* RIGHT */}
        <div>
          <OrderSummary
            items={items}
            totalAmount={totalAmount}
            itemCount={itemCount}
          />

          <button
            type="submit"
            disabled={isSubmitting}
            className="w-full mt-4 bg-purple-600 text-white py-3 rounded"
          >
            {isSubmitting ? 'Đang xử lý...' : 'Đặt hàng'}
          </button>

          <div className="text-center text-sm mt-2 flex justify-center items-center">
            <Check className="mr-1 text-green-500" size={16} />
            Bảo mật thanh toán
          </div>
        </div>

      </form>

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