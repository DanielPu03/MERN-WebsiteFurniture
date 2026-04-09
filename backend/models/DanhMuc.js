const mongoose = require('mongoose');

const danhMucSchema = new mongoose.Schema({
  tenDanhMuc: {
    type: String,
    required: [true, 'Tên danh mục là bắt buộc'],
    unique: true,
    trim: true,
    maxlength: [50]
  },
  moTa: {
    type: String,
    trim: true,
    maxlength: [255]
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
