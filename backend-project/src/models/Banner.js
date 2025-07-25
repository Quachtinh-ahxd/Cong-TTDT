const mongoose = require('mongoose');
const slugify = require('slugify');

const bannerSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, 'Tên banner là bắt buộc'],
      trim: true,
      maxlength: [255, 'Tên banner không được vượt quá 255 ký tự']
    },
    slug: {
      type: String,
      unique: true,
      lowercase: true
    },
    image: {
      type: String,
      required: [true, 'Hình ảnh banner là bắt buộc']
    },
    link: {
      type: String,
      default: '#',
      maxlength: [1000, 'Link không được vượt quá 1000 ký tự']
    },
    position: {
      type: String,
      required: [true, 'Vị trí banner là bắt buộc'],
      enum: {
        values: ['slider', 'sidebar', 'footer', 'home', 'category'],
        message: 'Vị trí không hợp lệ'
      }
    },
    description: {
      type: String,
      maxlength: [1000, 'Mô tả không được vượt quá 1000 ký tự']
    },
    sort_order: {
      type: Number,
      default: 0
    },
    status: {
      type: Number,
      default: 2, // 1: active, 2: inactive, 0: deleted
      enum: {
        values: [0, 1, 2],
        message: 'Trạng thái không hợp lệ'
      }
    },
    created_by: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      default: null
    },
    updated_by: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      default: null
    }
  },
  {
    timestamps: true, // Tự động thêm createdAt và updatedAt
    toJSON: { virtuals: true },
    toObject: { virtuals: true }
  }
);

// Middleware trước khi lưu - tạo slug từ name
bannerSchema.pre('save', function(next) {
  if (this.isModified('name')) {
    this.slug = slugify(this.name, {
      lower: true,
      strict: true,
      locale: 'vi'
    });
  }
  next();
});

// Phương thức tĩnh để lấy banner theo vị trí
bannerSchema.statics.findByPosition = function(position) {
  return this.find({
    position,
    status: 1
  }).sort({ sort_order: 1 });
};

// Phương thức tĩnh để lấy banner đang hoạt động
bannerSchema.statics.findActive = function() {
  return this.find({
    status: 1
  }).sort({ sort_order: 1 });
};

// Phương thức instance để kiểm tra banner có đang hoạt động không
bannerSchema.methods.isActive = function() {
  return this.status === 1;
};

// Phương thức instance để cập nhật trạng thái
bannerSchema.methods.updateStatus = function(status) {
  this.status = status;
  return this.save();
};

// Phương thức instance để toggle trạng thái
bannerSchema.methods.toggleStatus = function() {
  this.status = this.status === 1 ? 2 : 1;
  return this.save();
};

// Tạo model từ schema
const Banner = mongoose.model('Banner', bannerSchema);

module.exports = Banner;