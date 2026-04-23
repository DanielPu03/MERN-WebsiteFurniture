const DiaChi = require('../models/DiaChi');

// @desc    Get all addresses for a user
// @route   GET /api/addresses
// @access  Private
const getAddresses = async (req, res) => {
  try {
    const addresses = await DiaChi.find({ nguoiDungId: req.user._id }).sort({ macDinh: -1, createdAt: -1 });

    res.status(200).json({
      success: true,
      data: { addresses }
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message
    });
  }
};

// @desc    Get single address
// @route   GET /api/addresses/:id
// @access  Private
const getAddressById = async (req, res) => {
  try {
    const address = await DiaChi.findOne({
      _id: req.params.id,
      nguoiDungId: req.user._id
    });

    if (!address) {
      return res.status(404).json({
        success: false,
        message: 'Không tìm thấy địa chỉ'
      });
    }

    res.status(200).json({
      success: true,
      data: { address }
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message
    });
  }
};

// @desc    Create new address
// @route   POST /api/addresses
// @access  Private
const createAddress = async (req, res) => {
  try {
    const {
      tenNguoiNhan,
      soDienThoai,
      diaChiCuThe,
      phuongXa,
      quanHuyen,
      tinhThanh,
      macDinh
    } = req.body;

    const address = await DiaChi.create({
      nguoiDungId: req.user._id,
      tenNguoiNhan,
      soDienThoai,
      diaChiCuThe,
      phuongXa,
      quanHuyen,
      tinhThanh,
      macDinh: macDinh || false
    });

    res.status(201).json({
      success: true,
      message: 'Thêm địa chỉ thành công',
      data: { address }
    });
  } catch (error) {
    res.status(400).json({
      success: false,
      message: error.message
    });
  }
};

// @desc    Update address
// @route   PUT /api/addresses/:id
// @access  Private
const updateAddress = async (req, res) => {
  try {
    const {
      tenNguoiNhan,
      soDienThoai,
      diaChiCuThe,
      phuongXa,
      quanHuyen,
      tinhThanh,
      macDinh
    } = req.body;

    const address = await DiaChi.findOneAndUpdate(
      { _id: req.params.id, nguoiDungId: req.user._id },
      { tenNguoiNhan, soDienThoai, diaChiCuThe, phuongXa, quanHuyen, tinhThanh, macDinh },
      { new: true, runValidators: true }
    );

    if (!address) {
      return res.status(404).json({
        success: false,
        message: 'Không tìm thấy địa chỉ'
      });
    }

    res.status(200).json({
      success: true,
      message: 'Cập nhật địa chỉ thành công',
      data: { address }
    });
  } catch (error) {
    res.status(400).json({
      success: false,
      message: error.message
    });
  }
};

// @desc    Set default address
// @route   PUT /api/addresses/:id/default
// @access  Private
const setDefaultAddress = async (req, res) => {
  try {
    // Remove default from all user's addresses
    await DiaChi.updateMany(
      { nguoiDungId: req.user._id },
      { macDinh: false }
    );

    // Set new default
    const address = await DiaChi.findOneAndUpdate(
      { _id: req.params.id, nguoiDungId: req.user._id },
      { macDinh: true },
      { new: true }
    );

    if (!address) {
      return res.status(404).json({
        success: false,
        message: 'Không tìm thấy địa chỉ'
      });
    }

    res.status(200).json({
      success: true,
      message: 'Đặt địa chỉ mặc định thành công',
      data: { address }
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message
    });
  }
};

// @desc    Delete address
// @route   DELETE /api/addresses/:id
// @access  Private
const deleteAddress = async (req, res) => {
  try {
    const address = await DiaChi.findOneAndDelete({
      _id: req.params.id,
      nguoiDungId: req.user._id
    });

    if (!address) {
      return res.status(404).json({
        success: false,
        message: 'Không tìm thấy địa chỉ'
      });
    }

    res.status(200).json({
      success: true,
      message: 'Xóa địa chỉ thành công'
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message
    });
  }
};

module.exports = {
  getAddresses,
  getAddressById,
  createAddress,
  updateAddress,
  setDefaultAddress,
  deleteAddress
};
