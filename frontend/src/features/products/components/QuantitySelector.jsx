import React from 'react';
import { Minus, Plus } from 'lucide-react';

const QuantitySelector = ({ quantity, onQuantityChange, maxQuantity }) => {
  return (
    <div className="flex items-center space-x-4">
      <span className="text-gray-700 font-medium">Số lượng:</span>
      <div className="flex items-center border border-gray-300 rounded-lg">
        <button
          onClick={() => onQuantityChange(-1)}
          disabled={quantity <= 1}
          className="p-2 hover:bg-gray-100 disabled:opacity-50 disabled:cursor-not-allowed"
        >
          <Minus className="h-4 w-4" />
        </button>
        <span className="px-4 py-2 min-w-[60px] text-center">{quantity}</span>
        <button
          onClick={() => onQuantityChange(1)}
          disabled={quantity >= (maxQuantity || 1)}
          className="p-2 hover:bg-gray-100 disabled:opacity-50 disabled:cursor-not-allowed"
        >
          <Plus className="h-4 w-4" />
        </button>
      </div>
    </div>
  );
};

export default QuantitySelector;
