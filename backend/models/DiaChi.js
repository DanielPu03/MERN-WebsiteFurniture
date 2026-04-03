const mongoose = require('mongoose');

const diaChiSchema = new mongoose.Schema({
  nguoiDungId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'NguoiDung',
    required: true
  },
  tenNguoiNhan: {
    type: String,
    required: true,
    trim: true,
    maxlength: 100
  },
  soDienThoai: {
    type: String,
    required: true,
    trim: true
  },
  diaChiCuThe: {
    type: String,
    required: true,
    trim: true,
    maxlength: 200
  },
  phuongXa: {
    type: String,
    required: true,
    trim: true
  },
  quanHuyen: {
    type: String,
    required: true,
    trim: true
  },
  tinhThanh: {
    type: String,
    required: true,
    trim: true
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
