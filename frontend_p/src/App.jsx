import React, { useRef } from 'react';

function App() {
  const intervalRef = useRef(null);

  const startSendingLocation = () => {
    if (!navigator.geolocation) {
      alert("Geolocation not supported");
      return;
    }

    if (intervalRef.current) {
      return; // already running
    }

    intervalRef.current = setInterval(() => {
      navigator.geolocation.getCurrentPosition(async (position) => {
        const { latitude, longitude, speed, heading: course } = position.coords;

        const gpsData = {
          latitude,
          longitude,
          speed: speed || 0,
          course: course || 0
        };

        try {
          await fetch("https://iot-gps-data-8u1l.vercel.app/gps", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(gpsData)
          });
        } catch (err) {
          console.error("Failed to send:", err);
        }

      }, (error) => {
        console.error("Geolocation error:", error);
      });
    }, 3000); // every 3 seconds
  };

  const stopSendingLocation = () => {
    clearInterval(intervalRef.current);
    intervalRef.current = null;
  };
  

  return (
    <div style={{ textAlign: 'center', marginTop: '100px' }}>
      <h1>Send GPS Data Every 3 Seconds</h1>
      <button onClick={startSendingLocation}>Start</button>
      <button onClick={stopSendingLocation}>Stop</button>

    </div>
  );
}

export default App;
