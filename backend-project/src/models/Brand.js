const mongoose = require('mongoose');
const slugify = require('slugify');

const brandSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
    trim: true
  },
  slug: {
    type: String,
    unique: true
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
brandSchema.pre('save', function(next) {
  if (!this.isModified('name')) return next();
  this.slug = slugify(this.name, { lower: true });
  next();
});

const Brand = mongoose.model('Brand', brandSchema);

module.exports = Brand;