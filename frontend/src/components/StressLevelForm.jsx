import React, { useState } from 'react';
import axios from 'axios';
import { API_BASE_URL } from '../config';

const fieldDescriptions = {
  'Gender': 'Biological sex (Male/Female)',
  'Age': 'Age in years (0-120)',
  'Sleep Duration': 'Hours of sleep per night (0-24)',
  'Quality of Sleep': 'Sleep quality rating (1-10, 10 being best)',
  'Physical Activity Level': 'Activity level score (0-100, 100 being most active)',
  'BMI Category': 'Body Mass Index category',
  'Blood Pressure': 'Format as systolic/diastolic (e.g., 120/80)',
  'Heart Rate': 'Beats per minute (40-200)'
};

const genderOptions = ['Male', 'Female'];
const bmiOptions = ['Overweight', 'Normal', 'Obese'];

const initialForm = {
  'Gender': '',
  'Age': '',
  'Sleep Duration': '',
  'Quality of Sleep': '',
  'Physical Activity Level': '',
  'BMI Category': '',
  'Blood Pressure': '',
  'Heart Rate': '',
};

const fields = [
  { name: 'Gender', label: 'Gender', type: 'select', required: true },
  { name: 'Age', label: 'Age', type: 'number', required: true, min: 0, max: 120 },
  { name: 'Sleep Duration', label: 'Sleep Duration (hrs)', type: 'number', required: true, min: 0, max: 24, step: 0.1 },
  { name: 'Quality of Sleep', label: 'Quality of Sleep (1-10)', type: 'number', required: true, min: 1, max: 10 },
  { name: 'Physical Activity Level', label: 'Physical Activity Level', type: 'number', required: true, min: 0, max: 100 },
  { name: 'BMI Category', label: 'BMI Category', type: 'select', required: true },
  { name: 'Blood Pressure', label: 'Blood Pressure (systolic/diastolic)', type: 'text', required: true, placeholder: 'e.g. 120/80' },
  { name: 'Heart Rate', label: 'Heart Rate', type: 'number', required: true, min: 40, max: 200 },
];

const fieldOptions = {
  'Gender': genderOptions,
  'BMI Category': bmiOptions,
};

