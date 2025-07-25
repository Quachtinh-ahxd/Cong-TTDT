const express = require('express');
const router = express.Router();
const postController = require('../controllers/post.controller');
const { authenticate } = require('../middlewares/auth.middleware');
const upload = require('../middlewares/upload.middleware');

// Route công khai
router.get('/', postController.getAll);
router.get('/show/:id', postController.getById);
router.get('/latest', postController.getLatest);
router.get('/search', postController.search);

// Route cần xác thực
router.post('/store', authenticate, upload.single('image'), postController.create);
router.post('/update/:id', authenticate, upload.single('image'), postController.update);
router.delete('/destroy/:id', authenticate, postController.delete);
router.get('/status/:id', authenticate, postController.changeStatus);

module.exports = router;
