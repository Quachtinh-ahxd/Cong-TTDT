const express = require('express');
const router = express.Router();
const productController = require('../controllers/product.controller');
const { protect } = require('../middlewares/auth.middleware');
const { productUpload } = require('../middlewares/upload.middleware');

// Debug middleware
const debugUpload = (req, res, next) => {
  console.log('=== CREATE PRODUCT DEBUG ===');
  console.log('Request body:', req.body);
  console.log('Request file:', req.file);
  next();
};

const debugUpdateMiddleware = (req, res, next) => {
  console.log('=== UPDATE PRODUCT DEBUG ===');
  console.log('Request params:', req.params);
  console.log('Request body:', req.body);
  console.log('Request file:', req.file);
  next();
};

const debugDeleteMiddleware = (req, res, next) => {
  console.log('=== DELETE PRODUCT DEBUG ===');
  console.log('Product ID to delete:', req.params.id);
  console.log('User:', req.user?.id);
  next();
};

// Public routes
router.get('/', productController.getAllProducts);
router.get('/show/:id', productController.getProductById);
router.get('/category/:categoryId', productController.getProductsByCategory);
router.get('/brand/:brandId', productController.getProductsByBrand);
router.get('/search', productController.searchProducts);
router.get('/slug/:slug', productController.getProductBySlug);

// Protected routes
router.post('/store', 
  protect,
  productUpload.single('image'),
  debugUpload,
  productController.createProduct
);

router.put('/:id', 
  protect,
  productUpload.single('image'), 
  debugUpdateMiddleware,
  productController.updateProduct
);

router.put('/update/:id', 
  protect,
  productUpload.single('image'), 
  debugUpdateMiddleware,
  productController.updateProduct
);

router.patch('/:id', 
  protect,
  productUpload.single('image'), 
  debugUpdateMiddleware,
  productController.updateProduct
);

// DELETE ROUTES - THÊM CÁC ROUTE XÓA
router.delete('/:id', 
  protect, 
  debugDeleteMiddleware,
  productController.deleteProduct
);

router.delete('/destroy/:id', // ← THÊM ROUTE DESTROY
  protect, 
  debugDeleteMiddleware,
  productController.deleteProduct
);

router.post('/delete/:id', // ← THÊM ROUTE POST DELETE (nếu frontend dùng POST)
  protect, 
  debugDeleteMiddleware,
  productController.deleteProduct
);

// Admin routes
router.patch('/:id/approve', protect, productController.approveProduct);
router.patch('/:id/reject', protect, productController.rejectProduct);
router.put('/:id/approve', productController.approveProduct);

module.exports = router;
