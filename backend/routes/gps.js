const express = require('express');
const router = express.Router();
const GPS = require('../models/GpsData');

// ✅ POST route to save data
router.post('/v1', async (req, res) => {
  try {
    const gps = new GPS(req.body);
    await gps.save();
    res.status(200).send('Saved to MongoDB');
  } catch (err) {
    res.status(500).send(err.message);
  }
});

module.exports = router;
