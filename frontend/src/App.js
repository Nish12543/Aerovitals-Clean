import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import HeartRateMonitor from './components/heartratemonitor';
import Chatbot from './components/chatbot';
import SleepDisorderForm from './components/SleepDisorderForm';
import StressLevelForm from './components/StressLevelForm';
import LandingPage from './components/LandingPage';
import { FaPlane } from 'react-icons/fa';
import MainLayout from './components/MainLayout';
import HealthMonitoring from './components/HealthMonitoring';

function AppContent() {
  return (
    <div style={{ position: 'relative', minHeight: '100vh', overflow: 'hidden' }}>
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
          0% {
            background-position: 0% 50%;
          }
          50% {
            background-position: 100% 50%;
          }
          100% {
            background-position: 0% 50%;
          }
        }
      `}</style>
      <Routes>
        <Route path="/" element={<LandingPage />} />
        <Route path="/dashboard" element={
          <MainLayout>
            <div style={styles.flexRow}>
              <div style={styles.column}>
                <div style={styles.card}>
                  <h2 style={{ display: 'flex', alignItems: 'center', fontSize: '1.7rem', fontWeight: 700, color: '#2563eb', marginBottom: '1.5rem' }}>
                    <FaPlane style={{ marginRight: 10 }} /> AeroVitals
                  </h2>
                  <h2 style={styles.cardTitle}>Heart Rate Monitor</h2>
                  <HeartRateMonitor />
                </div>
              </div>
              <div style={styles.column}>
                <div style={styles.card}>
                  <h2 style={styles.cardTitle}>First Aid Assistant</h2>
                  <Chatbot />
                </div>
              </div>
            </div>
          </MainLayout>
        } />
        <Route path="/sleep-disorder" element={
          <MainLayout>
            <SleepDisorderForm />
          </MainLayout>
        } />
        <Route path="/stress-level" element={
          <MainLayout>
            <StressLevelForm />
          </MainLayout>
        } />
        <Route path="/health-monitoring" element={
          <MainLayout>
            <HealthMonitoring />
          </MainLayout>
        } />
      </Routes>
    </div>
  );
}

function App() {
  return (
    <Router>
      <AppContent />
    </Router>
  );
}

const styles = {
  flexRow: {
    display: 'flex',
    flexWrap: 'wrap',
    justifyContent: 'center',
    gap: '2rem',
    width: '100%'
  },
  column: {
    flex: '1',
    minWidth: '350px',
    maxWidth: '600px'
  },
  card: {
    backgroundColor: 'white',
    borderRadius: '0.5rem',
    boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1)',
    padding: '1.5rem',
    height: '100%'
  },
  cardTitle: {
    fontSize: '1.25rem',
    fontWeight: '600',
    color: '#1e293b',
    marginTop: 0,
    marginBottom: '1rem',
    paddingBottom: '0.5rem',
    borderBottom: '2px solid #e2e8f0'
  },
};

export default App;
