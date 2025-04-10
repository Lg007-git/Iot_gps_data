const mongoose = require('mongoose');
const GPS = require('../models/GpsData');
const cors = require('cors');
const express = require('express');

const app = express();

const corsOptions = {
  origin: ['https://iot-gps-data.vercel.app'],
  methods: ['GET', 'POST', 'OPTIONS'],
  allowedHeaders: ['Content-Type'],
  credentials: true,
  optionsSuccessStatus: 200,
};

app.use(cors(corsOptions));
app.use(express.json());

mongoose.connect(process.env.MONGO_URI, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
});

// POST handler
app.post('/gps/v1', async (req, res) => {
  try {
    const gps = new GPS(req.body);
    await gps.save();
    res.status(200).send('Saved to MongoDB');
  } catch (err) {
    res.status(500).send(err.message);
  }
});

// GET handler
app.get('/gps/v1', (req, res) => {
  res.send('POST your GPS data here.');
});

// For Vercel serverless
module.exports = app;
