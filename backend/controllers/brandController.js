const ThuongHieu = require('../models/ThuongHieu');

// Get all brands
const getAllBrands = async (req, res) => {
  const brands = await ThuongHieu.find().sort({ ngayTao: 1 });

  res.status(200).json({
    success: true,
    data: { brands }
  });
};

// Get brand by ID
const getBrandById = async (req, res) => {
  const brand = await ThuongHieu.findById(req.params.id);
  
  if (!brand) {
    return res.status(404).json({
      success: false,
      message: 'Brand not found'
    });
  }

  res.status(200).json({
    success: true,
    data: { brand }
  });
};

// Create brand (admin only)
const createBrand = async (req, res) => {
  const { tenThuongHieu, moTa, logo } = req.body;

  const brand = await ThuongHieu.create({
    tenThuongHieu,
    moTa,
    logo
  });

  res.status(201).json({
    success: true,
    message: 'Brand created successfully',
    data: { brand }
  });
};

// Update brand (admin only)
const updateBrand = async (req, res) => {
  const { tenThuongHieu, moTa, logo } = req.body;

  const brand = await ThuongHieu.findByIdAndUpdate(
    req.params.id,
    { tenThuongHieu, moTa, logo },
    { new: true, runValidators: true }
  );

  if (!brand) {
    return res.status(404).json({
      success: false,
      message: 'Brand not found'
    });
  }

  res.status(200).json({
    success: true,
    message: 'Brand updated successfully',
    data: { brand }
  });
};

// Delete brand (admin only)
const deleteBrand = async (req, res) => {
  const brand = await ThuongHieu.findById(req.params.id);
  
  if (!brand) {
    return res.status(404).json({
      success: false,
      message: 'Brand not found'
    });
  }

  await brand.deleteOne();

  res.status(200).json({
    success: true,
    message: 'Brand deleted successfully'
  });
};

module.exports = {
  getAllBrands,
  getBrandById,
  createBrand,
  updateBrand,
  deleteBrand
};
