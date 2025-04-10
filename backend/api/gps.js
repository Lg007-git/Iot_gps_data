import mongoose from 'mongoose';
import GPS from '../models/GpsData.js';
import cors from 'cors';
import express from 'express';
import dotenv from 'dotenv';

const app = express();

dotenv.config();

const corsOptions = {
  //origin: ['https://iot-gps-data.vercel.app'],
  origin : ['https://iot-gps-data-gq1r.vercel.app'],
  methods: ['GET', 'POST', 'OPTIONS'],
  allowedHeaders: ['Content-Type'],
  credentials: true,
  optionsSuccessStatus: 200,
};

app.use(cors(corsOptions));
app.use(express.json());

mongoose.connect(process.env.MONGO_URI);


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
  
  app.get('/gps/v1', (req, res) => {
    res.send('POST your GPS data here.');
  });

  if (process.env.NODE_ENV !== 'production') {
    const PORT = 5000;
    app.listen(PORT, () => {
      console.log(`🚀 Local server running at http://localhost:${PORT}`);
    });
  }
  
// For Vercel serverless
export default app;

