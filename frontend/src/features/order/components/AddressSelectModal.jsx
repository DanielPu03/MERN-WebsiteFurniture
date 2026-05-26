import React, { useState, useEffect } from 'react';
import { MapPin, Plus, Check, Trash2, Edit2 } from 'lucide-react';
import Modal from '../../../shared/components/Modal';
import Button from '../../../shared/components/Button';
import { useAuth } from '../../../shared/hooks/useRedux';
import toast from 'react-hot-toast';
import AddressForm from './AddressForm';

const AddressSelectModal = ({ isOpen, onClose, onSelectAddress, selectedAddressId }) => {
  const { user } = useAuth();
  const [addresses, setAddresses] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [showAddForm, setShowAddForm] = useState(false);
  const [editingAddress, setEditingAddress] = useState(null);

  useEffect(() => {
    if (isOpen) {
      loadAddresses();
    }
  }, [isOpen]);

  const loadAddresses = async () => {
    try {
      setIsLoading(true);
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
      toast.error('Lỗi tải danh sách địa chỉ');
    } finally {
      setIsLoading(false);
    }
  };

  const handleSelectAddress = (address) => {
    onSelectAddress(address);
    onClose();
  };

  const handleDeleteAddress = async (e, addressId) => {
    e.stopPropagation();

    if (addresses.length <= 1) {
      toast.error('Không thể xóa địa chỉ duy nhất');
      return;
    }

    try {
      const token = localStorage.getItem('token');
      const response = await fetch(`https://mern-websitefurniture.onrender.com/api/addresses/${addressId}`, {
        method: 'DELETE',
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });
      const data = await response.json();
      if (data.success) {
        toast.success('Xóa địa chỉ thành công');
        loadAddresses();
      }
    } catch (error) {
      toast.error('Lỗi xóa địa chỉ');
    }
  };

  const handleSetDefault = async (e, addressId) => {
    e.stopPropagation();
    try {
      const token = localStorage.getItem('token');
      const response = await fetch(`https://mern-websitefurniture.onrender.com/api/addresses/${addressId}/default`, {
        method: 'PUT',
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });
      const data = await response.json();
      if (data.success) {
        toast.success('Đặt địa chỉ mặc định thành công');
        loadAddresses();
      }
    } catch (error) {
      toast.error('Lỗi đặt địa chỉ mặc định');
    }
  };

  const handleEditAddress = (e, address) => {
    e.stopPropagation();
    setEditingAddress(address);
    setShowAddForm(true);
  };

  const handleAddressSaved = () => {
    setShowAddForm(false);
    setEditingAddress(null);
    loadAddresses();
  };

  if (showAddForm) {
    return (
      <AddressForm
        isOpen={isOpen}
        onClose={() => {
          setShowAddForm(false);
          setEditingAddress(null);
        }}
        onSave={handleAddressSaved}
        editingAddress={editingAddress}
      />
    );
  }

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title="Chọn địa chỉ giao hàng"
      size="lg"
    >
      {isLoading ? (
        <div className="flex justify-center py-8">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-purple-600"></div>
        </div>
      ) : addresses.length === 0 ? (
        <div className="text-center py-8">
          <MapPin className="w-16 h-16 mx-auto text-gray-400 mb-4" />
          <p className="text-gray-600 mb-4">Bạn chưa có địa chỉ nào</p>
          <Button
            onClick={() => setShowAddForm(true)}
            icon={<Plus className="w-4 h-4" />}
          >
            Thêm địa chỉ mới
          </Button>
        </div>
      ) : (
        <div className="space-y-4">
          {addresses.map((address) => (
            <div
              key={address._id}
              onClick={() => handleSelectAddress(address)}
              className={`p-4 border-2 rounded-lg cursor-pointer transition-all ${
                selectedAddressId === address._id
                  ? 'border-purple-600 bg-purple-50'
                  : 'border-gray-200 hover:border-purple-300'
              }`}
            >
              <div className="flex items-start justify-between">
                <div className="flex-1">
                  <div className="flex items-center gap-2 mb-2">
                    {address.macDinh && (
                      <span className="bg-purple-100 text-purple-800 text-xs px-2 py-1 rounded-full">
                        Mặc định
                      </span>
                    )}
                    {selectedAddressId === address._id && (
                      <Check className="w-5 h-5 text-purple-600" />
                    )}
                  </div>
                  <h4 className="font-semibold text-gray-900">{address.tenNguoiNhan}</h4>
                  <p className="text-gray-600 text-sm">{address.soDienThoai}</p>
                  <p className="text-gray-700 mt-1">
                    {address.diaChiCuThe}, {address.phuongXa}, {address.quanHuyen}, {address.tinhThanh}
                  </p>
                </div>
                <div className="flex gap-2 ml-4">
                  {!address.macDinh && (
                    <button
                      onClick={(e) => handleSetDefault(e, address._id)}
                      className="text-blue-600 hover:text-blue-800 text-sm"
                      title="Đặt làm mặc định"
                    >
                      Đặt mặc định
                    </button>
                  )}
                  <button
                    onClick={(e) => handleEditAddress(e, address)}
                    className="text-gray-600 hover:text-gray-800"
                    title="Sửa"
                  >
                    <Edit2 className="w-4 h-4" />
                  </button>
                  <button
                    onClick={(e) => handleDeleteAddress(e, address._id)}
                    className="text-red-600 hover:text-red-800"
                    title="Xóa"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              </div>
            </div>
          ))}

          <Button
            variant="outline"
            onClick={() => setShowAddForm(true)}
            icon={<Plus className="w-4 h-4" />}
            className="w-full"
          >
            Thêm địa chỉ mới
          </Button>
        </div>
      )}
    </Modal>
  );
};

export default AddressSelectModal;
