const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const gpsRoute = require('./routes/gps.js');
const GPS = require('../models/GpsData');
require('dotenv').config();

const app = express();
app.use(cors({
  origin: '*',
  //origin: ['http://localhost:5173','https://iot-gps-data.vercel.app'],
  methods: ['GET', 'POST','OPTIONS'],
  allowedHeaders: ['Content-Type'],
  credentials: true
}));
app.use(express.json());
app.options('*', cors());

mongoose.connect(process.env.MONGO_URI, {
  useNewUrlParser: true,
  useUnifiedTopology: true
});

app.post('/gps/v1', async (req, res) => {
  try {
    const gps = new GPS(req.body);
    await gps.save();
    res.status(200).send('Saved to MongoDB');
  } catch (err) {
    res.status(500).send(err.message);
  }
});

app.listen(process.env.PORT || 5000, () => {
  console.log('Server is running');
});
module.exports = app;