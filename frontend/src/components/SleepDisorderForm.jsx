import React, { useState } from 'react';
import axios from 'axios';
import { API_BASE_URL } from '../config';

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
      const response = await axios.post(`${API_BASE_URL}/predict_sleep_disorder`, form);
      setResult(response.data.prediction);
    } catch {
      setResult('Prediction failed');
    }
  };

  return (
    <div style={{
      display: 'flex',
      flexDirection: 'column',
      gap: '1.5rem',
      maxWidth: '1200px',
      margin: '0 auto',
      padding: '0 1rem',
      width: '100%',
      '@media (max-width: 768px)': {
        gap: '1rem',
        padding: '0 0.5rem',
      }
    }}>
      {/* Mobile-first layout */}
      <div style={{
        display: 'flex',
        flexDirection: 'column',
        gap: '1.5rem',
        width: '100%',
        '@media (min-width: 1024px)': {
          flexDirection: 'row',
          alignItems: 'flex-start',
        }
      }}>
        {/* Sidebar - visible on all devices */}
        <div style={{
          width: '100%',
          background: '#ffffff',
          padding: '1.5rem',
          borderRadius: '16px',
          boxShadow: '0 2px 16px rgba(0,0,0,0.08)',
          height: 'fit-content',
          '@media (min-width: 1024px)': {
            width: '300px',
            position: 'sticky',
            top: '20px',
            flexShrink: 0,
          },
          '@media (max-width: 768px)': {
            padding: '1rem',
          },
          '@media (max-width: 480px)': {
            padding: '0.75rem',
          }
        }}>
          <h3 style={{
            color: '#2563eb',
            marginBottom: '1.25rem',
            fontSize: '1.2rem',
            borderBottom: '2px solid #e5e7eb',
            paddingBottom: '0.625rem',
            '@media (max-width: 768px)': {
              fontSize: '1.1rem',
              marginBottom: '1rem',
            }
          }}>
            📋 Field Descriptions
          </h3>
          <div style={{
            display: 'flex',
            flexDirection: 'column',
            gap: '0.75rem',
          }}>
            <div style={{
              fontSize: '0.9rem',
              lineHeight: '1.4',
              color: '#374151',
              '@media (max-width: 768px)': {
                fontSize: '0.85rem',
              }
            }}>
              <strong>Gender:</strong> Biological sex (Male/Female)
            </div>
            <div style={{
              fontSize: '0.9rem',
              lineHeight: '1.4',
              color: '#374151',
              '@media (max-width: 768px)': {
                fontSize: '0.85rem',
              }
            }}>
              <strong>Age:</strong> Age in years (0-120)
            </div>
            <div style={{
              fontSize: '0.9rem',
              lineHeight: '1.4',
              color: '#374151',
              '@media (max-width: 768px)': {
                fontSize: '0.85rem',
              }
            }}>
              <strong>Sleep Duration:</strong> Hours of sleep per night (0-24)
            </div>
            <div style={{
              fontSize: '0.9rem',
              lineHeight: '1.4',
              color: '#374151',
              '@media (max-width: 768px)': {
                fontSize: '0.85rem',
              }
            }}>
              <strong>Quality of Sleep:</strong> Sleep quality rating (1-10, 10 being best)
            </div>
            <div style={{
              fontSize: '0.9rem',
              lineHeight: '1.4',
              color: '#374151',
              '@media (max-width: 768px)': {
                fontSize: '0.85rem',
              }
            }}>
              <strong>Physical Activity Level:</strong> Activity level score (0-100, 100 being most active). Represents daily physical activity intensity and duration.
            </div>
            <div style={{
              fontSize: '0.9rem',
              lineHeight: '1.4',
              color: '#374151',
              '@media (max-width: 768px)': {
                fontSize: '0.85rem',
              }
            }}>
              <strong>BMI Category:</strong> Body Mass Index category
            </div>
            <div style={{
              fontSize: '0.9rem',
              lineHeight: '1.4',
              color: '#374151',
              '@media (max-width: 768px)': {
                fontSize: '0.85rem',
              }
            }}>
              <strong>Systolic BP:</strong> Upper blood pressure reading (mmHg)
            </div>
            <div style={{
              fontSize: '0.9rem',
              lineHeight: '1.4',
              color: '#374151',
              '@media (max-width: 768px)': {
                fontSize: '0.85rem',
              }
            }}>
              <strong>Diastolic BP:</strong> Lower blood pressure reading (mmHg)
            </div>
            <div style={{
              fontSize: '0.9rem',
              lineHeight: '1.4',
              color: '#374151',
              '@media (max-width: 768px)': {
                fontSize: '0.85rem',
              }
            }}>
              <strong>Heart Rate:</strong> Beats per minute (40-200)
            </div>
          </div>
          <div style={{
            marginTop: '1.25rem',
            padding: '0.75rem',
            background: '#fef3c7',
            borderRadius: '8px',
            fontSize: '0.9rem',
            color: '#92400e',
            '@media (max-width: 768px)': {
              fontSize: '0.85rem',
              marginTop: '1rem',
            }
          }}>
            💡 <strong>Tip:</strong> Fill all fields accurately for best prediction results.
          </div>
        </div>
        
        {/* Main form container */}
        <div style={{
          flex: 1,
          maxWidth: '100%',
          padding: '1.5rem',
          background: '#f4f8fb',
          borderRadius: '16px',
          boxShadow: '0 2px 16px rgba(0,0,0,0.08)',
          '@media (max-width: 768px)': {
            padding: '1rem',
          },
          '@media (max-width: 480px)': {
            padding: '0.75rem',
          }
        }}>
          <h2 style={{
            textAlign: 'center',
            color: '#2563eb',
            marginBottom: '1.5rem',
            fontSize: '1.5rem',
            '@media (max-width: 768px)': {
              fontSize: '1.25rem',
              marginBottom: '1rem',
            }
          }}>
            Sleep Disorder Prediction
          </h2>
          
          <form onSubmit={handleSubmit} style={{
            display: 'flex',
            flexDirection: 'column',
            gap: '1.125rem',
          }}>
            {/* Form fields in responsive grid */}
            <div style={{
              display: 'grid',
              gridTemplateColumns: '1fr',
              gap: '1rem',
              '@media (min-width: 768px)': {
                gridTemplateColumns: 'repeat(2, 1fr)',
              }
            }}>
              <div style={{
                display: 'flex',
                flexDirection: 'column',
                gap: '0.5rem',
              }}>
                <label style={{
                  fontWeight: '600',
                  color: '#374151',
                  fontSize: '0.875rem',
                }}>
                  Gender:
                </label>
                <select 
                  name="Gender" 
                  value={form['Gender']} 
                  onChange={handleChange} 
                  required 
                  style={{
                    padding: '0.75rem',
                    border: '1px solid #d1d5db',
                    borderRadius: '8px',
                    fontSize: '1rem',
                    backgroundColor: 'white',
                    minHeight: '44px',
                    '@media (max-width: 768px)': {
                      fontSize: '16px',
                    }
                  }}
                >
                  <option value="">Select</option>
                  {genderOptions.map(opt => <option key={opt} value={opt}>{opt}</option>)}
                </select>
              </div>
              
              <div style={{
                display: 'flex',
                flexDirection: 'column',
                gap: '0.5rem',
              }}>
                <label style={{
                  fontWeight: '600',
                  color: '#374151',
                  fontSize: '0.875rem',
                }}>
                  Age:
                </label>
                <input 
                  name="Age" 
                  type="number" 
                  min="0" 
                  value={form['Age']} 
                  onChange={handleChange} 
                  required 
                  style={{
                    padding: '0.75rem',
                    border: '1px solid #d1d5db',
                    borderRadius: '8px',
                    fontSize: '1rem',
                    backgroundColor: 'white',
                    minHeight: '44px',
                    '@media (max-width: 768px)': {
                      fontSize: '16px',
                    }
                  }}
                />
              </div>
            </div>
            
            <div style={{
              display: 'grid',
              gridTemplateColumns: '1fr',
              gap: '1rem',
              '@media (min-width: 768px)': {
                gridTemplateColumns: 'repeat(2, 1fr)',
              }
            }}>
              <div style={{
                display: 'flex',
                flexDirection: 'column',
                gap: '0.5rem',
              }}>
                <label style={{
                  fontWeight: '600',
                  color: '#374151',
                  fontSize: '0.875rem',
                }}>
                  Sleep Duration (hrs):
                </label>
                <input 
                  name="Sleep Duration" 
                  type="number" 
                  step="0.1" 
                  min="0" 
                  value={form['Sleep Duration']} 
                  onChange={handleChange} 
                  required 
                  style={{
                    padding: '0.75rem',
                    border: '1px solid #d1d5db',
                    borderRadius: '8px',
                    fontSize: '1rem',
                    backgroundColor: 'white',
                    minHeight: '44px',
                    '@media (max-width: 768px)': {
                      fontSize: '16px',
                    }
                  }}
                />
              </div>
              
              <div style={{
                display: 'flex',
                flexDirection: 'column',
                gap: '0.5rem',
              }}>
                <label style={{
                  fontWeight: '600',
                  color: '#374151',
                  fontSize: '0.875rem',
                }}>
                  Quality of Sleep (1-10):
                </label>
                <input 
                  name="Quality of Sleep" 
                  type="number" 
                  min="1" 
                  max="10" 
                  value={form['Quality of Sleep']} 
                  onChange={handleChange} 
                  required 
                  style={{
                    padding: '0.75rem',
                    border: '1px solid #d1d5db',
                    borderRadius: '8px',
                    fontSize: '1rem',
                    backgroundColor: 'white',
                    minHeight: '44px',
                    '@media (max-width: 768px)': {
                      fontSize: '16px',
                    }
                  }}
                />
              </div>
            </div>
            
            <div style={{
              display: 'grid',
              gridTemplateColumns: '1fr',
              gap: '1rem',
              '@media (min-width: 768px)': {
                gridTemplateColumns: 'repeat(2, 1fr)',
              }
            }}>
              <div style={{
                display: 'flex',
                flexDirection: 'column',
                gap: '0.5rem',
              }}>
                <label style={{
                  fontWeight: '600',
                  color: '#374151',
                  fontSize: '0.875rem',
                }}>
                  Physical Activity Level:
                </label>
                <input 
                  name="Physical Activity Level" 
                  type="number" 
                  min="0" 
                  max="100" 
                  value={form['Physical Activity Level']} 
                  onChange={handleChange} 
                  required 
                  style={{
                    padding: '0.75rem',
                    border: '1px solid #d1d5db',
                    borderRadius: '8px',
                    fontSize: '1rem',
                    backgroundColor: 'white',
                    minHeight: '44px',
                    '@media (max-width: 768px)': {
                      fontSize: '16px',
                    }
                  }}
                />
              </div>
              
              <div style={{
                display: 'flex',
                flexDirection: 'column',
                gap: '0.5rem',
              }}>
                <label style={{
                  fontWeight: '600',
                  color: '#374151',
                  fontSize: '0.875rem',
                }}>
                  BMI Category:
                </label>
                <select 
                  name="BMI Category" 
                  value={form['BMI Category']} 
                  onChange={handleChange} 
                  required 
                  style={{
                    padding: '0.75rem',
                    border: '1px solid #d1d5db',
                    borderRadius: '8px',
                    fontSize: '1rem',
                    backgroundColor: 'white',
                    minHeight: '44px',
                    '@media (max-width: 768px)': {
                      fontSize: '16px',
                    }
                  }}
                >
                  <option value="">Select</option>
                  {bmiOptions.map(opt => <option key={opt} value={opt}>{opt}</option>)}
                </select>
              </div>
            </div>
            
            <div style={{
              display: 'grid',
              gridTemplateColumns: '1fr',
              gap: '1rem',
              '@media (min-width: 768px)': {
                gridTemplateColumns: 'repeat(2, 1fr)',
              }
            }}>
              <div style={{
                display: 'flex',
                flexDirection: 'column',
                gap: '0.5rem',
              }}>
                <label style={{
                  fontWeight: '600',
                  color: '#374151',
                  fontSize: '0.875rem',
                }}>
                  Systolic BP:
                </label>
                <input 
                  name="systolic_bp" 
                  type="number" 
                  min="0" 
                  value={form['systolic_bp']} 
                  onChange={handleChange} 
                  required 
                  style={{
                    padding: '0.75rem',
                    border: '1px solid #d1d5db',
                    borderRadius: '8px',
                    fontSize: '1rem',
                    backgroundColor: 'white',
                    minHeight: '44px',
                    '@media (max-width: 768px)': {
                      fontSize: '16px',
                    }
                  }}
                />
              </div>
              
              <div style={{
                display: 'flex',
                flexDirection: 'column',
                gap: '0.5rem',
              }}>
                <label style={{
                  fontWeight: '600',
                  color: '#374151',
                  fontSize: '0.875rem',
                }}>
                  Diastolic BP:
                </label>
                <input 
                  name="diastolic_bp" 
                  type="number" 
                  min="0" 
                  value={form['diastolic_bp']} 
                  onChange={handleChange} 
                  required 
                  style={{
                    padding: '0.75rem',
                    border: '1px solid #d1d5db',
                    borderRadius: '8px',
                    fontSize: '1rem',
                    backgroundColor: 'white',
                    minHeight: '44px',
                    '@media (max-width: 768px)': {
                      fontSize: '16px',
                    }
                  }}
                />
              </div>
            </div>
            
            <div style={{
              display: 'grid',
              gridTemplateColumns: '1fr',
              gap: '1rem',
              '@media (min-width: 768px)': {
                gridTemplateColumns: 'repeat(2, 1fr)',
              }
            }}>
              <div style={{
                display: 'flex',
                flexDirection: 'column',
                gap: '0.5rem',
              }}>
                <label style={{
                  fontWeight: '600',
                  color: '#374151',
                  fontSize: '0.875rem',
                }}>
                  Heart Rate:
                </label>
                <input 
                  name="Heart Rate" 
                  type="number" 
                  min="0" 
                  value={form['Heart Rate']} 
                  onChange={handleChange} 
                  required 
                  style={{
                    padding: '0.75rem',
                    border: '1px solid #d1d5db',
                    borderRadius: '8px',
                    fontSize: '1rem',
                    backgroundColor: 'white',
                    minHeight: '44px',
                    '@media (max-width: 768px)': {
                      fontSize: '16px',
                    }
                  }}
                />
              </div>
            </div>
            
            <button 
              type="submit" 
              style={{
                background: 'linear-gradient(90deg, #2563eb 0%, #60a5fa 100%)',
                color: 'white',
                border: 'none',
                borderRadius: '8px',
                padding: '1rem 2rem',
                fontSize: '1.1rem',
                fontWeight: '600',
                cursor: 'pointer',
                marginTop: '1rem',
                minHeight: '44px',
                transition: 'transform 0.2s',
                '@media (max-width: 768px)': {
                  padding: '0.875rem 1.5rem',
                  fontSize: '1rem',
                  width: '100%',
                },
                '@media (max-width: 480px)': {
                  padding: '0.75rem 1.25rem',
                  fontSize: '0.875rem',
                }
              }}
            >
              Predict Sleep Disorder
            </button>
            
            {result && (
              <div style={{
                background: '#f0f9ff',
                border: '1px solid #0ea5e9',
                borderRadius: '8px',
                padding: '1rem',
                marginTop: '1rem',
                textAlign: 'center',
                fontSize: '1.1rem',
                fontWeight: '600',
                color: '#0c4a6e',
                '@media (max-width: 768px)': {
                  fontSize: '1rem',
                  padding: '0.875rem',
                }
              }}>
                Prediction: {result}
              </div>
            )}
          </form>
        </div>
      </div>
    </div>
  );
};

export default SleepDisorderForm;