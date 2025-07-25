const express = require('express');
const router = express.Router();
const categoryController = require('../controllers/category.controller');
const { protect } = require('../middlewares/auth.middleware');
const { productUpload } = require('../middlewares/upload.middleware');

// Debug middleware
const debugUpload = (req, res, next) => {
  console.log('=== CATEGORY UPLOAD DEBUG ===');
  console.log('Request body:', req.body);
  console.log('Request file:', req.file);
  next();
};

// Public routes
router.get('/', categoryController.getAllCategories);
router.get('/:id', categoryController.getCategoryById);

// Protected routes - SỬA TẤT CẢ upload THÀNH productUpload
router.post('/', 
  protect,
  productUpload.single('image'), // ← SỬA ĐÂY
  debugUpload,
  categoryController.createCategory
);

router.post('/store', 
  protect,
  productUpload.single('image'), // ← SỬA ĐÂY (dòng 28)
  debugUpload,
  categoryController.createCategory
);

router.put('/:id', 
  protect,
  productUpload.single('image'), // ← SỬA ĐÂY
  debugUpload,
  categoryController.updateCategory
);

router.delete('/:id', 
  protect,
  productUpload.single('image'), // ← SỬA ĐÂY
  debugUpload,
  categoryController.deleteCategory
);


module.exports = router;
