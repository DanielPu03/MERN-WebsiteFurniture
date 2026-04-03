const SanPham = require('../models/SanPham');
const DanhMuc = require('../models/DanhMuc');
const ThuongHieu = require('../models/ThuongHieu');

// @desc    Get all products with filters
const getProducts = async (req, res) => {
  const {
    page = 1,
    limit = 12,
    category,
    brand,
    minPrice,
    maxPrice,
    search,
    sortBy = 'ngayTao',
    sortOrder = 'desc'
  } = req.query;

  // Build query
  const query = { trangThai: true };

  // Category filter
  if (category) {
    const danhMuc = await DanhMuc.findOne({ tenDanhMuc: category });
    if (danhMuc) {
      query.danhMucId = danhMuc._id;
    }
  }

  // Brand filter
  if (brand) {
    const thuongHieu = await ThuongHieu.findOne({ tenThuongHieu: brand });
    if (thuongHieu) {
      query.thuongHieuId = thuongHieu._id;
    }
  }

  // Price filter
  if (minPrice || maxPrice) {
    query.gia = {};
    if (minPrice) query.gia.$gte = parseFloat(minPrice);
    if (maxPrice) query.gia.$lte = parseFloat(maxPrice);
  }

  // Search filter
  if (search) {
    query.$text = { $search: search };
  }

  // Sort options
  const sortOptions = {};
  if (sortBy === 'gia') {
    sortOptions.gia = sortOrder === 'asc' ? 1 : -1;
  } else if (sortBy === 'danhGia') {
    sortOptions.danhGiaTrungBinh = sortOrder === 'asc' ? 1 : -1;
  } else if (sortBy === 'tenSanPham') {
    sortOptions.tenSanPham = sortOrder === 'asc' ? 1 : -1;
  } else {
    sortOptions.ngayTao = sortOrder === 'asc' ? 1 : -1;
  }

  // Execute query with pagination
  const products = await SanPham.find(query)
    .populate('danhMucId', 'tenDanhMuc')
    .populate('thuongHieuId', 'tenThuongHieu')
    .sort(sortOptions)
    .limit(limit * 1)
    .skip((page - 1) * limit);

  const total = await SanPham.countDocuments(query);

  res.status(200).json({
    success: true,
    data: {
      products,
      pagination: {
        page: parseInt(page),
        limit: parseInt(limit),
        total,
        pages: Math.ceil(total / limit)
      }
    }
  });
};

// @desc    Get product by ID
const getProductById = async (req, res) => {
  const product = await SanPham.findById(req.params.id)
    .populate('danhMucId', 'tenDanhMuc')
    .populate('thuongHieuId', 'tenThuongHieu');

  if (!product) {
    return res.status(404).json({
      success: false,
      message: 'Product not found'
    });
  }

  res.status(200).json({
    success: true,
    data: { product }
  });
};

// @desc    Create new product
const createProduct = async (req, res) => {
  const {
    tenSanPham,
    gia,
    soLuongTon,
    danhMucId,
    thuongHieuId,
    moTa,
    hinhAnh
  } = req.body;

  // Check if category and brand exist
  const danhMuc = await DanhMuc.findById(danhMucId);
  if (!danhMuc) {
    return res.status(400).json({
      success: false,
      message: 'Category not found'
    });
  }

  const thuongHieu = await ThuongHieu.findById(thuongHieuId);
  if (!thuongHieu) {
    return res.status(400).json({
      success: false,
      message: 'Brand not found'
    });
  }

  const product = await SanPham.create({
    tenSanPham,
    gia,
    soLuongTon,
    danhMucId,
    thuongHieuId,
    moTa,
    hinhAnh
  });

  const populatedProduct = await SanPham.findById(product._id)
    .populate('danhMucId', 'tenDanhMuc')
    .populate('thuongHieuId', 'tenThuongHieu');

  res.status(201).json({
    success: true,
    message: 'Product created successfully',
    data: { product: populatedProduct }
  });
};

// @desc    Update product
const updateProduct = async (req, res) => {
  const product = await SanPham.findByIdAndUpdate(
    req.params.id,
    req.body,
    { new: true, runValidators: true }
  ).populate('danhMucId', 'tenDanhMuc')
   .populate('thuongHieuId', 'tenThuongHieu');

  if (!product) {
    return res.status(404).json({
      success: false,
      message: 'Product not found'
    });
  }

  res.status(200).json({
    success: true,
    message: 'Product updated successfully',
    data: { product }
  });
};

// @desc    Delete product
const deleteProduct = async (req, res) => {
  const product = await SanPham.findById(req.params.id);

  if (!product) {
    return res.status(404).json({
      success: false,
      message: 'Product not found'
    });
  }

  await product.deleteOne();

  res.status(200).json({
    success: true,
    message: 'Product deleted successfully'
  });
};

// @desc    Get related products
const getRelatedProducts = async (req, res) => {
  const product = await SanPham.findById(req.params.id);
  
  if (!product) {
    return res.status(404).json({
      success: false,
      message: 'Product not found'
    });
  }

  const relatedProducts = await SanPham.find({
    _id: { $ne: req.params.id },
    danhMucId: product.danhMucId,
    trangThai: true
  })
  .populate('danhMucId', 'tenDanhMuc')
  .populate('thuongHieuId', 'tenThuongHieu')
  .limit(6);

  res.status(200).json({
    success: true,
    data: { products: relatedProducts }
  });
};

module.exports = {
  getProducts,
  getProductById,
  createProduct,
  updateProduct,
  deleteProduct,
  getRelatedProducts
};
