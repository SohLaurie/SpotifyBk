const express = require('express');
const router = express.Router();
const { getDeezerTrack, searchDeezer } = require('../controllers/deezerController');
const { protect } = require('../middleware/authMiddleware');

// Protect this route so only users of your app can bridge to Deezer
router.get('/track', protect, getDeezerTrack);
router.get('/search', protect, searchDeezer);

module.exports = router;
