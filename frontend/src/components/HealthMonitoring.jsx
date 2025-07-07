import React, { useState, useEffect } from 'react';

const SPO2_THRESHOLD = 95;
const TEMP_THRESHOLD = 37.5;
const HEART_RATE_MIN = 50;
const HEART_RATE_MAX = 120;

const THINGSPEAK_CHANNEL_ID = process.env.REACT_APP_THINGSPEAK_CHANNEL_ID;
// const THINGSPEAK_FIELD = 1; // Field number to display
const THINGSPEAK_READ_API_KEY = process.env.REACT_APP_THINGSPEAK_READ_API_KEY;

// Notification utility functions
const requestNotificationPermission = async () => {
  if (!('Notification' in window)) {
    console.log('This browser does not support notifications');
    return false;
  }
  
  if (Notification.permission === 'granted') {
    return true;
  }
  
  if (Notification.permission !== 'denied') {
    const permission = await Notification.requestPermission();
    return permission === 'granted';
  }
  
  return false;
};

const sendNotification = (title, body, icon = null) => {
  if (Notification.permission === 'granted') {
    new Notification(title, {
      body,
      icon,
      badge: '/favicon.ico',
      tag: 'health-alert',
      requireInteraction: true,
      silent: false
    });
  }
};

const ThingSpeakChart = ({ field, title }) => (
  <div style={{ margin: '1rem 0' }}>
    <h4 style={{ textAlign: 'center', color: '#2563eb' }}>{title}</h4>
    <iframe
      width="450"
      height="260"
      style={{ border: '1px solid #ccc', borderRadius: '8px', width: '100%', maxWidth: 450 }}
      src={`https://thingspeak.com/channels/${THINGSPEAK_CHANNEL_ID}/charts/${field}?bgcolor=%23ffffff&color=%23d62020&dynamic=true&results=60&type=line&api_key=${THINGSPEAK_READ_API_KEY}&update=10`}
      title={title}
    />
  </div>
);

