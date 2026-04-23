import React, { useState } from 'react';
import { useSearchParams, useNavigate } from 'react-router-dom';
import { Search, Grid, List } from 'lucide-react';
import { useProduct } from '../hooks/useProduct';
import { useCart } from '../../../shared/hooks/useRedux';
import Input from '../../../shared/components/Input';
import Loading from '../../../shared/components/Loading';
import toast from 'react-hot-toast';
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
  const [categories, setCategories] = useState([]);
  const [selectedCategory, setSelectedCategory] = useState(searchParams.get('category') || '');
  const [selectedSort, setSelectedSort] = useState(`${searchParams.get('sortBy') || 'createdAt'}-${searchParams.get('sortOrder') || 'desc'}`);

  React.useEffect(() => {
    const loadCategories = async () => {
      try {
        const response = await fetch('http://localhost:5000/api/categories');
        const data = await response.json();
        if (data.success) {
          setCategories(data.data.categories || data.data || []);
        }
      } catch (error) {
        console.error('Error loading categories:', error);
      }
    };
    loadCategories();
  }, []);

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
      search: searchParams.get('search') || '',
      minPrice: searchParams.get('minPrice') || '',
      maxPrice: searchParams.get('maxPrice') || '',
      sortBy: searchParams.get('sortBy') || 'createdAt',
      sortOrder: searchParams.get('sortOrder') || 'desc',
    };

    setFilters(currentFilters);
    dispatch(getProducts(currentFilters));
  }, []);

  const handleSearch = (e) => {
    e.preventDefault();
    const newFilters = { ...filters, search: searchTerm, page: 1 };
    setFilters(newFilters);
    dispatch(getProducts(newFilters));
    updateURL(newFilters);
  };

  const handleFilterChange = (key, value) => {
    const [sortBy, sortOrder] = selectedSort.split('-');
    const newFilters = { ...filters, [key]: value, page: 1, sortBy, sortOrder };
    if (key === 'category') {
      setSelectedCategory(value);
    }
    setFilters(newFilters);
    dispatch(getProducts(newFilters));
    updateURL(newFilters);
  };

  const handleSortChange = (value) => {
    const [sortBy, sortOrder] = value.split('-');
    const newFilters = { ...filters, sortBy, sortOrder, page: 1, category: selectedCategory };
    setSelectedSort(value);
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

        {/* Sort and Category */}
        <div className="flex items-center mb-6 gap-4">
          <select
            value={selectedCategory}
            onChange={(e) => handleFilterChange('category', e.target.value)}
            className="border rounded-lg px-3 py-2 flex-1"
          >
            <option value="">Tất cả danh mục</option>
            {categories.map((category) => (
              <option key={category._id} value={category.tenDanhMuc}>
                {category.tenDanhMuc}
              </option>
            ))}
          </select>
          <ProductSort
            filters={filters}
            onSortChange={handleSortChange}
            productCount={products.length}
            selectedSort={selectedSort}
          />
        </div>
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
