require('dotenv').config();
const app = require('./app');
const { setupDatabase } = require('./config/sql.config');
const path = require('path');
const fs = require('fs');

// Tạo các thư mục cần thiết (CHỈ TẠO public/images, KHÔNG TẠO uploads)
const createDirectories = () => {
  const directories = [
    path.join(__dirname, '../public/images/product'),
    path.join(__dirname, '../public/images/files'),
    // Xóa dòng tạo uploads
    // path.join(__dirname, '../uploads/product'),
    // path.join(__dirname, '../uploads'),
  ];
  
  directories.forEach(dir => {
    if (fs.existsSync(dir)) {
      console.log(`📁 Directory exists: ${dir}`);
    } else {
      fs.mkdirSync(dir, { recursive: true });
      console.log(`📁 Created directory: ${dir}`);
    }
  });
};

const startServer = async () => {
  try {
    // Tạo thư mục
    createDirectories();
    
    // Setup database
    console.log('Setting up SQL Server...');
    await setupDatabase();
    console.log('SQL Server setup completed');
    
    // Start server
    const PORT = process.env.PORT || 5000;
    app.listen(PORT, () => {
      console.log(`Server running on port ${PORT}`);
    });
    
  } catch (error) {
    console.error('Failed to start server:', error);
    process.exit(1);
  }
};

startServer();