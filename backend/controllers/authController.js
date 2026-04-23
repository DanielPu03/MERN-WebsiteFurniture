const User = require('../models/User');
const jwt = require('jsonwebtoken');

// Generate JWT Token
const generateToken = (id) => {
  return jwt.sign({ id }, process.env.ACCESS_TOKEN_SECRET, {
    expiresIn: '30d'
  });
};

// @desc    Register user
const register = async (req, res) => {
  const { hoTen, email, matKhau, soDienThoai } = req.body;

  // Check if user exists
  const userExists = await User.findOne({ email });
  if (userExists) {
    return res.status(400).json({
      success: false,
      message: 'User already exists'
    });
  }

  // Create user
  const user = await User.create({
    hoTen,
    email,
    matKhau,
    soDienThoai
  });

  // Generate token
  const token = generateToken(user._id);

  res.status(201).json({
    success: true,
    message: 'User registered successfully',
    data: {
      user: {
        _id: user._id,
        hoTen: user.hoTen,
        email: user.email,
        soDienThoai: user.soDienThoai,
        diaChi: user.diaChi,
        role: user.role,
        trangThai: user.trangThai
      },
      token
    }
  });
};

// @desc    Login user
const login = async (req, res) => {
  const { email, matKhau } = req.body;

  // Validate email & password
  if (!email || !matKhau) {
    return res.status(400).json({
      success: false,
      message: 'Please provide email and password'
    });
  }

  // Check for user
  const user = await User.findOne({ email }).select('+matKhau');
  if (!user) {
    return res.status(401).json({
      success: false,
      message: 'Invalid credentials'
    });
  }

  // Check if password matches
  const isMatch = await user.comparePassword(matKhau);
  if (!isMatch) {
    return res.status(401).json({
      success: false,
      message: 'Invalid credentials'
    });
  }

  // Check if user is active
  if (!user.trangThai) {
    return res.status(401).json({
      success: false,
      message: 'Your account has been deactivated'
    });
  }

  // Generate token
  const token = generateToken(user._id);

  res.status(200).json({
    success: true,
    message: 'Login successful',
    data: {
      user: {
        _id: user._id,
        hoTen: user.hoTen,
        email: user.email,
        soDienThoai: user.soDienThoai,
        diaChi: user.diaChi,
        role: user.role,
        trangThai: user.trangThai
      },
      token
    }
  });
};

// @desc    Get current user
const getMe = async (req, res) => {
  res.status(200).json({
    success: true,
    data: {
      user: {
        _id: req.user._id,
        hoTen: req.user.hoTen,
        email: req.user.email,
        soDienThoai: req.user.soDienThoai,
        diaChi: req.user.diaChi,
        role: req.user.role,
        trangThai: req.user.trangThai,
        ngayTao: req.user.ngayTao
      }
    }
  });
};

// @desc    Update user profile
const updateProfile = async (req, res) => {
  const { hoTen, soDienThoai, diaChi } = req.body;

  // Build update object with only provided fields
  const updateData = {};
  if (hoTen !== undefined) updateData.hoTen = hoTen;
  if (soDienThoai !== undefined) updateData.soDienThoai = soDienThoai;
  if (diaChi !== undefined) updateData.diaChi = diaChi;

  const user = await User.findByIdAndUpdate(
    req.user._id,
    updateData,
    { new: true, runValidators: true }
  );

  res.status(200).json({
    success: true,
    message: 'Profile updated successfully',
    data: {
      user: {
        _id: user._id,
        hoTen: user.hoTen,
        email: user.email,
        soDienThoai: user.soDienThoai,
        diaChi: user.diaChi,
        role: user.role,
        trangThai: user.trangThai
      }
    }
  });
};

// @desc    Change password
const changePassword = async (req, res) => {
  const { matKhauCu, matKhauMoi } = req.body;

  // Get user with password
  const user = await User.findById(req.user._id).select('+matKhau');

  // Check current password
  const isMatch = await user.comparePassword(matKhauCu);
  if (!isMatch) {
    return res.status(400).json({
      success: false,
      message: 'Current password is incorrect'
    });
  }

  // Update password
  user.matKhau = matKhauMoi;
  await user.save();

  res.status(200).json({
    success: true,
    message: 'Password changed successfully'
  });
};

module.exports = {
  register,
  login,
  getMe,
  updateProfile,
  changePassword
};
