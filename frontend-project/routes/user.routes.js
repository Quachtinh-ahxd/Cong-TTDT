const express = require('express');
const router = express.Router();
const userController = require('../controllers/user.controller');

router.get('/', userController.getAll);
router.get('/show/:id', userController.getById);
router.post('/store', userController.create);
router.post('/update/:id', userController.update);
router.delete('/destroy/:id', userController.delete);
router.get('/status/:id', userController.changeStatus);

module.exports = router;