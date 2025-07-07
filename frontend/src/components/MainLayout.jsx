import React, { useState, useEffect } from 'react';
import { useLocation, Link } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { FaHeartbeat, FaBed, FaPlane, FaTimes, FaThermometerHalf } from 'react-icons/fa';
import userImg from '../images/user.jpg';

// Hamburger icon component
function Hamburger({ onClick, isOpen }) {
  return (
    <button
      onClick={onClick}
      aria-label={isOpen ? 'Close sidebar' : 'Open sidebar'}
      style={{
        position: 'fixed',
        top: '1rem',
        left: '1rem',
        zIndex: 1001,
        background: 'rgba(37,99,235,0.95)',
        border: 'none',
        borderRadius: '8px',
        width: '44px',
        height: '44px',
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'center',
        alignItems: 'center',
        cursor: 'pointer',
        boxShadow: '0 2px 8px rgba(37,99,235,0.12)',
        transition: 'background 0.2s',
        outline: 'none',
        userSelect: 'none',
        touchAction: 'manipulation',
        '@media (max-width: 768px)': {
          top: '0.5rem',
          left: '0.5rem',
          width: '48px',
          height: '48px',
        }
      }}
      onTouchStart={(e) => {
        e.preventDefault();
        e.stopPropagation();
      }}
      onMouseDown={(e) => {
        e.preventDefault();
        e.stopPropagation();
      }}
    >
      <div style={{
        width: '20px',
        height: '2px',
        background: 'white',
        borderRadius: '1px',
        margin: '2px 0',
        transition: '0.3s',
        transform: isOpen ? 'rotate(45deg) translateY(4px)' : 'none',
        pointerEvents: 'none',
      }} />
      <div style={{
        width: '20px',
        height: '2px',
        background: 'white',
        borderRadius: '1px',
        margin: '2px 0',
        opacity: isOpen ? 0 : 1,
        transition: '0.3s',
        pointerEvents: 'none',
      }} />
      <div style={{
        width: '20px',
        height: '2px',
        background: 'white',
        borderRadius: '1px',
        margin: '2px 0',
        transition: '0.3s',
        transform: isOpen ? 'rotate(-45deg) translateY(-4px)' : 'none',
        pointerEvents: 'none',
      }} />
    </button>
  );
}

