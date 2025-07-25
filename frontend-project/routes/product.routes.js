const express = require('express');
const router = express.Router();
const productController = require('../controllers/product.controller');

// Route lấy sản phẩm theo trạng thái duyệt
router.get('/list', productController.getProductsByApprovalStatus);

// Route duyệt và từ chối sản phẩm
router.put('/approve/:id', productController.approveProduct);
router.put('/reject/:id', productController.rejectProduct);

// Các route khác
router.get('/', productController.getAll);
router.get('/show/:id', productController.getById);
router.post('/store', productController.create);
router.post('/update/:id', productController.update);
router.delete('/destroy/:id', productController.delete);
router.get('/status/:id', productController.changeStatus);

module.exports = router;


