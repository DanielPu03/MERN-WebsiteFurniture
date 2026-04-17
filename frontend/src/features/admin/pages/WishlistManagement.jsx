import React, { useState, useEffect } from 'react';
import { Search, Heart, Package, User, Trash2 } from 'lucide-react';
import toast from 'react-hot-toast';

const WishlistManagement = () => {
  const [wishlists, setWishlists] = useState([]);
  const [loading, setLoading] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');

  // Load wishlists
  useEffect(() => {
    loadWishlists();
  }, [searchTerm]);

  const loadWishlists = async () => {
    try {
      setLoading(true);
      const response = await fetch(`/api/wishlists?search=${searchTerm}`, {
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('token')}`
        }
      });
      const data = await response.json();
      if (data.success) {
        setWishlists(data.data || []);
      }
    } catch (error) {
      toast.error('Lỗi khi tải danh sách yêu thích!');
    } finally {
      setLoading(false);
    }
  };

  const handleDeleteWishlist = async (wishlistId) => {
    if (!window.confirm('Bạn có chắc chắn muốn xóa mục yêu thích này?')) return;

    try {
      const response = await fetch(`/api/wishlists/${wishlistId}`, {
        method: 'DELETE',
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('token')}`
        }
      });

      const data = await response.json();
      if (data.success) {
        toast.success('Xóa mục yêu thích thành công!');
        loadWishlists();
      } else {
        toast.error(data.message || 'Xóa mục yêu thích thất bại!');
      }
    } catch (error) {
      toast.error('Lỗi khi xóa mục yêu thích!');
    }
  };

  return (
    <div className="p-6">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="mb-6">
          <h1 className="text-2xl font-bold text-gray-900">Quản lý danh sách yêu thích</h1>
        </div>

        {/* Search */}
        <div className="mb-6">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
            <input
              type="text"
              placeholder="Tìm kiếm danh sách yêu thích..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            />
          </div>
        </div>

        {/* Wishlist Table */}
        <div className="bg-white rounded-lg shadow overflow-hidden">
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Người dùng</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Sản phẩm</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Giá</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Ngày thêm</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Thao tác</th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {loading ? (
                  <tr>
                    <td colSpan="5" className="px-6 py-4 text-center">
                      <div className="flex justify-center">
                        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
                      </div>
                    </td>
                  </tr>
                ) : wishlists.length === 0 ? (
                  <tr>
                    <td colSpan="5" className="px-6 py-4 text-center text-gray-500">
                      Không có mục yêu thích nào
                    </td>
                  </tr>
                ) : (
                  wishlists.map((wishlist) => (
                    <tr key={wishlist._id} className="hover:bg-gray-50">
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="flex items-center">
                          <div className="flex-shrink-0 h-8 w-8 rounded-full bg-blue-600 flex items-center justify-center">
                            <span className="text-white text-xs font-medium">
                              {wishlist.nguoiDungId?.hoTen?.charAt(0)?.toUpperCase() || 'U'}
                            </span>
                          </div>
                          <div className="ml-3">
                            <div className="text-sm font-medium text-gray-900">
                              {wishlist.nguoiDungId?.hoTen || wishlist.hoTen || 'N/A'}
                            </div>
                            <div className="text-xs text-gray-500">{wishlist.nguoiDungId?.email || wishlist.email || ''}</div>
                          </div>
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="flex items-center">
                          <Package className="w-5 h-5 text-blue-500 mr-2" />
                          <div className="text-sm font-medium text-gray-900">
                            {wishlist.sanPhamId?.tenSanPham || wishlist.tenSanPham || 'N/A'}
                          </div>
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="text-sm text-gray-900">
                          {wishlist.sanPhamId?.gia || wishlist.gia 
                            ? new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(wishlist.sanPhamId?.gia || wishlist.gia)
                            : 'N/A'}
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="text-sm text-gray-900">
                          {new Date(wishlist.ngayTao).toLocaleDateString('vi-VN')}
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                        <button
                          onClick={() => handleDeleteWishlist(wishlist._id)}
                          className="text-red-600 hover:text-red-900"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
};

export default WishlistManagement;
