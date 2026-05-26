import React, { useState, useEffect } from 'react';
import { Plus } from 'lucide-react';
import toast from 'react-hot-toast';
import ProductTable from '../components/ProductTable';
import ProductModal from '../components/ProductModal';
import SearchFilter from '../../../shared/components/SearchFilter';
import Pagination from '../../../shared/components/Pagination';

const ProductManagement = () => {
  const [products, setProducts] = useState([]);
  const [categories, setCategories] = useState([]);
  const [collections, setCollections] = useState([]);
  const [loading, setLoading] = useState(false);
  const [saving, setSaving] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [currentPage, setCurrentPage] = useState(1);
  const [pagination, setPagination] = useState({ page: 1, limit: 10, total: 0, totalPages: 0 });
  const [showModal, setShowModal] = useState(false);
  const [isEdit, setIsEdit] = useState(false);
  const [selectedProduct, setSelectedProduct] = useState(null);
  const [formData, setFormData] = useState({
    tenSanPham: '',
    gia: '',
    soLuongTon: '',
    danhMucId: '',
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
    loadCollections();
  }, [currentPage, searchTerm, statusFilter]);

  const loadProducts = async () => {
    try {
      setLoading(true);
      let url = `https://mern-websitefurniture.onrender.com/api/products?page=${currentPage}&limit=10&search=${searchTerm}&admin=true`;
      
      // Filter by status if admin wants to
      if (statusFilter !== 'all') {
        const trangThaiValue = statusFilter === 'active' ? 'true' : 'false';
        url += `&trangThai=${trangThaiValue}`;
      }
      
      const response = await fetch(url, {
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
      const response = await fetch('https://mern-websitefurniture.onrender.com/api/categories', {
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

  const loadCollections = async () => {
    try {
      const response = await fetch('https://mern-websitefurniture.onrender.com/api/collections', {
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
      setSaving(true);
      // Separate file images and URL images
      const fileImages = formData.hinhAnh.filter(img => img.file);
      const urlImages = formData.hinhAnh.filter(img => !img.file);
      
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

      const response = await fetch('https://mern-websitefurniture.onrender.com/api/products', {
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
        setShowModal(false);
        resetForm();
        loadProducts();

        // Upload file images if any
        if (fileImages.length > 0) {
          await uploadProductImages(data.data.product._id, fileImages);
        }
      } else {
        toast.error(data.message || 'Thêm sản phẩm thất bại!');
      }
    } catch (error) {
      toast.error('Lỗi khi thêm sản phẩm!');
    } finally {
      setSaving(false);
    }
  };

  const handleUpdateProduct = async () => {
    try {
      setSaving(true);
      const fileImages = formData.hinhAnh.filter(img => img.file);
      const urlImages = formData.hinhAnh.filter(img => !img.file);
      
      const allImages = urlImages.map(img => ({ url: img.url, laAnhChinh: img.laAnhChinh }));
      
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

      const response = await fetch(`https://mern-websitefurniture.onrender.com/api/products/${selectedProduct._id}`, {
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
        setShowModal(false);
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
    } finally {
      setSaving(false);
    }
  };

  const handleDeleteProduct = async (productId) => {
    if (!window.confirm('Bạn có chắc chắn muốn xóa sản phẩm này?')) return;

    try {
      const response = await fetch(`https://mern-websitefurniture.onrender.com/api/products/${productId}`, {
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
      const response = await fetch(`https://mern-websitefurniture.onrender.com/api/products/${productId}`, {
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

  const handleToggleStatus = async (productId, currentStatus) => {
    try {
      const response = await fetch(`https://mern-websitefurniture.onrender.com/api/products/${productId}/status`, {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${localStorage.getItem('token')}`
        },
        body: JSON.stringify({ trangThai: !currentStatus })
      });

      const data = await response.json();
      if (data.success) {
        toast.success(!currentStatus ? 'Đã bật bán sản phẩm!' : 'Đã ngừng bán sản phẩm!');
        loadProducts();
      } else {
        toast.error(data.message || 'Cập nhật trạng thái thất bại!');
      }
    } catch (error) {
      toast.error('Lỗi khi cập nhật trạng thái!');
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
      const response = await fetch(`https://mern-websitefurniture.onrender.com/api/products/${productId}/images`, {
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
    setIsEdit(true);
    setShowModal(true);
  };

  const openAddModal = () => {
    resetForm();
    setIsEdit(false);
    setShowModal(true);
  };

  const handleSave = () => {
    if (isEdit) {
      handleUpdateProduct();
    } else {
      handleAddProduct();
    }
  };

  const handleCloseModal = () => {
    setShowModal(false);
    resetForm();
  };

  const statusFilterOptions = [
    { value: 'all', label: 'Tất cả trạng thái' },
    { value: 'active', label: 'Đang bán' },
    { value: 'inactive', label: 'Ngừng bán' }
  ];

  return (
    <div className="p-6">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="flex justify-between items-center mb-6">
          <h1 className="text-2xl font-bold text-gray-900">Quản lý sản phẩm</h1>
          <button
            onClick={openAddModal}
            className="flex items-center gap-2 bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors"
          >
            <Plus className="w-4 h-4" />
            Thêm sản phẩm
          </button>
        </div>

        {/* Search and Filter */}
        <SearchFilter
          searchTerm={searchTerm}
          onSearchChange={setSearchTerm}
          filterOptions={statusFilterOptions}
          filterValue={statusFilter}
          onFilterChange={setStatusFilter}
          placeholder="Tìm kiếm sản phẩm..."
        />

        {/* Products Table */}
        <div className="bg-white rounded-lg shadow overflow-hidden">
          {loading ? (
            <div className="flex justify-center items-center py-12">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
            </div>
          ) : products.length === 0 ? (
            <div className="text-center py-12">
              <p className="text-gray-500">Không có sản phẩm nào</p>
            </div>
          ) : (
            <ProductTable
              products={products}
              onEdit={openEditModal}
              onDelete={handleDeleteProduct}
              onToggleStatus={handleToggleStatus}
            />
          )}
        </div>

        {/* Pagination */}
        <Pagination
          currentPage={pagination.page}
          totalPages={pagination.totalPages}
          onPageChange={setCurrentPage}
        />

        {/* Product Modal */}
        <ProductModal
          isOpen={showModal}
          onClose={handleCloseModal}
          onSave={handleSave}
          formData={formData}
          setFormData={setFormData}
          categories={categories}
          collections={collections}
          isEdit={isEdit}
          loading={saving}
        />
      </div>
    </div>
  );
};

export default ProductManagement;
