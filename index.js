const express = require('express');
const cors = require('cors');
const dotenv = require('dotenv');
const connectDB = require('./config/db');

// Route files
const authRoutes = require('./routes/authRoutes');
const playlistRoutes = require('./routes/playlistRoutes');
const spotifyRoutes = require('./routes/spotifyRoutes');
const deezerRoutes = require('./routes/deezerRoutes');
const youtubeRoutes = require('./routes/youtubeRoutes');

// Load environment variables
dotenv.config();

// Connect to database
connectDB();

const app = express();

// Body parser
app.use(express.json());

// Enable CORS
app.use(cors());

// Request logging middleware
app.use((req, res, next) => {
  console.log(`[${new Date().toISOString()}] ${req.method} ${req.url}`);
  if (req.body && Object.keys(req.body).length > 0) {
    console.log('Body:', JSON.stringify(req.body, null, 2));
  }
  next();
});

// Mount routers
app.use('/api/auth', authRoutes);
app.use('/api/playlists', playlistRoutes);
app.use('/api/spotify', spotifyRoutes);
app.use('/api/deezer', deezerRoutes);
app.use('/api/youtube', youtubeRoutes);

// Base route
app.get('/', (req, res) => {
  res.send('Spotify Clone API is running...');
});

const PORT = process.env.PORT || 5000;

app.listen(PORT, '0.0.0.0', () => {
  console.log(`Server running on http://localhost:${PORT}`);
  console.log(`Local Network: http://172.20.10.3:${PORT}`);
});
