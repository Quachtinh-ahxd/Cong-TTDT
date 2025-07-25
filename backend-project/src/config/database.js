const { Sequelize } = require('sequelize');

const sequelize = new Sequelize({
  dialect: 'mysql', // hoặc 'postgres', 'sqlite', etc.
  host: process.env.DB_HOST || 'localhost',
  port: process.env.DB_PORT || 3306,
  database: process.env.DB_NAME || 'your_database',
  username: process.env.DB_USER || 'root',
  password: process.env.DB_PASS || '',
  logging: console.log
});

module.exports = sequelize;
