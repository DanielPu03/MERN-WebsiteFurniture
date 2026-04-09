const SanPham = require('../models/SanPham');
const DanhMuc = require('../models/DanhMuc');
const ThuongHieu = require('../models/ThuongHieu');
const BoSuuTap = require('../models/BoSuuTap');

const getProducts = async (req, res) => {
  try {
    const {
      page = 1,
      limit = 12,
      category,
      brand,
      collection,
      minPrice,
      maxPrice,
      search,
      sortBy = 'ngayTao',
      sortOrder = 'desc'
    } = req.query;

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

    // Collection filter
    if (collection) {
      const boSuuTap = await BoSuuTap.findOne({ tenBoSuuTap: collection });
      if (boSuuTap) {
        query.boSuuTapId = boSuuTap._id;
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

    const products = await SanPham.find(query)
      .populate('danhMucId', 'tenDanhMuc')
      .populate('thuongHieuId', 'tenThuongHieu')
      .populate('boSuuTapId', 'tenBoSuuTap')
      .sort(sortOptions)
      .limit(limit * 1)
      .skip((page - 1) * limit);

    const total = await SanPham.countDocuments(query);

    res.json({
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
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message
    });
  }
};

const getProductById = async (req, res) => {
  try {
    const product = await SanPham.findById(req.params.id)
      .populate('danhMucId', 'tenDanhMuc')
      .populate('thuongHieuId', 'tenThuongHieu')
      .populate('boSuuTapId', 'tenBoSuuTap');

    if (!product) {
      return res.status(404).json({
        success: false,
        message: 'Product not found'
      });
    }

    res.json({
      success: true,
      data: { product }
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message
    });
  }
};

const createProduct = async (req, res) => {
  try {
    const {
      tenSanPham,
      gia,
      soLuongTon,
      danhMucId,
      thuongHieuId,
      boSuuTapId,
      moTa,
      hinhAnh
    } = req.body;

    // Validate category and brand
    const [danhMuc, thuongHieu] = await Promise.all([
      DanhMuc.findById(danhMucId),
      ThuongHieu.findById(thuongHieuId)
    ]);

    if (!danhMuc) {
      return res.status(400).json({
        success: false,
        message: 'Category not found'
      });
    }

    if (!thuongHieu) {
      return res.status(400).json({
        success: false,
        message: 'Brand not found'
      });
    }

    // Validate collection if provided
    if (boSuuTapId) {
      const boSuuTap = await BoSuuTap.findById(boSuuTapId);
      if (!boSuuTap) {
        return res.status(400).json({
          success: false,
          message: 'Collection not found'
        });
      }
    }

    const product = await SanPham.create({
      tenSanPham,
      gia,
      soLuongTon,
      danhMucId,
      thuongHieuId,
      boSuuTapId,
      moTa,
      hinhAnh
    });

    const populatedProduct = await SanPham.findById(product._id)
      .populate('danhMucId', 'tenDanhMuc')
      .populate('thuongHieuId', 'tenThuongHieu')
      .populate('boSuuTapId', 'tenBoSuuTap');

    res.status(201).json({
      success: true,
      message: 'Product created successfully',
      data: { product: populatedProduct }
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message
    });
  }
};

const updateProduct = async (req, res) => {
  try {
    const product = await SanPham.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true, runValidators: true }
    ).populate('danhMucId', 'tenDanhMuc')
     .populate('thuongHieuId', 'tenThuongHieu')
     .populate('boSuuTapId', 'tenBoSuuTap');

    if (!product) {
      return res.status(404).json({
        success: false,
        message: 'Product not found'
      });
    }

    res.json({
      success: true,
      message: 'Product updated successfully',
      data: { product }
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message
    });
  }
};

// Delete product
const deleteProduct = async (req, res) => {
  try {
    const product = await SanPham.findById(req.params.id);

    if (!product) {
      return res.status(404).json({
        success: false,
        message: 'Product not found'
      });
    }

    await product.deleteOne();

    res.json({
      success: true,
      message: 'Product deleted successfully'
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message
    });
  }
};

// Get all collections
const getProductCollections = async (req, res) => {
  try {
    const collections = await BoSuuTap.find({ trangThai: true })
      .populate('sanPhams', 'tenSanPham gia hinhAnh')
      .sort({ ngayTao: -1 });

    // Add product count to each collection
    const collectionsWithCount = collections.map(collection => ({
      _id: collection._id,
      tenBoSuuTap: collection.tenBoSuuTap,
      moTa: collection.moTa,
      hinhAnh: collection.hinhAnh,
      trangThai: collection.trangThai,
      soLuongSanPham: collection.sanPhams ? collection.sanPhams.length : 0,
      ngayTao: collection.ngayTao,
      ngayCapNhat: collection.ngayCapNhat
    }));

    res.json({
      success: true,
      data: {
        collections: collectionsWithCount
      }
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message
    });
  }
};

const getRelatedProducts = async (req, res) => {
  try {
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
    .populate('boSuuTapId', 'tenBoSuuTap')
    .limit(6);

    res.json({
      success: true,
      data: { products: relatedProducts }
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message
    });
  }
};

module.exports = {
  getProducts,
  getProductById,
  createProduct,
  updateProduct,
  deleteProduct,
  getProductCollections,
  getRelatedProducts
};
