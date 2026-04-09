const DanhMuc = require('../models/DanhMuc');
const SanPham = require('../models/SanPham');

// Get all categories
const getAllCategories = async (req, res) => {
  const categories = await DanhMuc.find().sort({ ngayTao: 1 });

  res.status(200).json({
    success: true,
    data: { categories }
  });
};

// Get category by ID
const getCategoryById = async (req, res) => {
  const category = await DanhMuc.findById(req.params.id);
  
  if (!category) {
    return res.status(404).json({
      success: false,
      message: 'Category not found'
    });
  }

  res.status(200).json({
    success: true,
    data: { category }
  });
};

// Get products by category
const getProductsByCategory = async (req, res) => {
  try {
    const { id } = req.params;
    const { limit = 4, exclude } = req.query;

    // Verify category exists
    const category = await DanhMuc.findById(id);
    if (!category) {
      return res.status(404).json({
        success: false,
        message: 'Category not found'
      });
    }

    // Build query
    const query = { 
      danhMucId: id,
      trangThai: true 
    };

    // Exclude specific product if provided
    if (exclude) {
      query._id = { $ne: exclude };
    }

    const products = await SanPham.find(query)
      .populate('danhMucId', 'tenDanhMuc')
      .populate('thuongHieuId', 'tenThuongHieu')
      .limit(parseInt(limit))
      .sort({ ngayTao: -1 });

    res.status(200).json({
      success: true,
      data: { products }
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message
    });
  }
};

// Create category (admin only)
const createCategory = async (req, res) => {
  const { tenDanhMuc, moTa, icon } = req.body;

  const category = await DanhMuc.create({
    tenDanhMuc,
    moTa,
    icon
  });

  res.status(201).json({
    success: true,
    message: 'Category created successfully',
    data: { category }
  });
};

// Update category (admin only)
const updateCategory = async (req, res) => {
  const { tenDanhMuc, moTa, icon } = req.body;

  const category = await DanhMuc.findByIdAndUpdate(
    req.params.id,
    { tenDanhMuc, moTa, icon },
    { new: true, runValidators: true }
  );

  if (!category) {
    return res.status(404).json({
      success: false,
      message: 'Category not found'
    });
  }

  res.status(200).json({
    success: true,
    message: 'Category updated successfully',
    data: { category }
  });
};

// Delete category (admin only)
const deleteCategory = async (req, res) => {
  const category = await DanhMuc.findById(req.params.id);
  
  if (!category) {
    return res.status(404).json({
      success: false,
      message: 'Category not found'
    });
  }

  await category.deleteOne();

  res.status(200).json({
    success: true,
    message: 'Category deleted successfully'
  });
};

module.exports = {
  getAllCategories,
  getCategoryById,
  getProductsByCategory,
  createCategory,
  updateCategory,
  deleteCategory
};
