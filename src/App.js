import { useState } from 'react';
import axios from 'axios';
import firebase from 'firebase/compat/app';
import 'firebase/compat/auth';

// Initialize Firebase
const firebaseConfig = {
  // Your Firebase configuration
  apiKey: 'AIzaSyCQhdetm3JM6hykQRrwseFKZcLTJdpX3L4',
};
firebase.initializeApp(firebaseConfig);

function App() {
  const [user, setUser] = useState(null);
  const [signInEmail, setSignInEmail] = useState('');
  const [signInPassword, setSignInPassword] = useState('');
  const [signUpEmail, setSignUpEmail] = useState('');
  const [signUpPassword, setSignUpPassword] = useState('');
  const [topic, setTopic] = useState('');
  const [joinUrl, setJoinUrl] = useState('');

  // Handle Sign In
  const handleSignIn = async (e) => {
    e.preventDefault();

    try {
      const response = await axios.post('http://localhost:5000/api/auth/sign-in', {
        email: signInEmail,
        password: signInPassword,
      });

      const userData = response.data.user;
      const user = {
        email: userData.email,
        uid: userData.uid,
      };

      setUser(user);
    } catch (error) {
      console.error(error);
    }
  };

  // Handle Sign Up
  const handleSignUp = async (e) => {
    e.preventDefault();

    try {
      const response = await axios.post('http://localhost:5000/api/auth/sign-up', {
        email: signUpEmail,
        password: signUpPassword,
      });

      const userData = response.data.user;
      const user = {
        email: userData.email,
        uid: userData.uid,
      };

      setUser(user);
    } catch (error) {
      console.error(error);
    }
  };

  // Handle Sign Out
  const handleSignOut = async () => {
    try {
      await axios.post('http://localhost:5000/api/auth/sign-out');

      setUser(null);
    } catch (error) {
      console.error(error);
    }
  };

  // Handle Meeting Creation
  const handleCreateMeeting = async (e) => {
    e.preventDefault();

    try {
      const idToken = await firebase.auth().currentUser.getIdToken();

      const response = await axios.post('http://localhost:5000/api/meetings', {
        userToken: idToken,
        topic,
      });

      setJoinUrl(response.data.joinUrl);
    } catch (error) {
      console.error(error);
    }
  };

  return (
    <div className="App">
      {user ? (
        <>
          <h1>Welcome, {user.email}</h1>
          <button onClick={handleSignOut}>Sign Out</button>
          <form onSubmit={handleCreateMeeting}>
            <input
              type="text"
              placeholder="Topic"
              value={topic}
              onChange={(e) => setTopic(e.target.value)}
              required
            />
            <button type="submit">Create Meeting</button>
          </form>
          {joinUrl && (
            <div>
              <h2>Join URL:</h2>
              <a href={joinUrl} target="_blank" rel="noopener noreferrer">
                {joinUrl}
              </a>
            </div>
          )}
        </>
      ) : (
        <>
          <h1>Sign In</h1>
          <form onSubmit={handleSignIn}>
            <input
              type="email"
              placeholder="Email"
              value={signInEmail}
              onChange={(e) => setSignInEmail(e.target.value)}
              required
            />
            <input
              type="password"
              placeholder="Password"
              value={signInPassword}
              onChange={(e) => setSignInPassword(e.target.value)}
              required
            />
            <button type="submit">Sign In</button>
          </form>
          <h1>Sign Up</h1>
          <form onSubmit={handleSignUp}>
            <input
              type="email"
              placeholder="Email"
              value={signUpEmail}
              onChange={(e) => setSignUpEmail(e.target.value)}
              required
            />
            <input
              type="password"
              placeholder="Password"
              value={signUpPassword}
              onChange={(e) => setSignUpPassword(e.target.value)}
              required
            />
            <button type="submit">Sign Up</button>
          </form>
        </>
      )}
    </div>
  );
}

export default App;


