const express = require('express');
const router = express.Router();
const brandController = require('../controllers/brand.controller');
const { protect } = require('../middlewares/auth.middleware');
const { productUpload } = require('../middlewares/upload.middleware'); // Dùng chung với product

// Debug middleware
const debugMiddleware = (req, res, next) => {
  console.log('=== BRAND ROUTE DEBUG ===');
  console.log('Method:', req.method);
  console.log('Path:', req.path);
  console.log('Original URL:', req.originalUrl);
  console.log('Body keys:', Object.keys(req.body || {}));
  console.log('File:', req.file ? req.file.filename : 'No file');
  next();
};

// GET Routes
router.get('/', 
  debugMiddleware,
  brandController.getAllBrands
);

router.get('/:id', 
  debugMiddleware,
  brandController.getBrandById
);

// POST Routes
router.post('/', 
  debugMiddleware,
  // protect, // TẮT AUTH ĐỂ TEST
  productUpload.single('image'),
  brandController.createBrand
);

router.post('/store', 
  debugMiddleware,
  // protect,
  productUpload.single('image'),
  brandController.createBrand
);

// PUT Routes
router.put('/:id', 
  debugMiddleware,
  // protect,
  productUpload.single('image'),
  brandController.updateBrand
);

// DELETE Routes
router.delete('/:id', 
  debugMiddleware,
  // protect,
  brandController.deleteBrand
);

module.exports = router;
