const multer = require('multer');
const path = require('path');
const fs = require('fs');

// Tạo thư mục video nếu chưa có
const videoDir = 'public/videos/uploads';
if (!fs.existsSync(videoDir)) {
  fs.mkdirSync(videoDir, { recursive: true });
  console.log(`📁 Created video directory: ${videoDir}`);
}

const videoStorage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, videoDir);
  },
  filename: function (req, file, cb) {
    const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
    const extension = path.extname(file.originalname);
    cb(null, `video-${uniqueSuffix}${extension}`);
  }
});

const videoUpload = multer({ 
  storage: videoStorage,
  limits: {
    fileSize: 5 * 1024 * 1024 * 1024, // 5GB
    files: 5
  },
  fileFilter: (req, file, cb) => {
    console.log('🎥 Video filter check:', file.originalname, file.mimetype);
    
    // Chấp nhận tất cả file (tạm thời)
    cb(null, true);
    
    // Hoặc chỉ video:
    // const allowedTypes = ['video/mp4', 'video/avi', 'video/mov', 'video/wmv'];
    // if (allowedTypes.includes(file.mimetype)) {
    //   cb(null, true);
    // } else {
    //   cb(new Error('Chỉ chấp nhận file video!'), false);
    // }
  }
});

module.exports = videoUpload;

