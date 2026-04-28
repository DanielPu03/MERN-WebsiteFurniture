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
  try {
    const {
      chiTietDonHang,
      diaChiGiaoHang,
      phiVanChuyen = 0,
      ghiChu = '',
      nguoiDungId,
      phuongThucThanhToan = 'COD'
    } = req.body;

    console.log('=== CREATE ORDER REQUEST ===');
    console.log('Request body:', JSON.stringify(req.body, null, 2));
    console.log('User:', req.user);
    console.log('chiTietDonHang:', chiTietDonHang);
    console.log('phuongThucThanhToan:', phuongThucThanhToan);
    console.log('Check condition - chiTietDonHang exists:', !!chiTietDonHang);
    console.log('Check condition - chiTietDonHang.length:', chiTietDonHang?.length);

    // If chiTietDonHang is provided (from checkout), use it directly
    if (chiTietDonHang && chiTietDonHang.length > 0) {
      console.log('ENTERED chiTietDonHang block');
      console.log('Starting stock validation for', chiTietDonHang.length, 'items');
      // Validate stock for each item
      for (const item of chiTietDonHang) {
        console.log('Looking up product:', item.sanPhamId);
        const product = await SanPham.findById(item.sanPhamId);
        console.log('Product found:', product ? product.tenSanPham : 'NOT FOUND');
        if (!product) {
          return res.status(400).json({
            success: false,
            message: `Product not found: ${item.sanPhamId}`
          });
        }
        if (product.soLuongTon < item.soLuong) {
          return res.status(400).json({
            success: false,
            message: `Insufficient stock for ${product.tenSanPham}`
          });
        }
      }

      console.log('Stock validation passed');

      // Calculate total
      const tongTien = chiTietDonHang.reduce((total, item) => {
        return total + (item.gia * item.soLuong);
      }, 0) + phiVanChuyen;

      console.log('Calculating total:', tongTien);
      console.log('About to create order with data:', {
        nguoiDungId: req.user._id,
        tongTien,
        diaChiGiaoHang,
        phiVanChuyen,
        ghiChu,
        chiTietDonHang,
        phuongThucThanhToan
      });

      // Create order
      const order = await DonHang.create({
        nguoiDungId: req.user._id,
        tongTien,
        diaChiGiaoHang,
        phiVanChuyen,
        ghiChu,
        chiTietDonHang,
        phuongThucThanhToan
      });

      console.log('Order created successfully:', order._id);

      // Update product stock
      for (const item of chiTietDonHang) {
        await SanPham.findByIdAndUpdate(item.sanPhamId, {
          $inc: { soLuongTon: -item.soLuong }
        });
      }

      // Clear user's cart
      await GioHang.findOneAndUpdate(
        { nguoiDungId: req.user._id },
        { danhSachSanPham: [] }
      );

      console.log('Sending 201 response from chiTietDonHang block');
      res.status(201).json({
        success: true,
        data: { order }
      });
      console.log('Returned after sending 201 response');
      return;
    }

  console.log('ENTERED cart block (chiTietDonHang not provided or empty)');
  // Otherwise, use cart (original logic)
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
    ghiChu,
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

  console.log('Sending 201 response: Order created successfully');
  res.status(201).json({
    success: true,
    message: 'Order created successfully',
    data: { order: populatedOrder }
  });
  } catch (error) {
    console.error('Error creating order:', error);
    console.error('Error name:', error.name);
    console.error('Error message:', error.message);
    if (error.errors) {
      console.error('Validation errors:', JSON.stringify(error.errors, null, 2));
    }
    
    // Trả về chi tiết lỗi cho client
    if (error.name === 'ValidationError') {
      const messages = Object.values(error.errors).map(err => err.message);
      console.log('Sending 400 ValidationError response:', messages);
      return res.status(400).json({
        success: false,
        message: 'Validation Error: ' + messages.join(', '),
        errors: messages
      });
    }
    
    console.log('Sending 500 error response:', error.message);
    res.status(500).json({
      success: false,
      message: error.message || 'Failed to create order'
    });
  }
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
