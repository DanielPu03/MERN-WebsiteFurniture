const DonHang = require('../models/DonHang');
const GioHang = require('../models/GioHang');
const SanPham = require('../models/SanPham');

// @desc    Get user's orders
const getOrders = async (req, res) => {
  const { page = 1, limit = 5, status } = req.query;

  // Build query
  const query = { nguoiDungId: req.user._id };
  if (status !== undefined) {
    query.tinhTrang = parseInt(status);
  }

  const orders = await DonHang.find(query)
    .populate('nguoiDungId', 'hoTen email soDienThoai')
    .populate('chiTietDonHang.sanPhamId', 'tenSanPham hinhAnh')
    .sort({ ngayTao: -1 })
    .limit(limit * 1)
    .skip((page - 1) * limit);

  const total = await DonHang.countDocuments(query);

  res.status(200).json({
    success: true,
    data: {
      orders,
      pagination: {
        page: parseInt(page),
        limit: parseInt(limit),
        total,
        pages: Math.ceil(total / limit)
      }
    }
  });
};

// @desc    Get order by ID
const getOrderById = async (req, res) => {
  const order = await DonHang.findById(req.params.id)
    .populate('nguoiDungId', 'hoTen email soDienThoai')
    .populate('chiTietDonHang.sanPhamId', 'tenSanPham hinhAnh moTa');

  if (!order) {
    return res.status(404).json({
      success: false,
      message: 'Order not found'
    });
  }

  // Check if user owns this order
  if (order.nguoiDungId.toString() !== req.user._id.toString() && req.user.role !== 1) {
    return res.status(403).json({
      success: false,
      message: 'Not authorized to view this order'
    });
  }

  res.status(200).json({
    success: true,
    data: { order }
  });
};

// @desc    Create new order (COD)
const createOrder = async (req, res) => {
  const {
    chiTietDonHang,
    diaChiGiaoHang,
    phiVanChuyen = 0
  } = req.body;

  // Get user's cart
  const cart = await GioHang.findOne({ nguoiDungId: req.user._id })
    .populate('danhSachSanPham.sanPhamId', 'tenSanPham gia soLuongTon');

  if (!cart || cart.danhSachSanPham.length === 0) {
    return res.status(400).json({
      success: false,
      message: 'Cart is empty'
    });
  }

  // Validate stock
  for (const item of cart.danhSachSanPham) {
    if (item.sanPhamId.soLuongTon < item.soLuong) {
      return res.status(400).json({
        success: false,
        message: `Insufficient stock for ${item.sanPhamId.tenSanPham}`
      });
    }
  }

  // Calculate total
  const tongTien = cart.tinhTongTien() + phiVanChuyen;

  // Create order
  const order = await DonHang.create({
    nguoiDungId: req.user._id,
    tongTien,
    diaChiGiaoHang,
    phiVanChuyen,
    chiTietDonHang: cart.danhSachSanPham.map(item => ({
      sanPhamId: item.sanPhamId._id,
      soLuong: item.soLuong,
      gia: item.gia
    }))
  });

  // Update product stock
  for (const item of cart.danhSachSanPham) {
    await item.sanPhamId.updateOne({
      $inc: { soLuongTon: -item.soLuong }
    });
  }

  // Clear cart
  cart.danhSachSanPham = [];
  await cart.save();

  // Populate and return order
  const populatedOrder = await DonHang.findById(order._id)
    .populate('chiTietDonHang.sanPhamId', 'tenSanPham hinhAnh moTa');

  res.status(201).json({
    success: true,
    message: 'Order created successfully',
    data: { order: populatedOrder }
  });
};

// @desc    Cancel order
const cancelOrder = async (req, res) => {
  const order = await DonHang.findById(req.params.id);

  if (!order) {
    return res.status(404).json({
      success: false,
      message: 'Order not found'
    });
  }

  // Check if user owns this order
  if (order.nguoiDungId.toString() !== req.user._id.toString()) {
    return res.status(403).json({
      success: false,
      message: 'Not authorized to cancel this order'
    });
  }

  // Check if order can be cancelled
  if (order.tinhTrang > 0) {
    return res.status(400).json({
      success: false,
      message: 'Order cannot be cancelled'
    });
  }

  // Restore product stock
  for (const item of order.chiTietDonHang) {
    await SanPham.findByIdAndUpdate(item.sanPhamId, {
      $inc: { soLuongTon: item.soLuong }
    });
  }

  // Update order status
  order.tinhTrang = 4; // Cancelled
  await order.save();

  res.status(200).json({
    success: true,
    message: 'Order cancelled successfully',
    data: { order }
  });
};

// @desc    Update order status (admin only)
const updateOrderStatus = async (req, res) => {
  const { tinhTrang } = req.body;

  const order = await DonHang.findById(req.params.id);

  if (!order) {
    return res.status(404).json({
      success: false,
      message: 'Order not found'
    });
  }

  // Update order status
  order.tinhTrang = tinhTrang;
  await order.save();

  // Populate and return order
  const populatedOrder = await DonHang.findById(order._id)
    .populate('chiTietDonHang.sanPhamId', 'tenSanPham hinhAnh moTa');

  res.status(200).json({
    success: true,
    message: 'Order status updated successfully',
    data: { order: populatedOrder }
  });
};

// @desc    Get all orders (admin only)
const getAllOrders = async (req, res) => {
  const { page = 1, limit = 10, status, search } = req.query;

  // Build query
  const query = {};
  if (status !== undefined) {
    query.tinhTrang = parseInt(status);
  }
  if (search) {
    // Search by order ID or customer info
    query.$or = [
      { _id: search },
      { diaChiGiaoHang: { $regex: search, $options: 'i' } }
    ];
  }

  const orders = await DonHang.find(query)
    .populate('nguoiDungId', 'hoTen email soDienThoai')
    .populate('chiTietDonHang.sanPhamId', 'tenSanPham hinhAnh')
    .sort({ ngayTao: -1 })
    .limit(limit * 1)
    .skip((page - 1) * limit);

  const total = await DonHang.countDocuments(query);

  res.status(200).json({
    success: true,
    data: {
      orders,
      pagination: {
        page: parseInt(page),
        limit: parseInt(limit),
        total,
        pages: Math.ceil(total / limit)
      }
    }
  });
};

module.exports = {
  getOrders,
  getOrderById,
  createOrder,
  cancelOrder,
  updateOrderStatus,
  getAllOrders
};
