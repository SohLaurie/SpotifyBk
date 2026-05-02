const axios = require('axios');

// @desc    Get a playable Deezer URL for a Spotify track
// @route   GET /api/deezer/track?artist=artistName&title=songTitle
// @access  Public (or Protected)
const getDeezerTrack = async (req, res) => {
  try {
    const { artist, title } = req.query;

    if (!artist || !title) {
      return res.status(400).json({ message: 'Please provide artist and title' });
    }

    // Search Deezer for the track
    // We use a strict search format: artist:"Artist Name" track:"Track Title"
    const query = `artist:"${artist}" track:"${title}"`;
    const response = await axios.get(`https://api.deezer.com/search?q=${encodeURIComponent(query)}`);

    if (response.data.data && response.data.data.length > 0) {
      const track = response.data.data[0];
      res.json({
        id: track.id,
        title: track.title,
        artist: track.artist.name,
        preview: track.preview, // This is the 30-second playable URL
        link: track.link
      });
    } else {
      // If no exact match, try a broader search
      const broadResponse = await axios.get(`https://api.deezer.com/search?q=${encodeURIComponent(artist + ' ' + title)}`);
      
      if (broadResponse.data.data && broadResponse.data.data.length > 0) {
        const track = broadResponse.data.data[0];
        res.json({
          id: track.id,
          title: track.title,
          artist: track.artist.name,
          preview: track.preview,
          link: track.link
        });
      } else {
        res.status(404).json({ message: 'Track not found on Deezer' });
      }
    }
  } catch (error) {
    console.error('Deezer Error:', error.message);
    res.status(500).json({ message: 'Error fetching from Deezer' });
  }
};

module.exports = {
  getDeezerTrack
};
