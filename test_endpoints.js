const axios = require('axios');

const BASE_URL = 'http://localhost:5000/api';

async function testEndpoints() {
  console.log('--- Starting Endpoint Tests ---\n');
  
  let token = '';
  let playlistId = '';
  const randomNum = Math.floor(Math.random() * 10000);
  const testUser = {
    firstname: 'Test',
    email: `testuser${randomNum}@example.com`,
    password: 'password123'
  };

  try {
    // 1. Register User
    console.log('1. Testing POST /auth/register...');
    const registerRes = await axios.post(`${BASE_URL}/auth/register`, testUser);
    console.log('   Status:', registerRes.status);
    console.log('   Response ID:', registerRes.data._id);
    
    // 2. Login User
    console.log('\n2. Testing POST /auth/login...');
    const loginRes = await axios.post(`${BASE_URL}/auth/login`, {
      email: testUser.email,
      password: testUser.password
    });
    token = loginRes.data.token;
    console.log('   Status:', loginRes.status);
    console.log('   Token received: Yes');

    const authConfig = { headers: { Authorization: `Bearer ${token}` } };

    // 3. Spotify Search
    console.log('\n3. Testing GET /spotify/search...');
    const searchRes = await axios.get(`${BASE_URL}/spotify/search?q=rihanna`, authConfig);
    console.log('   Status:', searchRes.status);
    console.log('   Tracks found:', searchRes.data.tracks ? searchRes.data.tracks.items.length : 0);
    const sampleTrackId = searchRes.data.tracks.items[0].id;
    console.log('   Sample Track ID:', sampleTrackId);

    // 4. Create Playlist
    console.log('\n4. Testing POST /playlists...');
    const createPlaylistRes = await axios.post(`${BASE_URL}/playlists`, {
      name: 'My Test Playlist',
      tracks: [sampleTrackId]
    }, authConfig);
    playlistId = createPlaylistRes.data._id;
    console.log('   Status:', createPlaylistRes.status);
    console.log('   Playlist Created with ID:', playlistId);

    // 5. Get Playlists
    console.log('\n5. Testing GET /playlists...');
    const getPlaylistsRes = await axios.get(`${BASE_URL}/playlists`, authConfig);
    console.log('   Status:', getPlaylistsRes.status);
    console.log('   Total Playlists:', getPlaylistsRes.data.length);

    // 6. Update Playlist
    console.log('\n6. Testing PUT /playlists/:id...');
    const updatePlaylistRes = await axios.put(`${BASE_URL}/playlists/${playlistId}`, {
      name: 'Updated Test Playlist'
    }, authConfig);
    console.log('   Status:', updatePlaylistRes.status);
    console.log('   New Name:', updatePlaylistRes.data.name);

    // 7. Toggle Favorite
    console.log('\n7. Testing POST /playlists/favorites...');
    const toggleFavRes = await axios.post(`${BASE_URL}/playlists/favorites`, {
      trackId: sampleTrackId
    }, authConfig);
    console.log('   Status:', toggleFavRes.status);
    console.log('   Current Favorites:', toggleFavRes.data);

    // 8. Get Favorites
    console.log('\n8. Testing GET /playlists/favorites...');
    const getFavsRes = await axios.get(`${BASE_URL}/playlists/favorites`, authConfig);
    console.log('   Status:', getFavsRes.status);
    console.log('   Favorites count:', getFavsRes.data.length);

    // 9. Delete Playlist
    console.log('\n9. Testing DELETE /playlists/:id...');
    const deletePlaylistRes = await axios.delete(`${BASE_URL}/playlists/${playlistId}`, authConfig);
    console.log('   Status:', deletePlaylistRes.status);
    console.log('   Message:', deletePlaylistRes.data.message);

    console.log('\n--- All Tests Completed Successfully! ---');
  } catch (error) {
    console.error('\n!!! TEST FAILED !!!');
    if (error.response) {
      console.error('Status:', error.response.status);
      console.error('Data:', error.response.data);
    } else {
      console.error(error.message);
    }
  }
}

testEndpoints();
