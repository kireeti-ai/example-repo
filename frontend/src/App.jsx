import { Routes, Route, useLocation } from 'react-router-dom';
import { AnimatePresence, motion } from 'framer-motion';
import Background from './components/Background';
import Navbar from './components/Navbar';
import Cursor from './components/Cursor';
import Landing from './pages/Landing';
import Dashboard from './pages/Dashboard';
import Onboarding from './pages/Onboarding';
import Claims from './pages/Claims';
import Profile from './pages/Profile';

function AnimatedRoutes() {
  const location = useLocation();
  return (
    <AnimatePresence mode="wait">
      <motion.div
        key={location.pathname}
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        exit={{ opacity: 0, y: -10 }}
        transition={{ duration: 0.3, ease: [0.25, 0.1, 0.25, 1] }}
      >
        <Routes location={location}>
          <Route path="/" element={<Landing />} />
          <Route path="/dashboard" element={<Dashboard />} />
          <Route path="/onboarding" element={<Onboarding />} />
          <Route path="/claims" element={<Claims />} />
          <Route path="/profile" element={<Profile />} />
        </Routes>
      </motion.div>
    </AnimatePresence>
  );
}

export default function App() {
  const location = useLocation();
  const isLanding = location.pathname === '/';

  return (
    <>
      <div className="noise-overlay" />
      <Background />
      {isLanding && <Cursor />}
      <Navbar />
      <AnimatedRoutes />
    </>
  );
}
