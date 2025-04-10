import mongoose from 'mongoose';
import GPS from '../models/GpsData.js';
import cors from 'cors';
import express from 'express';
import dotenv from 'dotenv';

dotenv.config();

const app = express();

const corsOptions = {
  origin: ['https://iot-gps-data-gq1r.vercel.app','http://localhost:5173'],
  methods: ['GET', 'POST', 'OPTIONS'],
  allowedHeaders: ['Content-Type'],
};

app.use(cors(corsOptions));
app.use(express.json());

mongoose.connect(process.env.MONGO_URI);

// Routes
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

// Only for local development:
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`✅ Server running on http://localhost:${PORT}`);
});

// Export only for Vercel deployment
export default app;
