const express = require('express');
const router = express.Router();
// const { protect } = require('../middlewares/auth.middleware');
const { fileUpload } = require('../middlewares/upload.middleware');
const fileController = require('../controllers/files.controller');

// Debug middleware
const debugFileUpload = (req, res, next) => {
  console.log('=== FILE UPLOAD DEBUG ===');
  console.log('Request body:', req.body);
  console.log('Request file:', req.file);
  next();
};

// Routes
router.get('/', fileController.getAllFiles);
router.get('/category/:category', fileController.getDocumentsByCategory); // ← THÊM ROUTE MỚI
router.get('/:id', fileController.getFileById);
router.get('/download/:id', fileController.downloadFile);

router.post('/upload', 
  // protect,
  fileUpload.single('file'),
  debugFileUpload,
  fileController.uploadFile
);

router.delete('/:id', 
  // protect,
  fileController.deleteFile
);

module.exports = router;
