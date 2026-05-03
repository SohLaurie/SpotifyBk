const ytSearch = require('yt-search');

// @desc    Search YouTube for a song and return the best Video ID
// @route   GET /api/youtube/search?q=artist+title
// @access  Public
// 
// FRONTEND CONNECTION: 
// This is called by `ApiService.getYoutubeVideoId` in Dart when the `PlayerProvider` 
// attempts to play a song. The frontend passes the artist and title, and this 
// backend route returns the exact YouTube video ID used for the audio stream.
const searchYoutube = async (req, res) => {
  try {
    const { q } = req.query;

    if (!q) {
      return res.status(400).json({ message: 'Please provide a search query' });
    }

    // Search YouTube for the song
    // We add "audio" to the search query to ensure we get audio-only tracks.
    // This avoids "Official Videos" which often have long dialogue intros 
    // that would desynchronize our frontend lyrics.
    const r = await ytSearch(q + ' audio');
    const videos = r.videos;

    if (videos && videos.length > 0) {
      // Find the best match: prioritize "Audio", "Topic", avoid "Official Video"
      // We check the top 5 results to find the most accurate studio audio track.
      let bestVideo = videos[0];
      for (let i = 0; i < Math.min(videos.length, 5); i++) {
        const v = videos[i];
        const titleL = v.title.toLowerCase();
        const authorL = v.author.name.toLowerCase();
        
        // Exclude music videos and prioritize official topic channels or lyric videos
        if ((titleL.includes('audio') || authorL.includes('topic') || titleL.includes('lyric')) && !titleL.includes('official video')) {
          bestVideo = v;
          break; // Found the perfect match
        }
      }

      console.log(`YouTube Search Result: ${bestVideo.title} (${bestVideo.videoId})`);
      
      // Return the video details to the frontend
      // The frontend YoutubePlayerController will use `videoId` to stream the music
      res.json({
        videoId: bestVideo.videoId,
        title: bestVideo.title,
        duration: bestVideo.duration.timestamp,
        author: bestVideo.author.name,
        thumbnail: bestVideo.thumbnail
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
