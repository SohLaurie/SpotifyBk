const express = require('express');
const router = express.Router();
const { protect } = require('../middleware/authMiddleware');
const { searchSpotify, getTrackDetails, getArtistDetails, getLyrics } = require('../controllers/spotifyController');

// All Spotify routes are protected so only logged-in users of our app can use them
router.get('/search', protect, searchSpotify);
router.get('/track/:id', protect, getTrackDetails);
router.get('/artist/:id', protect, getArtistDetails);
router.get('/lyrics', protect, getLyrics);

module.exports = router;
