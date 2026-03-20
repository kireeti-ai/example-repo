import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Link, useLocation, useNavigate } from 'react-router-dom';

export default function Navbar() {
  const location = useLocation();
  const navigate = useNavigate();
  const isPublic = location.pathname === '/';
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);

  const privateLinks = [
    { to: '/dashboard', label: 'Dashboard' },
    { to: '/claims', label: 'Claims' },
    { to: '/profile', label: 'Profile' },
  ];

  return (
    <motion.nav
      className="navbar"
      initial={{ y: -20, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      transition={{ duration: 0.6, ease: [0.25, 0.1, 0.25, 1] }}
    >
      <Link to={isPublic ? '/' : '/dashboard'} className="nav-brand">
        SaatDin
        <span className="nav-dot" />
      </Link>

      {/* Hamburger */}
      <button
        className="hamburger"
        onClick={() => setMobileOpen(!mobileOpen)}
        aria-label="Menu"
      >
        <span />
        <span />
        <span />
      </button>

      {isPublic ? (
        <ul className={`nav-links${mobileOpen ? ' open' : ''}`}>
          <li><a href="#how-it-works" onClick={() => setMobileOpen(false)}>How it works</a></li>
          <li><a href="#coverage" onClick={() => setMobileOpen(false)}>Coverage</a></li>
          <li><a href="#triggers" onClick={() => setMobileOpen(false)}>Triggers</a></li>
          <li>
            <motion.button
              className="btn-primary"
              style={{ padding: '8px 18px', fontSize: 13 }}
              whileHover={{ scale: 1.04, boxShadow: '0 8px 30px rgba(37,99,235,0.35)' }}
              whileTap={{ scale: 0.97 }}
              onClick={() => { setMobileOpen(false); navigate('/onboarding'); }}
            >
              Get Started →
            </motion.button>
          </li>
        </ul>
      ) : (
        <ul className={`nav-links${mobileOpen ? ' open' : ''}`}>
          {privateLinks.map((link) => (
            <li key={link.to}>
              <Link
                to={link.to}
                className={location.pathname === link.to ? 'active' : ''}
                onClick={() => setMobileOpen(false)}
              >
                {link.label}
              </Link>
            </li>
          ))}
          <li style={{ position: 'relative' }}>
            <div
              className="nav-avatar"
              onClick={() => setDropdownOpen(!dropdownOpen)}
            >
              R
            </div>
            <AnimatePresence>
              {dropdownOpen && (
                <motion.div
                  className="nav-avatar-dropdown"
                  initial={{ opacity: 0, y: -8 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -8 }}
                  transition={{ duration: 0.15 }}
                >
                  <Link to="/profile" onClick={() => { setDropdownOpen(false); setMobileOpen(false); }}>Profile</Link>
                  <button onClick={() => { setDropdownOpen(false); setMobileOpen(false); navigate('/'); }}>Sign out</button>
                </motion.div>
              )}
            </AnimatePresence>
          </li>
        </ul>
      )}
    </motion.nav>
  );
}
