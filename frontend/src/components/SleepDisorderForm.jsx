import React, { useState } from 'react';
import axios from 'axios';

const genderOptions = ['Male', 'Female'];
const bmiOptions = ['Overweight', 'Normal', 'Obese'];

const SleepDisorderForm = () => {
  const [form, setForm] = useState({
    'Gender': '',
    'Age': '',
    'Sleep Duration': '',
    'Quality of Sleep': '',
    'Physical Activity Level': '',
    'BMI Category': '',
    'systolic_bp': '',
    'diastolic_bp': '',
    'Heart Rate': '',
  });
  const [result, setResult] = useState('');

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await axios.post('http://localhost:5000/predict_sleep_disorder', form);
      setResult(response.data.prediction);
    } catch {
      setResult('Prediction failed');
    }
  };

  return (
    <div style={styles.mainContainer}>
      <div style={styles.sidebar}>
        <h3 style={styles.sidebarHeader}>📋 Field Descriptions</h3>
        <div style={styles.fieldDescriptions}>
          <div style={styles.fieldDesc}>
            <strong>Gender:</strong> Biological sex (Male/Female)
          </div>
          <div style={styles.fieldDesc}>
            <strong>Age:</strong> Age in years (0-120)
          </div>
          <div style={styles.fieldDesc}>
            <strong>Sleep Duration:</strong> Hours of sleep per night (0-24)
          </div>
          <div style={styles.fieldDesc}>
            <strong>Quality of Sleep:</strong> Sleep quality rating (1-10, 10 being best)
          </div>
          <div style={styles.fieldDesc}>
            <strong>Physical Activity Level:</strong> Activity level score (0-100, 100 being most active). Represents daily physical activity intensity and duration.
          </div>
          <div style={styles.fieldDesc}>
            <strong>BMI Category:</strong> Body Mass Index category
          </div>
          <div style={styles.fieldDesc}>
            <strong>Systolic BP:</strong> Upper blood pressure reading (mmHg)
          </div>
          <div style={styles.fieldDesc}>
            <strong>Diastolic BP:</strong> Lower blood pressure reading (mmHg)
          </div>
          <div style={styles.fieldDesc}>
            <strong>Heart Rate:</strong> Beats per minute (40-200)
          </div>
        </div>
        <div style={styles.tip}>
          💡 <strong>Tip:</strong> Fill all fields accurately for best prediction results.
        </div>
      </div>
      
      <div style={styles.container}>
        <h2 style={styles.header}>Sleep Disorder Prediction</h2>
        <form onSubmit={handleSubmit} style={styles.form}>
        <div style={styles.row}>
          <div style={styles.field}><label>Gender:</label>
            <select name="Gender" value={form['Gender']} onChange={handleChange} required style={styles.input}>
              <option value="">Select</option>
              {genderOptions.map(opt => <option key={opt} value={opt}>{opt}</option>)}
            </select>
          </div>
          <div style={styles.field}><label>Age:</label>
            <input name="Age" type="number" min="0" value={form['Age']} onChange={handleChange} required style={styles.input} />
          </div>
        </div>
        <div style={styles.row}>
          <div style={styles.field}><label>Sleep Duration (hrs):</label>
            <input name="Sleep Duration" type="number" step="0.1" min="0" value={form['Sleep Duration']} onChange={handleChange} required style={styles.input} />
          </div>
          <div style={styles.field}><label>Quality of Sleep (1-10):</label>
            <input name="Quality of Sleep" type="number" min="1" max="10" value={form['Quality of Sleep']} onChange={handleChange} required style={styles.input} />
          </div>
        </div>
        <div style={styles.row}>
          <div style={styles.field}><label>Physical Activity Level:</label>
            <input name="Physical Activity Level" type="number" min="0" max="100" value={form['Physical Activity Level']} onChange={handleChange} required style={styles.input} />
          </div>
          <div style={styles.field}><label>BMI Category:</label>
            <select name="BMI Category" value={form['BMI Category']} onChange={handleChange} required style={styles.input}>
              <option value="">Select</option>
              {bmiOptions.map(opt => <option key={opt} value={opt}>{opt}</option>)}
            </select>
          </div>
        </div>
        <div style={styles.row}>
          <div style={styles.field}><label>Systolic BP:</label>
            <input name="systolic_bp" type="number" min="0" value={form['systolic_bp']} onChange={handleChange} required style={styles.input} />
          </div>
          <div style={styles.field}><label>Diastolic BP:</label>
            <input name="diastolic_bp" type="number" min="0" value={form['diastolic_bp']} onChange={handleChange} required style={styles.input} />
          </div>
        </div>
        <div style={styles.row}>
          <div style={styles.field}><label>Heart Rate:</label>
            <input name="Heart Rate" type="number" min="0" value={form['Heart Rate']} onChange={handleChange} required style={styles.input} />
          </div>
        </div>
        <button type="submit" style={styles.button}>Predict Sleep Disorder</button>
        {result && <div style={styles.result}>Prediction: {result}</div>}
      </form>
    </div>
    </div>
  );
};

