const ytSearch = require('yt-search');

// @desc    Search YouTube for a song and return the best Video ID
// @route   GET /api/youtube/search?q=artist+title
// @access  Public
const searchYoutube = async (req, res) => {
  try {
    const { q } = req.query;

    if (!q) {
      return res.status(400).json({ message: 'Please provide a search query' });
    }

    // Search YouTube for the song
    // We add "topic" or "official audio" to the search to get better results
    const r = await ytSearch(q + ' official audio');
    const videos = r.videos;

    if (videos && videos.length > 0) {
      const video = videos[0];
      console.log(`YouTube Search Result: ${video.title} (${video.videoId})`);
      res.json({
        videoId: video.videoId,
        title: video.title,
        duration: video.duration.timestamp,
        author: video.author.name,
        thumbnail: video.thumbnail
      });
    } else {
      res.status(404).json({ message: 'No video found on YouTube' });
    }
  } catch (error) {
    console.error('YouTube Search Error:', error.message);
    res.status(500).json({ message: 'Error searching YouTube' });
  }
};

module.exports = {
  searchYoutube
};
