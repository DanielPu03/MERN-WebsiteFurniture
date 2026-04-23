import React, { useState, useEffect } from 'react';
import Modal from '../../../shared/components/Modal';
import Button from '../../../shared/components/Button';
import toast from 'react-hot-toast';

const AddressForm = ({ isOpen, onClose, onSave, editingAddress }) => {
  const [formData, setFormData] = useState({
    tenNguoiNhan: '',
    soDienThoai: '',
    tinhThanh: '',
    quanHuyen: '',
    phuongXa: '',
    diaChiCuThe: '',
    macDinh: false
  });
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    if (editingAddress) {
      setFormData({
        tenNguoiNhan: editingAddress.tenNguoiNhan,
        soDienThoai: editingAddress.soDienThoai,
        tinhThanh: editingAddress.tinhThanh,
        quanHuyen: editingAddress.quanHuyen,
        phuongXa: editingAddress.phuongXa,
        diaChiCuThe: editingAddress.diaChiCuThe,
        macDinh: editingAddress.macDinh
      });
    }
  }, [editingAddress]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);

    try {
      const token = localStorage.getItem('token');
      const url = editingAddress
        ? `http://localhost:5000/api/addresses/${editingAddress._id}`
        : 'http://localhost:5000/api/addresses';

      const response = await fetch(url, {
        method: editingAddress ? 'PUT' : 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify(formData)
      });

      const data = await response.json();
      if (data.success) {
        toast.success(editingAddress ? 'Cập nhật địa chỉ thành công' : 'Thêm địa chỉ thành công');
        onSave();
      } else {
        toast.error(data.message || 'Lỗi khi lưu địa chỉ');
      }
    } catch (error) {
      toast.error('Lỗi khi lưu địa chỉ');
    } finally {
      setIsLoading(false);
    }
  };

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value
    }));
  };

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title={editingAddress ? 'Sửa địa chỉ' : 'Thêm địa chỉ mới'}
      size="md"
    >
      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Họ tên người nhận *</label>
          <input
            type="text"
            name="tenNguoiNhan"
            value={formData.tenNguoiNhan}
            onChange={handleChange}
            required
            className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-purple-500 focus:border-transparent"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Số điện thoại *</label>
          <input
            type="tel"
            name="soDienThoai"
            value={formData.soDienThoai}
            onChange={handleChange}
            required
            pattern="0[0-9]{9}"
            placeholder="Bắt đầu bằng 0, 10 chữ số"
            className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-purple-500 focus:border-transparent"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Tỉnh/Thành phố *</label>
          <input
            type="text"
            name="tinhThanh"
            value={formData.tinhThanh}
            onChange={handleChange}
            required
            className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-purple-500 focus:border-transparent"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Quận/Huyện *</label>
          <input
            type="text"
            name="quanHuyen"
            value={formData.quanHuyen}
            onChange={handleChange}
            required
            className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-purple-500 focus:border-transparent"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Phường/Xã *</label>
          <input
            type="text"
            name="phuongXa"
            value={formData.phuongXa}
            onChange={handleChange}
            required
            className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-purple-500 focus:border-transparent"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Địa chỉ chi tiết *</label>
          <textarea
            name="diaChiCuThe"
            value={formData.diaChiCuThe}
            onChange={handleChange}
            required
            rows="2"
            className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-purple-500 focus:border-transparent"
          />
        </div>

        <div className="flex items-center">
          <input
            type="checkbox"
            name="macDinh"
            id="macDinh"
            checked={formData.macDinh}
            onChange={handleChange}
            className="w-4 h-4 text-purple-600 border-gray-300 rounded focus:ring-purple-500"
          />
          <label htmlFor="macDinh" className="ml-2 text-sm text-gray-700">
            Đặt làm địa chỉ mặc định
          </label>
        </div>

        <div className="flex gap-3 pt-4">
          <Button
            type="button"
            variant="outline"
            onClick={onClose}
            className="flex-1"
          >
            Hủy
          </Button>
          <Button
            type="submit"
            isLoading={isLoading}
            className="flex-1"
          >
            {editingAddress ? 'Cập nhật' : 'Lưu địa chỉ'}
          </Button>
        </div>
      </form>
    </Modal>
  );
};

export default AddressForm;
