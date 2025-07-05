import React, { useState, useEffect } from 'react';
import { useLocation, Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { FaComments, FaHeartbeat, FaBed, FaPlane } from 'react-icons/fa';

// Hamburger icon component
function Hamburger({ onClick, isOpen }) {
  return (
    <button
      onClick={onClick}
      aria-label={isOpen ? 'Close sidebar' : 'Open sidebar'}
      style={{
        position: 'fixed',
        top: 24,
        left: 24,
        zIndex: 1001,
        background: 'rgba(37,99,235,0.95)',
        border: 'none',
        borderRadius: '8px',
        width: 44,
        height: 44,
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'center',
        alignItems: 'center',
        cursor: 'pointer',
        boxShadow: '0 2px 8px rgba(37,99,235,0.12)',
        transition: 'background 0.2s',
        outline: 'none',
      }}
    >
      <div style={{
        width: 24,
        height: 3,
        background: 'white',
        borderRadius: 2,
        margin: '2.5px 0',
        transition: '0.3s',
        transform: isOpen ? 'rotate(45deg) translateY(7px)' : 'none',
      }} />
      <div style={{
        width: 24,
        height: 3,
        background: 'white',
        borderRadius: 2,
        margin: '2.5px 0',
        opacity: isOpen ? 0 : 1,
        transition: '0.3s',
      }} />
      <div style={{
        width: 24,
        height: 3,
        background: 'white',
        borderRadius: 2,
        margin: '2.5px 0',
        transition: '0.3s',
        transform: isOpen ? 'rotate(-45deg) translateY(-7px)' : 'none',
      }} />
    </button>
  );
}

// Sidebar component
function Sidebar({ isOpen, onClose }) {
  const location = useLocation();
  return (
    <motion.aside
      initial={{ x: -260 }}
      animate={{ x: isOpen ? 0 : -260 }}
      transition={{ type: 'spring', stiffness: 300, damping: 30 }}
      style={{ ...styles.sidebar, position: 'fixed', left: 0, top: 0, height: '100vh', zIndex: 1000, boxShadow: isOpen ? '2px 0 12px rgba(37,99,235,0.08)' : 'none' }}
    >
      <div style={styles.sidebarTitle}>
        <FaPlane style={{ marginRight: 8 }} />
        AeroVitals
      </div>
      <div style={styles.avatarContainer}>
        <img src="frontend\\src\\images\\passenger.png" alt="Passenger" style={styles.avatar} />
        <div style={styles.avatarName}>Passenger</div>
      </div>
      <nav>
        <ul style={styles.sidebarList}>
          <li>
            <Link to="/dashboard" style={{ ...styles.sidebarLink, ...(location.pathname === '/dashboard' ? styles.activeLink : {}) }} onClick={onClose}>
              <FaComments style={styles.icon} /> Chatbot
            </Link>
          </li>
          <li>
            <Link to="/sleep-disorder" style={{ ...styles.sidebarLink, ...(location.pathname === '/sleep-disorder' ? styles.activeLink : {}) }} onClick={onClose}>
              <FaBed style={styles.icon} /> Sleep Disorder
            </Link>
          </li>
          <li>
            <Link to="/stress-level" style={{ ...styles.sidebarLink, ...(location.pathname === '/stress-level' ? styles.activeLink : {}) }} onClick={onClose}>
              <FaHeartbeat style={styles.icon} /> Stress Level
            </Link>
          </li>
        </ul>
      </nav>
    </motion.aside>
  );
}

const MainLayout = ({ children }) => {
  const location = useLocation();
  const [sidebarOpen, setSidebarOpen] = useState(true);

  // Close sidebar on route change (mobile UX)
  useEffect(() => {
    setSidebarOpen(false);
  }, [location.pathname]);

  // Show sidebar by default on desktop
  useEffect(() => {
    const handleResize = () => {
      if (window.innerWidth > 900) setSidebarOpen(true);
    };
    window.addEventListener('resize', handleResize);
    handleResize();
    return () => window.removeEventListener('resize', handleResize);
  }, []);

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
      <div style={styles.appContainer}>
        <Hamburger onClick={() => setSidebarOpen((v) => !v)} isOpen={sidebarOpen} />
        <Sidebar isOpen={sidebarOpen} onClose={() => setSidebarOpen(false)} />
        <div style={{ ...styles.contentArea, marginLeft: sidebarOpen ? 240 : 0, transition: 'margin-left 0.3s', position: 'relative', zIndex: 1 }}>
          <header style={styles.header}>
            <div style={{ position: 'relative', width: '100%', height: 60 }}>
              <motion.div
                key={location.pathname}
                initial={{ x: -80, rotate: -10, opacity: 0.7 }}
                animate={{ x: 'calc(100vw - 320px)', rotate: 10, opacity: 1 }}
                exit={{ x: '100vw', opacity: 0 }}
                transition={{ duration: 1.2, type: 'spring', bounce: 0.3 }}
                style={{
                  position: 'absolute',
                  top: 0,
                  left: 0,
                  fontSize: 40,
                  color: '#fff',
                  zIndex: 2,
                  filter: 'drop-shadow(0 2px 8px #2563eb88)'
                }}
              >
                <FaPlane />
              </motion.div>
              <h1 style={styles.title}>AeroVitals</h1>
              <p style={styles.subtitle}>Your in-flight personal health monitoring platform</p>
            </div>
          </header>
          <main style={styles.mainContent}>
            {children}
          </main>
          <footer style={styles.footer}>
            <p>© {new Date().getFullYear()} AeroVitals</p>
          </footer>
        </div>
      </div>
    </div>
  );
};

