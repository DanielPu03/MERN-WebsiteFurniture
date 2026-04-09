const mongoose = require('mongoose');

const diaChiSchema = new mongoose.Schema({
  nguoiDungId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'NguoiDung',
    required: [true]
  },
  tenNguoiNhan: {
    type: String,
    required: [true, 'Tên người nhận là bắt buộc'],
    trim: true,
    maxlength: [100]
  },
  soDienThoai: {
    type: String,
    required: [true, 'Số điện thoại là bắt buộc'],
    trim: true,
    validate: {
      validator: function(v) {
        return /^[0-9]{10}$/.test(v);
      },
      message: 'Số điện thoại phải có 10 chữ số'
    }
  },
  diaChiCuThe: {
    type: String,
    required: [true, 'Địa chỉ cụ thể là bắt buộc'],
    trim: true,
    maxlength: [255]
  },
  phuongXa: {
    type: String,
    required: [true, 'Phường/Xã là bắt buộc'],
    trim: true,
    maxlength: [100]
  },
  quanHuyen: {
    type: String,
    required: [true, 'Quận/Huyện là bắt buộc'],
    trim: true,
    maxlength: [100]
  },
  tinhThanh: {
    type: String,
    required: [true, 'Tỉnh/Thành phố là bắt buộc'],
    trim: true,
    maxlength: [100]
  },
  macDinh: {
    type: Boolean,
    default: false
  }
}, {
  timestamps: true
});

// Ensure only one default address per user
diaChiSchema.pre('save', async function(next) {
  if (this.macDinh) {
    await this.constructor.updateMany(
      { nguoiDungId: this.nguoiDungId, _id: { $ne: this._id } },
      { macDinh: false }
    );
  }
  next();
});

module.exports = mongoose.model('DiaChi', diaChiSchema);
