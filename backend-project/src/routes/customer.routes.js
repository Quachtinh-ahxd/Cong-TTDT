const express = require('express');
const router = express.Router();
const customerController = require('../controllers/customer.controller');
const { protect, restrictTo } = require('../middlewares/auth.middleware');

// Kiểm tra xem customerController có tất cả các phương thức cần thiết không
console.log('Customer Controller Methods:', Object.keys(customerController));

// Public routes
router.get('/', customerController.getAllCustomers);
router.get('/index', customerController.getAllCustomers);
router.get('/show/:id', customerController.getCustomerById);

// Protected routes (admin only)
router.post('/store', 
  protect, 
  restrictTo('admin'), 
  customerController.createCustomer
);

router.post('/update/:id', 
  protect, 
  restrictTo('admin'), 
  customerController.updateCustomer
);

router.delete('/destroy/:id', 
  protect, 
  restrictTo('admin'), 
  customerController.deleteCustomer
);

router.get('/status/:id', 
  protect, 
  restrictTo('admin'), 
  customerController.changeCustomerStatus
);

module.exports = router;
