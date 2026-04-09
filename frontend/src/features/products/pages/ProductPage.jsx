import React, { useState } from 'react';
import { useSearchParams, useNavigate } from 'react-router-dom';
import { Search, Filter, Grid, List, ShoppingCart, Heart } from 'lucide-react';
import { useProduct } from '../hooks/useProduct';
import { formatCurrency } from '../../../shared/utils';
import Button from '../../../shared/components/Button';
import Input from '../../../shared/components/Input';
import Loading from '../../../shared/components/Loading';

const ProductPage = () => {
  const [searchParams, setSearchParams] = useSearchParams();
  const navigate = useNavigate();
  const { 
    products, 
    pagination, 
    filters, 
    isLoading, 
    getProducts, 
    setFilters,
    dispatch 
  } = useProduct();

    
  const [searchTerm, setSearchTerm] = useState(searchParams.get('search') || '');
  const [viewMode, setViewMode] = useState('grid');
  const [showFilters, setShowFilters] = useState(false);

  React.useEffect(() => {
    const currentFilters = {
      page: parseInt(searchParams.get('page')) || 1,
      limit: parseInt(searchParams.get('limit')) || 12,
      category: searchParams.get('category') || '',
      brand: searchParams.get('brand') || '',
      search: searchParams.get('search') || '',
      minPrice: searchParams.get('minPrice') || '',
      maxPrice: searchParams.get('maxPrice') || '',
      sortBy: searchParams.get('sortBy') || 'createdAt',
      sortOrder: searchParams.get('sortOrder') || 'desc',
    };
    
    setFilters(currentFilters);
    dispatch(getProducts(currentFilters));
  }, [searchParams.toString()]);

  const handleSearch = (e) => {
    e.preventDefault();
    const newFilters = { ...filters, search: searchTerm, page: 1 };
    setFilters(newFilters);
    dispatch(getProducts(newFilters));
    updateURL(newFilters);
  };

  const handleFilterChange = (key, value) => {
    const newFilters = { ...filters, [key]: value, page: 1 };
    setFilters(newFilters);
    dispatch(getProducts(newFilters));
    updateURL(newFilters);
  };

  const handleSortChange = (value) => {
    const [sortBy, sortOrder] = value.split('-');
    const newFilters = { ...filters, sortBy, sortOrder, page: 1 };
    setFilters(newFilters);
    dispatch(getProducts(newFilters));
    updateURL(newFilters);
  };

  const handlePageChange = (page) => {
    const newFilters = { ...filters, page };
    setFilters(newFilters);
    dispatch(getProducts(newFilters));
    updateURL(newFilters);
  };

  const updateURL = (filters) => {
    const params = new URLSearchParams();
    Object.entries(filters).forEach(([key, value]) => {
      if (value) params.set(key, value);
    });
    setSearchParams(params);
  };

  // Product Card Component
  const ProductCard = ({ product }) => {
    const getImageUrl = () => {
      if (product.hinhAnh && product.hinhAnh.length > 0) {
        const firstImage = product.hinhAnh[0];
        return firstImage.url || firstImage;
      }
      return null;
    };

    const imageUrl = getImageUrl();

    return (
      <div 
        className="bg-white rounded-lg shadow-md overflow-hidden hover:shadow-lg transition-shadow duration-300 cursor-pointer"
        onClick={() => navigate(`/product/${product._id}`)}
      >
        <div className="relative h-48 bg-gray-200">
          {imageUrl ? (
            <img
              src={imageUrl}
              alt={product.tenSanPham}
              className="w-full h-full object-cover"
              onError={(e) => {
                e.target.style.display = 'none';
                e.target.parentElement.innerHTML = `
                  <div class="w-full h-full flex items-center justify-center bg-gray-200">
                    <div class="text-gray-400 text-center">
                      <div class="text-4xl mb-2">?</div>
                      <p class="text-sm">No Image</p>
                    </div>
                  </div>
                `;
              }}
            />
          ) : (
            <div className="w-full h-full flex items-center justify-center bg-gray-200">
              <div className="text-gray-400 text-center">
                <div className="text-4xl mb-2">?</div>
                <p className="text-sm">No Image</p>
              </div>
            </div>
          )}
          
          {!product.trangThai && (
            <div className="absolute top-2 left-2">
              <span className="bg-red-100 text-red-800 text-xs px-2 py-1 rounded-full">
                Hêt hàng
              </span>
            </div>
          )}

          <button className="absolute top-2 right-2 p-2 bg-white rounded-full shadow-md hover:bg-gray-100 transition-colors">
            <Heart className="w-4 h-4 text-gray-600 hover:text-red-500" />
          </button>
        </div>

        <div className="p-4">
          <h3 className="text-lg font-semibold text-gray-900 mb-2 line-clamp-2">
            {product.tenSanPham}
          </h3>

          <div className="flex items-center mb-2">
            <div className="flex items-center">
              {[...Array(5)].map((_, index) => (
                <span key={index} className={`text-yellow-400 ${
                  index < Math.floor(product.danhGiaTrungBinh) ? 'fill-current' : ''
                }`}>
                  ?
                </span>
              ))}
            </div>
            <span className="text-sm text-gray-600 ml-2">
              ({product.soLuongDanhGia || 0} reviews)
            </span>
          </div>

          <div className="flex items-center justify-between mb-4">
            <div>
              <p className="text-xl font-bold text-blue-600">
                {formatCurrency(product.gia)}
              </p>
              <p className="text-sm text-gray-600">
                Còn lại: {product.soLuongTon}
              </p>
            </div>
          </div>

          <div className="flex gap-2">
            <Button 
              variant="outline" 
              size="sm"
              onClick={(e) => {
                e.stopPropagation();
                navigate(`/product/${product._id}`);
              }}
            >
              Chi tiết
            </Button>
            <Button
              variant="primary"
              size="sm"
              disabled={!product.trangThai || product.soLuongTon === 0}
              icon={<ShoppingCart className="w-4 h-4" />}
              onClick={(e) => e.stopPropagation()}
            >
              Thêm vào giỏ
            </Button>
          </div>
        </div>
      </div>
    );
  };

  if (isLoading && products.length === 0) {
    return (
      <div className="flex justify-center items-center min-h-96">
        <Loading size="lg" text="Loading products..." />
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8">
      {/* Header */}
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900 mb-4">S?n ph?m</h1>
        
        {/* Search and Filters */}
        <div className="flex flex-col lg:flex-row gap-4 mb-6">
          <form onSubmit={handleSearch} className="flex-1">
            <Input
              placeholder="Tìm kiếm sản phẩm..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              startIcon={<Search className="w-5 h-5" />}
            />
          </form>
          
          <div className="flex gap-2">
            <Button
              variant="outline"
              onClick={() => setShowFilters(!showFilters)}
              icon={<Filter className="w-4 h-4" />}
            >
              Bộ lọc
            </Button>
            
            <div className="flex border rounded-lg">
              <button
                className={`px-3 py-2 ${viewMode === 'grid' ? 'bg-blue-500 text-white' : 'bg-white text-gray-700'}`}
                onClick={() => setViewMode('grid')}
              >
                <Grid className="w-4 h-4" />
              </button>
              <button
                className={`px-3 py-2 ${viewMode === 'list' ? 'bg-blue-500 text-white' : 'bg-white text-gray-700'}`}
                onClick={() => setViewMode('list')}
              >
                <List className="w-4 h-4" />
              </button>
            </div>
          </div>
        </div>

        {/* Filters Panel */}
        {showFilters && (
          <div className="bg-gray-50 p-4 rounded-lg mb-6">
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
              <Input
                placeholder="Danh mục"
                value={filters.category}
                onChange={(e) => handleFilterChange('category', e.target.value)}
              />
              <Input
                placeholder="Thương hiệu"
                value={filters.brand}
                onChange={(e) => handleFilterChange('brand', e.target.value)}
              />
              <Input
                placeholder="Giá từ thấp"
                type="number"
                value={filters.minPrice}
                onChange={(e) => handleFilterChange('minPrice', e.target.value)}
              />
              <Input
                placeholder="Giá đến cao"
                type="number"
                value={filters.maxPrice}
                onChange={(e) => handleFilterChange('maxPrice', e.target.value)}
              />
            </div>
          </div>
        )}

        {/* Sort */}
        <div className="flex items-center justify-between mb-6">
          <p className="text-gray-600">
            Hiển thị {products.length} sản phẩm
          </p>
          <select
            value={`${filters.sortBy}-${filters.sortOrder}`}
            onChange={(e) => handleSortChange(e.target.value)}
            className="border rounded-lg px-3 py-2"
          >
            <option value="createdAt-desc">Mới nhất</option>
            <option value="createdAt-asc">Cũ nhất</option>
            <option value="gia-asc">Giá: Thấp Đến Cao</option>
            <option value="gia-desc">Giá: Cao Đến Thấp</option>
            <option value="tenSanPham-asc">Tên: A-Z</option>
            <option value="tenSanPham-desc">Tên: Z-A</option>
          </select>
        </div>
      </div>

      {/* Products Grid/List */}
      {products.length === 0 ? (
        <div className="text-center py-12">
          <div className="w-16 h-16 mx-auto bg-gray-100 rounded-full flex items-center justify-center mb-4">
            <Search className="w-8 h-8 text-gray-400" />
          </div>
          <h3 className="text-lg font-medium text-gray-900 mb-2">Không tìm thấy sản phẩm</h3>
          <p className="text-gray-600">Thử thay đổi bộ lọc hoặc tìm kiếm</p>
        </div>
      ) : (
        <>
          <div className={viewMode === 'grid' 
            ? "grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6"
            : "space-y-4"
          }>
            {products.map((product) => (
              <ProductCard key={product._id} product={product} />
            ))}
          </div>

          {/* Pagination */}
          {pagination.pages > 1 && (
            <div className="flex justify-center mt-8">
              <div className="flex gap-2">
                {Array.from({ length: pagination.pages }, (_, i) => i + 1).map(page => (
                  <button
                    key={page}
                    onClick={() => handlePageChange(page)}
                    className={`px-3 py-2 rounded ${
                      pagination.page === page
                        ? 'bg-blue-500 text-white'
                        : 'bg-white text-gray-700 border hover:bg-gray-50'
                    }`}
                  >
                    {page}
                  </button>
                ))}
              </div>
            </div>
          )}
        </>
      )}
    </div>
  );
};

export default ProductPage;
