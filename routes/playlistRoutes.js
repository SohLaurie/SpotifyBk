const express = require('express');
const router = express.Router();
const { protect } = require('../middleware/authMiddleware');
const {
  getPlaylists,
  createPlaylist,
  updatePlaylist,
  deletePlaylist,
  getFavorites,
  toggleFavorite,
} = require('../controllers/playlistController');

// Favorites routes
router.route('/favorites').get(protect, getFavorites).post(protect, toggleFavorite);

// Playlist routes
router.route('/').get(protect, getPlaylists).post(protect, createPlaylist);
router.route('/:id').put(protect, updatePlaylist).delete(protect, deletePlaylist);

module.exports = router;