const StressLevelForm = () => {
  const [form, setForm] = useState(initialForm);
  const [result, setResult] = useState('');
  const [infoOpen, setInfoOpen] = useState({});
  const [bpError, setBpError] = useState('');

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
    if (e.target.name === 'Blood Pressure') {
      setBpError('');
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    // Validate and split blood pressure
    const bp = form['Blood Pressure'].split('/');
    if (bp.length !== 2 || isNaN(bp[0]) || isNaN(bp[1])) {
      setBpError('Please enter blood pressure as systolic/diastolic (e.g., 120/80)');
      return;
    }
    const payload = {
      ...form,
      'systolic_bp': bp[0].trim(),
      'diastolic_bp': bp[1].trim(),
    };
    delete payload['Blood Pressure'];
    try {
      const response = await axios.post(`${API_BASE_URL}/predict_stress_level`, payload);
      setResult(response.data.prediction);
    } catch {
      setResult('Prediction failed');
    }
  };

  return (
    <div className="responsive-form-container">
      <h2 className="responsive-form-title">Stress Level Prediction</h2>
      <form className="responsive-form" onSubmit={handleSubmit}>
        <div className="responsive-form-grid">
          {fields.map((field) => (
            <div className="responsive-form-field" key={field.name}>
              <label>
                {field.label}
                <span
                  className="info-btn"
                  tabIndex={0}
                  onClick={() =>
                    setInfoOpen((prev) => ({
                      ...prev,
                      [field.name]: !prev[field.name],
                    }))
                  }
                  onBlur={() =>
                    setTimeout(
                      () =>
                        setInfoOpen((prev) => ({
                          ...prev,
                          [field.name]: false,
                        })),
                      200
                    )
                  }
                >
                  ℹ️
                </span>
                {infoOpen[field.name] && (
                  <span className="info-tooltip">{fieldDescriptions[field.name]}</span>
                )}
              </label>
              {field.type === 'select' ? (
                <select
                  name={field.name}
                  value={form[field.name]}
                  onChange={handleChange}
                  required={field.required}
                >
                  <option value="">Select</option>
                  {fieldOptions[field.name].map((opt) => (
                    <option key={opt} value={opt}>
                      {opt}
                    </option>
                  ))}
                </select>
              ) : (
                <input
                  name={field.name}
                  type={field.type}
                  value={form[field.name]}
                  onChange={handleChange}
                  required={field.required}
                  min={field.min}
                  max={field.max}
                  step={field.step}
                  placeholder={field.placeholder}
                />
              )}
              {field.name === 'Blood Pressure' && bpError && (
                <span style={{ color: 'red', fontSize: '0.95rem', marginTop: '0.25rem' }}>{bpError}</span>
              )}
            </div>
          ))}
        </div>
        <button type="submit" className="responsive-form-submit">
          Predict Stress Level
        </button>
        {result && (
          <div className="responsive-form-result">
            Prediction: {
              !isNaN(Number(result))
                ? (Number(result) >= 1 && Number(result) <= 4
                    ? 'Low'
                    : Number(result) >= 5 && Number(result) <= 7
                      ? 'Medium'
                      : Number(result) >= 8 && Number(result) <= 10
                        ? 'High'
                        : result)
                : result
            }
          </div>
        )}
      </form>
      <style>{`
        .responsive-form-container {
          max-width: 600px;
          margin: 2rem auto;
          padding: 1rem;
          background: #f4f8fb;
          border-radius: 12px;
          box-shadow: 0 2px 12px rgba(0,0,0,0.06);
        }
        .responsive-form-title {
          text-align: center;
          color: #2563eb;
          margin-bottom: 1.5rem;
          font-size: 1.5rem;
        }
        .responsive-form {
          width: 100%;
        }
        .responsive-form-grid {
          display: grid;
          grid-template-columns: 1fr;
          gap: 1rem;
        }
        .responsive-form-field {
          display: flex;
          flex-direction: column;
          position: relative;
        }
        .responsive-form-field label {
          font-weight: 600;
          color: #374151;
          font-size: 1rem;
          margin-bottom: 0.25rem;
          display: flex;
          align-items: center;
        }
        .info-btn {
          margin-left: 0.5rem;
          cursor: pointer;
          font-size: 1rem;
          user-select: none;
        }
        .info-tooltip {
          position: absolute;
          left: 110%;
          top: 0;
          background: #fff;
          color: #2563eb;
          border: 1px solid #2563eb;
          border-radius: 6px;
          padding: 0.5rem;
          font-size: 0.95rem;
          z-index: 10;
          min-width: 180px;
          max-width: 240px;
          box-shadow: 0 2px 8px rgba(37,99,235,0.08);
        }
        .responsive-form-field input,
        .responsive-form-field select {
          padding: 0.5rem;
          border: 1px solid #d1d5db;
          border-radius: 8px;
          font-size: 1rem;
          background: #fff;
          min-height: 36px;
        }
        .responsive-form-submit {
          margin-top: 1rem;
          background: linear-gradient(90deg, #2563eb 0%, #60a5fa 100%);
          color: #fff;
          border: none;
          border-radius: 8px;
          padding: 0.75rem 1.5rem;
          font-size: 1.1rem;
          font-weight: 600;
          cursor: pointer;
          width: 100%;
        }
        .responsive-form-result {
          margin-top: 1rem;
          background: #f0f9ff;
          border: 1px solid #0ea5e9;
          border-radius: 8px;
          padding: 1rem;
          text-align: center;
          font-size: 1.1rem;
          font-weight: 600;
          color: #0c4a6e;
        }
        @media (min-width: 700px) {
          .responsive-form-grid {
            grid-template-columns: 1fr 1fr;
          }
        }
        @media (max-width: 480px) {
          .responsive-form-container {
            padding: 0.5rem;
            border-radius: 8px;
          }
          .responsive-form-title {
            font-size: 1.15rem;
          }
          .responsive-form-field input,
          .responsive-form-field select {
            font-size: 0.95rem;
            min-height: 32px;
          }
        }
      `}</style>
    </div>
  );
};

export default StressLevelForm; 