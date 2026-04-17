import React, { useState } from 'react';
import { useSearchParams, useNavigate } from 'react-router-dom';
import { Search, Filter, Grid, List } from 'lucide-react';
import { useProduct } from '../hooks/useProduct';
import { useCart } from '../../../shared/hooks/useRedux';
import Button from '../../../shared/components/Button';
import Input from '../../../shared/components/Input';
import Loading from '../../../shared/components/Loading';
import toast from 'react-hot-toast';
import ProductFilters from '../components/ProductFilters';
import ProductGrid from '../components/ProductGrid';
import ProductSort from '../components/ProductSort';
import ProductPagination from '../components/ProductPagination';

const ProductPage = () => {
  const [searchParams, setSearchParams] = useSearchParams();
  const navigate = useNavigate();
  const { addToCart } = useCart();
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

  const handleAddToCart = async (product, e) => {
    e.stopPropagation();

    if (!product.trangThai || product.soLuongTon === 0) {
      toast.error('Sán phám không có sãn!');
      return;
    }

    try {
      await addToCart(product._id, 1);
      toast.success('Thêm vào giò hàng thành công!');
      // Dispatch custom event for header notification
      window.dispatchEvent(new CustomEvent('cartSuccess'));
    } catch (error) {
      toast.error('Thêm vào giò hàng thát bại!');
    }
  };

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
        <h1 className="text-3xl font-bold text-gray-900 mb-4">Sản phẩm</h1>
        
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
        <ProductFilters
          showFilters={showFilters}
          filters={filters}
          handleFilterChange={handleFilterChange}
        />

        {/* Sort */}
        <ProductSort
          filters={filters}
          onSortChange={handleSortChange}
          productCount={products.length}
        />
      </div>

      {/* Products Grid/List */}
      <ProductGrid
        products={products}
        viewMode={viewMode}
        onAddToCart={handleAddToCart}
      />

      {/* Pagination */}
      <ProductPagination
        pagination={pagination}
        onPageChange={handlePageChange}
      />
    </div>
  );
};

export default ProductPage;
