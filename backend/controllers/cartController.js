const GioHang = require('../models/GioHang');
const SanPham = require('../models/SanPham');

//    Get user's cart
const getCart = async (req, res) => {
  let cart = await GioHang.findOne({ nguoiDungId: req.user._id })
    .populate('danhSachSanPham.sanPhamId', 'tenSanPham gia hinhAnh soLuongTon trangThai');

  if (!cart) {
    cart = await GioHang.create({
      nguoiDungId: req.user._id,
      danhSachSanPham: []
    });
  }

  res.status(200).json({
    success: true,
    data: { cart }
  });
};

//    Add item to cart
const addToCart = async (req, res) => {
  try {
    const { sanPhamId, soLuong } = req.body;

    // Validate product
    const product = await SanPham.findById(sanPhamId);
    if (!product) {
      return res.status(404).json({
        success: false,
        message: 'Product not found'
      });
    }

    if (!product.trangThai) {
      return res.status(400).json({
        success: false,
        message: 'Product is not available'
      });
    }

    if (product.soLuongTon < soLuong) {
      return res.status(400).json({
        success: false,
        message: 'Insufficient stock'
      });
    }

    // Get or create cart
    let cart = await GioHang.findOne({ nguoiDungId: req.user._id });
  if (!cart) {
    cart = await GioHang.create({
      nguoiDungId: req.user._id,
      danhSachSanPham: []
    });
  }

  // Check if product already in cart
  const existingItem = cart.danhSachSanPham.find(
    item => item.sanPhamId.toString() === sanPhamId
  );

  if (existingItem) {
    // Update quantity
    const newQuantity = existingItem.soLuong + soLuong;
    if (newQuantity > product.soLuongTon) {
      return res.status(400).json({
        success: false,
        message: 'Insufficient stock'
      });
    }
    existingItem.soLuong = newQuantity;
  } else {
    // Add new item
    cart.danhSachSanPham.push({
      sanPhamId,
      soLuong,
      gia: product.gia
    });
  }

  await cart.save();

  // Populate and return updated cart
  const populatedCart = await GioHang.findById(cart._id)
    .populate('danhSachSanPham.sanPhamId', 'tenSanPham gia hinhAnh soLuongTon trangThai');

  res.status(200).json({
    success: true,
    message: 'Item added to cart successfully',
    data: { cart: populatedCart }
  });
  } catch (error) {
    console.error('Error in addToCart:', error);
    res.status(500).json({
      success: false,
      message: error.message || 'Error adding item to cart'
    });
  }
};

//    Update cart item quantity
const updateCartItem = async (req, res) => {
  const { sanPhamId, soLuong } = req.body;

  const cart = await GioHang.findOne({ nguoiDungId: req.user._id });
  if (!cart) {
    return res.status(404).json({
      success: false,
      message: 'Cart not found'
    });
  }

  const itemIndex = cart.danhSachSanPham.findIndex(
    item => item.sanPhamId.toString() === sanPhamId
  );

  if (itemIndex === -1) {
    return res.status(404).json({
      success: false,
      message: 'Item not found in cart'
    });
  }

  // Validate stock
  const product = await SanPham.findById(sanPhamId);
  if (product.soLuongTon < soLuong) {
    return res.status(400).json({
      success: false,
      message: 'Insufficient stock'
    });
  }

  if (soLuong === 0) {
    // Remove item
    cart.danhSachSanPham.splice(itemIndex, 1);
  } else {
    // Update quantity
    cart.danhSachSanPham[itemIndex].soLuong = soLuong;
  }

  await cart.save();

  // Populate and return updated cart
  const populatedCart = await GioHang.findById(cart._id)
    .populate('danhSachSanPham.sanPhamId', 'tenSanPham gia hinhAnh soLuongTon trangThai');

  res.status(200).json({
    success: true,
    message: 'Cart updated successfully',
    data: { cart: populatedCart }
  });
};

//    Remove item from cart
const removeFromCart = async (req, res) => {
  const { sanPhamId } = req.params;

  const cart = await GioHang.findOne({ nguoiDungId: req.user._id });
  if (!cart) {
    return res.status(404).json({
      success: false,
      message: 'Cart not found'
    });
  }

  cart.danhSachSanPham = cart.danhSachSanPham.filter(
    item => item.sanPhamId.toString() !== sanPhamId
  );

  await cart.save();

  // Populate and return updated cart
  const populatedCart = await GioHang.findById(cart._id)
    .populate('danhSachSanPham.sanPhamId', 'tenSanPham gia hinhAnh soLuongTon trangThai');

  res.status(200).json({
    success: true,
    message: 'Item removed from cart successfully',
    data: { cart: populatedCart }
  });
};

//  Clear cart
const clearCart = async (req, res) => {
  const cart = await GioHang.findOne({ nguoiDungId: req.user._id });
  if (!cart) {
    return res.status(404).json({
      success: false,
      message: 'Cart not found'
    });
  }

  cart.danhSachSanPham = [];
  await cart.save();

  res.status(200).json({
    success: true,
    message: 'Cart cleared successfully',
    data: { cart }
  });
};

//    Get cart summary
const getCartSummary = async (req, res) => {
  const cart = await GioHang.findOne({ nguoiDungId: req.user._id })
    .populate('danhSachSanPham.sanPhamId', 'tenSanPham gia hinhAnh soLuongTon trangThai');

  if (!cart || cart.danhSachSanPham.length === 0) {
    return res.status(200).json({
      success: true,
      data: {
        totalItems: 0,
        totalPrice: 0,
        items: []
      }
    });
  }

  const totalItems = cart.danhSachSanPham.reduce((total, item) => total + item.soLuong, 0);
  const totalPrice = cart.tinhTongTien();

  res.status(200).json({
    success: true,
    data: {
      totalItems,
      totalPrice,
      items: cart.danhSachSanPham
    }
  });
};

module.exports = {
  getCart,
  addToCart,
  updateCartItem,
  removeFromCart,
  clearCart,
  getCartSummary
};
