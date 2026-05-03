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
    type: [Object], // Array of Song objects with metadata
    default: [],
  },
  coverUrl: {
    type: String,
    default: '',
  },
}, {
  timestamps: true,
});

module.exports = mongoose.model('Playlist', playlistSchema);
