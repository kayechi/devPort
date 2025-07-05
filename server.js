require('dotenv').config();
const express = require('express');
const axios = require('axios');
const path = require('path');
const cors = require('cors');

const app = express();
const PORT = process.env.PORT || 3000;

// Middleware
app.use(cors());
app.use(express.json());
app.use(express.static(path.join(__dirname, 'public')));

// API Routes
app.get('/api/user/:username', async (req, res) => {
  try {
    const response = await axios.get(`https://api.github.com/users/${req.params.username}`, {
      headers: {
        'Authorization': process.env.GITHUB_TOKEN ? `token ${process.env.GITHUB_TOKEN}` : '',
        'User-Agent': 'GitHub-Portfolio-Viewer'
      }
    });
    res.json(response.data);
  } catch (error) {
    console.error('GitHub API Error:', error.message);
    res.status(error.response?.status || 500).json({
      error: 'Failed to fetch user data',
      details: error.message
    });
  }
});

app.get('/api/repos/:username', async (req, res) => {
  try {
    const response = await axios.get(
      `https://api.github.com/users/${req.params.username}/repos?sort=updated&per_page=5`,
      {
        headers: {
          'Authorization': process.env.GITHUB_TOKEN ? `token ${process.env.GITHUB_TOKEN}` : '',
          'User-Agent': 'GitHub-Portfolio-Viewer'
        }
      }
    );
    res.json(response.data);
  } catch (error) {
    console.error('GitHub API Error:', error.message);
    res.status(error.response?.status || 500).json({
      error: 'Failed to fetch repositories',
      details: error.message
    });
  }
});

// Serve frontend
app.get('*', (req, res) => {
  res.sendFile(path.join(__dirname, 'public', 'index.html'));
});

app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});
