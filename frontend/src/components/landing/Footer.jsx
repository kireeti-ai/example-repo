import { motion } from 'framer-motion';

export default function Footer() {
  return (
    <footer className="footer">
      <div className="footer-top">
        <div>
          <p className="footer-brand">SaatDin</p>
          <p className="footer-tagline">ek hafte ki kamai, hamesha surakshit.</p>
        </div>
        <p className="footer-center">Guidewire DEVTrails 2026</p>
        <div className="footer-team">
          <p>Built by</p>
          <p style={{ color: '#fff', fontWeight: 600 }}>Team SaatDin</p>
        </div>
      </div>

      <motion.div
        className="footer-bottom"
        initial={{ opacity: 0 }}
        whileInView={{ opacity: 1 }}
        viewport={{ once: true }}
        transition={{ duration: 0.8 }}
      >
        <p>
          Coverage scope: income loss only.
          Does not cover health, accidents, or vehicle damage.
          Thresholds are prototype design decisions.
        </p>
      </motion.div>
    </footer>
  );
}
