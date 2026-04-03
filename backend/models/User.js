const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');

const userSchema = new mongoose.Schema({
  hoTen: {
    type: String,
    required: true,
    trim: true,
    maxlength: 100
  },
  email: {
    type: String,
    required: true,
    unique: true,
    lowercase: true,
    trim: true
  },
  matKhau: {
    type: String,
    required: true,
    minlength: 6
  },
  soDienThoai: {
    type: String,
    required: true,
    trim: true
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
