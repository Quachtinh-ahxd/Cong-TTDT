const express = require('express');
const router = express.Router();
const { protect } = require('../middlewares/auth.middleware');
const { userUpload } = require('../middlewares/upload.middleware'); // ← PHẢI LÀ userUpload

// IMPORT CONTROLLER THẬT
const userController = require('../controllers/user.controller');

// Debug middleware
const debugMiddleware = (req, res, next) => {
  console.log('=== USER ROUTE DEBUG ===');
  console.log('Method:', req.method);
  console.log('Path:', req.path);
  console.log('Original URL:', req.originalUrl);
  console.log('Body keys:', Object.keys(req.body || {}));
  next();
};

// GET Routes
router.get('/', 
  debugMiddleware,
  userController.getAllUsers
);

router.get('/:id', 
  debugMiddleware,
  userController.getUserById
);

// POST Routes - Tạo user mới
router.post('/store', 
  debugMiddleware,
  userUpload.single('image'), 
  userController.createUser
);

router.post('/', 
  debugMiddleware,
  userUpload.single('image'), // ← PHẢI LÀ userUpload
  userController.createUser
);

// PUT Routes - Cập nhật user
router.put('/:id', 
  debugMiddleware,
  protect,
  userUpload.single('image'),
  userController.updateUser
);

// DELETE Routes - Xóa user
router.delete('/:id', 
  debugMiddleware,
  protect, 
  userController.deleteUser
);

module.exports = router;




















