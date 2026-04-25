const Wishlist = require('../models/Wishlist');
const SanPham = require('../models/SanPham');
const User = require('../models/User');

// Get user's wishlist
const getWishlist = async (req, res) => {
  try {
    let wishlist = await Wishlist.findOne({ nguoiDungId: req.user._id })
      .populate('danhSachSanPham.sanPhamId', 'tenSanPham gia hinhAnh soLuongTon trangThai');

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
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message
    });
  }
};

// Get all wishlists (admin)
const getAllWishlists = async (req, res) => {
  try {
    const { search } = req.query;
    
    const wishlists = await Wishlist.find()
      .populate('nguoiDungId', 'hoTen email')
      .populate('danhSachSanPham.sanPhamId', 'tenSanPham gia hinhAnh soLuongTon trangThai');

    // Flatten wishlist items for easier display
    const flattenedWishlists = [];
    for (const wishlist of wishlists) {
      if (wishlist.danhSachSanPham && wishlist.danhSachSanPham.length > 0) {
        for (const item of wishlist.danhSachSanPham) {
          try {
            if (item.sanPhamId && item.sanPhamId.tenSanPham) {
              // Filter by search if provided
              if (search && !item.sanPhamId.tenSanPham.toLowerCase().includes(search.toLowerCase())) {
                continue;
              }
              
              flattenedWishlists.push({
                _id: `${wishlist._id}_${item.sanPhamId._id}`,
                wishlistId: wishlist._id,
                nguoiDungId: wishlist.nguoiDungId,
                sanPhamId: item.sanPhamId,
                ngayThem: item.ngayThem
              });
            }
          } catch (err) {
            console.error('Error processing wishlist item:', err);
          }
        }
      }
    }

    res.status(200).json({
      success: true,
      data: flattenedWishlists
    });
  } catch (error) {
    console.error('Error in getAllWishlists:', error);
    res.status(500).json({
      success: false,
      message: error.message
    });
  }
};

// Add product to wishlist
const addToWishlist = async (req, res) => {
  try {
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
      .populate('danhSachSanPham.sanPhamId', 'tenSanPham gia hinhAnh soLuongTon trangThai');

    res.status(200).json({
      success: true,
      message: 'Product added to wishlist successfully',
      data: { wishlist: populatedWishlist }
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message
    });
  }
};

// Remove product from wishlist
const removeFromWishlist = async (req, res) => {
  try {
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
      .populate('danhSachSanPham.sanPhamId', 'tenSanPham gia hinhAnh soLuongTon trangThai');

    res.status(200).json({
      success: true,
      message: 'Product removed from wishlist successfully',
      data: { wishlist: populatedWishlist }
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message
    });
  }
};

// Remove product from any user's wishlist (admin)
const removeFromWishlistAdmin = async (req, res) => {
  try {
    const { wishlistId, sanPhamId } = req.params;

    const wishlist = await Wishlist.findById(wishlistId);
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

    res.status(200).json({
      success: true,
      message: 'Product removed from wishlist successfully'
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message
    });
  }
};

// Check if product in wishlist
const checkProductInWishlist = async (req, res) => {
  try {
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
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message
    });
  }
};

// Clear wishlist
const clearWishlist = async (req, res) => {
  try {
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
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message
    });
  }
};

module.exports = {
  getWishlist,
  getAllWishlists,
  addToWishlist,
  removeFromWishlist,
  removeFromWishlistAdmin,
  checkProductInWishlist,
  clearWishlist
};
