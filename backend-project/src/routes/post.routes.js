const express = require('express');
const router = express.Router();
const postController = require('../controllers/post.controller'); // Dùng controller thật

router.get('/', postController.getAllPosts);
router.get('/:id', postController.getPostById);
router.post('/', postController.createPost);
router.put('/:id', postController.updatePost);
router.delete('/:id', postController.deletePost);

module.exports = router;
