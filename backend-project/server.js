const app = require('./src/app'); // Đảm bảo import app từ src/app.js
const dotenv = require('dotenv');
const { createDatabaseIfNotExists, createAllTables } = require('./src/config/sqlServer');
const multer = require('multer');
const path = require('path');
const fs = require('fs');
const express = require('express');

// Load environment variables
dotenv.config();

const PORT = process.env.PORT || 5000;

// Kiểm tra file upload middleware
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    // Sửa từ 'files' thành 'product'
    const uploadPath = path.join(__dirname, '../public/images/product');
    
    // Tạo thư mục nếu chưa có
    if (!fs.existsSync(uploadPath)) {
      fs.mkdirSync(uploadPath, { recursive: true });
      console.log(`📁 Created directory: ${uploadPath}`);
    }
    
    console.log('📁 Upload destination:', uploadPath);
    cb(null, uploadPath);
  },
  filename: (req, file, cb) => {
    const filename = Date.now() + '-' + Math.round(Math.random() * 1E9) + path.extname(file.originalname);
    console.log('📄 Generated filename:', filename);
    cb(null, filename);
  }
});

const upload = multer({ 
  storage: storage,
  limits: {
    fileSize: 10 * 1024 * 1024 // 10MB limit
  },
  fileFilter: (req, file, cb) => {
    const allowedTypes = /jpeg|jpg|png|gif|webp/;
    const extname = allowedTypes.test(path.extname(file.originalname).toLowerCase());
    const mimetype = allowedTypes.test(file.mimetype);
    
    if (mimetype && extname) {
      return cb(null, true);
    } else {
      cb(new Error('Only image files are allowed'));
    }
  }
});

const createDirectories = () => {
  const dirs = [
    path.join(__dirname, 'public/images/product'),
    path.join(__dirname, 'uploads/product'),
    path.join(__dirname, 'uploads'),
    path.join(__dirname, '../public/images/product'),
    path.join(__dirname, '../uploads/product')
  ];
  
  dirs.forEach(dir => {
    if (!fs.existsSync(dir)) {
      fs.mkdirSync(dir, { recursive: true });
      console.log(`✅ Created directory: ${dir}`);
    } else {
      console.log(`📁 Directory exists: ${dir}`);
    }
  });
};

createDirectories();

// THÊM STATIC MIDDLEWARE TRƯỚC KHI START SERVER
app.use('/images', express.static(path.join(__dirname, 'public/images')));
app.use('/images', express.static(path.join(__dirname, '../public/images')));
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));
app.use('/uploads', express.static(path.join(__dirname, '../uploads')));

// Serve product images
app.use('/images/product', express.static(path.join(__dirname, 'public/images/product')));
app.use('/images/product', express.static(path.join(__dirname, '../public/images/product')));
app.use('/uploads/product', express.static(path.join(__dirname, 'uploads/product')));
app.use('/uploads/product', express.static(path.join(__dirname, '../uploads/product')));

// Debug middleware để log requests
app.use('/images', (req, res, next) => {
  console.log(`🖼️ Image request: ${req.originalUrl}`);
  
  const imagePath = req.path;
  const possiblePaths = [
    path.join(__dirname, 'public/images', imagePath),
    path.join(__dirname, '../public/images', imagePath),
    path.join(__dirname, 'uploads', imagePath.replace('/product/', '/')),
    path.join(__dirname, '../uploads', imagePath.replace('/product/', '/'))
  ];
  
  console.log(`🔍 Searching for: ${imagePath}`);
  for (const filePath of possiblePaths) {
    console.log(`  📍 ${filePath}: ${fs.existsSync(filePath) ? '✅ FOUND' : '❌ NOT FOUND'}`);
    if (fs.existsSync(filePath)) {
      console.log(`✅ Serving image from: ${filePath}`);
      return res.sendFile(path.resolve(filePath));
    }
  }
  
  console.log(`❌ Image not found: ${imagePath}`);
  res.status(404).json({
    error: 'Image not found',
    path: imagePath,
    searchedPaths: possiblePaths
  });
});

// Khởi động server
let server; // Biến global để track server instance

const startServer = async () => {
  try {
    // Nếu server đã chạy, không start lại
    if (server && server.listening) {
      console.log('Server already running');
      return;
    }
    
    // Chỉ sử dụng SQL Server
    console.log('Setting up SQL Server...');
    await createDatabaseIfNotExists();
    await createAllTables();
    console.log('SQL Server setup completed');
    
    server = app.listen(PORT, () => {
      console.log(`Server running on port ${PORT}`);
    });
    
  } catch (error) {
    console.error('Error starting server:', error);
  }
};

startServer();
