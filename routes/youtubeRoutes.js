const express = require('express');
const router = express.Router();
const { searchYoutube } = require('../controllers/youtubeController');
const { protect } = require('../middleware/authMiddleware');

// Route to get YouTube video ID for a song
router.get('/search', protect, searchYoutube);

module.exports = router;
