const express = require('express');
const router = express.Router();
const topicController = require('../controllers/topic.controller');

router.get('/', topicController.getAllTopics);

module.exports = router;


