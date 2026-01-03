const axios = require('axios');

// Get API key from env
const GEOAPIFY_KEY = process.env.GEOAPIFY_KEY;

const geocode = async (req, res) => {
  try {
    const { text } = req.query;

    if (!text) {
      return res.status(400).json({ error: 'Missing search text' });
    }

    if (!GEOAPIFY_KEY) {
      console.error("GEOAPIFY_KEY is missing in environment variables.");
      return res.status(500).json({ error: 'Server configuration error' });
    }

    const url = `https://api.geoapify.com/v1/geocode/search?text=${encodeURIComponent(text)}&apiKey=${GEOAPIFY_KEY}`;

    // Simple caching could be added here later if needed, but per requirements places/regions are main cache target.

    const response = await axios.get(url);
    res.json(response.data);

  } catch (error) {
    console.error('Geoapify error:', error.message);
    res.status(500).json({ error: 'Failed to fetch geocoding data' });
  }
};

module.exports = { geocode };
