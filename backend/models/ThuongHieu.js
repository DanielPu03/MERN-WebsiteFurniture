const mongoose = require('mongoose');

const thuongHieuSchema = new mongoose.Schema({
  tenThuongHieu: {
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
