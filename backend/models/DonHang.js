const mongoose = require('mongoose');

const chiTietDonHangSchema = new mongoose.Schema({
  sanPhamId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'SanPham',
    required: true
  },
  soLuong: {
    type: Number,
    required: true,
    min: 1
  },
  gia: {
    type: Number,
    required: true,
    min: 0
  }
}, { _id: false });

const thanhToanSchema = new mongoose.Schema({
  phuongThuc: {
    type: String,
    required: true,
    enum: ['COD', 'Bank Transfer', 'Credit Card', 'E-Wallet']
  },
  soTien: {
    type: Number,
    required: true,
    min: 0
  },
  trangThai: {
    type: Number,
    enum: [0, 1, 2], // 0 = pending, 1 = success, 2 = failed
    default: 0
  },
  maGiaoDich: {
    type: String,
    trim: true
  },
  ngayThanhToan: {
    type: Date
  }
}, { _id: false });

const vanChuyenSchema = new mongoose.Schema({
  donViVanChuyen: {
    type: String,
    required: true,
    trim: true
  },
  maVanDon: {
    type: String,
    trim: true
  },
  trangThai: {
    type: String,
    enum: ['pending', 'processing', 'shipped', 'delivered', 'cancelled'],
    default: 'pending'
  },
  ngayGui: {
    type: Date
  },
  ngayNhan: {
    type: Date
  }
}, { _id: false });

const donHangSchema = new mongoose.Schema({
  nguoiDungId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'NguoiDung',
    required: true
  },
  tongTien: {
    type: Number,
    required: true,
    min: 0
  },
  tinhTrang: {
    type: Number,
    enum: [0, 1, 2, 3], // 0 = pending, 1 = confirmed, 2 = shipping, 3 = completed
    default: 0
  },
  diaChiGiaoHang: {
    type: String,
    required: true,
    trim: true
  },
  phiVanChuyen: {
    type: Number,
    required: true,
    min: 0,
    default: 0
  },
  chiTietDonHang: [chiTietDonHangSchema],
  thanhToan: thanhToanSchema,
  vanChuyen: vanChuyenSchema,
  ngayTao: {
    type: Date,
    default: Date.now
  }
}, {
  timestamps: true
});

// Calculate total before saving
donHangSchema.pre('save', function(next) {
  if (this.isModified('chiTietDonHang')) {
    this.tongTien = this.chiTietDonHang.reduce((total, item) => {
      return total + (item.gia * item.soLuong);
    }, 0) + this.phiVanChuyen;
  }
  next();
});

module.exports = mongoose.model('DonHang', donHangSchema);
