const mongoose = require('mongoose');

const thuongHieuSchema = new mongoose.Schema({
  tenThuongHieu: {
    type: String,
    required: [true, 'Tên thương hiệu là bắt buộc'],
    unique: true,
    trim: true,
    maxlength: [50]
  },
  moTa: {
    type: String,
    trim: true,
    maxlength: [255]
  },
  logo: {
    type: String,
    default: ''
  },
  trangThai: {
    type: Boolean,
    default: true
  }
}, {
  timestamps: true
});

module.exports = mongoose.model('ThuongHieu', thuongHieuSchema);
