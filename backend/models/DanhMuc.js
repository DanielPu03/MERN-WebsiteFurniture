const mongoose = require('mongoose');

const danhMucSchema = new mongoose.Schema({
  tenDanhMuc: {
    type: String,
    required: true,
    unique: true,
    trim: true,
    maxlength: 100
  },
  moTa: {
    type: String,
    trim: true,
    maxlength: 500
  },
  icon: {
    type: String,
    default: '📦'
  },
  trangThai: {
    type: Boolean,
    default: true
  }
}, {
  timestamps: true
});

module.exports = mongoose.model('DanhMuc', danhMucSchema);
