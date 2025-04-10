import mongoose from 'mongoose';
import GPS from '../models/GpsData.js';
import dotenv from 'dotenv';

dotenv.config();

let isConnected = false;

export default async function handler(req, res) {
  // CORS headers
  res.setHeader('Access-Control-Allow-Origin', 'https://iot-gps-data-gq1r.vercel.app');
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');
  res.setHeader('Access-Control-Allow-Credentials', 'true');

  // Preflight request
  if (req.method === 'OPTIONS') {
    return res.status(200).end();
  }

  if (!isConnected) {
    await mongoose.connect(process.env.MONGO_URI);
    isConnected = true;
  }

  if (req.method === 'POST') {
    try {
      const gps = new GPS(req.body);
      await gps.save();
      return res.status(200).send('Saved to MongoDB');
    } catch (err) {
      return res.status(500).send(err.message);
    }
  } else if (req.method === 'GET') {
    return res.send('POST your GPS data here.');
  } else {
    return res.status(405).send('Method Not Allowed');
  }
}
