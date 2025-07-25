const { DataTypes } = require('sequelize');
const sequelize = require('../config/database');
const slugify = require('slugify');

const Product = sequelize.define('Product', {
  id: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true
  },
  name: {
    type: DataTypes.STRING,
    allowNull: false
  },
  slug: {
    type: DataTypes.STRING,
    unique: true
  },
  category_id: {
    type: DataTypes.INTEGER,
    allowNull: false
  },
  brand_id: {
    type: DataTypes.INTEGER,
    allowNull: false
  },
  image: {
    type: DataTypes.STRING,
    allowNull: true
  },
  description: {
    type: DataTypes.TEXT,
    allowNull: true
  },
  detail: {
    type: DataTypes.TEXT,
    allowNull: true
  },
  status: {
    type: DataTypes.INTEGER,
    defaultValue: 1, // 1: active, 0: deleted
    allowNull: false
  },
  is_approved: {
    type: DataTypes.INTEGER,
    defaultValue: 0, // 0: chờ duyệt, 1: đã duyệt, 2: từ chối
    allowNull: false
  },
  reject_reason: {
    type: DataTypes.TEXT,
    allowNull: true
  },
  created_by: {
    type: DataTypes.INTEGER,
    allowNull: true
  },
  updated_by: {
    type: DataTypes.INTEGER,
    allowNull: true
  }
}, {
  timestamps: true,
  paranoid: true, // Enables soft deletes
  underscored: true, // Use snake_case for fields
  hooks: {
    beforeCreate: (product) => {
      if (product.name) {
        product.slug = slugify(product.name, { lower: true });
      }
    },
    beforeUpdate: (product) => {
      if (product.changed('name')) {
        product.slug = slugify(product.name, { lower: true });
      }
    }
  }
});

module.exports = Product;
