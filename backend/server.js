const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const gpsRoute = require('./routes/gps.js');
require('dotenv').config();

const app = express();
app.use(cors({
  origin: ['http://localhost:5173','https://iot-gps-data.vercel.app'],
  methods: ['GET', 'POST','OPTIONS'],
  credentials: true
}));
app.use(express.json());
app.options('*', cors());

mongoose.connect(process.env.MONGO_URI, {
  useNewUrlParser: true,
  useUnifiedTopology: true
});

app.use('/gps', gpsRoute); 

app.listen(process.env.PORT || 5000, () => {
  console.log('Server is running');
});
