import React, { useState, useEffect } from 'react';
import { Search, Plus, Edit2, Trash2, Upload, X, Star, Image as ImageIcon, ChevronLeft, ChevronRight } from 'lucide-react';
import toast from 'react-hot-toast';

const ProductManagement = () => {
  const [products, setProducts] = useState([]);
  const [categories, setCategories] = useState([]);
  const [brands, setBrands] = useState([]);
  const [collections, setCollections] = useState([]);
  const [loading, setLoading] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const [pagination, setPagination] = useState({ page: 1, limit: 10, total: 0, totalPages: 0 });
  const [showAddModal, setShowAddModal] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);
  const [selectedProduct, setSelectedProduct] = useState(null);
  const [formData, setFormData] = useState({
    tenSanPham: '',
    gia: '',
    soLuongTon: '',
    danhMucId: '',
    thuongHieuId: '',
    boSuuTapIds: [],
    moTa: '',
    trangThai: true,
    noiBat: false,
    hinhAnh: [],
    imageUrl: ''
  });

  // Load initial data
  useEffect(() => {
    loadProducts();
    loadCategories();
    loadBrands();
    loadCollections();
  }, [currentPage, searchTerm]);

  const loadProducts = async () => {
    try {
      setLoading(true);
      const response = await fetch(`http://localhost:5000/api/products?page=${currentPage}&limit=10&search=${searchTerm}`, {
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('token')}`
        }
      });
      const data = await response.json();
      if (data.success) {
        setProducts(data.data.products || []);
        const paginationData = data.data.pagination || {};
        setPagination({
          page: paginationData.page || 1,
          limit: paginationData.limit || 10,
          total: paginationData.total || 0,
          totalPages: paginationData.pages || 0,
        });
      } else {
        toast.error(data.message || 'Lỗi khi tải sản phẩm!');
      }
    } catch (error) {
      toast.error('Lỗi khi tải sản phẩm!');
    } finally {
      setLoading(false);
    }
  };

  const loadCategories = async () => {
    try {
      const response = await fetch('http://localhost:5000/api/categories', {
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('token')}`
        }
      });
      const data = await response.json();
      if (data.success) {
        // Handle response structure - backend returns { data: { categories } }
        const categoriesList = data.data.categories || data.data || [];
        setCategories(categoriesList);
      } else {
      }
    } catch (error) {
    }
  };

  const loadBrands = async () => {
    try {
      const response = await fetch('http://localhost:5000/api/brands', {
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('token')}`
        }
      });
      const data = await response.json();
      if (data.success) {
        // Handle response structure - backend returns { data: { brands } }
        const brandsList = data.data.brands || data.data || [];
        setBrands(brandsList);
      } else {
      }
    } catch (error) {
    }
  };

  const loadCollections = async () => {
    try {
      const response = await fetch('http://localhost:5000/api/collections', {
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('token')}`
        }
      });
      const data = await response.json();
      if (data.success) {
        // Handle response structure - backend returns { data: { collections } }
        const collectionsList = data.data.collections || data.data || [];
        setCollections(collectionsList);
      } else {
      }
    } catch (error) {
    }
  };

  const handleAddProduct = async () => {
    try {
      // Separate file images and URL images
      const fileImages = formData.hinhAnh.filter(img => img.type === 'file');
      const urlImages = formData.hinhAnh.filter(img => img.type === 'url');
      
      const productData = {
        ...formData,
        gia: parseFloat(formData.gia),
        soLuongTon: parseInt(formData.soLuongTon),
        danhMucId: formData.danhMucId || null,
        thuongHieuId: formData.thuongHieuId && formData.thuongHieuId !== '' ? formData.thuongHieuId : null,
        boSuuTapIds: formData.boSuuTapIds && formData.boSuuTapIds.length > 0 ? formData.boSuuTapIds : [],
        noiBat: formData.noiBat,
        hinhAnh: urlImages.map(img => ({ url: img.url, laAnhChinh: img.laAnhChinh }))
      };


      const response = await fetch('http://localhost:5000/api/products', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${localStorage.getItem('token')}`
        },
        body: JSON.stringify(productData)
      });

      const data = await response.json();
      if (data.success) {
        toast.success('Thêm sản phẩm thành công!');
        setShowAddModal(false);
        resetForm();
        loadProducts();
        
        // Upload file images if any
        if (fileImages.length > 0) {
          const productId = data.data.product?._id || data.data._id;
          if (productId) {
            await uploadProductImages(productId, fileImages);
          }
        }
      } else {
        toast.error(data.message || 'Thêm sản phẩm thất bại!');
      }
    } catch (error) {
      toast.error('Lỗi khi thêm sản phẩm!');
    }
  };

  const handleUpdateProduct = async () => {
    try {
      // Separate file images and URL images
      const fileImages = formData.hinhAnh.filter(img => img.type === 'file');
      const urlImages = formData.hinhAnh.filter(img => img.type === 'url');

      // Preserve existing images from the product
      const existingImages = selectedProduct.hinhAnh || [];

      // Combine existing images with new URL images
      const allImages = [
        ...existingImages,
        ...urlImages.map(img => ({ url: img.url, laAnhChinh: img.laAnhChinh }))
      ];

      const productData = {
        ...formData,
        gia: parseFloat(formData.gia),
        soLuongTon: parseInt(formData.soLuongTon),
        danhMucId: formData.danhMucId || null,
        thuongHieuId: formData.thuongHieuId && formData.thuongHieuId !== '' ? formData.thuongHieuId : null,
        boSuuTapIds: formData.boSuuTapIds && formData.boSuuTapIds.length > 0 ? formData.boSuuTapIds : [],
        noiBat: formData.noiBat,
        hinhAnh: allImages
      };

      const response = await fetch(`http://localhost:5000/api/products/${selectedProduct._id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${localStorage.getItem('token')}`
        },
        body: JSON.stringify(productData)
      });

      const data = await response.json();
      if (data.success) {
        toast.success('Cập nhật sản phẩm thành công!');
        setShowEditModal(false);
        resetForm();
        loadProducts();

        // Upload file images if any
        if (fileImages.length > 0) {
          await uploadProductImages(selectedProduct._id, fileImages);
        }
      } else {
        toast.error(data.message || 'Cập nhật sản phẩm thất bại!');
      }
    } catch (error) {
      toast.error('Lỗi khi cập nhật sản phẩm!');
    }
  };

  const handleDeleteProduct = async (productId) => {
    if (!window.confirm('Bạn có chắc chắn muốn xóa sản phẩm này?')) return;

    try {
      const response = await fetch(`http://localhost:5000/api/products/${productId}`, {
        method: 'DELETE',
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('token')}`
        }
      });

      const data = await response.json();
      if (data.success) {
        toast.success('Xóa sản phẩm thành công!');
        loadProducts();
      } else {
        toast.error(data.message || 'Xóa sản phẩm thất bại!');
      }
    } catch (error) {
      toast.error('Lỗi khi xóa sản phẩm!');
    }
  };

  const handleToggleFeatured = async (productId, currentFeatured) => {
    try {
      const response = await fetch(`http://localhost:5000/api/products/${productId}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${localStorage.getItem('token')}`
        },
        body: JSON.stringify({ noiBat: !currentFeatured })
      });

      const data = await response.json();
      if (data.success) {
        toast.success(!currentFeatured ? 'Đánh dấu sản phẩm nổi bật!' : 'Bỏ đánh dấu sản phẩm nổi bật!');
        loadProducts();
      } else {
        toast.error(data.message || 'Cập nhật thất bại!');
      }
    } catch (error) {
      toast.error('Lỗi khi cập nhật!');
    }
  };

  const handleImageUpload = (e) => {
    const files = Array.from(e.target.files);
    
    if (formData.hinhAnh.length + files.length > 10) {
      toast.error('Chỉ được tải tối đa 10 ảnh!');
      return;
    }

    const newImages = files.map(file => ({
      file,
      url: URL.createObjectURL(file),
      laAnhChinh: formData.hinhAnh.length === 0,
      type: 'file'
    }));

    setFormData(prev => ({
      ...prev,
      hinhAnh: [...prev.hinhAnh, ...newImages]
    }));
  };

  const handleAddImageUrl = () => {
    if (!formData.imageUrl) {
      toast.error('Vui lòng nhập URL hình ảnh!');
      return;
    }

    if (formData.hinhAnh.length >= 10) {
      toast.error('Chỉ được tải tối đa 10 ảnh!');
      return;
    }

    const newImage = {
      url: formData.imageUrl,
      laAnhChinh: formData.hinhAnh.length === 0,
      type: 'url'
    };

    setFormData(prev => ({
      ...prev,
      hinhAnh: [...prev.hinhAnh, newImage],
      imageUrl: ''
    }));

    toast.success('Đã thêm hình ảnh từ URL!');
  };

  const removeImage = (index) => {
    const newImages = formData.hinhAnh.filter((_, i) => i !== index);
    
    // If removing main image, set first remaining as main
    if (newImages.length > 0 && formData.hinhAnh[index]?.laAnhChinh) {
      newImages[0].laAnhChinh = true;
    }

    setFormData(prev => ({
      ...prev,
      hinhAnh: newImages
    }));
  };

  const setMainImage = (index) => {
    const newImages = formData.hinhAnh.map((img, i) => ({
      ...img,
      laAnhChinh: i === index
    }));

    setFormData(prev => ({
      ...prev,
      hinhAnh: newImages
    }));
  };

  const uploadProductImages = async (productId, fileImages = null) => {
    const imageFormData = new FormData();
    
    // Use provided fileImages or filter from formData
    const actualFiles = fileImages || formData.hinhAnh.filter(img => img.type === 'file').map(img => img.file);
    actualFiles.forEach(file => {
      imageFormData.append('images', file);
    });

    try {
      const response = await fetch(`http://localhost:5000/api/products/${productId}/images`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('token')}`
        },
        body: imageFormData
      });

      const data = await response.json();
      if (data.success) {
        toast.success('Upload hình ảnh thành công!');
      } else {
        toast.error(data.message || 'Upload hình ảnh thất bại!');
      }
    } catch (error) {
      toast.error('Lỗi khi upload hình ảnh!');
    }
  };

  const resetForm = () => {
    setFormData({
      tenSanPham: '',
      gia: '',
      soLuongTon: '',
      danhMucId: '',
      thuongHieuId: '',
      boSuuTapIds: [],
      moTa: '',
      trangThai: true,
      noiBat: false,
      hinhAnh: [],
      imageUrl: ''
    });
    setSelectedProduct(null);
  };

  const openEditModal = (product) => {
    setSelectedProduct(product);
    setFormData({
      tenSanPham: product.tenSanPham || '',
      gia: product.gia || '',
      soLuongTon: product.soLuongTon || '',
      danhMucId: product.danhMucId?._id || product.danhMucId || '',
      thuongHieuId: product.thuongHieuId?._id || product.thuongHieuId || '',
      boSuuTapIds: product.boSuuTapIds?.map(id => typeof id === 'object' ? id._id : id) || [],
      moTa: product.moTa || '',
      trangThai: product.trangThai !== undefined ? product.trangThai : true,
      noiBat: product.noiBat || false,
      hinhAnh: product.hinhAnh || [],
      imageUrl: ''
    });
    setShowEditModal(true);
  };

  return (
    <div className="p-6">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="flex justify-between items-center mb-6">
          <h1 className="text-2xl font-bold text-gray-900">Quản lý sản phẩm</h1>
          <button
            onClick={() => setShowAddModal(true)}
            className="flex items-center gap-2 bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors"
          >
            <Plus className="w-4 h-4" />
            Thêm sản phẩm
          </button>
        </div>

        {/* Search */}
        <div className="mb-6">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
            <input
              type="text"
              placeholder="Tìm kiếm sản phẩm..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            />
          </div>
        </div>

        {/* Products Table */}
        <div className="bg-white rounded-lg shadow overflow-hidden">
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Hình ảnh</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Tên sản phẩm</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Giá</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Tồn kho</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Nổi bật</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Trạng thái</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Thao tác</th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {loading ? (
                  <tr>
                    <td colSpan="7" className="px-6 py-4 text-center">
                      <div className="flex justify-center">
                        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
                      </div>
                    </td>
                  </tr>
                ) : products.length === 0 ? (
                  <tr>
                    <td colSpan="7" className="px-6 py-4 text-center text-gray-500">
                      Không có sản phẩm nào
                    </td>
                  </tr>
                ) : (
                  products.map((product) => (
                    <tr key={product._id} className="hover:bg-gray-50">
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="flex gap-2">
                          {product.hinhAnh && product.hinhAnh.length > 0 ? (
                            product.hinhAnh.slice(0, 3).map((img, index) => (
                              <div key={index} className="relative">
                                <img
                                  src={img.url || img}
                                  alt={product.tenSanPham}
                                  className="w-12 h-12 object-cover rounded"
                                />
                                {img.laAnhChinh && (
                                  <span className="absolute -top-1 -right-1 bg-red-500 text-white text-xs px-1 rounded">
                                    Chính
                                  </span>
                                )}
                                {product.hinhAnh.length > 3 && index === 2 && (
                                  <span className="absolute -bottom-1 -right-1 bg-gray-800 text-white text-xs px-1 rounded">
                                    +{product.hinhAnh.length - 3}
                                  </span>
                                )}
                              </div>
                            ))
                          ) : (
                            <div className="w-12 h-12 bg-gray-200 rounded flex items-center justify-center">
                              <ImageIcon className="w-6 h-6 text-gray-400" />
                            </div>
                          )}
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="text-sm font-medium text-gray-900">{product.tenSanPham}</div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="text-sm text-gray-900">{new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(product.gia)}</div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="text-sm text-gray-900">{product.soLuongTon}</div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <button
                          onClick={() => handleToggleFeatured(product._id, product.noiBat)}
                          className={`${product.noiBat ? 'text-yellow-500' : 'text-gray-300'} hover:text-yellow-500`}
                        >
                          <Star className="w-5 h-5" fill={product.noiBat ? 'currentColor' : 'none'} />
                        </button>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${
                          product.trangThai
                            ? 'bg-green-100 text-green-800'
                            : 'bg-red-100 text-red-800'
                        }`}>
                          {product.trangThai ? 'Đang bán' : 'Ngừng bán'}
                        </span>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                        <div className="flex gap-2">
                          <button
                            onClick={() => openEditModal(product)}
                            className="text-blue-600 hover:text-blue-900"
                          >
                            <Edit2 className="w-4 h-4" />
                          </button>
                          <button
                            onClick={() => handleDeleteProduct(product._id)}
                            className="text-red-600 hover:text-red-900"
                          >
                            <Trash2 className="w-4 h-4" />
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </div>

        {/* Pagination */}
        {pagination.totalPages > 1 && (
          <div className="mt-6 flex justify-center items-center gap-2">
            <button
              onClick={() => setCurrentPage(prev => Math.max(1, prev - 1))}
              disabled={pagination.page === 1}
              className="px-3 py-2 rounded bg-white border text-gray-700 hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed flex items-center"
            >
              <ChevronLeft className="w-4 h-4" />
            </button>

            {Array.from({ length: pagination.totalPages }, (_, i) => i + 1).map(page => (
              <button
                key={page}
                onClick={() => setCurrentPage(page)}
                className={`px-3 py-2 rounded ${
                  pagination.page === page
                    ? 'bg-blue-600 text-white'
                    : 'bg-white text-gray-700 border hover:bg-gray-50'
                }`}
              >
                {page}
              </button>
            ))}

            <button
              onClick={() => setCurrentPage(prev => Math.min(pagination.totalPages, prev + 1))}
              disabled={pagination.page === pagination.totalPages}
              className="px-3 py-2 rounded bg-white border text-gray-700 hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed flex items-center"
            >
              <ChevronRight className="w-4 h-4" />
            </button>
          </div>
        )}

        {/* Add Product Modal */}
        {showAddModal && (
          <div className="fixed inset-0 bg-gray-600 bg-opacity-50 overflow-y-auto h-full w-full z-50">
            <div className="relative min-h-screen flex items-center justify-center p-4">
              <div className="relative bg-white rounded-lg text-left overflow-hidden shadow-xl max-w-4xl w-full max-h-[90vh] overflow-y-auto">
                <div className="flex justify-between items-center px-6 py-4 border-b">
                  <h3 className="text-lg font-medium text-gray-900">Thêm sản phẩm mới</h3>
                  <button
                    onClick={() => {
                      setShowAddModal(false);
                      resetForm();
                    }}
                    className="text-gray-400 hover:text-gray-600"
                  >
                    <X className="w-6 h-6" />
                  </button>
                </div>

                <div className="px-6 py-4">
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">Tên sản phẩm *</label>
                      <input
                        type="text"
                        value={formData.tenSanPham}
                        onChange={(e) => setFormData(prev => ({ ...prev, tenSanPham: e.target.value }))}
                        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
                        required
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">Giá *</label>
                      <input
                        type="number"
                        value={formData.gia}
                        onChange={(e) => setFormData(prev => ({ ...prev, gia: e.target.value }))}
                        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
                        required
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">Số lượng tồn *</label>
                      <input
                        type="number"
                        value={formData.soLuongTon}
                        onChange={(e) => setFormData(prev => ({ ...prev, soLuongTon: e.target.value }))}
                        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
                        required
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">Danh mục</label>
                      <select
                        value={formData.danhMucId}
                        onChange={(e) => setFormData(prev => ({ ...prev, danhMucId: e.target.value }))}
                        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
                      >
                        <option value="">Chọn danh mục</option>
                        {categories.map(cat => (
                          <option key={cat._id} value={cat._id}>{cat.tenDanhMuc}</option>
                        ))}
                      </select>
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">Thương hiệu (không bắt buộc)</label>
                      <select
                        value={formData.thuongHieuId}
                        onChange={(e) => setFormData(prev => ({ ...prev, thuongHieuId: e.target.value }))}
                        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
                      >
                        <option value="">Chọn thương hiệu</option>
                        {brands.map(brand => (
                          <option key={brand._id} value={brand._id}>{brand.tenThuongHieu}</option>
                        ))}
                      </select>
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">Bộ sưu tập (không bắt buộc)</label>
                      <div className="space-y-2 max-h-40 overflow-y-auto border border-gray-300 rounded-md p-3">
                        {collections.length === 0 ? (
                          <p className="text-sm text-gray-500">Không có bộ sưu tập nào</p>
                        ) : (
                          collections.map(collection => (
                            <label key={collection._id} className="flex items-center space-x-2 cursor-pointer">
                              <input
                                type="checkbox"
                                checked={formData.boSuuTapIds.includes(collection._id)}
                                onChange={(e) => {
                                  if (e.target.checked) {
                                    setFormData(prev => ({ 
                                      ...prev, 
                                      boSuuTapIds: [...prev.boSuuTapIds, collection._id] 
                                    }));
                                  } else {
                                    setFormData(prev => ({ 
                                      ...prev, 
                                      boSuuTapIds: prev.boSuuTapIds.filter(id => id !== collection._id) 
                                    }));
                                  }
                                }}
                                className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                              />
                              <span className="text-sm text-gray-700">{collection.tenBoSuuTap}</span>
                            </label>
                          ))
                        )}
                      </div>
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">Trạng thái</label>
                      <select
                        value={formData.trangThai}
                        onChange={(e) => setFormData(prev => ({ ...prev, trangThai: e.target.value === 'true' }))}
                        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
                      >
                        <option value="true">Đang bán</option>
                        <option value="false">Ngừng bán</option>
                      </select>
                    </div>
                    <div className="flex items-center">
                      <input
                        type="checkbox"
                        id="noiBat"
                        checked={formData.noiBat}
                        onChange={(e) => setFormData(prev => ({ ...prev, noiBat: e.target.checked }))}
                        className="w-4 h-4 text-blue-600 border-gray-300 rounded focus:ring-blue-500"
                      />
                      <label htmlFor="noiBat" className="ml-2 block text-sm font-medium text-gray-700">
                        Nổi bật
                      </label>
                    </div>
                  </div>

                  <div className="mt-4">
                    <label className="block text-sm font-medium text-gray-700 mb-2">Hình ảnh sản phẩm</label>
                    
                    {/* Image URL Input */}
                    <div className="mb-4">
                      <div className="flex gap-2">
                        <input
                          type="text"
                          placeholder="Nhập URL hình ảnh (https://...)"
                          value={formData.imageUrl || ''}
                          onChange={(e) => setFormData(prev => ({ ...prev, imageUrl: e.target.value }))}
                          className="flex-1 px-3 py-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
                        />
                        <button
                          type="button"
                          onClick={handleAddImageUrl}
                          className="px-4 py-2 bg-green-600 text-white rounded-md hover:bg-green-700"
                        >
                          Thêm URL
                        </button>
                      </div>
                    </div>

                    {/* Image Upload */}
                    <div className="mb-4">
                      <label className="flex items-center gap-2 px-4 py-2 border-2 border-dashed border-gray-300 rounded-lg hover:border-gray-400 cursor-pointer">
                        <Upload className="w-5 h-5 text-gray-400" />
                        <span>Hoặc chọn hình ảnh từ máy (tối đa 10 ảnh)</span>
                        <input
                          type="file"
                          multiple
                          accept="image/*"
                          onChange={handleImageUpload}
                          className="hidden"
                        />
                      </label>
                    </div>

                    {/* Image Preview */}
                    {formData.hinhAnh.length > 0 && (
                      <div className="grid grid-cols-5 gap-4">
                        {formData.hinhAnh.map((img, index) => (
                          <div key={index} className="relative group">
                            <img
                              src={img.url}
                              alt={`Preview ${index + 1}`}
                              className="w-full h-32 object-cover rounded-lg"
                            />
                            {img.laAnhChinh && (
                              <div className="absolute top-2 left-2 bg-red-500 text-white text-xs px-2 py-1 rounded">
                                Ảnh chính
                              </div>
                            )}
                            <div className="absolute top-2 right-2 opacity-0 group-hover:opacity-100 transition-opacity">
                              <div className="flex gap-1">
                                <button
                                  onClick={() => setMainImage(index)}
                                  className="p-1 bg-blue-500 text-white rounded hover:bg-blue-600"
                                  title="Đặt làm ảnh chính"
                                >
                                  <Star className="w-3 h-3" />
                                </button>
                                <button
                                  onClick={() => removeImage(index)}
                                  className="p-1 bg-red-500 text-white rounded hover:bg-red-600"
                                  title="Xóa ảnh"
                                >
                                  <X className="w-3 h-3" />
                                </button>
                              </div>
                            </div>
                          </div>
                        ))}
                      </div>
                    )}
                  </div>

                  <div className="mt-4">
                    <label className="block text-sm font-medium text-gray-700 mb-1">Mô tả</label>
                    <textarea
                      value={formData.moTa}
                      onChange={(e) => setFormData(prev => ({ ...prev, moTa: e.target.value }))}
                      rows={4}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
                    />
                  </div>
                </div>

                <div className="flex justify-end px-6 py-4 bg-gray-50 border-t">
                  <button
                    onClick={() => {
                      setShowAddModal(false);
                      resetForm();
                    }}
                    className="mr-3 px-4 py-2 border border-gray-300 rounded-md text-gray-700 hover:bg-gray-50"
                  >
                    Hủy
                  </button>
                  <button
                    onClick={handleAddProduct}
                    className="px-4 py-2 bg-blue-600 border border-transparent rounded-md font-medium text-white hover:bg-blue-700"
                  >
                    Thêm sản phẩm
                  </button>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Edit Product Modal */}
        {showEditModal && selectedProduct && (
          <div className="fixed inset-0 bg-gray-600 bg-opacity-50 overflow-y-auto h-full w-full z-50">
            <div className="relative min-h-screen flex items-center justify-center p-4">
              <div className="relative bg-white rounded-lg text-left overflow-hidden shadow-xl max-w-4xl w-full max-h-[90vh] overflow-y-auto">
                <div className="flex justify-between items-center px-6 py-4 border-b">
                  <h3 className="text-lg font-medium text-gray-900">Cập nhật sản phẩm</h3>
                  <button
                    onClick={() => {
                      setShowEditModal(false);
                      resetForm();
                    }}
                    className="text-gray-400 hover:text-gray-600"
                  >
                    <X className="w-6 h-6" />
                  </button>
                </div>

                <div className="px-6 py-4">
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">Tên sản phẩm *</label>
                      <input
                        type="text"
                        value={formData.tenSanPham}
                        onChange={(e) => setFormData(prev => ({ ...prev, tenSanPham: e.target.value }))}
                        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
                        required
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">Giá *</label>
                      <input
                        type="number"
                        value={formData.gia}
                        onChange={(e) => setFormData(prev => ({ ...prev, gia: e.target.value }))}
                        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
                        required
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">Số lượng tồn *</label>
                      <input
                        type="number"
                        value={formData.soLuongTon}
                        onChange={(e) => setFormData(prev => ({ ...prev, soLuongTon: e.target.value }))}
                        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
                        required
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">Danh mục</label>
                      <select
                        value={formData.danhMucId}
                        onChange={(e) => setFormData(prev => ({ ...prev, danhMucId: e.target.value }))}
                        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
                      >
                        <option value="">Chọn danh mục</option>
                        {categories.map(cat => (
                          <option key={cat._id} value={cat._id}>{cat.tenDanhMuc}</option>
                        ))}
                      </select>
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">Thương hiệu (không bắt buộc)</label>
                      <select
                        value={formData.thuongHieuId}
                        onChange={(e) => setFormData(prev => ({ ...prev, thuongHieuId: e.target.value }))}
                        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
                      >
                        <option value="">Chọn thương hiệu</option>
                        {brands.map(brand => (
                          <option key={brand._id} value={brand._id}>{brand.tenThuongHieu}</option>
                        ))}
                      </select>
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">Bộ sưu tập (không bắt buộc)</label>
                      <div className="space-y-2 max-h-40 overflow-y-auto border border-gray-300 rounded-md p-3">
                        {collections.length === 0 ? (
                          <p className="text-sm text-gray-500">Không có bộ sưu tập nào</p>
                        ) : (
                          collections.map(collection => (
                            <label key={collection._id} className="flex items-center space-x-2 cursor-pointer">
                              <input
                                type="checkbox"
                                checked={formData.boSuuTapIds.includes(collection._id)}
                                onChange={(e) => {
                                  if (e.target.checked) {
                                    setFormData(prev => ({ 
                                      ...prev, 
                                      boSuuTapIds: [...prev.boSuuTapIds, collection._id] 
                                    }));
                                  } else {
                                    setFormData(prev => ({ 
                                      ...prev, 
                                      boSuuTapIds: prev.boSuuTapIds.filter(id => id !== collection._id) 
                                    }));
                                  }
                                }}
                                className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                              />
                              <span className="text-sm text-gray-700">{collection.tenBoSuuTap}</span>
                            </label>
                          ))
                        )}
                      </div>
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">Trạng thái</label>
                      <select
                        value={formData.trangThai}
                        onChange={(e) => setFormData(prev => ({ ...prev, trangThai: e.target.value === 'true' }))}
                        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
                      >
                        <option value="true">Đang bán</option>
                        <option value="false">Ngừng bán</option>
                      </select>
                    </div>
                    <div className="flex items-center">
                      <input
                        type="checkbox"
                        id="noiBat"
                        checked={formData.noiBat}
                        onChange={(e) => setFormData(prev => ({ ...prev, noiBat: e.target.checked }))}
                        className="w-4 h-4 text-blue-600 border-gray-300 rounded focus:ring-blue-500"
                      />
                      <label htmlFor="noiBat" className="ml-2 block text-sm font-medium text-gray-700">
                        Nổi bật
                      </label>
                    </div>
                  </div>

                  <div className="mt-4">
                    <label className="block text-sm font-medium text-gray-700 mb-2">Hình ảnh sản phẩm</label>
                    
                    {/* Image URL Input */}
                    <div className="mb-4">
                      <div className="flex gap-2">
                        <input
                          type="text"
                          placeholder="Nhập URL hình ảnh mới (https://...)"
                          value={formData.imageUrl || ''}
                          onChange={(e) => setFormData(prev => ({ ...prev, imageUrl: e.target.value }))}
                          className="flex-1 px-3 py-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
                        />
                        <button
                          type="button"
                          onClick={handleAddImageUrl}
                          className="px-4 py-2 bg-green-600 text-white rounded-md hover:bg-green-700"
                        >
                          Thêm URL
                        </button>
                      </div>
                    </div>

                    {/* Current Images */}
                    {selectedProduct.hinhAnh && selectedProduct.hinhAnh.length > 0 && (
                      <div className="mb-4">
                        <h4 className="text-sm font-medium text-gray-700 mb-2">Hình ảnh hiện tại:</h4>
                        <div className="grid grid-cols-5 gap-4">
                          {selectedProduct.hinhAnh.map((img, index) => (
                            <div key={index} className="relative group">
                              <img
                                src={img.url || img}
                                alt={`Current ${index + 1}`}
                                className="w-full h-32 object-cover rounded-lg"
                              />
                              {img.laAnhChinh && (
                                <div className="absolute top-2 left-2 bg-red-500 text-white text-xs px-2 py-1 rounded">
                                  Ảnh chính
                                </div>
                              )}
                              <div className="absolute top-2 right-2 opacity-0 group-hover:opacity-100 transition-opacity">
                                <div className="flex gap-1">
                                  <button
                                    onClick={() => setMainImage(index)}
                                    className="p-1 bg-blue-500 text-white rounded hover:bg-blue-600"
                                    title="Đặt làm ảnh chính"
                                  >
                                    <Star className="w-3 h-3" />
                                  </button>
                                  <button
                                    onClick={() => {
                                      if (window.confirm('Bạn có chắc chắn muốn xóa ảnh này?')) {
                                        // Call API to delete image
                                        fetch(`http://localhost:5000/api/products/${selectedProduct._id}/images/${index}`, {
                                          method: 'DELETE',
                                          headers: {
                                            'Authorization': `Bearer ${localStorage.getItem('token')}`
                                          }
                                        }).then(response => response.json())
                                          .then(data => {
                                            if (data.success) {
                                              toast.success('Xóa ảnh thành công!');
                                              // Update local state
                                              const newImages = selectedProduct.hinhAnh.filter((_, i) => i !== index);
                                              if (newImages.length > 0 && img.laAnhChinh) {
                                                newImages[0].laAnhChinh = true;
                                              }
                                              setSelectedProduct(prev => ({
                                                ...prev,
                                                hinhAnh: newImages
                                              }));
                                              setFormData(prev => ({
                                                ...prev,
                                                hinhAnh: newImages
                                              }));
                                            } else {
                                              toast.error(data.message || 'Xóa ảnh thất bại!');
                                            }
                                          })
                                          .catch(error => {
                                            toast.error('Lỗi khi xóa ảnh!');
                                          });
                                      }
                                    }}
                                    className="p-1 bg-red-500 text-white rounded hover:bg-red-600"
                                    title="Xóa ảnh"
                                  >
                                    <X className="w-3 h-3" />
                                  </button>
                                </div>
                              </div>
                            </div>
                          ))}
                        </div>
                      </div>
                    )}

                    {/* New Images Upload */}
                    <div className="mb-4">
                      <label className="flex items-center gap-2 px-4 py-2 border-2 border-dashed border-gray-300 rounded-lg hover:border-gray-400 cursor-pointer">
                        <Upload className="w-5 h-5 text-gray-400" />
                        <span>Thêm hình ảnh mới (tối đa 10 ảnh)</span>
                        <input
                          type="file"
                          multiple
                          accept="image/*"
                          onChange={handleImageUpload}
                          className="hidden"
                        />
                      </label>
                    </div>

                    {/* All Images Preview */}
                    {formData.hinhAnh.length > 0 && (
                      <div className="grid grid-cols-5 gap-4">
                        {formData.hinhAnh.map((img, index) => (
                          <div key={index} className="relative group">
                            <img
                              src={img.url}
                              alt={`Preview ${index + 1}`}
                              className="w-full h-32 object-cover rounded-lg"
                            />
                            {img.laAnhChinh && (
                              <div className="absolute top-2 left-2 bg-red-500 text-white text-xs px-2 py-1 rounded">
                                Ảnh chính
                              </div>
                            )}
                            <div className="absolute top-2 right-2 opacity-0 group-hover:opacity-100 transition-opacity">
                              <div className="flex gap-1">
                                <button
                                  onClick={() => setMainImage(index)}
                                  className="p-1 bg-blue-500 text-white rounded hover:bg-blue-600"
                                  title="Đặt làm ảnh chính"
                                >
                                  <Star className="w-3 h-3" />
                                </button>
                                <button
                                  onClick={() => removeImage(index)}
                                  className="p-1 bg-red-500 text-white rounded hover:bg-red-600"
                                  title="Xóa ảnh"
                                >
                                  <X className="w-3 h-3" />
                                </button>
                              </div>
                            </div>
                          </div>
                        ))}
                      </div>
                    )}
                  </div>

                  <div className="mt-4">
                    <label className="block text-sm font-medium text-gray-700 mb-1">Mô tả</label>
                    <textarea
                      value={formData.moTa}
                      onChange={(e) => setFormData(prev => ({ ...prev, moTa: e.target.value }))}
                      rows={4}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
                    />
                  </div>
                </div>

                <div className="flex justify-end px-6 py-4 bg-gray-50 border-t">
                  <button
                    onClick={() => {
                      setShowEditModal(false);
                      resetForm();
                    }}
                    className="mr-3 px-4 py-2 border border-gray-300 rounded-md text-gray-700 hover:bg-gray-50"
                  >
                    Hủy
                  </button>
                  <button
                    onClick={handleUpdateProduct}
                    className="px-4 py-2 bg-blue-600 border border-transparent rounded-md font-medium text-white hover:bg-blue-700"
                  >
                    Cập nhật sản phẩm
                  </button>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};      

export default ProductManagement;
