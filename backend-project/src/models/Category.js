const mongoose = require('mongoose');
const slugify = require('slugify');

const categorySchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
    trim: true
  },
  slug: {
    type: String,
    unique: true
  },
  parent_id: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Category',
    default: null
  },
  image: {
    type: String,
    default: null
  },
  description: {
    type: String,
    default: null
  },
  status: {
    type: Number,
    default: 2
  },
  created_by: {
    type: Number,
    default: 1
  },
  updated_by: {
    type: Number,
    default: null
  }
}, {
  timestamps: true
});

// Generate slug before saving
categorySchema.pre('save', function(next) {
  if (!this.isModified('name')) return next();
  this.slug = slugify(this.name, { lower: true });
  next();
});

const Category = mongoose.model('Category', categorySchema);

module.exports = Category;