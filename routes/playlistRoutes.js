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
  addTrackToPlaylist,
  getPlaylistById,
  removeTrackFromPlaylist
} = require('../controllers/playlistController');

// Favorites routes
router.route('/favorites').get(protect, getFavorites).post(protect, toggleFavorite);

// Playlist routes
router.route('/').get(protect, getPlaylists).post(protect, createPlaylist);
router.route('/:id').get(protect, getPlaylistById).put(protect, updatePlaylist).delete(protect, deletePlaylist);
router.post('/:id/tracks', protect, addTrackToPlaylist);
router.delete('/:id/tracks/:trackId', protect, removeTrackFromPlaylist);

module.exports = router;
