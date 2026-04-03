const User = require('../models/User');
const DiaChi = require('../models/DiaChi');

// Get all users (admin only)
const getAllUsers = async (req, res) => {
  const { page = 1, limit = 10, search } = req.query;

  const query = {};
  if (search) {
    query.$or = [
      { hoTen: { $regex: search, $options: 'i' } },
      { email: { $regex: search, $options: 'i' } }
    ];
  }

  const users = await User.find(query)
    .select('-matKhau')
    .sort({ ngayTao: -1 })
    .limit(limit * 1)
    .skip((page - 1) * limit);

  const total = await User.countDocuments(query);

  res.status(200).json({
    success: true,
    data: {
      users,
      pagination: {
        page: parseInt(page),
        limit: parseInt(limit),
        total,
        pages: Math.ceil(total / limit)
      }
    }
  });
};

// Get user by ID (admin only)
const getUserById = async (req, res) => {
  const user = await User.findById(req.params.id).select('-matKhau');
  
  if (!user) {
    return res.status(404).json({
      success: false,
      message: 'User not found'
    });
  }

  res.status(200).json({
    success: true,
    data: { user }
  });
};

// Update user (admin only)
const updateUser = async (req, res) => {
  const { hoTen, soDienThoai, role, trangThai } = req.body;
  
  const user = await User.findByIdAndUpdate(
    req.params.id,
    { hoTen, soDienThoai, role, trangThai },
    { new: true, runValidators: true }
  ).select('-matKhau');

  if (!user) {
    return res.status(404).json({
      success: false,
      message: 'User not found'
    });
  }

  res.status(200).json({
    success: true,
    message: 'User updated successfully',
    data: { user }
  });
};

// Delete user (admin only)
const deleteUser = async (req, res) => {
  const user = await User.findById(req.params.id);
  
  if (!user) {
    return res.status(404).json({
      success: false,
      message: 'User not found'
    });
  }

  await user.deleteOne();

  res.status(200).json({
    success: true,
    message: 'User deleted successfully'
  });
};

// Get user addresses
const getUserAddresses = async (req, res) => {
  const addresses = await DiaChi.find({ nguoiDungId: req.user._id })
    .sort({ laMacDinh: -1, ngayTao: -1 });

  res.status(200).json({
    success: true,
    data: { addresses }
  });
};

// Add address
const addAddress = async (req, res) => {
  const {
    tenNguoiNhan,
    soDienThoai,
    tinhThanhPho,
    quanHuyen,
    phuongXa,
    soNha,
    laMacDinh
  } = req.body;

  // If new address is default, unset other default addresses
  if (laMacDinh) {
    await DiaChi.updateMany(
      { nguoiDungId: req.user._id },
      { laMacDinh: false }
    );
  }

  const address = await DiaChi.create({
    nguoiDungId: req.user._id,
    tenNguoiNhan,
    soDienThoai,
    tinhThanhPho,
    quanHuyen,
    phuongXa,
    soNha,
    laMacDinh: laMacDinh || false
  });

  res.status(201).json({
    success: true,
    message: 'Address added successfully',
    data: { address }
  });
};

// Update address
const updateAddress = async (req, res) => {
  const { addressId } = req.params;
  const addressData = req.body;

  // If updated address is default, unset other default addresses
  if (addressData.laMacDinh) {
    await DiaChi.updateMany(
      { nguoiDungId: req.user._id, _id: { $ne: addressId } },
      { laMacDinh: false }
    );
  }

  const address = await DiaChi.findOneAndUpdate(
    { _id: addressId, nguoiDungId: req.user._id },
    addressData,
    { new: true, runValidators: true }
  );

  if (!address) {
    return res.status(404).json({
      success: false,
      message: 'Address not found'
    });
  }

  res.status(200).json({
    success: true,
    message: 'Address updated successfully',
    data: { address }
  });
};

// Delete address
const deleteAddress = async (req, res) => {
  const { addressId } = req.params;

  const address = await DiaChi.findOneAndDelete({
    _id: addressId,
    nguoiDungId: req.user._id
  });

  if (!address) {
    return res.status(404).json({
      success: false,
      message: 'Address not found'
    });
  }

  res.status(200).json({
    success: true,
    message: 'Address deleted successfully'
  });
};

module.exports = {
  getAllUsers,
  getUserById,
  updateUser,
  deleteUser,
  getUserAddresses,
  addAddress,
  updateAddress,
  deleteAddress
};
