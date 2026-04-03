const mongoose = require('mongoose');

const chiTietGioHangSchema = new mongoose.Schema({
  sanPhamId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'SanPham',
    required: true
  },
  soLuong: {
    type: Number,
    required: true,
    min: 1,
    default: 1
  },
  gia: {
    type: Number,
    required: true,
    min: 0
  }
}, { _id: false });

const gioHangSchema = new mongoose.Schema({
  nguoiDungId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'NguoiDung',
    required: true,
    unique: true
  },
  danhSachSanPham: [chiTietGioHangSchema],
  ngayCapNhat: {
    type: Date,
    default: Date.now
  }
}, {
  timestamps: true
});

// Update ngayCapNhat when cart is modified
gioHangSchema.pre('save', function(next) {
  this.ngayCapNhat = new Date();
  next();
});

// Method to calculate total
gioHangSchema.methods.tinhTongTien = function() {
  return this.danhSachSanPham.reduce((total, item) => {
    return total + (item.gia * item.soLuong);
  }, 0);
};

// Method to update product quantity
gioHangSchema.methods.capNhatSoLuong = function(sanPhamId, soLuong) {
  const itemIndex = this.danhSachSanPham.findIndex(
    item => item.sanPhamId.toString() === sanPhamId.toString()
  );

  if (itemIndex > -1) {
    if (soLuong > 0) {
      this.danhSachSanPham[itemIndex].soLuong = soLuong;
    } else {
      this.danhSachSanPham.splice(itemIndex, 1);
    }
  } else if (soLuong > 0) {
    this.danhSachSanPham.push({ sanPhamId, soLuong });
  }

  return this.save();
};

module.exports = mongoose.model('GioHang', gioHangSchema);
