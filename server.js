require('dotenv').config();
console.log("➔ server.js: Loaded WEATHER_API_KEY =", !!process.env.WEATHER_API_KEY);
const express = require('express');
const fetch = require('node-fetch');        // or global fetch in Node ≥18
const app = express();
const port = process.env.PORT || 5000;      // Or whatever port you choose

app.use(express.json());

// CORS headers if your frontend is on a different origin
app.use((req, res, next) => {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET,OPTIONS');
  next();
});

// Example endpoint: /api/weather?city=London
app.get('/api/weather', async (req, res) => {
  const city = req.query.city;
  if (!city) {
    return res.status(400).json({ error: 'No city provided' });
  }
  const apiKey = process.env.WEATHER_API_KEY;
  console.log(`➔ server.js: Received /api/weather?city=${city}, API key present? ${!!apiKey}`);
  if (!apiKey) {
    // If env var is missing, immediately return 500 with a clear message
    return res.status(500).json({ error: 'Missing WEATHER_API_KEY on server' });
  }
  try {
    const apiResponse = await fetch(
      `https://api.openweathermap.org/data/2.5/weather?q=${encodeURIComponent(city)}&units=metric&appid=${apiKey}`
    );

    if (!apiResponse.ok) {
      const text = await apiResponse.text();
      console.error("➔ server.js: OpenWeather returned non‐OK status", apiResponse.status, text);
      return res.status(apiResponse.status).json({ error: `OpenWeather API error: ${text}` });
    }

    const data = await apiResponse.json();
    if (data.cod == '404') {
      return res.status(404).json(data);
    }
    res.json(data);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Server Error', details: err.message});
  }
});

app.listen(port, () => {
  console.log(`Server listening on port ${port}`);
});
