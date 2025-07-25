const express = require('express');
const router = express.Router();
const movieController = require('../controllers/movie.controller');
const { protect, restrictTo } = require('../middlewares/auth.middleware');
const upload = require('../middlewares/upload.middleware');

// Debug middleware
router.use((req, res, next) => {
  console.log(`🎬 Movie route: ${req.method} ${req.path}`);
  next();
});

// Public routes
router.get('/', movieController.getAllMovies);
router.get('/hot', movieController.getHotMovies);
router.get('/search', movieController.searchMovies);
router.get('/genre/:genre', movieController.getMoviesByGenre);
router.get('/show/:id', movieController.getMovieById);
router.get('/reviews/:id', movieController.getMovieReviews);

// Public - Đánh giá không cần login
router.post('/review/:id', movieController.reviewMovie);

// Admin routes
router.post('/store', upload.single('poster'), movieController.createMovie);
router.put('/update/:id', upload.single('poster'), movieController.updateMovie);
router.put('/status/:id', movieController.changeMovieStatus);
router.delete('/destroy/:id', movieController.deleteMovie);
router.get('/admin/stats', movieController.getMovieStats);

// Thêm route sync videos
router.post('/sync-videos', movieController.syncVideosFromDocuments);
router.get('/sync-videos', movieController.syncVideosFromDocuments);

module.exports = router;


