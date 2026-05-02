const mongoose = require('mongoose');

const playlistSchema = new mongoose.Schema({
  user_id: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true,
  },
  name: {
    type: String,
    required: [true, 'Please provide a playlist name'],
    trim: true,
  },
  tracks: {
    type: [String], // Array of Spotify Track IDs
    default: [],
  },
}, {
  timestamps: true,
});

module.exports = mongoose.model('Playlist', playlistSchema);
