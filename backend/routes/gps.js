const express = require('express');
const router = express.Router();
const GPS = require('../models/GpsData');

router.options('/', (req, res) => {
  res.sendStatus(200);
});

// ✅ POST route to save data
router.post('/', async (req, res) => {
  try {
    const gps = new GPS(req.body);
    await gps.save();
    res.status(200).send('Saved to MongoDB');
  } catch (err) {
    res.status(500).send(err.message);
  }
});

module.exports = router;
