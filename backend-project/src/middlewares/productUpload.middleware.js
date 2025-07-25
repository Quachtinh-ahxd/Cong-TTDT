const express = require('express');
const router = express.Router();
const productController = require('../controllers/product.controller');
const protect = require('../middlewares/auth.middleware');
const debugUpload = require('../middlewares/debugUpload.middleware');
const debugUpdateMiddleware = require('../middlewares/debugUpdate.middleware');
const productUpload = require('../middlewares/productUpload.middleware');

// @route   POST api/products/store
// @desc    Create a new product
// @access  Private
router.post('/store', 
  (req, res, next) => {
    console.log('=== PRODUCT STORE ROUTE DEBUG ===');
    console.log('POST /store called');
    console.log('Content-Type:', req.headers['content-type']);
    next();
  },
  protect,
  productUpload.single('image'), // Dùng productUpload thay vì upload
  debugUpload,
  productController.createProduct
);

// @route   PUT api/products/:id
// @desc    Update a product
// @access  Private
router.put('/:id', productUpload.single('image'), debugUpload, productController.updateProduct);

// @route   PUT api/products/update/:id
// @desc    Update a product
// @access  Private
router.put('/update/:id', 
  debugUpdateMiddleware,
  productUpload.single('image'), 
  productController.updateProduct
);

// @route   PATCH api/products/:id
// @desc    Partially update a product
// @access  Private
router.patch('/:id', 
  debugUpdateMiddleware,
  productUpload.single('image'), 
  productController.updateProduct
);

// @route   GET api/products
// @desc    Get all products
// @access  Public
router.get('/', productController.getAllProducts);

// @route   GET api/products/:id
// @desc    Get a single product by ID
// @access  Public
router.get('/:id', productController.getProductById);

// @route   DELETE api/products/:id
// @desc    Delete a product
// @access  Private
router.delete('/:id', protect, productController.deleteProduct);

module.exports = router;