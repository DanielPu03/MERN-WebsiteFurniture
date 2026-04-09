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

const thanhToanSchema = new mongoose.Schema({
  phuongThuc: {
    type: String,
    required: [true, 'Phương thức thanh toán là bắt buộc'],
    enum: {
      values: ['COD', 'Bank Transfer', 'Credit Card', 'E-Wallet'],
      message: 'Phương thức thanh toán không hợp lệ'
    }
  },
  soTien: {
    type: Number,
    required: [true, 'Số tiền là bắt buộc'],
    min: [0, 'Số tiền phải lớn hơn hoặc bằng 0']
  },
  trangThai: {
    type: Number,
    enum: {
      values: [0, 1, 2],
      message: 'Trạng thái thanh toán không hợp lệ'
    },
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
    required: [true, 'Đơn vị vận chuyển là bắt buộc'],
    trim: true,
    maxlength: [100]
  },
  maVanDon: {
    type: String,
    trim: true,
    maxlength: [50]
  },
  trangThai: {
    type: String,
    enum: {
      values: ['pending', 'processing', 'shipped', 'delivered', 'cancelled'],
      message: 'Trạng thái vận chuyển không hợp lệ'
    },
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
    required: [true, 'ID người dùng là bắt buộc']
  },
  tongTien: {
    type: Number,
    required: [true],
    min: [0, 'Tổng tiền phải lớn hơn hoặc bằng 0']
  },
  tinhTrang: {
    type: Number,
    enum: {
      values: [0, 1, 2, 3],
      message: 'Trạng thái đơn hàng không hợp lệ'
    },
    default: 0
  },
  diaChiGiaoHang: {
    type: String,
    required: [true, 'Địa chỉ giao hàng là bắt buộc'],
    trim: true,
    maxlength: [255]
  },
  phiVanChuyen: {
    type: Number,
    required: [true],
    min: [0, 'Phí vận chuyển phải lớn hơn hoặc bằng 0'],
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
