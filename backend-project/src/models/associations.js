const Product = require('./Product');
const Category = require('./Category');
const Brand = require('./Brand');

// Define associations
Product.belongsTo(Category, { foreignKey: 'category_id', as: 'category' });
Category.hasMany(Product, { foreignKey: 'category_id', as: 'products' });

Product.belongsTo(Brand, { foreignKey: 'brand_id', as: 'brand' });
Brand.hasMany(Product, { foreignKey: 'brand_id', as: 'products' });

module.exports = {
  Product,
  Category,
  Brand
};