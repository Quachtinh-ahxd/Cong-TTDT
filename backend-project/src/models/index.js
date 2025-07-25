// const useSqlServer = process.env.USE_SQL_SERVER === 'true';

// module.exports = {
//   Brand: useSqlServer ? require('./sql/Brand') : require('./Brand'),
//   Category: useSqlServer ? require('./sql/Category') : require('./Category'),
//   Product: useSqlServer ? require('./sql/Product') : require('./Product'),
//   Post: useSqlServer ? require('./sql/Post') : require('./Post'),
//   Topic: useSqlServer ? require('./sql/Topic') : require('./Topic'),
//   Banner: useSqlServer ? require('./sql/Banner') : require('./Banner'),
//   Customer: useSqlServer ? require('./sql/Customer') : require('./Customer'),
//   User: useSqlServer ? require('./sql/User') : require('./User'),
//   Comment: useSqlServer ? require('./sql/Comment') : require('./Comment'),
//   Document: useSqlServer ? require('./sql/Document') : require('./Document'),
//   Poll: require('./sql/Poll')
// };
// const useSqlServer = process.env.USE_SQL_SERVER === 'true';

// const User = require('./sql/User');
// const Category = require('./sql/Category');
// const Brand = require('./sql/Brand');
// const Product = require('./sql/Product');
// const Poll = require('./sql/Poll');
// const File = require('./sql/File');
// const Comment = require('./sql/Comment');

// module.exports = {
//   User,
//   Category,
//   Brand,
//   Product,
//   Poll,
//   File,
//   Comment
// };
const User = require('./sql/User');
const Category = require('./sql/Category');
const Brand = require('./sql/Brand');
const Product = require('./sql/Product');
const Poll = require('./sql/Poll');
const Document = require('./sql/Document'); // ← ĐỔI THÀNH Document
// const File = require('./sql/File'); // ← XÓA DÒNG NÀY

module.exports = {
  User,
  Category,
  Brand,
  Product,
  Poll,
  Document // ← ĐỔI THÀNH Document
  // File // ← XÓA DÒNG NÀY
};