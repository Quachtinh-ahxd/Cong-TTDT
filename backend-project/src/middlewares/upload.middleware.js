const multer = require('multer');
const path = require('path');
const fs = require('fs');

// Tạo thư mục nếu chưa tồn tại
const createDir = (dir) => {
  if (!fs.existsSync(dir)) {
    fs.mkdirSync(dir, { recursive: true });
  }
};

// File filter chung
const fileFilter = (req, file, cb) => {
  if (file.mimetype.startsWith('image/')) {
    cb(null, true);
  } else {
    cb(new Error('File must be an image'), false);
  }
};

// File filter cho mọi loại file
const allFileFilter = (req, file, cb) => {
  cb(null, true); // Accept all file types
};

// PRODUCT UPLOAD
const productStorage = multer.diskStorage({
  destination: function (req, file, cb) {
    const uploadPath = 'public/images/product';
    createDir(uploadPath);
    cb(null, uploadPath);
  },
  filename: function (req, file, cb) {
    const uniqueName = 'image' + Date.now() + Math.round(Math.random() * 1E9) + path.extname(file.originalname);
    cb(null, uniqueName);
  }
});

const productUpload = multer({
  storage: productStorage,
  fileFilter: fileFilter,
  limits: {
    fileSize: 5 * 1024 * 1024 // 5MB
  }
});

// USER UPLOAD
const userStorage = multer.diskStorage({
  destination: function (req, file, cb) {
    const uploadPath = 'public/images/user';
    console.log('=== USER UPLOAD DESTINATION ===', uploadPath);
    createDir(uploadPath);
    cb(null, uploadPath);
  },
  filename: function (req, file, cb) {
    const uniqueName = 'user' + Date.now() + Math.round(Math.random() * 1E9) + path.extname(file.originalname);
    console.log('=== USER FILENAME ===', uniqueName);
    cb(null, uniqueName);
  }
});

const userUpload = multer({
  storage: userStorage,
  fileFilter: fileFilter,
  limits: {
    fileSize: 2 * 1024 * 1024 // 2MB
  }
});

// FILE UPLOAD (for general files)
const fileStorage = multer.diskStorage({
  destination: function (req, file, cb) {
    const uploadPath = 'public/uploads';
    createDir(uploadPath);
    cb(null, uploadPath);
  },
  filename: function (req, file, cb) {
    const uniqueName = 'file' + Date.now() + Math.round(Math.random() * 1E9) + path.extname(file.originalname);
    cb(null, uniqueName);
  }
});

const fileUpload = multer({
  storage: fileStorage,
  fileFilter: allFileFilter,
  limits: {
    fileSize: 10 * 1024 * 1024 // 10MB
  }
});

// EXPORT TẤT CẢ
module.exports = { 
  productUpload,
  userUpload,
  fileUpload  // ← THÊM fileUpload
};
