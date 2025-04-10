import mongoose from 'mongoose';

const gpsSchema = new mongoose.Schema({
  latitude: Number,
  longitude: Number,
  speed: Number,
  course: Number,
  timestamp: { type: Date, default: Date.now }
});

const GPS= mongoose.model('GPS', gpsSchema);

export default GPS;
