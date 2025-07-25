const express = require('express');
const router = express.Router();
const authController = require('../controllers/auth.controllers');
const { protect } = require('../middlewares/auth.middleware');

// Đăng ký tài khoản
router.post('/register', authController.register);

// Đăng nhập
router.post('/login', authController.login);

// Đăng nhập khách hàng
router.post('/customer/login', authController.customerLogin);

// Đăng nhập admin
router.post('/admin/login', authController.adminLogin);

// Thêm route test token
router.get('/test-token', protect, (req, res) => {
  res.json({
    success: true,
    message: 'Token hợp lệ',
    user: {
      id: req.user.id,
      username: req.user.username,
      roles: req.user.roles
    }
  });
});

module.exports = router;
