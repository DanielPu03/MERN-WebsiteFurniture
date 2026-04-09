const mongoose = require('mongoose');

const danhGiaSchema = new mongoose.Schema({
  nguoiDungId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'NguoiDung',
    required: [true, 'ID người dùng là bắt buộc']
  },
  sanPhamId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'SanPham',
    required: [true, 'ID sản phẩm là bắt buộc']
  },
  soSao: {
    type: Number,
    required: [true, 'Số sao là bắt buộc'],
    min: [1, 'Số sao phải từ 1 đến 5'],
    max: [5, 'Số sao phải từ 1 đến 5']
  },
  binhLuan: {
    type: String,
    trim: true,
    maxlength: [1000, 'Bình luận không được vượt quá 1000 ký tự']
  },
  ngayTao: {
    type: Date,
    default: Date.now
  }
}, {
  timestamps: true
});

// Ensure one review per user per product
danhGiaSchema.index({ nguoiDungId: 1, sanPhamId: 1 }, { unique: true });

// Update product average rating after review is saved
danhGiaSchema.post('save', async function() {
  const SanPham = mongoose.model('SanPham');
  const product = await SanPham.findById(this.sanPhamId);
  if (product) {
    await product.updateAverageRating();
  }
});

// Update product average rating after review is removed
danhGiaSchema.post('remove', async function() {
  const SanPham = mongoose.model('SanPham');
  const product = await SanPham.findById(this.sanPhamId);
  if (product) {
    await product.updateAverageRating();
  }
});

module.exports = mongoose.model('DanhGia', danhGiaSchema);