const styles = {
  appContainer: {
    display: 'flex',
    minHeight: '100vh',
    backgroundColor: '#f8fafc',
    fontFamily: "'Segoe UI', Tahoma, Geneva, Verdana, sans-serif"
  },
  sidebar: {
    width: '240px',
    background: 'linear-gradient(180deg, #2563eb 0%, #60a5fa 100%)',
    color: 'white',
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    padding: '32px 0',
    minHeight: '100vh',
    boxShadow: '2px 0 12px rgba(37,99,235,0.08)'
  },
  sidebarTitle: {
    fontSize: '1.7rem',
    fontWeight: 700,
    marginBottom: '2.5rem',
    letterSpacing: '1px',
    textShadow: '0 2px 8px rgba(0,0,0,0.08)'
  },
  sidebarList: {
    listStyle: 'none',
    padding: 0,
    width: '100%',
  },
  sidebarLink: {
    display: 'block',
    padding: '14px 32px',
    color: 'white',
    textDecoration: 'none',
    fontSize: '1.1rem',
    borderRadius: '0 24px 24px 0',
    marginBottom: '8px',
    transition: 'background 0.2s, color 0.2s',
  },
  activeLink: {
    background: 'rgba(255,255,255,0.18)',
    color: '#1e293b',
    fontWeight: 600,
  },
  contentArea: {
    flex: 1,
    display: 'flex',
    flexDirection: 'column',
    minHeight: '100vh',
  },
  header: {
    backgroundColor: '#3b82f6',
    color: 'white',
    padding: '1.5rem',
    textAlign: 'center',
    boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1)'
  },
  title: {
    fontSize: '2rem',
    fontWeight: '600',
    margin: 0
  },
  subtitle: {
    fontSize: '1rem',
    opacity: 0.9,
    margin: '0.5rem 0 0'
  },
  mainContent: {
    flex: 1,
    display: 'flex',
    flexDirection: 'column',
    justifyContent: 'center',
    alignItems: 'center',
    padding: '2rem',
    maxWidth: '1400px',
    margin: '0 auto',
    width: '100%'
  },
  footer: {
    textAlign: 'center',
    padding: '1rem',
    backgroundColor: '#e2e8f0',
    color: '#64748b',
    fontSize: '0.875rem'
  },
  avatarContainer: {
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    marginBottom: '2rem',
  },
  avatar: {
    width: '56px',
    height: '56px',
    borderRadius: '50%',
    marginBottom: '0.5rem',
    objectFit: 'cover',
    border: '2px solid #fff',
    boxShadow: '0 2px 8px rgba(0,0,0,0.08)'
  },
  avatarName: {
    fontSize: '1.1rem',
    fontWeight: '600',
    color: 'white',
    letterSpacing: '0.5px',
  },
  icon: {
    marginRight: '0.5rem',
  },
};

export default MainLayout; 