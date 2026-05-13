const mongoose = require('mongoose');

const chiTietDonHangSchema = new mongoose.Schema({
  sanPhamId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'SanPham',
    required: [true, 'ID sản phẩm là bắt buộc']
  },
  soLuong: {
    type: Number,
    required: [true, 'Số lượng là bắt buộc'],
    min: [1, 'Số lượng phải lớn hơn 0']
  },
  gia: {
    type: Number,
    required: [true, 'Giá là bắt buộc'],
    min: [0, 'Giá phải lớn hơn hoặc bằng 0']
  }
}, { _id: false });

const donHangSchema = new mongoose.Schema({
  nguoiDungId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'NguoiDung',
    required: [true, 'ID người dùng là bắt buộc']
  },
  tongTien: {
    type: Number,
    required: [true, 'Tổng tiền là bắt buộc'],
    min: [0, 'Tổng tiền phải lớn hơn hoặc bằng 0']
  },
  tinhTrang: {
    type: Number,
    enum: {
      values: [0, 1, 2, 3, 4],
      message: 'Trạng thái đơn hàng không hợp lệ'
    },
    default: 0
  },
  diaChiGiaoHang: {
    type: String,
    required: [true, 'Địa chỉ giao hàng là bắt buộc'],
    trim: true,
    maxlength: [500]
  },
  phiVanChuyen: {
    type: Number,
    default: 0,
    min: [0, 'Phí vận chuyển phải lớn hơn hoặc bằng 0']
  },
  ghiChu: {
    type: String,
    trim: true,
    maxlength: [500]
  },
  phuongThucThanhToan: {
    type: String,
    enum: ['COD', 'VNPAY'],
    default: 'COD'
  },
  trangThaiThanhToan: {
    type: String,
    enum: ['pending', 'paid', 'failed'],
    default: 'pending'
  },
  maGiaoDichVnpay: {
    type: String,
    trim: true
  },
  ngayThanhToan: {
    type: Date
  },
  chiTietDonHang: [chiTietDonHangSchema],
  ngayTao: {
    type: Date,
    default: Date.now
  }
}, {
  timestamps: true
});

donHangSchema.pre('save', function(next) {
  if (this.isModified('chiTietDonHang')) {
    this.tongTien = this.chiTietDonHang.reduce((total, item) => {
      return total + (item.gia * item.soLuong);
    }, 0) + this.phiVanChuyen;
  }
  next();
});

module.exports = mongoose.model('DonHang', donHangSchema);
