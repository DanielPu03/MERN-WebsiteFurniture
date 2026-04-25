import React from 'react';
import { CreditCard, Truck } from 'lucide-react';

const PaymentMethodSelector = ({ selectedMethod, onChange }) => {
  return (
    <div className="bg-white rounded-lg shadow-lg p-6">
      <h2 className="text-xl font-bold text-gray-900 mb-6">Phương thức thanh toán</h2>

      <div className="space-y-4">
        <label className="flex items-center p-4 border border-gray-200 rounded-lg cursor-pointer hover:border-purple-500 transition-colors">
          <input
            type="radio"
            name="paymentMethod"
            value="COD"
            checked={selectedMethod === 'COD'}
            onChange={onChange}
            className="mr-3 h-4 w-4 text-purple-600 focus:ring-purple-500 border-gray-300"
          />
          <Truck className="w-5 h-5 text-purple-600 mr-3" />
          <div>
            <span className="block font-medium text-gray-900">Thanh toán khi nhận hàng (COD)</span>
            <span className="block text-sm text-gray-600">Thanh toán tiền mặt khi nhận sản phẩm</span>
          </div>
        </label>

        <label className="flex items-center p-4 border border-gray-200 rounded-lg cursor-pointer hover:border-purple-500 transition-colors">
          <input
            type="radio"
            name="paymentMethod"
            value="BANK_TRANSFER"
            checked={selectedMethod === 'BANK_TRANSFER'}
            onChange={onChange}
            className="mr-3 h-4 w-4 text-purple-600 focus:ring-purple-500 border-gray-300"
          />
          <CreditCard className="w-5 h-5 text-purple-600 mr-3" />
          <div>
            <span className="block font-medium text-gray-900">Chuyển khoản ngân hàng</span>
            <span className="block text-sm text-gray-600">Chuyển khoản qua ngân hàng</span>
          </div>
        </label>
      </div>
    </div>
  );
};

export default PaymentMethodSelector;
