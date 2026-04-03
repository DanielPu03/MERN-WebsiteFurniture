const mongoose = require('mongoose');

const hinhAnhSanPhamSchema = new mongoose.Schema({
  url: {
    type: String,
    required: true
  },
  laAnhChinh: {
    type: Boolean,
    default: false
  }
}, { _id: false });

const sanPhamSchema = new mongoose.Schema({
  tenSanPham: {
    type: String,
    required: true,
    trim: true,
    maxlength: 200
  },
  gia: {
    type: Number,
    required: true,
    min: 0
  },
  soLuongTon: {
    type: Number,
    required: true,
    min: 0,
    default: 0
  },
  danhMucId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'DanhMuc',
    required: true
  },
  thuongHieuId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'ThuongHieu',
    required: true
  },
  moTa: {
    type: String,
    trim: true,
    maxlength: 2000
  },
  trangThai: {
    type: Boolean,
    default: true
  },
  hinhAnh: [hinhAnhSanPhamSchema],
  danhGiaTrungBinh: {
    type: Number,
    default: 0,
    min: 0,
    max: 5
  },
  soLuongDanhGia: {
    type: Number,
    default: 0,
    min: 0
  },
  ngayTao: {
    type: Date,
    default: Date.now
  }
}, {
  timestamps: true
});

// Index for search
sanPhamSchema.index({ tenSanPham: 'text', moTa: 'text' });

// Update average rating when reviews are added/removed
sanPhamSchema.methods.updateAverageRating = async function() {
  const DanhGia = mongoose.model('DanhGia');
  const stats = await DanhGia.aggregate([
    { $match: { sanPhamId: this._id } },
    {
      $group: {
        _id: '$sanPhamId',
        avgRating: { $avg: '$soSao' },
        count: { $sum: 1 }
      }
    }
  ]);

  if (stats.length > 0) {
    this.danhGiaTrungBinh = Math.round(stats[0].avgRating * 10) / 10;
    this.soLuongDanhGia = stats[0].count;
  } else {
    this.danhGiaTrungBinh = 0;
    this.soLuongDanhGia = 0;
  }

  await this.save();
};

module.exports = mongoose.model('SanPham', sanPhamSchema);
