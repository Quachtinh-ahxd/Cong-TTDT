const mongoose = require('mongoose');
const slugify = require('slugify');

const topicSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, 'Tên chủ đề là bắt buộc'],
      trim: true,
      maxlength: [255, 'Tên chủ đề không được vượt quá 255 ký tự']
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
    parent_id: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Topic',
      default: null
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

// Middleware trước khi lưu - tạo slug từ name
topicSchema.pre('save', function(next) {
  if (this.isModified('name')) {
    this.slug = slugify(this.name, {
      lower: true,
      strict: true,
      locale: 'vi'
    });
  }
  next();
});

// Virtual populate - lấy tất cả bài viết thuộc chủ đề
topicSchema.virtual('posts', {
  ref: 'Post',
  foreignField: 'topic_id',
  localField: '_id'
});

// Virtual populate - lấy tất cả chủ đề con
topicSchema.virtual('children', {
  ref: 'Topic',
  foreignField: 'parent_id',
  localField: '_id'
});

// Phương thức tĩnh để lấy chủ đề gốc (không có parent)
topicSchema.statics.findRoots = function() {
  return this.find({
    parent_id: null,
    status: 1,
    deleted_at: null
  }).sort({ sort_order: 1 });
};

// Phương thức tĩnh để lấy chủ đề đang hoạt động
topicSchema.statics.findActive = function() {
  return this.find({
    status: 1,
    deleted_at: null
  }).sort({ sort_order: 1 });
};

// Phương thức instance để lấy tất cả chủ đề con
topicSchema.methods.getChildren = async function() {
  return await mongoose.model('Topic').find({
    parent_id: this._id,
    status: 1,
    deleted_at: null
  }).sort({ sort_order: 1 });
};

// Phương thức instance để kiểm tra chủ đề có đang hoạt động không
topicSchema.methods.isActive = function() {
  return this.status === 1 && this.deleted_at === null;
};

// Phương thức instance để cập nhật trạng thái
topicSchema.methods.updateStatus = function(status) {
  this.status = status;
  return this.save();
};

// Phương thức instance để toggle trạng thái
topicSchema.methods.toggleStatus = function() {
  this.status = this.status === 1 ? 2 : 1;
  return this.save();
};

// Phương thức instance để soft delete
topicSchema.methods.softDelete = function() {
  this.deleted_at = new Date();
  this.status = 0;
  return this.save();
};

// Phương thức instance để restore
topicSchema.methods.restore = function() {
  this.deleted_at = null;
  this.status = 2;
  return this.save();
};

// Tạo model từ schema
const Topic = mongoose.model('Topic', topicSchema);

module.exports = Topic;