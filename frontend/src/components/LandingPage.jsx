import React from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { FaPlane, FaHeartbeat, FaComments, FaBed } from 'react-icons/fa';

const features = [
  {
    icon: <FaHeartbeat size={32} color="#2563eb" />,
    title: 'Real-time Health Monitoring',
    desc: 'Track your heart rate, blood pressure, and more during your flight.'
  },
  {
    icon: <FaComments size={32} color="#2563eb" />,
    title: 'AI First Aid Assistant',
    desc: 'Get instant health advice and first aid support from our onboard chatbot.'
  },
  {
    icon: <FaBed size={32} color="#2563eb" />,
    title: 'Sleep & Stress Prediction',
    desc: 'Personalized predictions for sleep disorders and stress levels.'
  }
];

export default function LandingPage() {
  const navigate = useNavigate();
  
  return (
    <div style={{
      minHeight: '100vh',
      width: '100vw',
      position: 'relative',
      overflow: 'hidden',
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'center',
      justifyContent: 'flex-start',
      zIndex: 0,
    }}>
      {/* Animated blue gradient background */}
      <div style={{
        position: 'fixed',
        top: 0,
        left: 0,
        width: '100vw',
        height: '100vh',
        zIndex: 0,
        pointerEvents: 'none',
        background: 'linear-gradient(120deg, #e0f2fe 0%, #60a5fa 40%, #2563eb 100%)',
        animation: 'gradientMove 12s ease-in-out infinite',
        backgroundSize: '200% 200%',
      }} />
      <style>{`
        @keyframes gradientMove {
          0% { background-position: 0% 50%; }
          50% { background-position: 100% 50%; }
          100% { background-position: 0% 50%; }
        }
      `}</style>
      
      <div style={{
        zIndex: 1,
        marginTop: '2rem',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        minHeight: '60vh',
        padding: '0 1rem',
        '@media (max-width: 768px)': {
          marginTop: '1rem',
          minHeight: '50vh',
          padding: '0 0.5rem',
        }
      }}>
        <motion.div
          initial={{ y: -60, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ duration: 1, type: 'spring', bounce: 0.3 }}
          style={{
            display: 'flex',
            alignItems: 'center',
            marginBottom: '1rem',
            flexDirection: 'column',
            '@media (max-width: 768px)': {
              marginBottom: '0.5rem',
            }
          }}
        >
          <FaPlane 
            size={48} 
            style={{
              color: '#fff',
              marginBottom: '0.5rem',
              filter: 'drop-shadow(0 2px 8px #2563eb44)',
              '@media (max-width: 768px)': {
                fontSize: '2rem',
              }
            }}
          />
          <span style={{
            fontSize: '2.5rem',
            fontWeight: 800,
            color: '#fff',
            letterSpacing: 1,
            textShadow: '0 2px 8px #2563eb88',
            textAlign: 'center',
            '@media (max-width: 768px)': {
              fontSize: '1.75rem',
            },
            '@media (max-width: 480px)': {
              fontSize: '1.5rem',
            }
          }}>
            AeroVitals
          </span>
        </motion.div>
        
        <motion.p
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3, duration: 0.8 }}
          style={{
            fontSize: '1.3rem',
            color: '#1e293b',
            marginBottom: '2rem',
            maxWidth: '500px',
            textAlign: 'center',
            lineHeight: 1.5,
            '@media (max-width: 768px)': {
              fontSize: '1rem',
              marginBottom: '1.5rem',
              maxWidth: '100%',
            },
            '@media (max-width: 480px)': {
              fontSize: '0.875rem',
              marginBottom: '1rem',
            }
          }}
        >
          Your in-flight personal health monitoring platform. Stay safe, informed, and healthy at 30,000 feet.
        </motion.p>
        
        <motion.button
          whileHover={{ scale: 1.07 }}
          whileTap={{ scale: 0.97 }}
          onClick={() => navigate('/dashboard')}
          style={{
            background: 'linear-gradient(90deg, #2563eb 0%, #60a5fa 100%)',
            color: 'white',
            border: 'none',
            borderRadius: '8px',
            padding: '1rem 2rem',
            fontSize: '1.2rem',
            fontWeight: 700,
            cursor: 'pointer',
            boxShadow: '0 2px 12px rgba(37,99,235,0.10)',
            marginTop: '0.5rem',
            letterSpacing: 1,
            transition: 'background 0.2s',
            minHeight: '44px',
            '@media (max-width: 768px)': {
              padding: '0.875rem 1.5rem',
              fontSize: '1rem',
              width: '100%',
              maxWidth: '280px',
            },
            '@media (max-width: 480px)': {
              padding: '0.75rem 1.25rem',
              fontSize: '0.875rem',
            }
          }}
        >
          Get Started
        </motion.button>
      </div>
      
      <div style={{
        zIndex: 1,
        marginTop: '3rem',
        display: 'flex',
        flexWrap: 'wrap',
        justifyContent: 'center',
        gap: '2rem',
        width: '100%',
        maxWidth: '1200px',
        padding: '0 1rem',
        '@media (max-width: 768px)': {
          marginTop: '2rem',
          gap: '1rem',
          padding: '0 0.5rem',
        }
      }}>
        {features.map((f, i) => (
          <motion.div
            key={f.title}
            initial={{ opacity: 0, y: 40 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.5 + i * 0.2, duration: 0.7 }}
            style={{
              background: 'rgba(255,255,255,0.92)',
              borderRadius: '16px',
              boxShadow: '0 2px 16px rgba(37,99,235,0.08)',
              padding: '2rem 1.5rem',
              minWidth: '240px',
              maxWidth: '320px',
              flex: '1 1 260px',
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
              marginBottom: '1rem',
              textAlign: 'center',
              '@media (max-width: 768px)': {
                padding: '1.5rem 1rem',
                minWidth: '200px',
                maxWidth: '100%',
                flex: '1 1 100%',
              },
              '@media (max-width: 480px)': {
                padding: '1rem 0.75rem',
                minWidth: '100%',
              }
            }}
          >
            <div style={{
              marginBottom: '1rem',
              '@media (max-width: 768px)': {
                marginBottom: '0.75rem',
              }
            }}>
              {f.icon}
            </div>
            <div style={{
              fontWeight: 700,
              fontSize: '1.1rem',
              margin: '0 0 0.5rem 0',
              color: '#1e293b',
              '@media (max-width: 768px)': {
                fontSize: '1rem',
              },
              '@media (max-width: 480px)': {
                fontSize: '0.875rem',
              }
            }}>
              {f.title}
            </div>
            <div style={{
              color: '#334155',
              fontSize: '1rem',
              lineHeight: 1.4,
              '@media (max-width: 768px)': {
                fontSize: '0.875rem',
              },
              '@media (max-width: 480px)': {
                fontSize: '0.75rem',
              }
            }}>
              {f.desc}
            </div>
          </motion.div>
        ))}
      </div>
      
      <footer style={{
        zIndex: 1,
        textAlign: 'center',
        padding: '2rem 0 1rem',
        color: '#fff',
        fontSize: '1rem',
        width: '100%',
        marginTop: '3rem',
        '@media (max-width: 768px)': {
          padding: '1.5rem 0 0.75rem',
          marginTop: '2rem',
          fontSize: '0.875rem',
        },
        '@media (max-width: 480px)': {
          padding: '1rem 0 0.5rem',
          marginTop: '1.5rem',
          fontSize: '0.75rem',
        }
      }}>
        <p>© 2025 AeroVitals</p>
      </footer>
    </div>
  );
} 