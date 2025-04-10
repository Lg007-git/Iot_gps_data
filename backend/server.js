const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const GPS = require('./models/GpsData');
require('dotenv').config();

const app = express();

// app.use(cors({
//   //origin: '*',
//   origin: ['https://iot-gps-data.vercel.app'],
//   methods: ['GET', 'POST', 'OPTIONS'],
//   allowedHeaders: ['Content-Type'],
//   credentials: true,
//   optionsSuccessStatus: 200
// }));

// ✅ Define corsOptions here
const corsOptions = {
  origin: ['https://iot-gps-data.vercel.app'],
  methods: ['GET', 'POST', 'OPTIONS'],
  allowedHeaders: ['Content-Type'],
  credentials: true,
  optionsSuccessStatus: 200
};

app.use(cors(corsOptions));
app.options('*', cors(corsOptions)); // handles preflight 
app.use(express.json());

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

app.get('/gps/v1', (req, res) => {
  res.send('POST your GPS data here.');
});

app.listen(process.env.PORT || 5000, () => {
  console.log('Server is running');
});
module.exports = app;