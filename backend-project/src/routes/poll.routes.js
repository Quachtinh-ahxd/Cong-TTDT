const express = require('express');
const router = express.Router();
const pollController = require('../controllers/poll.controller');
const { protect } = require('../middlewares/auth.middleware');

// Public routes
router.get('/', pollController.getAllPolls);
router.get('/show/:id', pollController.getPollById);
router.get('/results/:id', pollController.getPollResults);
router.post('/vote/:id', pollController.votePoll);

// Protected routes (admin only)
router.post('/store', protect, pollController.createPoll);

module.exports = router;