const HealthMonitoring = () => {
  const [spo2, setSpo2] = useState('');
  const [temp, setTemp] = useState('');
  const [heartRate, setHeartRate] = useState('');
  const [notificationPermission, setNotificationPermission] = useState(false);
  const [previousValues, setPreviousValues] = useState({
    spo2: null,
    temp: null,
    heartRate: null,
  });

  const spo2Value = parseFloat(spo2);
  const tempValue = parseFloat(temp);

  const spo2Alert = spo2 && spo2Value < SPO2_THRESHOLD;
  const tempAlert = temp && tempValue > TEMP_THRESHOLD;
  const heartRateAlert = heartRate && (heartRate < HEART_RATE_MIN || heartRate > HEART_RATE_MAX);

  const [latest, setLatest] = useState({
    spo2: null,
    temp: null,
    heartRate: null,
  });

  // Request notification permission on component mount
  useEffect(() => {
    requestNotificationPermission().then(permission => {
      setNotificationPermission(permission);
    });
  }, []);

  // Check for abnormal values and send notifications
  useEffect(() => {
    const checkAndNotify = (current, previous, type, threshold, unit) => {
      if (current !== null && previous !== null && current !== previous) {
        let isAbnormal = false;
        let message = '';

        switch (type) {
          case 'spo2':
            isAbnormal = current < threshold;
            if (isAbnormal) {
              message = `SpO₂ level is critically low: ${current}% (Normal: ≥${threshold}%)`;
            }
            break;
          case 'temp':
            isAbnormal = current > threshold;
            if (isAbnormal) {
              message = `Body temperature is elevated: ${current}°C (Normal: ≤${threshold}°C)`;
            }
            break;
          case 'heartRate':
            isAbnormal = current < HEART_RATE_MIN || current > HEART_RATE_MAX;
            if (isAbnormal) {
              message = `Heart rate is abnormal: ${current} bpm (Normal: ${HEART_RATE_MIN}-${HEART_RATE_MAX} bpm)`;
            }
            break;
          default:
            break;
        }

        if (isAbnormal && notificationPermission) {
          sendNotification('Health Alert', message);
        }
      }
    };

    // Check each vital sign
    checkAndNotify(latest.spo2, previousValues.spo2, 'spo2', SPO2_THRESHOLD, '%');
    checkAndNotify(latest.temp, previousValues.temp, 'temp', TEMP_THRESHOLD, '°C');
    checkAndNotify(latest.heartRate, previousValues.heartRate, 'heartRate', null, 'bpm');

    // Update previous values
    setPreviousValues({
      spo2: latest.spo2,
      temp: latest.temp,
      heartRate: latest.heartRate,
    });
  }, [latest, previousValues, notificationPermission]);

  useEffect(() => {
    const fetchLatest = async () => {
      try {
        const res = await fetch(
          `https://api.thingspeak.com/channels/${THINGSPEAK_CHANNEL_ID}/feeds.json?api_key=${THINGSPEAK_READ_API_KEY}&results=1`
        );
        const data = await res.json();
        const feed = data.feeds[0] || {};
        setLatest({
          spo2: parseFloat(feed.field1),
          temp: parseFloat(feed.field2),
          heartRate: parseFloat(feed.field3),
        });
      } catch (err) {
        console.error('Error fetching health data:', err);
      }
    };
    fetchLatest();
    const interval = setInterval(fetchLatest, 10000); // Poll every 10 seconds
    return () => clearInterval(interval);
  }, []);

  return (
    <div className="health-monitoring-container">
      <h2 className="health-monitoring-title">Health Monitoring</h2>
      
      {/* Notification permission status */}
      <div style={{ 
        marginBottom: '1rem', 
        padding: '0.5rem', 
        borderRadius: '6px',
        backgroundColor: notificationPermission ? '#dcfce7' : '#fef3c7',
        border: `1px solid ${notificationPermission ? '#22c55e' : '#f59e0b'}`,
        color: notificationPermission ? '#166534' : '#92400e',
        fontSize: '0.9rem',
        textAlign: 'center'
      }}>
        {notificationPermission ? 
          '🔔 Push notifications enabled - You will be alerted for abnormal values' :
          '🔕 Push notifications disabled - Click "Enable Notifications" to get alerts'
        }
        {!notificationPermission && (
          <button
            onClick={async () => {
              const permission = await requestNotificationPermission();
              setNotificationPermission(permission);
            }}
            style={{
              marginLeft: '0.5rem',
              padding: '0.25rem 0.5rem',
              backgroundColor: '#2563eb',
              color: 'white',
              border: 'none',
              borderRadius: '4px',
              cursor: 'pointer',
              fontSize: '0.8rem'
            }}
          >
            Enable Notifications
          </button>
        )}
      </div>

      <div className="latest-values" style={{ marginBottom: '1rem', display: 'flex', flexDirection: 'column', gap: '0.5rem', background: 'none', border: 'none', boxShadow: 'none', padding: 0 }}>
        <div>
          Latest SpO₂: <span style={{ color: latest.spo2 !== null && latest.spo2 < SPO2_THRESHOLD ? '#ef4444' : '#22c55e', fontWeight: 600 }}>
            {latest.spo2 ?? 'Loading...'}%
          </span>
          <span style={{ marginLeft: 8, color: '#64748b', fontSize: '0.95em' }}>
            (Threshold: {SPO2_THRESHOLD}%)
          </span>
        </div>
        <div>
          Latest Body Temp: <span style={{ color: latest.temp !== null && latest.temp > TEMP_THRESHOLD ? '#ef4444' : '#22c55e', fontWeight: 600 }}>
            {latest.temp ?? 'Loading...'}°C
          </span>
          <span style={{ marginLeft: 8, color: '#64748b', fontSize: '0.95em' }}>
            (Threshold: {TEMP_THRESHOLD}°C)
          </span>
        </div>
        <div>
          Latest Heart Rate: <span style={{ color: latest.heartRate !== null && (latest.heartRate < HEART_RATE_MIN || latest.heartRate > HEART_RATE_MAX) ? '#ef4444' : '#22c55e', fontWeight: 600 }}>
            {latest.heartRate ?? 'Loading...'} bpm
          </span>
          <span style={{ marginLeft: 8, color: '#64748b', fontSize: '0.95em' }}>
            (Range: {HEART_RATE_MIN}-{HEART_RATE_MAX} bpm)
          </span>
        </div>
      </div>
      
      <div className="health-monitoring-charts-grid" style={{ marginTop: '2rem' }}>
        <ThingSpeakChart field={1} title="SpO₂ (%)" />
        <ThingSpeakChart field={2} title="Body Temperature (°C)" />
        <ThingSpeakChart field={3} title="Heart Rate (bpm)" />
      </div>
      <style>{`
        .health-monitoring-container {
          max-width: 500px;
          margin: 2rem auto;
          padding: 1.5rem;
          background: #f4f8fb;
          border-radius: 12px;
          box-shadow: 0 2px 12px rgba(0,0,0,0.06);
        }
        @media (min-width: 1100px) {
          .health-monitoring-container {
            max-width: 1100px;
            padding: 2.5rem;
          }
        }
        .health-monitoring-title {
          text-align: center;
          color: #2563eb;
          margin-bottom: 1.5rem;
          font-size: 1.5rem;
        }
        .health-monitoring-form {
          width: 100%;
        }
        .health-monitoring-grid {
          display: grid;
          grid-template-columns: 1fr;
          gap: 2rem;
        }
        .health-monitoring-field {
          display: flex;
          flex-direction: column;
          position: relative;
        }
        .health-monitoring-field label {
          font-weight: 600;
          color: #374151;
          font-size: 1rem;
          margin-bottom: 0.5rem;
        }
        .health-monitoring-field input {
          padding: 0.5rem;
          border: 1px solid #d1d5db;
          border-radius: 8px;
          font-size: 1rem;
          background: #fff;
          min-height: 36px;
          margin-bottom: 0.5rem;
        }
        .visual-bar-wrapper {
          width: 100%;
          height: 16px;
          background: #e5e7eb;
          border-radius: 8px;
          overflow: hidden;
          margin-bottom: 0.5rem;
        }
        .visual-bar {
          height: 100%;
          transition: width 0.4s, background 0.4s;
        }
        .alert {
          color: #ef4444;
          background: #fee2e2;
          border: 1px solid #fca5a5;
          border-radius: 6px;
          padding: 0.5rem;
          font-size: 0.98rem;
          margin-top: 0.25rem;
        }
        .health-monitoring-charts-grid {
          display: grid;
          grid-template-columns: 1fr;
          gap: 2rem;
        }
        @media (min-width: 700px) {
          .health-monitoring-charts-grid {
            grid-template-columns: 1fr 1fr;
          }
        }
        @media (min-width: 1100px) {
          .health-monitoring-charts-grid {
            grid-template-columns: 1fr 1fr 1fr;
          }
        }
        @media (max-width: 480px) {
          .health-monitoring-container {
            padding: 0.75rem;
            border-radius: 8px;
          }
          .health-monitoring-title {
            font-size: 1.15rem;
          }
          .health-monitoring-field input {
            font-size: 0.95rem;
            min-height: 32px;
          }
        }
      `}</style>
    </div>
  );
};

export default HealthMonitoring; 