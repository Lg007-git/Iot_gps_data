import React, { useRef, useState, useEffect } from 'react';
import './App.css';

function App() {
  const intervalRef = useRef(null);
  const [vehicleId, setVehicleId] = useState('');
  const [currentData, setCurrentData] = useState(null);

  useEffect(() => {
    const watchId = navigator.geolocation.watchPosition(
      (position) => {
        const { latitude, longitude, speed, heading: course } = position.coords;
        setCurrentData({
          vehicleId,
          latitude,
          longitude,
          speed: speed || 0,
          course: course || 0,
        });
      },
      (error) => {
        console.error("Geolocation error:", error);
      },
      {
        enableHighAccuracy: true,
        maximumAge: 0,
        timeout: 5000,
      }
    );

    return () => {
      navigator.geolocation.clearWatch(watchId);
    };
  }, [vehicleId]);

  const startSendingLocation = () => {
    if (!intervalRef.current && currentData) {
      intervalRef.current = setInterval(async () => {
        try {
          await fetch("https://iot-gps-data.vercel.app/gps/v1", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(currentData),
          });
        } catch (err) {
          console.error("Failed to send:", err);
        }
      }, 3000);
    }
  };

  const stopSendingLocation = () => {
    clearInterval(intervalRef.current);
    intervalRef.current = null;
  };

  return (
    <div className="app-container">
      <div className="card">
        <h1 className="heading">GPS Tracker</h1>

        <input
          type="text"
          placeholder="Enter Vehicle ID"
          value={vehicleId}
          onChange={(e) => setVehicleId(e.target.value)}
          className="input"
        />

        <div className="button-group">
          <button
            onClick={startSendingLocation}
            disabled={!vehicleId.trim()}
            className={`button ${!vehicleId.trim() ? 'disabled' : 'start'}`}
          >
            Start
          </button>
          <button onClick={stopSendingLocation} className="button stop">
            Stop
          </button>
        </div>

        {currentData && (
          <div className="data-container">
            <h2 className="subheading">Live GPS Data</h2>
            <div><strong>Vehicle ID:</strong> {currentData.vehicleId || "Enter Vehicle Id to Start"}</div>
            <div><strong>Latitude:</strong> {currentData.latitude}</div>
            <div><strong>Longitude:</strong> {currentData.longitude}</div>
            <div><strong>Speed:</strong> {currentData.speed}</div>
            <div><strong>Course:</strong> {currentData.course}</div>
          </div>
        )}
      </div>
    </div>
  );
}

export default App;