const styles = {
  mainContainer: {
    display: 'flex',
    gap: '24px',
    maxWidth: '1200px',
    margin: '40px auto',
    padding: '0 20px',
    fontFamily: 'Segoe UI, Arial, sans-serif',
  },
  sidebar: {
    width: '300px',
    background: '#ffffff',
    padding: '24px',
    borderRadius: '16px',
    boxShadow: '0 2px 16px rgba(0,0,0,0.08)',
    height: 'fit-content',
    position: 'sticky',
    top: '20px',
  },
  sidebarHeader: {
    color: '#2563eb',
    marginBottom: '20px',
    fontSize: '1.2rem',
    borderBottom: '2px solid #e5e7eb',
    paddingBottom: '10px',
  },
  fieldDescriptions: {
    display: 'flex',
    flexDirection: 'column',
    gap: '12px',
  },
  fieldDesc: {
    fontSize: '0.9rem',
    lineHeight: '1.4',
    color: '#374151',
  },
  tip: {
    marginTop: '20px',
    padding: '12px',
    background: '#fef3c7',
    borderRadius: '8px',
    fontSize: '0.9rem',
    color: '#92400e',
  },
  container: {
    flex: 1,
    maxWidth: '500px',
    padding: '24px',
    background: '#f4f8fb',
    borderRadius: '16px',
    boxShadow: '0 2px 16px rgba(0,0,0,0.08)',
  },
  header: {
    textAlign: 'center',
    color: '#2563eb',
    marginBottom: '24px',
  },
  form: {
    display: 'flex',
    flexDirection: 'column',
    gap: '18px',
  },
  row: {
    display: 'flex',
    gap: '16px',
    flexWrap: 'wrap',
  },
  field: {
    flex: 1,
    display: 'flex',
    flexDirection: 'column',
    minWidth: '180px',
    marginBottom: '8px',
  },
  input: {
    padding: '8px',
    borderRadius: '6px',
    border: '1px solid #bcd0ee',
    fontSize: '1rem',
    marginTop: '4px',
  },
  button: {
    background: 'linear-gradient(90deg, #2563eb 0%, #60a5fa 100%)',
    color: 'white',
    border: 'none',
    borderRadius: '8px',
    padding: '12px',
    fontSize: '1.1rem',
    fontWeight: 600,
    cursor: 'pointer',
    marginTop: '12px',
    boxShadow: '0 2px 8px rgba(37,99,235,0.08)',
    transition: 'background 0.2s',
  },
  result: {
    marginTop: '18px',
    fontWeight: 600,
    color: '#2563eb',
    textAlign: 'center',
    fontSize: '1.1rem',
  },
};

export default SleepDisorderForm;