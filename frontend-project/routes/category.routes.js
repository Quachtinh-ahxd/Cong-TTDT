const express = require('express');
const router = express.Router();
const categoryController = require('../controllers/category.controller');

// GET routes
router.get('/', categoryController.getAll);
router.get('/show/:id', categoryController.getById);

// POST routes  
router.post('/store', categoryController.create);

// PUT/PATCH routes
router.put('/:id', categoryController.update);
router.patch('/:id', categoryController.update);

// DELETE routes
router.delete('/destroy/:id', categoryController.delete);

// Status routes
router.get('/status/:id', categoryController.changeStatus);

module.exports = router;
