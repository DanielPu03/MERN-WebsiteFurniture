import React, { useState, useEffect } from 'react';
import { Heart } from 'lucide-react';
import toast from 'react-hot-toast';
import WishlistTable from '../components/WishlistTable';
import SearchFilter from '../../../shared/components/SearchFilter';

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
      const response = await fetch(`https://mern-websitefurniture.onrender.com/api/wishlist/all?search=${searchTerm}`, {
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
      // Extract wishlistId and sanPhamId from the combined ID
      const [actualWishlistId, sanPhamId] = wishlistId.split('_');
      
      const response = await fetch(`https://mern-websitefurniture.onrender.com/api/wishlist/admin/${actualWishlistId}/${sanPhamId}`, {
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
        <SearchFilter
          searchTerm={searchTerm}
          onSearchChange={setSearchTerm}
          placeholder="Tìm kiếm danh sách yêu thích..."
        />

        {/* Wishlist Table */}
        <WishlistTable
          wishlists={wishlists}
          loading={loading}
          onDelete={handleDeleteWishlist}
        />
      </div>
    </div>
  );
};

export default WishlistManagement;
