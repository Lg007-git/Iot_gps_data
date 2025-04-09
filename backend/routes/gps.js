const express = require('express');
const router = express.Router();
const GPS = require('../models/GpsData');

// ✅ POST route to save data
router.post('/', async (req, res) => {
  try {
    const gps = new GPS(req.body);
    await gps.save();
    res.send('Saved to MongoDB');
  } catch (err) {
    res.status(500).send(err.message);
  }
});

// ✅ GET route to fetch data
router.get('/', async (req, res) => {
  try {
    const data = await GPS.find().sort({ timestamp: -1 });
    res.json(data);
  } catch (err) {
    res.status(500).send(err.message);
  }
});

module.exports = router;
