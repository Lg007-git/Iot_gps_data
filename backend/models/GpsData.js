const mongoose = require('mongoose');

const gpsSchema = new mongoose.Schema({
  latitude: Number,
  longitude: Number,
  speed: Number,
  course: Number,
  timestamp: { type: Date, default: Date.now }
});

module.exports = mongoose.models.GPS || mongoose.model('GPS', gpsSchema);
