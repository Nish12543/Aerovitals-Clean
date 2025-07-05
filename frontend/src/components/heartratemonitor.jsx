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
          <div style={{ height: '8px', width: '1px', backgroundColor: '#6B7280' }}></div>
          <div style={{ fontSize: '10px', marginTop: '4px' }}>{bpm}</div>
        </div>
      );
    }
    return ticks;
  };

  return (
    <div style={styles.container}>
      <h2 style={styles.title}>HEART RATE MONITOR</h2>
      
      {/* Heart Rate Display */}
      <div style={styles.rateDisplay}>
        <div style={styles.rateValue}>{heartRate || '--'}</div>
        <div style={styles.rateUnit}>bpm</div>
        {status && (
          <div style={{...styles.statusText, color: status.color}}>
            {status.text}
          </div>
        )}
      </div>
      
      {/* Color-coded Bar Indicator */}
      <div style={styles.barContainer}>
        <div style={styles.scaleContainer}>
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
              }}
            >
              <div style={{
                width: '10px',
                height: '10px',
                borderRadius: '50%',
                backgroundColor: status.color,
                border: '2px solid white',
                boxShadow: '0 0 4px rgba(0,0,0,0.3)',
              }}></div>
            </div>
          )}
        </div>
        <div style={styles.barBackground}>
          {/* Gradient from blue (low) to green (normal) to red (high) */}
          <div style={{
            ...styles.barFill,
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
                ...styles.barPointer,
                left: `${status.position}%`,
              }}
            >
              <div style={{...styles.pointerArrow, borderBottomColor: status.color}}></div>
              <div style={{...styles.pointerLine, backgroundColor: status.color}}></div>
            </div>
          )}
        </div>
      </div>
      
      {/* Input and Controls */}
      <div style={styles.inputContainer}>
        <input
          type="number"
          value={heartRate}
          onChange={(e) => setHeartRate(e.target.value)}
          placeholder={`Enter heart rate (${MIN_BPM}-${MAX_BPM} bpm)`}
          style={styles.input}
          min={MIN_BPM}
          max={MAX_BPM}
        />
        <button onClick={checkHeartRate} style={styles.button}>CHECK</button>
      </div>

      <div style={styles.musicControls}>
        <button 
          onClick={toggleMusic} 
          style={{
            ...styles.musicButton,
            backgroundColor: isPlaying ? '#EF4444' : '#10B981'
          }}
        >
          {isPlaying ? '⏸ PAUSE MUSIC' : '▶️ PLAY MUSIC'}
        </button>
        
        <div style={styles.volumeControl}>
          <label style={styles.volumeLabel}>VOLUME:</label>
          <input
            type="range"
            min="0"
            max="1"
            step="0.1"
            value={volume}
            onChange={handleVolumeChange}
            style={styles.volumeSlider}
          />
        </div>
      </div>
    </div>
  );
};

const styles = {
  container: {
    backgroundColor: '#FFFFFF',
    padding: '25px',
    borderRadius: '16px',
    boxShadow: '0 4px 20px rgba(0,0,0,0.08)',
    maxWidth: '500px',
    margin: '0 auto',
    fontFamily: "'Segoe UI', system-ui, sans-serif",
  },
  title: {
    color: '#1F2937',
    textAlign: 'center',
    marginBottom: '25px',
    fontSize: '18px',
    fontWeight: '600',
  },
  rateDisplay: {
    textAlign: 'center',
    marginBottom: '15px',
  },
  rateValue: {
    fontSize: '48px',
    fontWeight: '700',
    color: '#111827',
    lineHeight: '1',
  },
  rateUnit: {
    fontSize: '16px',
    color: '#6B7280',
    marginTop: '4px',
  },
  statusText: {
    fontSize: '14px',
    fontWeight: '600',
    marginTop: '10px',
    textTransform: 'uppercase',
  },
  barContainer: {
    margin: '30px 0',
    position: 'relative',
  },
  scaleContainer: {
    position: 'relative',
    height: '30px',
    width: '100%',
    marginBottom: '5px',
  },
  barBackground: {
    height: '12px',
    borderRadius: '6px',
    position: 'relative',
    overflow: 'hidden',
  },
  barFill: {
    height: '100%',
    width: '100%',
  },
  barPointer: {
    position: 'absolute',
    top: '-12px',
    transform: 'translateX(-50%)',
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
  },
  pointerArrow: {
    width: 0,
    height: 0,
    borderLeft: '10px solid transparent',
    borderRight: '10px solid transparent',
    borderBottom: '12px solid #36827F', // Add the color here
    marginBottom: '4px',
  },

  pointerLine: {
    width: '2px',
    height: '12px',
  },
  inputContainer: {
    display: 'flex',
    gap: '10px',
    marginBottom: '20px',
  },
  input: {
    flex: '1',
    padding: '12px 16px',
    fontSize: '14px',
    borderRadius: '8px',
    border: '1px solid #E5E7EB',
    outline: 'none',
  },
  button: {
    backgroundColor: '#3B82F6',
    color: 'white',
    border: 'none',
    padding: '12px 20px',
    fontSize: '14px',
    borderRadius: '8px',
    cursor: 'pointer',
    fontWeight: '600',
  },
  musicControls: {
    backgroundColor: '#F9FAFB',
    borderRadius: '12px',
    padding: '15px',
  },
  musicButton: {
    width: '100%',
    padding: '12px',
    borderRadius: '8px',
    border: 'none',
    cursor: 'pointer',
    fontWeight: '600',
    fontSize: '14px',
    color: 'white',
    marginBottom: '12px',
  },
  volumeControl: {
    display: 'flex',
    alignItems: 'center',
    gap: '10px',
  },
  volumeLabel: {
    fontSize: '12px',
    fontWeight: '600',
    color: '#4B5563',
  },
  volumeSlider: {
    flex: '1',
    height: '4px',
    borderRadius: '2px',
    backgroundColor: '#E5E7EB',
    outline: 'none',
  },
};

export default HeartRateMonitor;