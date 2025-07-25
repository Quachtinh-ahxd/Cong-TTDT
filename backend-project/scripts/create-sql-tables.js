const { createAllTables } = require('../src/config/sqlServer');
const dotenv = require('dotenv');

// Load environment variables
dotenv.config();

// Hàm chạy tạo bảng
const run = async () => {
  try {
    console.log('Starting to create SQL Server tables...');
    await createAllTables();
    console.log('SQL Server tables created successfully!');
    process.exit(0);
  } catch (error) {
    console.error('Error creating SQL Server tables:', error);
    process.exit(1);
  }
};

// Chạy hàm
run();