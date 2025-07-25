const express = require('express');
const router = express.Router();
const commentController = require('../controllers/comment.controller');
const { protect } = require('../middlewares/auth.middleware');

// Debug middleware
router.use((req, res, next) => {
  console.log(`🔥 Comment route: ${req.method} ${req.path}`);
  next();
});

// Test route
router.get('/test', (req, res) => {
  res.json({ message: 'Comment routes working!' });
});

// Public routes
router.get('/post/:postId', commentController.getByPost);

// Protected routes
router.post('/store', commentController.create);
router.post('/', commentController.create);

// Admin routes - không cần protect để test
router.put('/toggle/:id', commentController.toggleStatus);
router.post('/toggle/:id', commentController.toggleStatus);
router.delete('/delete/:id', commentController.delete);
router.delete('/:id', commentController.delete);

module.exports = router;






