const express = require('express');
const fetch = require('node-fetch');

const router = express.Router();

const CASTR_API_URL = 'https://api.castr.io/v1';
// TODO: Replace with your actual Castr.io API key
const CASTR_API_KEY = process.env.CASTR_API_KEY || 'YOUR_CASTR_API_KEY';

const castrFetch = async (endpoint, options = {}) => {
  const url = `${CASTR_API_URL}${endpoint}`;
  const headers = {
    'Content-Type': 'application/json',
    'x-api-key': CASTR_API_KEY,
    ...options.headers,
  };

  const response = await fetch(url, { ...options, headers });

  if (!response.ok) {
    const error = await response.json();
    throw new Error(error.message || 'Castr.io API request failed');
  }

  return response.json();
};

// Create a new live stream
router.post('/streams', async (req, res) => {
  try {
    const { name, region } = req.body;
    const stream = await castrFetch('/streams', {
      method: 'POST',
      body: JSON.stringify({ name, region }),
    });
    res.json(stream);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Get stream details
router.get('/streams/:id', async (req, res) => {
  try {
    const { id } = req.params;
    const stream = await castrFetch(`/streams/${id}`);
    res.json(stream);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

module.exports = router;
