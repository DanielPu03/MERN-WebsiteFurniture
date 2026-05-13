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

const hinhAnhFlexibleSchema = new mongoose.Schema({}, { _id: false, discriminatorKey: 'type' });

hinhAnhFlexibleSchema.add({
  url: String,
  laAnhChinh: { type: Boolean, default: false }
});

const hinhAnhMixedSchema = {
  type: mongoose.Schema.Types.Mixed,
  validate: {
    validator: function(value) {
      if (typeof value === 'string') {
        return true; 
      }
      if (Array.isArray(value)) {
        if (value.length === 0) return true; 
        return value.every(item => {
          if (typeof item === 'string') {
            return true; 
          }
          if (typeof item === 'object' && item !== null) {
            return !item.url || (typeof item.url === 'string'); 
          }
          return false;
        });
      }
      if (value === null || value === undefined) {
        return true;
      }
      return false;
    },
    message: 'hinhAnh must be a string URL or array of image objects/URLs'
  }
};

const sanPhamSchema = new mongoose.Schema({
  tenSanPham: {
    type: String,
    required: [true, 'Tên sản phẩm là bắt buộc'],
    trim: true,
    maxlength: [100]
  },
  gia: {
    type: Number,
    required: [true],
    min: [0, 'Giá sản phẩm phải lớn hơn hoặc bằng 0']
  },
  soLuongTon: {
    type: Number,
    required: [true],
    min: [0, 'Số lượng tồn phải lớn hơn hoặc bằng 0'],
    default: 0
  },
  danhMucId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'DanhMuc',
    required: true
  },
  boSuuTapIds: [{
    type: mongoose.Schema.Types.ObjectId,
    ref: 'BoSuuTap',
    default: []
  }],
  moTa: {
    type: String,
    trim: true,
    maxlength: [500]
  },
  hinhAnh: hinhAnhMixedSchema,
  trangThai: {
    type: Boolean,
    default: true
  },
  noiBat: {
    type: Boolean,
    default: false
  }
}, {
  timestamps: { createdAt: 'ngayTao', updatedAt: 'ngayCapNhat' }
});

// Pre-save middleware to normalize hinhAnh data
sanPhamSchema.pre('save', function(next) {
  if (this.hinhAnh !== undefined && this.hinhAnh !== null) {
    // If hinhAnh is a string, convert to array format
    if (typeof this.hinhAnh === 'string') {
      if (this.hinhAnh.trim().length > 0) {
        this.hinhAnh = [{
          url: this.hinhAnh,
          laAnhChinh: true
        }];
      } else {
        // Empty string - set to empty array
        this.hinhAnh = [];
      }
    }
    // If hinhAnh is array of strings, convert to array of objects
    else if (Array.isArray(this.hinhAnh)) {
      this.hinhAnh = this.hinhAnh.map((img, index) => {
        if (typeof img === 'string') {
          if (img.trim().length > 0) {
            return {
              url: img,
              laAnhChinh: index === 0 // First image is main
            };
          }
          return null; // Remove empty strings
        }
        return img;
      }).filter(Boolean); // Remove null items
    }
  }
  next();
});

// Pre-update middleware to normalize hinhAnh data
sanPhamSchema.pre(['updateOne', 'updateMany', 'findOneAndUpdate'], function(next) {
  const update = this.getUpdate();
  if (update.hinhAnh) {
    // If hinhAnh is a string, convert to array format
    if (typeof update.hinhAnh === 'string') {
      update.hinhAnh = [{
        url: update.hinhAnh,
        laAnhChinh: true
      }];
    }
    // If hinhAnh is array of strings, convert to array of objects
    else if (Array.isArray(update.hinhAnh)) {
      update.hinhAnh = update.hinhAnh.map((img, index) => {
        if (typeof img === 'string') {
          return {
            url: img,
            laAnhChinh: index === 0 // First image is main
          };
        }
        return img;
      });
    }
  }
  next();
});

// Index for search
sanPhamSchema.index({ tenSanPham: 'text', moTa: 'text' });

module.exports = mongoose.model('SanPham', sanPhamSchema);
