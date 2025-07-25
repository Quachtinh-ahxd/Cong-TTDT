const mongoose = require('mongoose');
const slugify = require('slugify');

const postSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: [true, 'Tiêu đề bài viết là bắt buộc'],
      trim: true,
      maxlength: [255, 'Tiêu đề bài viết không được vượt quá 255 ký tự']
    },
    slug: {
      type: String,
      unique: true,
      lowercase: true
    },
    image: {
      type: String,
      default: null
    },
    detail: {
      type: String,
      required: [true, 'Nội dung bài viết là bắt buộc']
    },
    description: {
      type: String,
      maxlength: [1000, 'Mô tả ngắn không được vượt quá 1000 ký tự']
    },
    type: {
      type: String,
      enum: {
        values: ['post', 'page', 'news'],
        message: 'Loại bài viết không hợp lệ'
      },
      default: 'post'
    },
    topic_id: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Topic',
      default: null
    },
    view_count: {
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
    },
    deleted_at: {
      type: Date,
      default: null
    }
  },
  {
    timestamps: true, // Tự động thêm createdAt và updatedAt
    toJSON: { virtuals: true },
    toObject: { virtuals: true }
  }
);

// Middleware trước khi lưu - tạo slug từ title
postSchema.pre('save', function(next) {
  if (this.isModified('title')) {
    this.slug = slugify(this.title, {
      lower: true,
      strict: true,
      locale: 'vi'
    });
  }
  next();
});

// Phương thức tĩnh để lấy bài viết đang hoạt động
postSchema.statics.findActive = function() {
  return this.find({
    status: 1,
    deleted_at: null
  }).sort({ createdAt: -1 });
};

// Phương thức tĩnh để lấy bài viết theo loại
postSchema.statics.findByType = function(type) {
  return this.find({
    type,
    status: 1,
    deleted_at: null
  }).sort({ createdAt: -1 });
};

// Phương thức tĩnh để lấy bài viết theo chủ đề
postSchema.statics.findByTopic = function(topicId) {
  return this.find({
    topic_id: topicId,
    status: 1,
    deleted_at: null
  }).sort({ createdAt: -1 });
};

// Phương thức tĩnh để lấy bài viết mới nhất
postSchema.statics.findLatest = function(limit = 5) {
  return this.find({
    status: 1,
    deleted_at: null
  })
    .sort({ createdAt: -1 })
    .limit(limit);
};

// Phương thức tĩnh để lấy bài viết phổ biến nhất
postSchema.statics.findPopular = function(limit = 5) {
  return this.find({
    status: 1,
    deleted_at: null
  })
    .sort({ view_count: -1 })
    .limit(limit);
};

// Phương thức instance để tăng lượt xem
postSchema.methods.increaseViewCount = function() {
  this.view_count += 1;
  return this.save();
};

// Phương thức instance để kiểm tra bài viết có đang hoạt động không
postSchema.methods.isActive = function() {
  return this.status === 1 && this.deleted_at === null;
};

// Phương thức instance để cập nhật trạng thái
postSchema.methods.updateStatus = function(status) {
  this.status = status;
  return this.save();
};

// Phương thức instance để toggle trạng thái
postSchema.methods.toggleStatus = function() {
  this.status = this.status === 1 ? 2 : 1;
  return this.save();
};

// Phương thức instance để soft delete
postSchema.methods.softDelete = function() {
  this.deleted_at = new Date();
  this.status = 0;
  return this.save();
};

// Phương thức instance để restore
postSchema.methods.restore = function() {
  this.deleted_at = null;
  this.status = 2;
  return this.save();
};

// Tạo model từ schema
const Post = mongoose.model('Post', postSchema);

module.exports = Post;