const User = require('../models/User');

// @desc    Update user role (admin only)
const updateUserRole = async (req, res) => {
  const { userId, role } = req.body;

  const user = await User.findByIdAndUpdate(
    userId,
    { role: parseInt(role) },
    { new: true, runValidators: true }
  ).select('-matKhau');

  if (!user) {
    return res.status(404).json({
      success: false,
      message: 'Người dùng không tồn tại'
    });
  }

  res.status(200).json({
    success: true,
    message: `Người dùng đã được cập nhật thành ${role === 1 ? 'admin' : 'user'} successfully`,
    data: { user }
  });
};

module.exports = {
  updateUserRole
};
