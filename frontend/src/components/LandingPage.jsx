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
    <div style={styles.landingRoot}>
      {/* Animated blue gradient background */}
      <div style={styles.gradientBg} />
      <style>{`
        @keyframes gradientMove {
          0% { background-position: 0% 50%; }
          50% { background-position: 100% 50%; }
          100% { background-position: 0% 50%; }
        }
      `}</style>
      <div style={styles.heroSection}>
        <motion.div
          initial={{ y: -60, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ duration: 1, type: 'spring', bounce: 0.3 }}
          style={{ display: 'flex', alignItems: 'center', marginBottom: 16 }}
        >
          <FaPlane size={48} style={{ color: '#fff', marginRight: 16, filter: 'drop-shadow(0 2px 8px #2563eb44)' }} />
          <span style={{ fontSize: '2.5rem', fontWeight: 800, color: '#fff', letterSpacing: 1, textShadow: '0 2px 8px #2563eb88' }}>AeroVitals</span>
        </motion.div>
        <motion.p
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3, duration: 0.8 }}
          style={{ fontSize: '1.3rem', color: '#1e293b', marginBottom: 32, maxWidth: 500, textAlign: 'center' }}
        >
          Your in-flight personal health monitoring platform. Stay safe, informed, and healthy at 30,000 feet.
        </motion.p>
        <motion.button
          whileHover={{ scale: 1.07 }}
          whileTap={{ scale: 0.97 }}
          onClick={() => navigate('/dashboard')}
          style={styles.getStartedBtn}
        >
          Get Started
        </motion.button>
      </div>
      <div style={styles.featuresSection}>
        {features.map((f, i) => (
          <motion.div
            key={f.title}
            initial={{ opacity: 0, y: 40 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.5 + i * 0.2, duration: 0.7 }}
            style={styles.featureCard}
          >
            <div>{f.icon}</div>
            <div style={{ fontWeight: 700, fontSize: '1.1rem', margin: '12px 0 6px' }}>{f.title}</div>
            <div style={{ color: '#334155', fontSize: '1rem' }}>{f.desc}</div>
          </motion.div>
        ))}
      </div>
      <footer style={styles.footer}>
        <p>© 2025 AeroVitals</p>
      </footer>
    </div>
  );
}

const styles = {
  landingRoot: {
    minHeight: '100vh',
    width: '100vw',
    position: 'relative',
    overflow: 'hidden',
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    justifyContent: 'flex-start',
    zIndex: 0,
  },
  gradientBg: {
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
  },
  heroSection: {
    zIndex: 1,
    marginTop: 80,
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    justifyContent: 'center',
    minHeight: 320,
  },
  getStartedBtn: {
    background: 'linear-gradient(90deg, #2563eb 0%, #60a5fa 100%)',
    color: 'white',
    border: 'none',
    borderRadius: '8px',
    padding: '16px 36px',
    fontSize: '1.2rem',
    fontWeight: 700,
    cursor: 'pointer',
    boxShadow: '0 2px 12px rgba(37,99,235,0.10)',
    marginTop: 8,
    letterSpacing: 1,
    transition: 'background 0.2s',
  },
  featuresSection: {
    zIndex: 1,
    marginTop: 56,
    display: 'flex',
    flexWrap: 'wrap',
    justifyContent: 'center',
    gap: '32px',
    width: '100%',
    maxWidth: 1100,
    padding: '0 24px',
  },
  featureCard: {
    background: 'rgba(255,255,255,0.92)',
    borderRadius: 16,
    boxShadow: '0 2px 16px rgba(37,99,235,0.08)',
    padding: '32px 28px',
    minWidth: 240,
    maxWidth: 320,
    flex: '1 1 260px',
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    marginBottom: 24,
  },
  footer: {
    zIndex: 1,
    textAlign: 'center',
    padding: '2rem 0 1rem',
    color: '#fff',
    fontSize: '1rem',
    width: '100%',
    marginTop: 40,
  },
}; 