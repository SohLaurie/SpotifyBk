const axios = require('axios');
const qs = require('qs');

let spotifyAccessToken = '';
let tokenExpirationTime = 0;

// Helper function to get or refresh Spotify Access Token
const getSpotifyAccessToken = async () => {
  // Check if token exists and is not expired (adding a 1-minute buffer)
  if (spotifyAccessToken && Date.now() < tokenExpirationTime - 60000) {
    return spotifyAccessToken;
  }

  const clientId = process.env.SPOTIFY_CLIENT_ID;
  const clientSecret = process.env.SPOTIFY_CLIENT_SECRET;
  
  const authOptions = {
    method: 'post',
    url: 'https://accounts.spotify.com/api/token',
    data: qs.stringify({ grant_type: 'client_credentials' }),
    headers: {
      'Authorization': 'Basic ' + (Buffer.from(clientId + ':' + clientSecret).toString('base64')),
      'Content-Type': 'application/x-www-form-urlencoded'
    }
  };

  try {
    const response = await axios(authOptions);
    spotifyAccessToken = response.data.access_token;
    // expiresIn is in seconds, convert to milliseconds and add to current time
    tokenExpirationTime = Date.now() + (response.data.expires_in * 1000);
    return spotifyAccessToken;
  } catch (error) {
    console.error('Error fetching Spotify Access Token:', error.response ? error.response.data : error.message);
    throw new Error('Failed to get Spotify access token');
  }
};

// @desc    Search for songs/artists/albums on Spotify
// @route   GET /api/spotify/search?q=query&type=track
// @access  Private (or Public, but usually private in the app)
const searchSpotify = async (req, res) => {
  try {
    const { q, type } = req.query;
    
    if (!q) {
      return res.status(400).json({ message: 'Please provide a search query (q)' });
    }

    const token = await getSpotifyAccessToken();
    const searchType = type || 'track,artist,album';

    const response = await axios.get(`https://api.spotify.com/v1/search?q=${encodeURIComponent(q)}&type=${searchType}`, {
      headers: {
        'Authorization': `Bearer ${token}`
      }
    });

    res.json(response.data);
  } catch (error) {
    console.error('Spotify Search Error:', error.response ? error.response.data : error.message);
    res.status(500).json({ message: 'Error searching Spotify' });
  }
};

// @desc    Get track details from Spotify
// @route   GET /api/spotify/track/:id
// @access  Private
const getTrackDetails = async (req, res) => {
  try {
    const { id } = req.params;
    const token = await getSpotifyAccessToken();

    const response = await axios.get(`https://api.spotify.com/v1/tracks/${id}`, {
      headers: {
        'Authorization': `Bearer ${token}`
      }
    });

    res.json(response.data);
  } catch (error) {
    console.error('Spotify Track Details Error:', error.response ? error.response.data : error.message);
    res.status(500).json({ message: 'Error fetching track details from Spotify' });
  }
};

// @desc    Get artist details from Spotify
// @route   GET /api/spotify/artist/:id
// @access  Private
const getArtistDetails = async (req, res) => {
  try {
    const { id } = req.params;
    const token = await getSpotifyAccessToken();

    const response = await axios.get(`https://api.spotify.com/v1/artists/${id}`, {
      headers: {
        'Authorization': `Bearer ${token}`
      }
    });

    res.json(response.data);
  } catch (error) {
    console.error('Spotify Artist Details Error:', error.response ? error.response.data : error.message);
    res.status(500).json({ message: 'Error fetching artist details from Spotify' });
  }
};

// @desc    Get lyrics for a track
// @route   GET /api/spotify/lyrics?artist=artistName&title=songTitle
// @access  Private
const getLyrics = async (req, res) => {
  try {
    const { artist, title } = req.query;
    
    if (!artist || !title) {
      return res.status(400).json({ message: 'Please provide both artist and title' });
    }

    // Call the free lyrics API (lyrics.ovh)
    const response = await axios.get(`https://api.lyrics.ovh/v1/${encodeURIComponent(artist)}/${encodeURIComponent(title)}`);
    
    res.json({ lyrics: response.data.lyrics });
  } catch (error) {
    // If lyrics are not found (404) or there's another error, return a graceful fallback
    console.error('Lyrics Fetch Error:', error.message);
    res.status(404).json({ message: 'Lyrics not available for this track', lyrics: 'Lyrics not available.' });
  }
};

module.exports = {
  searchSpotify,
  getTrackDetails,
  getArtistDetails,
  getLyrics
};
