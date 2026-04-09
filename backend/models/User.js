const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');

const userSchema = new mongoose.Schema({
  hoTen: {
    type: String,
    required: [true, 'Họ và tên là bắt buộc'],
    trim: true,
    maxlength: [55, 'Họ và tên không được bỏ trống']
  },
  email: {
    type: String,
    required: [true, 'Email là bắt buộc'],
    unique: true,
    lowercase: true,
    trim: true,
    validate: {
      validator: function(v) {
        return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(v);
      },
      message: 'Email không hợp lệ'
    }
  },
  matKhau: {
    type: String,
    required: [true, 'Mật khẩu là bắt buộc'],
    minlength: [6, 'Mật khẩu phải có ít nhất 6 ký tự'],
    validate: {
      validator: function(v) {
        // Kiểm tra có chữ hoa, chữ thường, số
        const hasUpperCase = /[A-Z]/.test(v);
        const hasLowerCase = /[a-z]/.test(v);
        const hasNumber = /[0-9]/.test(v);
        return hasUpperCase && hasLowerCase && hasNumber;
      },
      message: 'Mật khẩu phải có ít nhất 1 chữ hoa, 1 chữ thường và 1 số'
    }
  },
  soDienThoai: {
    type: String,
    required: [true, 'Số điện thoại là bắt buộc'],
    trim: true,
    validate: {
      validator: function(v) {
        return /^[0-9]{10}$/.test(v);
      },
      message: 'Số điện thoại phải có 10 chữ số'
    }
  },
  diaChi: {
    type: String,
    trim: true,
    maxlength: [255, 'Địa chỉ không được bỏ trống']
  },
  role: {
    type: Number,
    enum: [0, 1], // 0 = user, 1 = admin
    default: 0
  },
  trangThai: {
    type: Boolean,
    default: true
  },
  ngayTao: {
    type: Date,
    default: Date.now
  }
}, {
  timestamps: true
});

// Hash password before saving
userSchema.pre('save', async function(next) {
  if (!this.isModified('matKhau')) return next();
  
  try {
    const salt = await bcrypt.genSalt(10);
    this.matKhau = await bcrypt.hash(this.matKhau, salt);
    next();
  } catch (error) {
    next(error);
  }
});

// Compare password method
userSchema.methods.comparePassword = async function(candidatePassword) {
  return await bcrypt.compare(candidatePassword, this.matKhau);
};

// Hide password in JSON output
userSchema.methods.toJSON = function() {
  const user = this.toObject();
  delete user.matKhau;
  return user;
};

module.exports = mongoose.model('NguoiDung', userSchema);
