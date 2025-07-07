import React, { useState } from 'react';

const SPO2_THRESHOLD = 95;
const TEMP_THRESHOLD = 37.5;

const HealthMonitoring = () => {
  const [spo2, setSpo2] = useState('');
  const [temp, setTemp] = useState('');

  const spo2Value = parseFloat(spo2);
  const tempValue = parseFloat(temp);

  const spo2Alert = spo2 && spo2Value < SPO2_THRESHOLD;
  const tempAlert = temp && tempValue > TEMP_THRESHOLD;

  return (
    <div className="health-monitoring-container">
      <h2 className="health-monitoring-title">Health Monitoring</h2>
      <form className="health-monitoring-form" onSubmit={e => e.preventDefault()}>
        <div className="health-monitoring-grid">
          <div className="health-monitoring-field">
            <label htmlFor="spo2">SpO₂ (%):</label>
            <input
              id="spo2"
              type="number"
              min="70"
              max="100"
              value={spo2}
              onChange={e => setSpo2(e.target.value)}
              placeholder="e.g. 98"
              required
            />
            <div className="visual-bar-wrapper">
              <div
                className="visual-bar"
                style={{
                  width: spo2 ? `${Math.min(Math.max(spo2Value, 70), 100)}%` : '0%',
                  background: spo2Alert ? '#ef4444' : '#22c55e',
                }}
              />
            </div>
            {spo2Alert && (
              <div className="alert">⚠️ SpO₂ is below normal! (Threshold: {SPO2_THRESHOLD}%)</div>
            )}
          </div>
          <div className="health-monitoring-field">
            <label htmlFor="temp">Body Temperature (°C):</label>
            <input
              id="temp"
              type="number"
              min="30"
              max="45"
              step="0.1"
              value={temp}
              onChange={e => setTemp(e.target.value)}
              placeholder="e.g. 36.8"
              required
            />
            <div className="visual-bar-wrapper">
              <div
                className="visual-bar"
                style={{
                  width: temp ? `${Math.min(Math.max((tempValue - 30) * 4, 0), 100)}%` : '0%',
                  background: tempAlert ? '#ef4444' : '#3b82f6',
                }}
              />
            </div>
            {tempAlert && (
              <div className="alert">⚠️ Body temperature is above normal! (Threshold: {TEMP_THRESHOLD}°C)</div>
            )}
          </div>
        </div>
      </form>
      <style>{`
        .health-monitoring-container {
          max-width: 500px;
          margin: 2rem auto;
          padding: 1.5rem;
          background: #f4f8fb;
          border-radius: 12px;
          box-shadow: 0 2px 12px rgba(0,0,0,0.06);
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
        @media (min-width: 600px) {
          .health-monitoring-grid {
            grid-template-columns: 1fr 1fr;
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