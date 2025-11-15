// backend/server.js
const express = require('express');
const multer = require('multer');
const cors = require('cors');
const app = express();
const PORT = 3000;

app.use(cors());
app.use(express.json());
app.use('/uploads', express.static('uploads'));

const upload = multer({ dest: 'uploads/' });

// Mock database
const users = {
  "user1@example.com": {
    password: "pass123",
    username: "User One",
    email: "user1@example.com",
    age: 3,
    profilePic: "/uploads/default.png",  // default profile image
  }
};

let loggedInUser = null;

// Login endpoint
app.post('/login', (req, res) => {
  const { email, password } = req.body;
  if(users[email] && users[email].password === password){
    loggedInUser = users[email];
    res.json({ success: true, user: loggedInUser });
  } else {
    res.status(401).json({ success: false, message: "Invalid credentials" });
  }
});

// Get profile data for logged in user
app.get('/profile', (req, res) => {
  if(!loggedInUser) return res.status(401).json({ success: false, message: "Not logged in" });
  res.json(loggedInUser);
});

// Update profile including age or profile pic URL
app.put('/profile', upload.single('profilePic'), (req, res) => {
  if(!loggedInUser) return res.status(401).json({ success: false, message: "Not logged in" });

  if(req.body.age) loggedInUser.age = parseInt(req.body.age);
  if(req.body.username) loggedInUser.username = req.body.username;
  
  if(req.file) {
    loggedInUser.profilePic = '/' + req.file.path.replace(/\\/g, '/');
  }
  res.json({ success: true, user: loggedInUser });
});

// Logout endpoint
app.post('/logout', (req, res) => {
  loggedInUser = null;
  res.json({ success: true });
});

app.listen(PORT, () => {
  console.log(`Server started on http://localhost:${PORT}`);
});