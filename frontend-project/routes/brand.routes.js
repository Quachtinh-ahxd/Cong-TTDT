const express = require('express');
const router = express.Router();
const brandController = require('../controllers/brand.controller');

// GET routes
router.get('/', brandController.getAll);
router.get('/show/:id', brandController.getById);

// POST routes
router.post('/store', brandController.create);

// PUT/PATCH routes
router.put('/:id', brandController.update);
router.patch('/:id', brandController.update);

// DELETE routes
router.delete('/destroy/:id', brandController.delete);

// Status routes
router.get('/status/:id', brandController.changeStatus);

module.exports = router;
