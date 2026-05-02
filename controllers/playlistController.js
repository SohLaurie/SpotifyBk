const Playlist = require('../models/Playlist');
const User = require('../models/User');

// @desc    Get all playlists for the logged in user
// @route   GET /api/playlists
// @access  Private
const getPlaylists = async (req, res) => {
  try {
    const playlists = await Playlist.find({ user_id: req.user.id });
    res.json(playlists);
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

// @desc    Create a new playlist
// @route   POST /api/playlists
// @access  Private
const createPlaylist = async (req, res) => {
  try {
    const { name, tracks } = req.body;

    if (!name) {
      return res.status(400).json({ message: 'Please provide a playlist name' });
    }

    const playlist = await Playlist.create({
      user_id: req.user.id,
      name,
      tracks: tracks || [],
    });

    res.status(201).json(playlist);
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

// @desc    Update a playlist (add/remove tracks, rename)
// @route   PUT /api/playlists/:id
// @access  Private
const updatePlaylist = async (req, res) => {
  try {
    const playlist = await Playlist.findById(req.params.id);

    if (!playlist) {
      return res.status(404).json({ message: 'Playlist not found' });
    }

    // Check for user
    if (playlist.user_id.toString() !== req.user.id) {
      return res.status(401).json({ message: 'User not authorized' });
    }

    const updatedPlaylist = await Playlist.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true }
    );

    res.json(updatedPlaylist);
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

// @desc    Delete a playlist
// @route   DELETE /api/playlists/:id
// @access  Private
const deletePlaylist = async (req, res) => {
  try {
    const playlist = await Playlist.findById(req.params.id);

    if (!playlist) {
      return res.status(404).json({ message: 'Playlist not found' });
    }

    // Check for user
    if (playlist.user_id.toString() !== req.user.id) {
      return res.status(401).json({ message: 'User not authorized' });
    }

    await playlist.deleteOne();

    res.json({ id: req.params.id, message: 'Playlist deleted' });
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

// @desc    Get user's favorite tracks
// @route   GET /api/favorites
// @access  Private
const getFavorites = async (req, res) => {
  try {
    const user = await User.findById(req.user.id);
    // Filter out any old legacy string IDs that might crash the new frontend
    const validFavorites = user.favorites.filter((f) => typeof f === 'object' && f !== null);
    res.json(validFavorites);
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

// @desc    Add or remove a track from favorites
// @route   POST /api/playlists/favorites
// @access  Private
const toggleFavorite = async (req, res) => {
  try {
    const song = req.body;

    if (!song || !song.id) {
      return res.status(400).json({ message: 'Please provide a song with an ID' });
    }

    const user = await User.findById(req.user.id);

    // Find index, handling both old string IDs and new song objects
    const index = user.favorites.findIndex((s) => {
      if (typeof s === 'string') return s === song.id;
      return s && s.id === song.id;
    });

    if (index > -1) {
      // Remove from favorites
      user.favorites.splice(index, 1);
    } else {
      // Add to favorites (full object)
      user.favorites.push(song);
    }

    await user.save();

    res.json(user.favorites);
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

// @desc    Add a track to a playlist
// @route   POST /api/playlists/:id/add
// @access  Private
const addTrackToPlaylist = async (req, res) => {
  try {
    const song = req.body;
    const { id } = req.params;

    if (!song || !song.id) {
      return res.status(400).json({ message: 'Please provide a song with an ID' });
    }

    const playlist = await Playlist.findById(id);

    if (!playlist) {
      return res.status(404).json({ message: 'Playlist not found' });
    }

    // Check for user
    if (playlist.user_id.toString() !== req.user.id) {
      return res.status(401).json({ message: 'User not authorized' });
    }

    // Check if already in playlist
    const exists = playlist.tracks.some((t) => t.id === song.id);
    if (!exists) {
      playlist.tracks.push(song);
      await playlist.save();
    }

    res.json(playlist);
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

module.exports = {
  getPlaylists,
  createPlaylist,
  updatePlaylist,
  deletePlaylist,
  getFavorites,
  toggleFavorite,
  addTrackToPlaylist,
};
