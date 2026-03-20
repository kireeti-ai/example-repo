import { motion } from 'framer-motion';

export default function Navbar() {
  return (
    <motion.nav
      className="navbar"
      initial={{ y: -80, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      transition={{ duration: 0.7, ease: [0.22, 1, 0.36, 1] }}
    >
      <div className="navbar-brand">
        SaatDin
        <span className="navbar-dot" />
      </div>
      <ul className="navbar-links">
        <li><a href="#how-it-works">How it works</a></li>
        <li><a href="#coverage">Coverage</a></li>
        <li><a href="#for-riders">For Riders</a></li>
      </ul>
    </motion.nav>
  );
}
