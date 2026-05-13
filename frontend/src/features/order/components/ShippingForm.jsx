import React from 'react';
import { Truck, MapPin, Edit2 } from 'lucide-react';

const ShippingForm = ({ formData, selectedAddress, onChange, onShowAddressModal }) => {
  return (
    <div className="bg-white rounded-lg shadow-lg p-6">
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center">
          <Truck className="w-6 h-6 text-purple-600 mr-3" />
          <h2 className="text-xl font-bold text-gray-900">Thông tin giao hàng</h2>
        </div>
        <button
          type="button"
          onClick={onShowAddressModal}
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
      ) : (
        <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4 mb-4">
          <div className="flex items-start">
            <MapPin className="w-5 h-5 text-yellow-600 mr-3 mt-0.5" />
            <div className="flex-1">
              <p className="text-yellow-800">Chưa chọn địa chỉ giao hàng</p>
              <button
                type="button"
                onClick={onShowAddressModal}
                className="mt-2 text-purple-600 hover:text-purple-700 text-sm font-medium underline"
              >
                Chọn địa chỉ ngay
              </button>
            </div>
          </div>
        </div>
      )}

      <div className="md:col-span-2">
        <label className="block text-sm font-medium text-gray-700 mb-1">Ghi chú</label>
        <textarea
          name="notes"
          value={formData.notes}
          onChange={onChange}
          rows={3}
          className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
          placeholder="Ghi chú cho đơn hàng (tùy chọn)"
        />
      </div>
    </div>
  );
};

export default ShippingForm;
