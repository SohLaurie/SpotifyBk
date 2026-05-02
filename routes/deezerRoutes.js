const express = require('express');
const router = express.Router();
const { getDeezerTrack } = require('../controllers/deezerController');
const { protect } = require('../middleware/authMiddleware');

// Protect this route so only users of your app can bridge to Deezer
router.get('/track', protect, getDeezerTrack);

module.exports = router;
