import React, { useState, useEffect, useRef } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { ShoppingCart, User, Search, Menu, X, Heart, Check, ChevronDown } from 'lucide-react';
import { useAuth, useCart } from '../../hooks/useRedux';
import { API_BASE_URL } from '../../../app/axiosClient';

const Header = () => {
  const { user, isAuthenticated, dispatch, logout } = useAuth();
  const { cart, itemCount } = useCart();
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isUserMenuOpen, setIsUserMenuOpen] = useState(false);
  const [isProductDropdownOpen, setIsProductDropdownOpen] = useState(false);
  const [categories, setCategories] = useState([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [showCartSuccess, setShowCartSuccess] = useState(false);
  const navigate = useNavigate();
  const userMenuRef = useRef(null);
  const productDropdownRef = useRef(null);
  const dropdownTimeoutRef = useRef(null);

  // Listen for custom cart success events
  useEffect(() => {
    const handleCartSuccess = () => {
      setShowCartSuccess(true);
      const timer = setTimeout(() => {
        setShowCartSuccess(false);
      }, 2000);
      return () => clearTimeout(timer);
    };

    // Add event listener
    window.addEventListener('cartSuccess', handleCartSuccess);

    // Cleanup
    return () => {
      window.removeEventListener('cartSuccess', handleCartSuccess);
    };
  }, []);

  // Load categories from backend
  useEffect(() => {
    const loadCategories = async () => {
      try {
        const response = await fetch(`${API_BASE_URL}/categories`);
        const data = await response.json();
        if (data.success) {
          const categoriesList = data.data.categories || data.data || [];
          setCategories(categoriesList);
        }
      } catch (error) {
        console.error('Error loading categories:', error);
      }
    };

    loadCategories();
  }, []);

  // Click outside handler
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (userMenuRef.current && !userMenuRef.current.contains(event.target)) {
        setIsUserMenuOpen(false);
      }
      if (productDropdownRef.current && !productDropdownRef.current.contains(event.target)) {
        setIsProductDropdownOpen(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);

  // Cleanup timeout on unmount
  useEffect(() => {
    return () => {
      if (dropdownTimeoutRef.current) {
        clearTimeout(dropdownTimeoutRef.current);
      }
    };
  }, []);

  const handleDropdownMouseEnter = () => {
    if (dropdownTimeoutRef.current) {
      clearTimeout(dropdownTimeoutRef.current);
      dropdownTimeoutRef.current = null;
    }
    setIsProductDropdownOpen(true);
  };

  const handleDropdownMouseLeave = () => {
    dropdownTimeoutRef.current = setTimeout(() => {
      setIsProductDropdownOpen(false);
    }, 300);
  };

  const handleSearch = (e) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      navigate(`/products?search=${encodeURIComponent(searchQuery.trim())}`);
      setSearchQuery('');
      setIsMenuOpen(false);
    }
  };

  const handleLogout = () => {
    dispatch(logout());
    navigate('/');
    setIsMenuOpen(false);
    setIsUserMenuOpen(false);
    // Force page reload to confirm logout
    window.location.reload();
  };

  const cartItemsCount = itemCount || 0;

  return (
    <header className="bg-white shadow-sm sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          {/* Logo */}
          <Link to="/" className="flex items-center">
            <div className="flex items-center space-x-2">
              <div className="w-10 h-10 bg-gradient-to-r from-purple-600 to-pink-600 rounded-lg flex items-center justify-center">
                <span className="text-white font-bold text-lg">HS</span>
              </div>
              <span className="text-xl font-bold">
                <span className="text-purple-600">havy</span>
                <span className="text-gray-900">Store</span>
              </span>
            </div>
          </Link>

          {/* Navigation - Desktop */}
          <nav className="hidden lg:flex items-center space-x-8">
            <Link
              to="/"
              className="text-gray-700 hover:text-purple-600 font-medium transition-colors"
            >
              Trang chủ
            </Link>
            <div
              className="relative"
              ref={productDropdownRef}
              onMouseEnter={handleDropdownMouseEnter}
              onMouseLeave={handleDropdownMouseLeave}
            >
              <Link
                to="/products"
                className="flex items-center text-gray-700 hover:text-purple-600 font-medium transition-colors"
              >
                Sản phẩm
                <ChevronDown className="ml-1 h-4 w-4" />
              </Link>
              {isProductDropdownOpen && categories.length > 0 && (
                <div className="absolute top-full left-0 mt-2 w-56 bg-white rounded-lg shadow-lg border border-gray-200 z-50">
                  <div className="py-2">
                    {categories.map((category) => (
                      <Link
                        key={category._id}
                        to={`/products?category=${encodeURIComponent(category.tenDanhMuc)}`}
                        className="block px-4 py-2 text-gray-700 hover:bg-gray-50 hover:text-purple-600 transition-colors"
                        onClick={() => setIsProductDropdownOpen(false)}
                      >
                        {category.tenDanhMuc}
                      </Link>
                    ))}
                  </div>
                </div>
              )}
            </div>
            <Link
              to="/collections"
              className="text-gray-700 hover:text-purple-600 font-medium transition-colors"
            >
              Bộ Sưu Tập
            </Link>
            <Link
              to="/contact"
              className="text-gray-700 hover:text-purple-600 font-medium transition-colors"
            >
              Liên hệ
            </Link>
          </nav>

          {/* Search Bar - Desktop */}
          <div className="hidden md:flex flex-1 max-w-md mx-8">
            <form onSubmit={handleSearch} className="w-full">
              <div className="relative">
                <input
                  type="text"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  placeholder="Tìm kiếm sản phẩm..."
                  className="w-full pl-4 pr-12 py-2 border border-gray-300 rounded-full focus:outline-none focus:ring-2 focus:ring-purple-600 focus:border-transparent"
                />
                <button
                  type="submit"
                  className="absolute right-0 top-0 mt-1 mr-1 p-2 text-gray-400 hover:text-purple-600 transition-colors"
                >
                  <Search className="h-5 w-5" />
                </button>
              </div>
            </form>
          </div>

          {/* User Actions - Desktop */}
          <div className="hidden md:flex items-center space-x-4">
            <Link
              to="/wishlist"
              className="text-gray-700 hover:text-purple-600 transition-colors"
            >
              <Heart className="h-6 w-6" />
            </Link>
            <div className="relative">
              <Link
                to="/cart"
                className="relative text-gray-700 hover:text-purple-600 transition-colors"
              >
                <ShoppingCart className="h-6 w-6" />
                {cartItemsCount > 0 && (
                  <span className="absolute -top-2 -right-2 bg-red-500 text-white text-xs rounded-full h-5 w-5 flex items-center justify-center">
                    {cartItemsCount}
                  </span>
                )}
              </Link>
              
              {/* Cart Success Notification */}
              {showCartSuccess && (
                <div className="absolute -top-12 right-0 bg-green-500 text-white px-3 py-2 rounded-lg shadow-lg flex items-center space-x-2 animate-fade-in-up">
                  <Check className="h-4 w-4" />
                  <span className="text-sm font-medium">Thêm vào giò hàng thành công!</span>
                </div>
              )}
            </div>
            {isAuthenticated ? (
              <div className="relative" ref={userMenuRef}>
                <button 
                  className="flex items-center space-x-2 text-gray-700 hover:text-purple-600 transition-colors"
                  onClick={() => setIsUserMenuOpen(!isUserMenuOpen)}
                >
                  <User className="h-6 w-6" />
                  <span className="text-sm font-medium">{user?.hoTen || 'User'}</span>
                </button>
                <div className={`absolute right-0 mt-2 w-48 bg-white rounded-lg shadow-lg border border-gray-200 transition-all duration-200 z-50 ${isUserMenuOpen ? 'block' : 'hidden'}`}>
                  <Link
                    to="/profile"
                    className="block px-4 py-2 text-gray-700 hover:bg-gray-50 transition-colors"
                  >
                    Tài khoản
                  </Link>
                  <Link
                    to="/orders"
                    className="block px-4 py-2 text-gray-700 hover:bg-gray-50 transition-colors"
                  >
                    Đơn hàng
                  </Link>
                  {user?.role === 1 && (
                    <Link
                      to="/admin"
                      className="block px-4 py-2 text-gray-700 hover:bg-gray-50 transition-colors border-t border-gray-100"
                    >
                      Quản trị viên
                    </Link>
                  )}
                  <button
                    onClick={(e) => {
                      e.preventDefault();
                      e.stopPropagation();
                      handleLogout();
                    }}
                    className="w-full text-left px-4 py-2 text-gray-700 hover:bg-gray-50 transition-colors"
                  >
                    Đăng xuất
                  </button>
                </div>
              </div>
            ) : (
              <Link
                to="/login"
                className="flex items-center space-x-2 bg-purple-600 text-white px-4 py-2 rounded-lg hover:bg-purple-700 transition-colors"
              >
                <User className="h-5 w-5" />
                <span>Đăng nhập</span>
              </Link>
            )}
          </div>

          {/* Mobile Menu Button */}
          <button
            onClick={() => setIsMenuOpen(!isMenuOpen)}
            className="md:hidden text-gray-700 hover:text-purple-600 transition-colors"
          >
            {isMenuOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
          </button>
        </div>

        {/* Mobile Menu */}
        {isMenuOpen && (
          <div className="md:hidden border-t border-gray-200">
            <div className="py-4 space-y-4">
              {/* Search Bar - Mobile */}
              <form onSubmit={handleSearch} className="px-4">
                <div className="relative">
                  <input
                    type="text"
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    placeholder="Tìm kiếm sản phẩm..."
                    className="w-full pl-4 pr-12 py-2 border border-gray-300 rounded-full focus:outline-none focus:ring-2 focus:ring-purple-600 focus:border-transparent"
                  />
                  <button
                    type="submit"
                    className="absolute right-0 top-0 mt-1 mr-1 p-2 text-gray-400 hover:text-purple-600 transition-colors"
                  >
                    <Search className="h-5 w-5" />
                  </button>
                </div>
              </form>

              {/* Navigation - Mobile */}
              <nav className="px-4 space-y-2">
                <Link
                  to="/products"
                  onClick={() => setIsMenuOpen(false)}
                  className="block py-2 text-gray-700 hover:text-purple-600 font-medium transition-colors"
                >
                  Sản phẩm
                </Link>
                <Link
                  to="/about"
                  onClick={() => setIsMenuOpen(false)}
                  className="block py-2 text-gray-700 hover:text-purple-600 font-medium transition-colors"
                >
                  Về chúng tôi
                </Link>
                <Link
                  to="/contact"
                  onClick={() => setIsMenuOpen(false)}
                  className="block py-2 text-gray-700 hover:text-purple-600 font-medium transition-colors"
                >
                  Liên hệ
                </Link>
              </nav>

              {/* User Actions - Mobile */}
              <div className="px-4 pt-4 border-t border-gray-200">
                <div className="flex items-center justify-around">
                  <Link
                    to="/wishlist"
                    onClick={() => setIsMenuOpen(false)}
                    className="text-gray-700 hover:text-purple-600 transition-colors"
                  >
                    <Heart className="h-6 w-6" />
                  </Link>
                  <div className="relative">
                    <Link
                      to="/cart"
                      onClick={() => setIsMenuOpen(false)}
                      className="relative text-gray-700 hover:text-purple-600 transition-colors"
                    >
                      <ShoppingCart className="h-6 w-6" />
                      {cartItemsCount > 0 && (
                        <span className="absolute -top-2 -right-2 bg-red-500 text-white text-xs rounded-full h-5 w-5 flex items-center justify-center">
                          {cartItemsCount}
                        </span>
                      )}
                    </Link>
                    
                    {/* Cart Success Notification - Mobile */}
                    {showCartSuccess && (
                      <div className="absolute -top-12 right-0 bg-green-500 text-white px-3 py-2 rounded-lg shadow-lg flex items-center space-x-2 animate-fade-in-up">
                        <Check className="h-4 w-4" />
                        <span className="text-sm font-medium">Thêm vào giò hàng thành công!</span>
                      </div>
                    )}
                  </div>
                  {isAuthenticated ? (
                    <div className="space-y-2">
                      {user?.role === 1 && (
                        <Link
                          to="/admin"
                          onClick={() => setIsMenuOpen(false)}
                          className="block px-4 py-2 text-gray-700 hover:bg-gray-50 transition-colors"
                        >
                          Quản trị viên
                        </Link>
                      )}
                      <button
                        onClick={(e) => {
                          e.preventDefault();
                          e.stopPropagation();
                          handleLogout();
                        }}
                        className="text-gray-700 hover:text-purple-600 transition-colors"
                      >
                        <User className="h-6 w-6" />
                      </button>
                    </div>
                  ) : (
                    <Link
                      to="/login"
                      onClick={() => setIsMenuOpen(false)}
                      className="bg-purple-600 text-white px-4 py-2 rounded-lg hover:bg-purple-700 transition-colors"
                    >
                      Đăng nhập
                    </Link>
                  )}
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </header>
  );
};

export default Header;
