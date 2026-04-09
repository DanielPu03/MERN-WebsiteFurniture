const mongoose = require('mongoose');

const wishlistDetailSchema = new mongoose.Schema({
  sanPhamId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'SanPham',
    required: [true, 'ID sản phẩm là bắt buộc']
  },
  ngayThem: {
    type: Date,
    default: Date.now
  }
}, { _id: false });

const wishlistSchema = new mongoose.Schema({
  nguoiDungId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'NguoiDung',
    required: [true, 'ID người dùng là bắt buộc'],
    unique: true
  },
  danhSachSanPham: [wishlistDetailSchema],
  ngayTao: {
    type: Date,
    default: Date.now
  }
}, {
  timestamps: true
});

// Method to add product to wishlist
wishlistSchema.methods.themSanPham = function(sanPhamId) {
  const exists = this.danhSachSanPham.some(
    item => item.sanPhamId.toString() === sanPhamId.toString()
  );

  if (!exists) {
    this.danhSachSanPham.push({ sanPhamId });
  }

  return this.save();
};

// Method to remove product from wishlist
wishlistSchema.methods.xoaSanPham = function(sanPhamId) {
  this.danhSachSanPham = this.danhSachSanPham.filter(
    item => item.sanPhamId.toString() !== sanPhamId.toString()
  );

  return this.save();
};

// Method to check if product exists in wishlist
wishlistSchema.methods.coSanPham = function(sanPhamId) {
  return this.danhSachSanPham.some(
    item => item.sanPhamId.toString() === sanPhamId.toString()
  );
};

module.exports = mongoose.model('Wishlist', wishlistSchema);
