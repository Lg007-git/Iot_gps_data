import mongoose from 'mongoose';
import GPS from '../models/GpsData.js';
import dotenv from 'dotenv';

dotenv.config();

let isConnected = false;

export default async function handler(req, res) {
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
