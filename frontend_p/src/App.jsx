import React, { useRef, useState, useEffect } from 'react';
import './App.css';

function App() {
  const intervalRef = useRef(null);
  const vehicleIdRef = useRef('');
  const [vehicleId, setVehicleId] = useState('');
  const [currentData, setCurrentData] = useState(null);
  const [sendStatus, setSendStatus] = useState(null);

  useEffect(() => {
    vehicleIdRef.current = vehicleId; // keep ref updated with latest input
  }, [vehicleId]);

  useEffect(() => {
    const watchId = navigator.geolocation.watchPosition(
      (position) => {
        const { latitude, longitude, speed, heading: course, accuracy  } = position.coords;
        if (accuracy > 20) return;
        setCurrentData({
          vehicleId: vehicleIdRef.current,
          latitude,
          longitude,
          speed: speed || 0,
          course: course || 0,
        });
        console.log(currentData);
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
  }, []);

  const startSendingLocation = () => {
    if (!intervalRef.current && currentData) {
      intervalRef.current = setInterval(async () => {
        try {
          const res = await fetch("https://iot-gps-data.vercel.app/gps/v1", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(currentData),
          });

          if (!res.ok) throw new Error("HTTP error");
          setSendStatus('success');
        } catch (err) {
          setSendStatus('error');
          console.error("Failed to send:", err);
        }

        // Remove blink after 1.5s
        setTimeout(() => setSendStatus(null), 1500);
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
      <div className='parentx'>
        {!currentData ? (
              <p>Waiting for GPS data...</p>
              ) : (
          <div className="data-container">
            <h2 className="subheading">Live GPS Data</h2>
            <div><strong>Vehicle ID:</strong> {currentData.vehicleId}</div>
            <div><strong>Latitude:</strong> {currentData.latitude}</div>
            <div><strong>Longitude:</strong> {currentData.longitude}</div>
            <div><strong>Speed:</strong> {currentData.speed}</div>
            <div><strong>Course:</strong> {currentData.course}</div>
          </div>
        )}

        {sendStatus && (
            <div className="status-indicator">
              <div className={`circle ${sendStatus === 'success' ? 'green' : 'red'}`}></div>
            </div>
          )}
        </div>
          <button className="parklink" onClick={() => window.location.href = 'https://iot-project-interfacefrontend.vercel.app/'}>
              LNM Park
            </button>

      </div>
    </div>
  );
}

export default App;