const mongoose = require('mongoose');

const boSuuTapSchema = new mongoose.Schema({
  tenBoSuuTap: {
    type: String,
    required: [true, 'Tên bộ sưu tập là bắt buộc'],
    trim: true,
    maxlength: [100]
  },
  moTa: {
    type: String,
    required: [false],
    maxlength: [500]
  },
  hinhAnh: {
    type: String,
    required: [true]
  },
  trangThai: {
    type: Boolean,
    default: true
  },
  sanPhams: [{
    type: mongoose.Schema.Types.ObjectId,
    ref: 'SanPham'
  }]
}, {
  timestamps: { createdAt: 'ngayTao', updatedAt: 'ngayCapNhat' }
});

boSuuTapSchema.index({ tenBoSuuTap: 'text', moTa: 'text' });

module.exports = mongoose.model('BoSuuTap', boSuuTapSchema);
