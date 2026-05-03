const express = require('express');
const router = express.Router();
const { protect } = require('../middleware/authMiddleware');
const { searchSpotify, getTrackDetails, getArtistDetails, getLyrics, getAlbumTracks, getRelatedArtists } = require('../controllers/spotifyController');

// All Spotify routes are protected so only logged-in users of our app can use them
router.get('/search', protect, searchSpotify);
router.get('/track/:id', protect, getTrackDetails);
router.get('/artist/:id', protect, getArtistDetails);
router.get('/artist/:id/related-artists', protect, getRelatedArtists);
router.get('/album/:id', protect, getAlbumTracks);
router.get('/lyrics', protect, getLyrics);

module.exports = router;
