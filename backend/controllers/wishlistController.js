const Wishlist = require('../models/Wishlist');
const SanPham = require('../models/SanPham');

// Get user's wishlist
const getWishlist = async (req, res) => {
  let wishlist = await Wishlist.findOne({ nguoiDungId: req.user._id })
    .populate('danhSachSanPham.sanPhamId', 'tenSanPham gia hinhAnh soLuongTon');

  if (!wishlist) {
    wishlist = await Wishlist.create({
      nguoiDungId: req.user._id,
      danhSachSanPham: []
    });
  }

  res.status(200).json({
    success: true,
    data: { wishlist }
  });
};

// Add product to wishlist
const addToWishlist = async (req, res) => {
  const { sanPhamId } = req.body;
  const userId = req.user._id;

  // Check if product exists
  const product = await SanPham.findById(sanPhamId);
  if (!product) {
    return res.status(404).json({
      success: false,
      message: 'Product not found'
    });
  }

  // Get or create wishlist
  let wishlist = await Wishlist.findOne({ nguoiDungId: userId });
  if (!wishlist) {
    wishlist = await Wishlist.create({
      nguoiDungId: userId,
      danhSachSanPham: []
    });
  }

  // Check if product already in wishlist
  const exists = wishlist.danhSachSanPham.some(
    item => item.sanPhamId.toString() === sanPhamId
  );

  if (exists) {
    return res.status(400).json({
      success: false,
      message: 'Product already in wishlist'
    });
  }

  // Add product to wishlist
  wishlist.danhSachSanPham.push({
    sanPhamId,
    ngayThem: new Date()
  });

  await wishlist.save();

  // Populate and return updated wishlist
  const populatedWishlist = await Wishlist.findById(wishlist._id)
    .populate('danhSachSanPham.sanPhamId', 'tenSanPham gia hinhAnh soLuongTon');

  res.status(200).json({
    success: true,
    message: 'Product added to wishlist successfully',
    data: { wishlist: populatedWishlist }
  });
};

// Remove product from wishlist
const removeFromWishlist = async (req, res) => {
  const { sanPhamId } = req.params;
  const userId = req.user._id;

  const wishlist = await Wishlist.findOne({ nguoiDungId: userId });
  if (!wishlist) {
    return res.status(404).json({
      success: false,
      message: 'Wishlist not found'
    });
  }

  // Remove product from wishlist
  wishlist.danhSachSanPham = wishlist.danhSachSanPham.filter(
    item => item.sanPhamId.toString() !== sanPhamId
  );

  await wishlist.save();

  // Populate and return updated wishlist
  const populatedWishlist = await Wishlist.findById(wishlist._id)
    .populate('danhSachSanPham.sanPhamId', 'tenSanPham gia hinhAnh soLuongTon');

  res.status(200).json({
    success: true,
    message: 'Product removed from wishlist successfully',
    data: { wishlist: populatedWishlist }
  });
};

// Check if product in wishlist
const checkProductInWishlist = async (req, res) => {
  const { sanPhamId } = req.params;
  const userId = req.user._id;

  const wishlist = await Wishlist.findOne({ nguoiDungId: userId });
  if (!wishlist) {
    return res.status(200).json({
      success: true,
      data: { inWishlist: false }
    });
  }

  const inWishlist = wishlist.danhSachSanPham.some(
    item => item.sanPhamId.toString() === sanPhamId
  );

  res.status(200).json({
    success: true,
    data: { inWishlist }
  });
};

// Clear wishlist
const clearWishlist = async (req, res) => {
  const wishlist = await Wishlist.findOne({ nguoiDungId: req.user._id });
  
  if (!wishlist) {
    return res.status(404).json({
      success: false,
      message: 'Wishlist not found'
    });
  }

  wishlist.danhSachSanPham = [];
  await wishlist.save();

  res.status(200).json({
    success: true,
    message: 'Wishlist cleared successfully',
    data: { wishlist }
  });
};

module.exports = {
  getWishlist,
  addToWishlist,
  removeFromWishlist,
  checkProductInWishlist,
  clearWishlist
};
