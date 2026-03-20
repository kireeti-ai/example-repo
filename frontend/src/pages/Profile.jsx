import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import ProgressBar from '../components/ProgressBar';

const container = {
  hidden: { opacity: 0 },
  show: { opacity: 1, transition: { staggerChildren: 0.08, delayChildren: 0.1 } },
};
const item = {
  hidden: { opacity: 0, y: 24 },
  show: { opacity: 1, y: 0, transition: { duration: 0.5, ease: [0.25, 0.1, 0.25, 1] } },
};

const details = [
  { label: 'NAME', value: 'Raju Kumar' },
  { label: 'PHONE', value: '+91 98765 43210' },
  { label: 'PLATFORM', value: 'Blinkit' },
  { label: 'ZONE', value: 'Bellandur' },
  { label: 'PINCODE', value: '560103' },
  { label: 'MEMBER SINCE', value: 'Jan 2026' },
];

const loyaltyTiers = [
  { weeks: 4, discount: '5%', achieved: true },
  { weeks: 8, discount: '10%', achieved: true },
  { weeks: 12, discount: '15%', achieved: false, note: '4 weeks away' },
  { weeks: 16, discount: '20%', achieved: false, note: 'locked' },
];

export default function Profile() {
  return (
    <motion.div className="page-container" variants={container} initial="hidden" animate="show">
      {/* HEADER */}
      <motion.div className="profile-header" variants={item}>
        <div className="profile-avatar">R</div>
        <div>
          <h1 style={{ fontFamily: 'var(--font-display)', fontSize: 24, fontWeight: 800, marginBottom: 2 }}>Raju Kumar</h1>
          <p style={{ color: 'var(--muted)', fontSize: 13 }}>Member since January 2026</p>
        </div>
      </motion.div>

      {/* 3 COLUMN GRID */}
      <div className="profile-grid">
        {/* COLUMN 1 */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: 20 }}>
          {/* PERSONAL DETAILS */}
          <motion.div className="card" variants={item} whileHover={{ borderColor: '#2563eb22' }}>
            <h3 style={{ fontSize: 16, fontWeight: 700, marginBottom: 16 }}>Personal Details</h3>
            {details.map((d) => (
              <div className="profile-detail-row" key={d.label}>
                <p className="profile-detail-label">{d.label}</p>
                <p className="profile-detail-value">{d.value}</p>
              </div>
            ))}
          </motion.div>

          {/* LOYALTY */}
          <motion.div className="card" variants={item} whileHover={{ borderColor: '#2563eb22' }}>
            <h3 style={{ fontSize: 16, fontWeight: 700, marginBottom: 4 }}>Loyalty & Discounts</h3>
            <p style={{ fontSize: 15, fontWeight: 700, marginBottom: 16 }}>8-week clean streak 🔥</p>

            <div style={{ marginBottom: 16 }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: 12, color: 'var(--muted)', marginBottom: 6 }}>
                <span>8 / 12 weeks to next milestone</span>
                <span style={{ color: 'var(--text)' }}>66%</span>
              </div>
              <div className="risk-bar-track">
                <motion.div
                  className="risk-bar-fill"
                  style={{ background: 'linear-gradient(90deg, var(--blue), var(--green))' }}
                  initial={{ width: 0 }}
                  animate={{ width: '66%' }}
                  transition={{ duration: 1, delay: 0.3 }}
                />
              </div>
            </div>

            {loyaltyTiers.map((t) => (
              <div className="loyalty-row" key={t.weeks}>
                <span>{t.weeks} weeks → {t.discount} off</span>
                <span className={t.achieved ? 'achieved' : 'locked'}>
                  {t.achieved ? '✓ Achieved' : t.note === 'locked' ? '○ locked' : `○ ${t.note}`}
                </span>
              </div>
            ))}

            <p style={{ color: 'var(--orange)', fontSize: 13, marginTop: 12 }}>Current saving: ₹6.80/week</p>
          </motion.div>
        </div>

        {/* COLUMN 2 */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: 20 }}>
          {/* ACTIVE POLICY */}
          <motion.div className="card" variants={item} whileHover={{ borderColor: '#2563eb22' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 16 }}>
              <h3 style={{ fontSize: 16, fontWeight: 700 }}>Active Policy</h3>
              <span className="badge badge-active">ACTIVE</span>
            </div>
            <div style={{ fontSize: 13, color: 'var(--muted)', lineHeight: 2.2 }}>
              <p>Tier: <span style={{ color: 'var(--white)', fontWeight: 600 }}>Standard</span></p>
              <p>Weekly premium: <span style={{ color: 'var(--orange)', fontWeight: 600 }}>₹68</span></p>
              <p>Daily payout: <span style={{ color: 'var(--orange)', fontWeight: 600 }}>₹400</span></p>
              <p>Max covered days: <span style={{ color: 'var(--white)' }}>3 per week</span></p>
              <p>Policy period: <span style={{ color: 'var(--white)' }}>Mar 17 – Mar 23 2026</span></p>
            </div>
            <div style={{ borderTop: '1px solid var(--border)', marginTop: 12, paddingTop: 12 }}>
              <p style={{ fontFamily: 'var(--font-mono)', fontSize: 11, color: 'var(--muted2)' }}>
                Next debit: Monday, Mar 24 · ₹68
              </p>
            </div>
            <div style={{ display: 'flex', flexDirection: 'column', gap: 8, marginTop: 16 }}>
              <Link to="/onboarding">
                <motion.button className="btn-primary" style={{ width: '100%' }} whileHover={{ scale: 1.04, boxShadow: '0 8px 30px rgba(37,99,235,0.35)' }} whileTap={{ scale: 0.97 }}>
                  Upgrade to Premium
                </motion.button>
              </Link>
              <Link to="/claims">
                <motion.button className="btn-secondary" style={{ width: '100%' }} whileHover={{ borderColor: '#2563eb', color: '#fff' }} whileTap={{ scale: 0.97 }}>
                  View all claims
                </motion.button>
              </Link>
            </div>
          </motion.div>

          {/* QUICK STATS */}
          <motion.div className="card" variants={item} whileHover={{ borderColor: '#2563eb22' }}>
            <h3 style={{ fontSize: 16, fontWeight: 700, marginBottom: 16 }}>Quick Stats</h3>
            <div style={{ fontSize: 13, color: 'var(--muted)', lineHeight: 2.4 }}>
              <p>Total weeks insured: <span style={{ color: 'var(--white)' }}>10</span></p>
              <p>Total claims: <span style={{ color: 'var(--white)' }}>8</span></p>
              <p>Total paid out: <span style={{ color: 'var(--orange)', fontWeight: 700 }}>₹2,640</span></p>
              <p>Avg payout/claim: <span style={{ color: 'var(--orange)', fontWeight: 700 }}>₹330</span></p>
              <p>Claim success rate: <span style={{ color: 'var(--green)', fontWeight: 700 }}>87.5%</span></p>
            </div>
          </motion.div>
        </div>

        {/* COLUMN 3 */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: 20 }}>
          {/* ZONE RISK */}
          <motion.div className="card" variants={item} whileHover={{ borderColor: '#2563eb22' }}>
            <p className="section-label" style={{ marginBottom: 16 }}>ZAPE scores · Updated Sunday</p>

            <div className="risk-bar-row">
              <div className="risk-bar-label">
                <span>🌧 Flood Risk</span>
                <span style={{ color: 'var(--orange)', fontWeight: 600 }}>78%</span>
              </div>
              <ProgressBar value={78} delay={0.2} />
              <p style={{ fontSize: 11, color: 'var(--muted)', marginTop: 4 }}>High — Bellandur is in BBMP flood zone A</p>
            </div>

            <div className="risk-bar-row">
              <div className="risk-bar-label">
                <span>😷 AQI Risk</span>
                <span style={{ color: 'var(--orange)', fontWeight: 600 }}>52%</span>
              </div>
              <ProgressBar value={52} delay={0.4} />
              <p style={{ fontSize: 11, color: 'var(--muted)', marginTop: 4 }}>Moderate — seasonal variation</p>
            </div>

            <div className="risk-bar-row">
              <div className="risk-bar-label">
                <span>🚦 Traffic Risk</span>
                <span style={{ color: 'var(--orange)', fontWeight: 600 }}>71%</span>
              </div>
              <ProgressBar value={71} delay={0.6} />
              <p style={{ fontSize: 11, color: 'var(--muted)', marginTop: 4 }}>High — ORR corridor</p>
            </div>

            <div style={{ borderTop: '1px solid var(--border)', marginTop: 8, paddingTop: 12 }}>
              <p style={{ fontFamily: 'var(--font-mono)', fontSize: 13, color: 'var(--orange)', fontWeight: 600 }}>Zone Multiplier: 1.4×</p>
              <p style={{ fontSize: 12, color: 'var(--muted)', marginTop: 4 }}>Platform Factor: 1.1× (Blinkit)</p>
              <p style={{ fontSize: 12, color: 'var(--white)', marginTop: 2 }}>Combined: 1.54× base rate</p>
            </div>
          </motion.div>

          {/* DANGER ZONE */}
          <motion.div className="card danger-card" variants={item}>
            <p style={{ color: 'var(--red)', fontSize: 14, fontWeight: 600, marginBottom: 4 }}>Delete Account</p>
            <p style={{ color: 'var(--muted)', fontSize: 12, marginBottom: 16, lineHeight: 1.6 }}>
              This will cancel your active policy and forfeit remaining coverage.
            </p>
            <motion.button className="btn-danger" whileHover={{ background: 'rgba(239,68,68,0.1)' }} whileTap={{ scale: 0.97 }}>
              Delete Account
            </motion.button>
          </motion.div>
        </div>
      </div>
    </motion.div>
  );
}