// Sidebar component
function Sidebar({ isOpen, onClose }) {
  const location = useLocation();
  
  return (
    <>
      {/* Mobile overlay */}
      {isOpen && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          onClick={onClose}
          style={{
            position: 'fixed',
            top: 0,
            left: 0,
            right: 0,
            bottom: 0,
            backgroundColor: 'rgba(0, 0, 0, 0.5)',
            zIndex: 999,
            '@media (min-width: 769px)': {
              display: 'none',
            }
          }}
        />
      )}
      
      <motion.aside
        initial={{ x: -280 }}
        animate={{ x: isOpen ? 0 : -280 }}
        transition={{ type: 'spring', stiffness: 300, damping: 30 }}
        style={{
          position: 'fixed',
          left: 0,
          top: 0,
          height: '100vh',
          width: '280px',
          background: 'linear-gradient(180deg, #2563eb 0%, #60a5fa 100%)',
          color: 'white',
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          padding: '2rem 0',
          zIndex: 1000,
          boxShadow: isOpen ? '2px 0 12px rgba(37,99,235,0.08)' : 'none',
          '@media (max-width: 768px)': {
            width: '100vw',
            maxWidth: '320px',
          }
        }}
      >
        <div style={{
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          width: '100%',
          padding: '0 1.5rem',
          marginBottom: '2rem',
        }}>
          <div style={{
            fontSize: '1.5rem',
            fontWeight: 700,
            letterSpacing: '1px',
            textShadow: '0 2px 8px rgba(0,0,0,0.08)',
            display: 'flex',
            alignItems: 'center',
            gap: '0.5rem',
          }}>
            <FaPlane />
            AeroVitals
          </div>
          <button
            onClick={onClose}
            style={{
              background: 'none',
              border: 'none',
              color: 'white',
              fontSize: '1.2rem',
              cursor: 'pointer',
              padding: '0.5rem',
              borderRadius: '4px',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              '@media (min-width: 769px)': {
                display: 'none',
              }
            }}
          >
            <FaTimes />
          </button>
        </div>
        
        <div style={{
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          marginBottom: '2rem',
        }}>
          <img 
            src={userImg} 
            alt="Passenger" 
            style={{
              width: '56px',
              height: '56px',
              borderRadius: '50%',
              marginBottom: '0.5rem',
              objectFit: 'cover',
              border: '2px solid #fff',
              boxShadow: '0 2px 8px rgba(0,0,0,0.08)'
            }} 
          />
          <div style={{
            fontSize: '1.1rem',
            fontWeight: '600',
            color: 'white',
            letterSpacing: '0.5px',
          }}>
            Passenger
          </div>
        </div>
        
        <nav style={{ width: '100%' }}>
          <ul style={{
            listStyle: 'none',
            padding: 0,
            margin: 0,
            width: '100%',
          }}>
            <li>
              <Link 
                to="/dashboard" 
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  padding: '1rem 1.5rem',
                  color: 'white',
                  textDecoration: 'none',
                  fontSize: '1rem',
                  borderRadius: '0 24px 24px 0',
                  marginBottom: '0.5rem',
                  transition: 'background 0.2s, color 0.2s',
                  background: location.pathname === '/dashboard' ? 'rgba(255,255,255,0.18)' : 'transparent',
                  color: location.pathname === '/dashboard' ? '#1e293b' : 'white',
                  fontWeight: location.pathname === '/dashboard' ? 600 : 400,
                }} 
                onClick={onClose}
              >
                <FaHeartbeat style={{ marginRight: '0.5rem' }} /> 
                Dashboard
              </Link>
            </li>
            <li>
              <Link 
                to="/sleep-disorder" 
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  padding: '1rem 1.5rem',
                  color: 'white',
                  textDecoration: 'none',
                  fontSize: '1rem',
                  borderRadius: '0 24px 24px 0',
                  marginBottom: '0.5rem',
                  transition: 'background 0.2s, color 0.2s',
                  background: location.pathname === '/sleep-disorder' ? 'rgba(255,255,255,0.18)' : 'transparent',
                  color: location.pathname === '/sleep-disorder' ? '#1e293b' : 'white',
                  fontWeight: location.pathname === '/sleep-disorder' ? 600 : 400,
                }} 
                onClick={onClose}
              >
                <FaBed style={{ marginRight: '0.5rem' }} /> 
                Sleep Disorder
              </Link>
            </li>
            <li>
              <Link 
                to="/stress-level" 
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  padding: '1rem 1.5rem',
                  color: 'white',
                  textDecoration: 'none',
                  fontSize: '1rem',
                  borderRadius: '0 24px 24px 0',
                  marginBottom: '0.5rem',
                  transition: 'background 0.2s, color 0.2s',
                  background: location.pathname === '/stress-level' ? 'rgba(255,255,255,0.18)' : 'transparent',
                  color: location.pathname === '/stress-level' ? '#1e293b' : 'white',
                  fontWeight: location.pathname === '/stress-level' ? 600 : 400,
                }} 
                onClick={onClose}
              >
                <FaHeartbeat style={{ marginRight: '0.5rem' }} /> 
                Stress Level
              </Link>
            </li>
            <li>
              <Link 
                to="/health-monitoring" 
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  padding: '1rem 1.5rem',
                  color: 'white',
                  textDecoration: 'none',
                  fontSize: '1rem',
                  borderRadius: '0 24px 24px 0',
                  marginBottom: '0.5rem',
                  transition: 'background 0.2s, color 0.2s',
                  background: location.pathname === '/health-monitoring' ? 'rgba(255,255,255,0.18)' : 'transparent',
                  color: location.pathname === '/health-monitoring' ? '#1e293b' : 'white',
                  fontWeight: location.pathname === '/health-monitoring' ? 600 : 400,
                }} 
                onClick={onClose}
              >
                <FaThermometerHalf style={{ marginRight: '0.5rem' }} /> 
                Health Monitoring
              </Link>
            </li>
          </ul>
        </nav>
      </motion.aside>
    </>
  );
}

