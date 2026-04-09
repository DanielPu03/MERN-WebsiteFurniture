import React from 'react';
import { Mail, Phone, MapPin, Globe, MessageCircle, Share2, Heart, ArrowUp } from 'lucide-react';

const Footer = () => {
  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <footer className="bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900 text-white relative overflow-hidden">
      {/* Background Pattern */}
      <div className="absolute inset-0 opacity-10">
        <div className="absolute top-10 left-10 w-32 h-32 bg-purple-500 rounded-full filter blur-3xl"></div>
        <div className="absolute bottom-10 right-10 w-48 h-48 bg-pink-500 rounded-full filter blur-3xl"></div>
        <div className="absolute top-1/2 left-1/2 w-64 h-64 bg-blue-500 rounded-full filter blur-3xl"></div>
      </div>

      <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        {/* Main Footer Content */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-12 mb-12">
          {/* Company Info */}
          <div className="col-span-1 md:col-span-2 lg:col-span-1">
            <div className="mb-6">
              <h3 className="text-3xl font-bold mb-4">
                <span className="bg-gradient-to-r from-purple-400 to-pink-400 bg-clip-text text-transparent">
                  havy
                </span>
                <span className="text-white">Store</span>
              </h3>
              <p className="text-gray-300 leading-relaxed mb-6">
                Chuyên cung cấp nội thất cao cấp, mang đến không gian sống đẳng cấp và tiện nghi cho mọi gia đình Việt. Với hơn 10 năm kinh nghiệm, chúng tôi cam kết chất lượng và dịch vụ tốt nhất.
              </p>
              
              {/* Social Media */}
              <div className="flex space-x-4 mb-6">
                <a href="#" className="group p-3 bg-white/10 rounded-full hover:bg-white/20 transition-all duration-300 transform hover:scale-110">
                  <Globe className="h-5 w-5 text-gray-300 group-hover:text-white" />
                </a>
                <a href="#" className="group p-3 bg-white/10 rounded-full hover:bg-white/20 transition-all duration-300 transform hover:scale-110">
                  <MessageCircle className="h-5 w-5 text-gray-300 group-hover:text-white" />
                </a>
                <a href="#" className="group p-3 bg-white/10 rounded-full hover:bg-white/20 transition-all duration-300 transform hover:scale-110">
                  <Share2 className="h-5 w-5 text-gray-300 group-hover:text-white" />
                </a>
              </div>

              {/* Newsletter */}
              <div className="bg-white/10 rounded-2xl p-4">
                <h4 className="font-semibold mb-3 flex items-center">
                  <Heart className="h-4 w-4 mr-2 text-pink-400" />
                  Đăng ký nhận tin
                </h4>
                <div className="flex">
                  <input
                    type="email"
                    placeholder="Email của bạn"
                    className="flex-1 px-4 py-2 bg-white/10 border border-white/20 rounded-l-full text-white placeholder-gray-400 focus:outline-none focus:border-purple-400 transition-colors"
                  />
                  <button className="px-4 py-2 bg-gradient-to-r from-purple-600 to-pink-600 rounded-r-full hover:from-purple-700 hover:to-pink-700 transition-all duration-300">
                    Gửi
                  </button>
                </div>
              </div>
            </div>
          </div>

          {/* Quick Links */}
          <div>
            <h4 className="text-xl font-semibold mb-6 text-white">Liên Kết Nhanh</h4>
            <ul className="space-y-3">
              {[
                { name: 'Về Chúng Tôi', href: '#' },
                { name: 'Sản Phẩm', href: '#' },
                { name: 'Khuyến Mãi', href: '#' },
                { name: 'Tin Tức', href: '#' },
                { name: 'Tuyển Dụng', href: '#' },
                { name: 'Liên Hệ', href: '#' }
              ].map((link, index) => (
                <li key={index}>
                  <a 
                    href={link.href} 
                    className="text-gray-300 hover:text-white transition-colors duration-300 flex items-center group"
                  >
                    <span className="w-0 h-0.5 bg-gradient-to-r from-purple-400 to-pink-400 mr-0 group-hover:w-2 group-hover:mr-2 transition-all duration-300"></span>
                    {link.name}
                  </a>
                </li>
              ))}
            </ul>
          </div>

          {/* Customer Service */}
          <div>
            <h4 className="text-xl font-semibold mb-6 text-white">Hỗ Trợ Khách Hàng</h4>
            <ul className="space-y-3">
              {[
                { name: 'Hướng Dẫn Mua Hàng', href: '#' },
                { name: 'Chính Sách Đổi Trả', href: '#' },
                { name: 'Chính Sách Bảo Hành', href: '#' },
                { name: 'Phương Thức Thanh Toán', href: '#' },
                { name: 'Vận Chuyển & Giao Hàng', href: '#' },
                { name: 'Câu Hỏi Thường Gặp', href: '#' }
              ].map((link, index) => (
                <li key={index}>
                  <a 
                    href={link.href} 
                    className="text-gray-300 hover:text-white transition-colors duration-300 flex items-center group"
                  >
                    <span className="w-0 h-0.5 bg-gradient-to-r from-purple-400 to-pink-400 mr-0 group-hover:w-2 group-hover:mr-2 transition-all duration-300"></span>
                    {link.name}
                  </a>
                </li>
              ))}
            </ul>
          </div>

          {/* Contact Info */}
          <div>
            <h4 className="text-xl font-semibold mb-6 text-white">Thông Tin Liên Hệ</h4>
            <div className="space-y-4">
              <div className="flex items-start">
                <MapPin className="h-5 w-5 mr-3 text-purple-400 flex-shrink-0 mt-1" />
                <div>
                  <p className="text-gray-300">180 Cao Lỗ, phường Chánh Hưng</p>
                  <p className="text-gray-300">Thành phố Hồ Chí Minh</p>
                </div>
              </div>
              
              <div className="flex items-center">
                <Phone className="h-5 w-5 mr-3 text-purple-400 flex-shrink-0" />
                <div>
                  <p className="text-gray-300">0832723534</p>
                  <p className="text-gray-300">Hotline: 123321123</p>
                </div>
              </div>
              
              <div className="flex items-center">
                <Mail className="h-5 w-5 mr-3 text-purple-400 flex-shrink-0" />
                <div>
                  <p className="text-gray-300">info@havystore.vn</p>
                  <p className="text-gray-300">trunqphu.209@gmail.com</p>
                </div>
              </div>

              {/* Working Hours */}
              <div className="mt-6 p-4 bg-white/10 rounded-2xl">
                <h5 className="font-semibold mb-2 text-purple-300">Giờ làm việc</h5>
                <p className="text-gray-300 text-sm">Thứ 2 - Thứ 7: 8:00 - 21:00</p>
                <p className="text-gray-300 text-sm">Chủ Nhật: 9:00 - 18:00</p>
              </div>
            </div>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="border-t border-gray-700 pt-8">
          <div className="flex flex-col md:flex-row justify-between items-center">
            <div className="mb-4 md:mb-0">
              <p className="text-gray-400 text-sm">
                2026 havyStore. Tất cả quyền được bảo lưu.
              </p>
              <p className="text-gray-500 text-xs mt-1">
                Made with <Heart className="inline h-3 w-3 text-pink-400 mx-1" /> in Vietnam
              </p>
            </div>
            
            <div className="flex flex-col md:flex-row items-center space-y-4 md:space-y-0 md:space-x-6">
              <a href="#" className="text-gray-400 hover:text-white text-sm transition-colors duration-300">
                Chính Sách Bảo Mật
              </a>
              <a href="#" className="text-gray-400 hover:text-white text-sm transition-colors duration-300">
                Điều Khoản Sử Dụng
              </a>
              <a href="#" className="text-gray-400 hover:text-white text-sm transition-colors duration-300">
                Site Map
              </a>
            </div>
          </div>
        </div>
      </div>

      {/* Scroll to Top Button */}
      <button
        onClick={scrollToTop}
        className="absolute bottom-8 right-8 p-3 bg-gradient-to-r from-purple-600 to-pink-600 rounded-full shadow-lg hover:from-purple-700 hover:to-pink-700 transition-all duration-300 transform hover:scale-110"
        title="Lên đầu trang"
      >
        <ArrowUp className="h-5 w-5 text-white" />
      </button>
    </footer>
  );
};

export default Footer;
