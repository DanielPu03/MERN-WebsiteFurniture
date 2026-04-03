const mongoose = require('mongoose');

const danhGiaSchema = new mongoose.Schema({
  nguoiDungId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'NguoiDung',
    required: true
  },
  sanPhamId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'SanPham',
    required: true
  },
  soSao: {
    type: Number,
    required: true,
    min: 1,
    max: 5
  },
  binhLuan: {
    type: String,
    trim: true,
    maxlength: 1000
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
