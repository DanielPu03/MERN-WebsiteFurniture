import React from 'react';
import { Package, Heart, ShoppingCart } from 'lucide-react';

const Features = () => {
  return (
    <section className="bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <div className="text-center mb-12">
          <h2 className="text-3xl font-bold text-gray-900 mb-4">Tại sao chọn havyStore?</h2>
          <p className="text-lg text-gray-600">Chúng tôi cam kết mang đến trải nghiệm mua sắm tốt nhất</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          <div className="text-center">
            <div className="w-16 h-16 bg-purple-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <Package className="w-8 h-8 text-purple-600" />
            </div>
            <h3 className="text-xl font-semibold text-gray-900 mb-2">Sản phẩm chất lượng</h3>
            <p className="text-gray-600">Cam kết sản phẩm chính hãng, chất lượng đảm bảo</p>
          </div>

          <div className="text-center">
            <div className="w-16 h-16 bg-pink-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <Heart className="w-8 h-8 text-pink-600" />
            </div>
            <h3 className="text-xl font-semibold text-gray-900 mb-2">Dịch vụ tận tâm</h3>
            <p className="text-gray-600">Đội ngũ tư vấn chuyên nghiệp, hỗ trợ 24/7</p>
          </div>

          <div className="text-center">
            <div className="w-16 h-16 bg-purple-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <ShoppingCart className="w-8 h-8 text-purple-600" />
            </div>
            <h3 className="text-xl font-semibold text-gray-900 mb-2">Giao hàng nhanh chóng</h3>
            <p className="text-gray-600">Miễn phí vận chuyển cho đơn hàng từ 2 triệu</p>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Features;
