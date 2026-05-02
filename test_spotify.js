const axios = require('axios');
const qs = require('qs');
require('dotenv').config({ path: __dirname + '/.env' });

const testSpotify = async () => {
  const clientId = process.env.SPOTIFY_CLIENT_ID;
  const clientSecret = process.env.SPOTIFY_CLIENT_SECRET;

  console.log('Testing with Client ID:', clientId);

  try {
    // 1. Get Token
    const authOptions = {
      method: 'post',
      url: 'https://accounts.spotify.com/api/token',
      data: qs.stringify({ grant_type: 'client_credentials' }),
      headers: {
        'Authorization': 'Basic ' + (Buffer.from(clientId + ':' + clientSecret).toString('base64')),
        'Content-Type': 'application/x-www-form-urlencoded'
      }
    };

    console.log('Fetching token...');
    const tokenRes = await axios(authOptions);
    const token = tokenRes.data.access_token;
    console.log('Token received successfully.');

    // 2. Search
    console.log('Searching for "Daft Punk"...');
    const searchRes = await axios.get(`https://api.spotify.com/v1/search?q=Daft%20Punk&type=track&limit=1`, {
      headers: { 'Authorization': `Bearer ${token}` }
    });

    console.log('Search results received:');
    console.log(JSON.stringify(searchRes.data, null, 2).substring(0, 500) + '...');
    
    if (searchRes.data.tracks && searchRes.data.tracks.items.length > 0) {
        console.log('\n✅ SUCCESS: Found', searchRes.data.tracks.items.length, 'tracks.');
    } else {
        console.log('\n❌ FAILURE: No tracks found.');
    }

  } catch (error) {
    console.error('\n❌ ERROR:', error.response ? error.response.data : error.message);
  }
};

testSpotify();