const MainLayout = ({ children }) => {
  const location = useLocation();
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [isMobile, setIsMobile] = useState(false);

  // Handle responsive behavior
  useEffect(() => {
    const handleResize = () => {
      const mobile = window.innerWidth <= 768;
      setIsMobile(mobile);
      // Only auto-open sidebar on desktop on initial mount
      if (!mobile) {
        setSidebarOpen(true);
      } else {
        setSidebarOpen(false);
      }
    };
    handleResize();
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []); // Only run on mount/unmount

  // Close sidebar on route change (mobile UX)
  useEffect(() => {
    if (isMobile) {
      setSidebarOpen(false);
    }
  }, [location.pathname, isMobile]);

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
      
      <div style={{
        display: 'flex',
        minHeight: '100vh',
        backgroundColor: '#f8fafc',
        fontFamily: "'Segoe UI', Tahoma, Geneva, Verdana, sans-serif"
      }}>
        <Hamburger onClick={() => setSidebarOpen((v) => !v)} isOpen={sidebarOpen} />
        <Sidebar isOpen={sidebarOpen} onClose={() => setSidebarOpen(false)} />
        
        <div style={{
          flex: 1,
          display: 'flex',
          flexDirection: 'column',
          minHeight: '100vh',
          marginLeft: isMobile ? 0 : (sidebarOpen ? '280px' : 0),
          transition: 'margin-left 0.3s',
          position: 'relative',
          zIndex: 1,
          '@media (max-width: 768px)': {
            marginLeft: 0,
          }
        }}>
          <header style={{
            backgroundColor: '#3b82f6',
            color: 'white',
            padding: '1rem',
            textAlign: 'center',
            boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1)',
            '@media (max-width: 768px)': {
              padding: '0.75rem',
            }
          }}>
            <div style={{
              position: 'relative',
              width: '100%',
              height: 'auto',
              minHeight: '60px',
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
              justifyContent: 'center',
              '@media (max-width: 768px)': {
                minHeight: '50px',
              }
            }}>
              <h1 style={{
                fontSize: isMobile ? '1.5rem' : '2rem',
                fontWeight: '600',
                margin: '0.5rem 0',
                '@media (max-width: 768px)': {
                  fontSize: '1.25rem',
                  margin: '0.25rem 0',
                }
              }}>
                AeroVitals
              </h1>
              <p style={{
                fontSize: isMobile ? '0.875rem' : '1rem',
                opacity: 0.9,
                margin: '0.25rem 0 0',
                '@media (max-width: 768px)': {
                  fontSize: '0.75rem',
                  margin: '0.125rem 0 0',
                }
              }}>
                Your in-flight personal health monitoring platform
              </p>
            </div>
          </header>
          
          <main style={{
            flex: 1,
            display: 'flex',
            flexDirection: 'column',
            justifyContent: 'center',
            alignItems: 'center',
            padding: isMobile ? '1rem' : '2rem',
            maxWidth: '1400px',
            margin: '0 auto',
            width: '100%',
            '@media (max-width: 768px)': {
              padding: '0.75rem',
            }
          }}>
            <AnimatePresence mode="wait">
              <motion.div
                key={location.pathname}
                initial={{ opacity: 0, y: 20, scale: 0.95 }}
                animate={{ opacity: 1, y: 0, scale: 1 }}
                exit={{ opacity: 0, y: -20, scale: 0.95 }}
                transition={{ 
                  duration: 0.4, 
                  ease: [0.4, 0, 0.2, 1],
                  scale: {
                    duration: 0.3,
                    ease: [0.4, 0, 0.2, 1]
                  }
                }}
                style={{
                  width: '100%',
                  height: '100%',
                  display: 'flex',
                  flexDirection: 'column',
                  justifyContent: 'center',
                  alignItems: 'center',
                }}
              >
                {children}
              </motion.div>
            </AnimatePresence>
          </main>
          
          <footer style={{
            textAlign: 'center',
            padding: isMobile ? '0.75rem' : '1rem',
            backgroundColor: '#e2e8f0',
            color: '#64748b',
            fontSize: isMobile ? '0.75rem' : '0.875rem',
          }}>
            <p>© {new Date().getFullYear()} AeroVitals</p>
          </footer>
        </div>
      </div>
    </div>
  );
};

export default MainLayout; 