const express = require('express');
const cors = require('cors');
const path = require('path');
const fs = require('fs');

const app = express();

// CORS configuration
app.use(cors({
  origin: ['http://localhost:3000', 'http://127.0.0.1:3000'],
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS', 'PATCH'],
  allowedHeaders: ['Content-Type', 'Authorization', 'Accept', 'Origin', 'X-Requested-With']
}));

// Body parser middleware
app.use(express.json({ limit: '50mb' }));
app.use(express.urlencoded({ extended: true, limit: '50mb' }));

// Debug middleware
app.use((req, res, next) => {
  console.log(`🔍 ${req.method} ${req.path}`);
  next();
});

// Serve static files from the public directory
app.use(express.static('public'));

// Serve static images - FIX CHÍNH Ở ĐÂY
app.use('/images', (req, res, next) => {
  let filePath;
  
  if (req.path.startsWith('/product/')) {
    // URL: /images/product/filename.jpg -> public/images/product/filename.jpg
    const filename = path.basename(req.path);
    filePath = path.join(__dirname, '../public/images/product', filename);
  } else {
    // URL: /images/filename.jpg -> public/images/filename.jpg
    filePath = path.join(__dirname, '../public/images', req.path);
  }
  
  console.log(`🔍 Request path: ${req.path}`);
  console.log(`🔍 File path: ${filePath}`);
  
  if (fs.existsSync(filePath)) {
    console.log(`✅ File found: ${filePath}`);
    res.sendFile(path.resolve(filePath));
  } else {
    console.log(`❌ File not found: ${filePath}`);
    res.status(404).json({ 
      success: false,
      message: 'Image not found',
      error: 'FILE_NOT_FOUND' 
    });
  }
});

// Import routes
const authRoutes = require('./routes/auth.routes');
const userRoutes = require('./routes/user.routes');
const categoryRoutes = require('./routes/category.routes');
const brandRoutes = require('./routes/brand.routes');
const productRoutes = require('./routes/product.routes');
const pollRoutes = require('./routes/poll.routes');
const fileRoutes = require('./routes/files.routes');
// app.js - THÊM POST ROUTES
const postRoutes = require('./routes/post.routes');
const topicRoutes = require('./routes/topic.routes');


// Use routes
app.use('/api/auth', authRoutes);
app.use('/api/users', userRoutes);
app.use('/api/user', userRoutes);
app.use('/api/categories', categoryRoutes);
app.use('/api/brands', brandRoutes);
app.use('/api/products', productRoutes);
app.use('/api/polls', pollRoutes);
app.use('/api/files', fileRoutes);
app.use('/api/posts', postRoutes);
app.use('/api/topic', topicRoutes);

// 404 handler
app.use('*', (req, res) => {
  console.log(`❌ 404 - Route not found: ${req.method} ${req.originalUrl}`);
  res.status(404).json({
    success: false,
    message: `Route not found: ${req.method} ${req.originalUrl}`,
    error: 'ROUTE_NOT_FOUND'
  });
});

// Error handler
app.use((error, req, res, next) => {
  console.error('Error:', error);
  res.status(500).json({
    success: false,
    message: error.message || 'Internal server error',
    error: 'INTERNAL_SERVER_ERROR'
  });
});

module.exports = app;
