import React, { useState, useEffect, useRef } from 'react';
import axios from 'axios';
import { Howl } from 'howler';
import musicFile from '../assets/background-music-soft-piano-334995.mp3';
import { API_BASE_URL } from '../config';

const HeartRateMonitor = () => {
  const [heartRate, setHeartRate] = useState('');
  const [status, setStatus] = useState(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const [volume, setVolume] = useState(0.5);
  const soundRef = useRef(null);

  // Range configuration
  const MIN_BPM = 40;
  const MAX_BPM = 200;
  const NORMAL_MIN = 60;
  const NORMAL_MAX = 100;

  useEffect(() => {
    soundRef.current = new Howl({
      src: [musicFile],
      loop: true,
      volume: volume,
    });

    return () => {
      if (soundRef.current) {
        soundRef.current.unload();
      }
    };
  }, []);

  useEffect(() => {
    if (soundRef.current) {
      soundRef.current.volume(volume);
    }
  }, [volume]);

  const checkHeartRate = async () => {
    try {
      const response = await axios.post(`${API_BASE_URL}/heartrate`, {
        heart_rate: heartRate
      });

      const play = response.data.play_music;
      const newStatus = determineStatus(heartRate);

      setStatus(newStatus);

      // Auto-play music if backend suggests it
      if (play && !isPlaying) {
        soundRef.current.play();
        setIsPlaying(true);
      } else if (!play && isPlaying) {
        soundRef.current.pause();
        setIsPlaying(false);
      }
    } catch (error) {
      console.error('Error checking heart rate:', error);
    }
  };

  const determineStatus = (rate) => {
    const hr = parseInt(rate);
    if (isNaN(hr)) return null;
    
    // Calculate position (40-200 bpm range)
    const position = ((hr - MIN_BPM) / (MAX_BPM - MIN_BPM)) * 100;
    
    if (hr < NORMAL_MIN) return { 
      text: 'LOW HEART RATE', 
      color: '#3B82F6',
      position: Math.max(0, position) // Ensure position doesn't go below 0
    };
    if (hr > NORMAL_MAX) return { 
      text: 'HIGH HEART RATE', 
      color: '#EF4444',
      position: Math.min(100, position) // Ensure position doesn't exceed 100
    };
    return { 
      text: 'NORMAL HEART RATE', 
      color: '#10B981',
      position: position
    };
  };

  const toggleMusic = () => {
    if (!soundRef.current) return;

    if (isPlaying) {
      soundRef.current.pause();
    } else {
      soundRef.current.play();
    }
    setIsPlaying(!isPlaying);
  };

  const handleVolumeChange = (e) => {
    const newVolume = parseFloat(e.target.value);
    setVolume(newVolume);
  };

  // Generate tick marks for the scale
  const generateScaleTicks = () => {
    const ticks = [];
    for (let bpm = 40; bpm <= 200; bpm += 20) {
      const position = ((bpm - MIN_BPM) / (MAX_BPM - MIN_BPM)) * 100;
      ticks.push(
        <div 
          key={bpm} 
          style={{
            position: 'absolute',
            left: `${position}%`,
            transform: 'translateX(-50%)',
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
          }}
        >
          <div style={{ 
            height: '8px', 
            width: '1px', 
            backgroundColor: '#6B7280',
            '@media (max-width: 768px)': {
              height: '6px',
            }
          }}></div>
          <div style={{ 
            fontSize: '10px', 
            marginTop: '4px',
            '@media (max-width: 768px)': {
              fontSize: '8px',
              marginTop: '2px',
            }
          }}>{bpm}</div>
        </div>
      );
    }
    return ticks;
  };

  return (
    <div style={{
      maxWidth: '800px',
      margin: '0 auto',
      padding: '2rem',
      backgroundColor: '#f8fafc',
      borderRadius: '16px',
      boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1)',
      fontFamily: 'Arial, sans-serif',
      '@media (max-width: 768px)': {
        padding: '1.5rem',
        margin: '0 1rem',
      },
      '@media (max-width: 480px)': {
        padding: '1rem',
        margin: '0 0.5rem',
      }
    }}>
      <h2 style={{
        textAlign: 'center',
        color: '#1f2937',
        marginBottom: '2rem',
        fontSize: '2rem',
        fontWeight: '700',
        '@media (max-width: 768px)': {
          fontSize: '1.5rem',
          marginBottom: '1.5rem',
        },
        '@media (max-width: 480px)': {
          fontSize: '1.25rem',
          marginBottom: '1rem',
        }
      }}>
        HEART RATE MONITOR
      </h2>
      
      {/* Heart Rate Display */}
      <div style={{
        textAlign: 'center',
        marginBottom: '2rem',
        '@media (max-width: 768px)': {
          marginBottom: '1.5rem',
        }
      }}>
        <div style={{
          fontSize: '4rem',
          fontWeight: '700',
          color: '#1f2937',
          lineHeight: 1,
          '@media (max-width: 768px)': {
            fontSize: '3rem',
          },
          '@media (max-width: 480px)': {
            fontSize: '2.5rem',
          }
        }}>
          {heartRate || '--'}
        </div>
        <div style={{
          fontSize: '1.5rem',
          color: '#6b7280',
          marginTop: '0.5rem',
          '@media (max-width: 768px)': {
            fontSize: '1.25rem',
          },
          '@media (max-width: 480px)': {
            fontSize: '1rem',
          }
        }}>
          bpm
        </div>
        {status && (
          <div style={{
            fontSize: '1.25rem',
            fontWeight: '600',
            marginTop: '1rem',
            color: status.color,
            '@media (max-width: 768px)': {
              fontSize: '1rem',
              marginTop: '0.75rem',
            },
            '@media (max-width: 480px)': {
              fontSize: '0.875rem',
              marginTop: '0.5rem',
            }
          }}>
            {status.text}
          </div>
        )}
      </div>
      
      {/* Color-coded Bar Indicator */}
      <div style={{
        marginBottom: '2rem',
        '@media (max-width: 768px)': {
          marginBottom: '1.5rem',
        }
      }}>
        <div style={{
          position: 'relative',
          height: '60px',
          marginBottom: '1rem',
          '@media (max-width: 768px)': {
            height: '50px',
          },
          '@media (max-width: 480px)': {
            height: '40px',
          }
        }}>
          {generateScaleTicks()}
          {/* Pointer on the number line */}
          {status && (
            <div 
              style={{
                position: 'absolute',
                left: `${status.position}%`,
                bottom: '16px',
                transform: 'translateX(-50%)',
                zIndex: 10,
                '@media (max-width: 768px)': {
                  bottom: '12px',
                },
                '@media (max-width: 480px)': {
                  bottom: '8px',
                }
              }}
            >
              <div style={{
                width: '10px',
                height: '10px',
                borderRadius: '50%',
                backgroundColor: status.color,
                border: '2px solid white',
                boxShadow: '0 0 4px rgba(0,0,0,0.3)',
                '@media (max-width: 480px)': {
                  width: '8px',
                  height: '8px',
                }
              }}></div>
            </div>
          )}
        </div>
        <div style={{
          position: 'relative',
          height: '20px',
          backgroundColor: '#e5e7eb',
          borderRadius: '10px',
          overflow: 'hidden',
          '@media (max-width: 768px)': {
            height: '16px',
          },
          '@media (max-width: 480px)': {
            height: '12px',
          }
        }}>
          {/* Gradient from blue (low) to green (normal) to red (high) */}
          <div style={{
            width: '100%',
            height: '100%',
            background: `linear-gradient(
              90deg, 
              #3B82F6 0%, 
              #3B82F6 ${(NORMAL_MIN - MIN_BPM) / (MAX_BPM - MIN_BPM) * 100}%, 
              #10B981 ${(NORMAL_MIN - MIN_BPM) / (MAX_BPM - MIN_BPM) * 100}%, 
              #10B981 ${(NORMAL_MAX - MIN_BPM) / (MAX_BPM - MIN_BPM) * 100}%, 
              #EF4444 ${(NORMAL_MAX - MIN_BPM) / (MAX_BPM - MIN_BPM) * 100}%, 
              #EF4444 100%
            )`
          }}></div>
          {status && (
            <div 
              style={{
                position: 'absolute',
                left: `${status.position}%`,
                top: '50%',
                transform: 'translate(-50%, -50%)',
                zIndex: 5,
              }}
            >
              <div style={{
                width: '0',
                height: '0',
                borderLeft: '6px solid transparent',
                borderRight: '6px solid transparent',
                borderBottom: '8px solid',
                borderBottomColor: status.color,
                '@media (max-width: 480px)': {
                  borderLeft: '4px solid transparent',
                  borderRight: '4px solid transparent',
                  borderBottom: '6px solid',
                  borderBottomColor: status.color,
                }
              }}></div>
              <div style={{
                width: '2px',
                height: '20px',
                backgroundColor: status.color,
                margin: '0 auto',
                '@media (max-width: 768px)': {
                  height: '16px',
                },
                '@media (max-width: 480px)': {
                  height: '12px',
                }
              }}></div>
            </div>
          )}
        </div>
      </div>
      
      {/* Input and Controls */}
      <div style={{
        display: 'flex',
        flexDirection: 'column',
        gap: '1.5rem',
        '@media (max-width: 768px)': {
          gap: '1rem',
        }
      }}>
        <div style={{
          display: 'flex',
          gap: '1rem',
          alignItems: 'center',
          '@media (max-width: 768px)': {
            flexDirection: 'column',
            gap: '0.75rem',
          }
        }}>
          <input
            type="number"
            placeholder="Enter heart rate (40-200 bpm)"
            value={heartRate}
            onChange={(e) => setHeartRate(e.target.value)}
            style={{
              flex: 1,
              padding: '0.875rem',
              border: '1px solid #d1d5db',
              borderRadius: '8px',
              fontSize: '1rem',
              backgroundColor: 'white',
              minHeight: '44px',
              '@media (max-width: 768px)': {
                fontSize: '16px',
                width: '100%',
              },
              '@media (max-width: 480px)': {
                padding: '0.75rem',
                fontSize: '0.875rem',
              }
            }}
          />
          <button
            onClick={checkHeartRate}
            style={{
              background: 'linear-gradient(90deg, #2563eb 0%, #60a5fa 100%)',
              color: 'white',
              border: 'none',
              borderRadius: '8px',
              padding: '0.875rem 1.5rem',
              fontSize: '1rem',
              fontWeight: '600',
              cursor: 'pointer',
              minHeight: '44px',
              minWidth: '120px',
              transition: 'transform 0.2s',
              '@media (max-width: 768px)': {
                padding: '0.75rem 1.25rem',
                fontSize: '0.875rem',
                minWidth: '100px',
                width: '100%',
              },
              '@media (max-width: 480px)': {
                padding: '0.625rem 1rem',
                fontSize: '0.8rem',
                minWidth: '80px',
              }
            }}
          >
            Check Rate
          </button>
        </div>
        
        {/* Music Controls */}
        <div style={{
          display: 'flex',
          flexDirection: 'column',
          gap: '1rem',
          padding: '1.5rem',
          backgroundColor: '#f1f5f9',
          borderRadius: '12px',
          '@media (max-width: 768px)': {
            padding: '1rem',
            gap: '0.75rem',
          }
        }}>
          <h3 style={{
            margin: 0,
            fontSize: '1.25rem',
            color: '#1f2937',
            '@media (max-width: 768px)': {
              fontSize: '1.125rem',
            },
            '@media (max-width: 480px)': {
              fontSize: '1rem',
            }
          }}>
            Music Controls
          </h3>
          
          <div style={{
            display: 'flex',
            gap: '1rem',
            alignItems: 'center',
            '@media (max-width: 768px)': {
              flexDirection: 'column',
              gap: '0.75rem',
            }
          }}>
            {isPlaying && (
              <button
                onClick={toggleMusic}
                style={{
                  background: '#ef4444',
                  color: 'white',
                  border: 'none',
                  borderRadius: '8px',
                  padding: '0.75rem 1.25rem',
                  fontSize: '1rem',
                  fontWeight: '600',
                  cursor: 'pointer',
                  minHeight: '44px',
                  minWidth: '120px',
                  transition: 'transform 0.2s',
                  '@media (max-width: 768px)': {
                    padding: '0.625rem 1rem',
                    fontSize: '0.875rem',
                    minWidth: '100px',
                    width: '100%',
                  },
                  '@media (max-width: 480px)': {
                    padding: '0.5rem 0.875rem',
                    fontSize: '0.8rem',
                    minWidth: '80px',
                  }
                }}
              >
                Stop Music
              </button>
            )}
            
            <div style={{
              display: 'flex',
              alignItems: 'center',
              gap: '0.75rem',
              flex: 1,
              '@media (max-width: 768px)': {
                width: '100%',
              }
            }}>
              <label style={{
                fontSize: '0.875rem',
                color: '#374151',
                fontWeight: '500',
                '@media (max-width: 480px)': {
                  fontSize: '0.8rem',
                }
              }}>
                Volume:
              </label>
              <input
                type="range"
                min="0"
                max="1"
                step="0.1"
                value={volume}
                onChange={handleVolumeChange}
                style={{
                  flex: 1,
                  height: '6px',
                  borderRadius: '3px',
                  background: '#d1d5db',
                  outline: 'none',
                  cursor: 'pointer',
                  '@media (max-width: 480px)': {
                    height: '4px',
                  }
                }}
              />
              <span style={{
                fontSize: '0.875rem',
                color: '#6b7280',
                minWidth: '30px',
                textAlign: 'right',
                '@media (max-width: 480px)': {
                  fontSize: '0.8rem',
                  minWidth: '25px',
                }
              }}>
                {Math.round(volume * 100)}%
              </span>
            </div>
          </div>
          
          {!isPlaying && (
            <div style={{
              fontSize: '0.875rem',
              color: '#6b7280',
              fontStyle: 'italic',
              textAlign: 'center',
              '@media (max-width: 480px)': {
                fontSize: '0.8rem',
              }
            }}>
              Music will play automatically when you check your heart rate
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default HeartRateMonitor;