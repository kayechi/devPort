const express = require('express');
const axios = require('axios');
const path = require('path');
require('dotenv').config();

const app = express();
const PORT = process.env.PORT || 3000;

// Serve static files
app.use(express.static(path.join(__dirname, 'public')));

// API proxy endpoints
app.get('/api/user/:username', async (req, res) => {
    try {
        const response = await axios.get(`https://api.github.com/users/${req.params.username}`, {
            headers: {
                'Authorization': `token ${process.env.GITHUB_TOKEN}`
            }
        });
        res.json(response.data);
    } catch (error) {
        res.status(error.response?.status || 500).json({ error: 'Failed to fetch user data' });
    }
});

app.get('/api/repos/:username', async (req, res) => {
    try {
        const response = await axios.get(`https://api.github.com/users/${req.params.username}/repos?sort=updated`, {
            headers: {
                'Authorization': `token ${process.env.GITHUB_TOKEN}`
            }
        });
        res.json(response.data);
    } catch (error) {
        res.status(error.response?.status || 500).json({ error: 'Failed to fetch repositories' });
    }
});

// Serve the main page
app.get('*', (req, res) => {
    res.sendFile(path.join(__dirname, 'public', 'index.html'));
});

app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});