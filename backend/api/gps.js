const mongoose = require('mongoose');
const GPS = require('../models/GpsData');
require('dotenv').config();

mongoose.connect(process.env.MONGO_URI, {
  useNewUrlParser: true,
  useUnifiedTopology: true
});

module.exports = async (req, res) => {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');

  if (req.method === 'OPTIONS') return res.status(200).end();

  if (req.method === 'POST') {
    try {
      const gps = new GPS(req.body);
      await gps.save();
      res.status(200).send('Saved to MongoDB');
    } catch (err) {
      res.status(500).send(err.message);
    }
  } else if (req.method === 'GET') {
    res.status(200).send('POST your GPS data here.');
  } else {
    res.status(405).send('Method Not Allowed');
  }
};
