// Import required modules
const express = require('express');
const cors = require('cors');
const axios = require('axios');
const firebase = require('firebase/compat/app');
require('firebase/compat/auth');
require('firebase/compat/firestore');
require('firebase/storage');

// Initialize Firebase
const firebaseConfig = {
  // Your Firebase configuration
    apiKey: 'AIzaSyCQhdetm3JM6hykQRrwseFKZcLTJdpX3L4',
};
firebase.initializeApp(firebaseConfig);

// Initialize Express app
const app = express();

// Enable CORS
app.use(cors());

// Enable JSON body parsing
app.use(express.json());

// Routes
// Zoom API Authentication and Meeting Creation
app.post('/api/meetings', async (req, res) => {
  const { userToken, topic } = req.body;

  try {
    const response = await axios.post(
      'https://zoom.us/oauth/authorize?response_type=code&client_id=h5un_jbARemLlTPxbBEaqA&redirect_uri=http%3A%2F%2Flocalhost%3A3000%2F',
      {
        topic,
        type: 2,
      },
      {
        headers: {
          Authorization: `Bearer ${userToken}`,
        },
      }
    );

    const joinUrl = response.data.join_url;

    res.json({ joinUrl });
  } catch (error) {
    console.error(error);

    res.status(500).json({ error: 'Failed to create Zoom Meeting' });
  }
});

// User Authentication and Management using Firebase
// Sign Up
app.post('/api/auth/sign-up', async (req, res) => {
  const { email, password } = req.body;

  try {
    const userCredential = await firebase
      .auth()
      .createUserWithEmailAndPassword(email, password);

    const user = userCredential.user;

    res.json({ user });
  } catch (error) {
    console.error(error);

    res.status(500).json({ error: 'Failed to sign up' });
  }
});

// Sign In
app.post('/api/auth/sign-in', async (req, res) => {
  const { email, password } = req.body;

  try {
    const userCredential = await firebase
      .auth()
      .signInWithEmailAndPassword(email, password);

    const user = userCredential.user;

    res.json({ user });
  } catch (error) {
    console.error(error);

    res.status(500).json({ error: 'Failed to sign in' });
  }
});

// Sign Out
app.post('/api/auth/sign-out', async (req, res) => {
  try {
    await firebase.auth().signOut();

    res.json({ success: true });
  } catch (error) {
    console.error(error);

    res.status(500).json({ error: 'Failed to sign out' });
  }
});

// Start server
app.listen(5000, () => {
  console.log('Server started on port 5000');
});
