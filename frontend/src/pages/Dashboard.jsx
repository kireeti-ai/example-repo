import { motion } from 'framer-motion';
import { useInView } from 'react-intersection-observer';
import CountUp from 'react-countup';
import { Link } from 'react-router-dom';
// lucide-react icons available if needed
import ProgressBar from '../components/ProgressBar';

const container = {
  hidden: { opacity: 0 },
  show: { opacity: 1, transition: { staggerChildren: 0.08, delayChildren: 0.1 } },
};
const item = {
  hidden: { opacity: 0, y: 24 },
  show: { opacity: 1, y: 0, transition: { duration: 0.5, ease: [0.25, 0.1, 0.25, 1] } },
};

const recentClaims = [
  { emoji: '🌧', trigger: 'RainLock', date: 'Mar 18', amount: '₹400', status: 'Paid' },
  { emoji: '🚦', trigger: 'TrafficBlock', date: 'Mar 12', amount: '₹280', status: 'Paid' },
  { emoji: '😷', trigger: 'AQI Guard', date: 'Mar 07', amount: '₹320', status: 'Paid' },
  { emoji: '🌧', trigger: 'RainLock', date: 'Feb 28', amount: '₹400', status: 'Under Review' },
];

function StatCard({ label, value, badge, isOrange, delay = 0 }) {
  const [ref, inView] = useInView({ triggerOnce: true, threshold: 0.3 });
  return (
    <motion.div
      className="stat-card"
      ref={ref}
      variants={item}
      whileHover={{ scale: 1.015, borderColor: '#2563eb22', background: '#161616', boxShadow: '0 0 0 1px #2563eb22, 0 20px 60px rgba(0,0,0,0.4)' }}
    >
      <p className="stat-card-label">{label}</p>
      {badge ? (
        <span className="badge badge-active" style={{ fontSize: 13, padding: '6px 14px' }}>{badge}</span>
      ) : (
        <p className={`stat-card-value${isOrange ? ' orange' : ''}`}>
          {typeof value === 'number' && inView ? (
            <CountUp end={value} duration={1.5} prefix={isOrange ? '₹' : ''} separator="," />
          ) : value}
        </p>
      )}
    </motion.div>
  );
}

export default function Dashboard() {
  const [ref, inView] = useInView({ triggerOnce: true, threshold: 0.1 });
  const hour = new Date().getHours();
  const greeting = hour < 12 ? 'Good morning' : hour < 17 ? 'Good afternoon' : 'Good evening';

  return (
    <motion.div className="page-container" variants={container} initial="hidden" animate="show" ref={ref}>
      {/* GREETING */}
      <motion.div variants={item} style={{ marginBottom: 32 }}>
        <h1 style={{ fontFamily: 'var(--font-display)', fontSize: 28, fontWeight: 800, marginBottom: 4 }}>
          {greeting}, Raju.
        </h1>
        <p style={{ color: 'var(--muted)', fontSize: 14 }}>
          Bellandur · Blinkit · Policy active until Sunday
        </p>
      </motion.div>

      {/* STAT CARDS */}
      <motion.div className="stat-cards-grid" variants={item}>
        <StatCard label="Coverage Status" badge="ACTIVE" />
        <StatCard label="This Week's Premium" value="₹68" />
        <StatCard label="Total Paid Out" value={1200} isOrange />
        <StatCard label="Claims This Month" value="3" />
      </motion.div>

      {/* MAIN GRID */}
      <div className="dash-grid">
        {/* LEFT COLUMN */}
        <div>
          {/* LIVE ZONE MONITOR */}
          <motion.div className="card" variants={item} whileHover={{ borderColor: '#2563eb22' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 20 }}>
              <div>
                <h3 style={{ fontSize: 16, fontWeight: 700, marginBottom: 4 }}>Live Zone Monitor</h3>
                <p style={{ fontFamily: 'var(--font-mono)', fontSize: 11, color: 'var(--muted)' }}>Pincode 560103 · Bellandur</p>
              </div>
              <span style={{ fontFamily: 'var(--font-mono)', fontSize: 11, color: 'var(--muted2)' }}>Last checked: 2 min ago</span>
            </div>

            {/* Rainfall */}
            <div className="zone-metric">
              <span style={{ fontSize: 20 }}>🌧</span>
              <div>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                  <span style={{ fontSize: 13, fontWeight: 600 }}>Rainfall</span>
                  <div style={{ display: 'flex', gap: 10, alignItems: 'center' }}>
                    <span style={{ fontFamily: 'var(--font-mono)', fontSize: 12, color: 'var(--text)' }}>18mm in past 3hr</span>
                    <span className="badge badge-monitoring">Monitoring</span>
                  </div>
                </div>
                <div className="zone-metric-bar-track" data-tooltip="Derived from Open-Meteo API">
                  <motion.div className="zone-metric-bar-fill" initial={{ width: 0 }} animate={inView ? { width: '51%' } : {}} transition={{ duration: 1, delay: 0.3 }} />
                </div>
              </div>
            </div>

            {/* AQI */}
            <div className="zone-metric">
              <span style={{ fontSize: 20 }}>😷</span>
              <div>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                  <span style={{ fontSize: 13, fontWeight: 600 }}>AQI</span>
                  <div style={{ display: 'flex', gap: 10, alignItems: 'center' }}>
                    <span style={{ fontFamily: 'var(--font-mono)', fontSize: 12, color: 'var(--text)' }}>142</span>
                    <span className="badge badge-normal">Normal</span>
                  </div>
                </div>
                <div className="zone-metric-bar-track" data-tooltip="Derived from WAQI / CPCB data">
                  <motion.div className="zone-metric-bar-fill" initial={{ width: 0 }} animate={inView ? { width: '57%' } : {}} transition={{ duration: 1, delay: 0.5 }} />
                </div>
              </div>
            </div>

            {/* Traffic */}
            <div className="zone-metric">
              <span style={{ fontSize: 20 }}>🚦</span>
              <div>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                  <span style={{ fontSize: 13, fontWeight: 600 }}>Traffic Speed</span>
                  <div style={{ display: 'flex', gap: 10, alignItems: 'center' }}>
                    <span style={{ fontFamily: 'var(--font-mono)', fontSize: 12, color: 'var(--text)' }}>11.2 kmph</span>
                    <span className="badge badge-normal">Normal</span>
                  </div>
                </div>
                <div className="zone-metric-bar-track" data-tooltip="Derived from TomTom Traffic API">
                  <motion.div className="zone-metric-bar-fill" initial={{ width: 0 }} animate={inView ? { width: '45%' } : {}} transition={{ duration: 1, delay: 0.7 }} />
                </div>
              </div>
            </div>

            <p style={{ fontFamily: 'var(--font-mono)', fontSize: 11, color: 'var(--muted2)', marginTop: 16, textAlign: 'center' }}>
              Next check in 13 minutes
            </p>
          </motion.div>

          {/* RECENT CLAIMS */}
          <motion.div className="card" variants={item} whileHover={{ borderColor: '#2563eb22' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 16 }}>
              <h3 style={{ fontSize: 16, fontWeight: 700 }}>Recent Claims</h3>
              <Link to="/claims" style={{ fontSize: 13, color: 'var(--blue)', fontWeight: 500 }}>View all →</Link>
            </div>
            {recentClaims.map((c, i) => (
              <div className="claim-row" key={i}>
                <span style={{ fontSize: 18 }}>{c.emoji}</span>
                <div>
                  <p style={{ fontSize: 13, fontWeight: 600 }}>{c.trigger}</p>
                  <p style={{ fontFamily: 'var(--font-mono)', fontSize: 11, color: 'var(--muted)' }}>{c.date}</p>
                </div>
                <span style={{ color: 'var(--orange)', fontWeight: 700, fontSize: 15 }}>{c.amount}</span>
                <span className={`badge ${c.status === 'Paid' ? 'badge-paid' : 'badge-review'}`}>{c.status}</span>
              </div>
            ))}
          </motion.div>
        </div>

        {/* RIGHT COLUMN */}
        <div>
          {/* YOUR POLICY */}
          <motion.div className="card" variants={item} whileHover={{ borderColor: '#2563eb22' }}>
            <h3 style={{ fontSize: 16, fontWeight: 700, marginBottom: 16 }}>Your Policy</h3>
            <div style={{ display: 'flex', gap: 8, alignItems: 'center', marginBottom: 12 }}>
              <span style={{ fontSize: 14, fontWeight: 600 }}>Tier:</span>
              <span className="badge badge-active">Standard</span>
            </div>
            <div style={{ fontSize: 13, color: 'var(--muted)', lineHeight: 2 }}>
              <p>Payout: <span style={{ color: 'var(--orange)', fontWeight: 600 }}>₹400/day</span></p>
              <p>Max days: <span style={{ color: 'var(--text)' }}>3 per week</span></p>
              <p>Period: <span style={{ color: 'var(--text)' }}>Mar 17 – Mar 23</span></p>
            </div>
            <Link to="/onboarding">
              <motion.button className="btn-secondary" style={{ width: '100%', marginTop: 16 }} whileHover={{ borderColor: '#2563eb', color: '#fff' }} whileTap={{ scale: 0.97 }}>
                Upgrade Plan
              </motion.button>
            </Link>
          </motion.div>

          {/* ZONE RISK SCORE */}
          <motion.div className="card" variants={item} whileHover={{ borderColor: '#2563eb22' }}>
            <h3 style={{ fontSize: 16, fontWeight: 700, marginBottom: 4 }}>Zone Risk Score</h3>
            <p style={{ fontSize: 12, color: 'var(--muted)', marginBottom: 20 }}>ZAPE calculates your premium from these scores every Sunday.</p>
            <div className="risk-bar-row">
              <div className="risk-bar-label"><span>Flood Risk</span><span style={{ color: 'var(--orange)', fontWeight: 600 }}>78%</span></div>
              <ProgressBar value={78} delay={0.2} />
            </div>
            <div className="risk-bar-row">
              <div className="risk-bar-label"><span>AQI Risk</span><span style={{ color: 'var(--orange)', fontWeight: 600 }}>52%</span></div>
              <ProgressBar value={52} delay={0.4} />
            </div>
            <div className="risk-bar-row">
              <div className="risk-bar-label"><span>Traffic Risk</span><span style={{ color: 'var(--orange)', fontWeight: 600 }}>71%</span></div>
              <ProgressBar value={71} delay={0.6} />
            </div>
            <p style={{ fontFamily: 'var(--font-mono)', fontSize: 13, color: 'var(--orange)', fontWeight: 600, marginTop: 8, textAlign: 'center' }}>
              Your multiplier: 1.4×
            </p>
          </motion.div>

          {/* LOYALTY STREAK */}
          <motion.div className="card" variants={item} whileHover={{ borderColor: '#2563eb22' }}>
            <h3 style={{ fontSize: 16, fontWeight: 700, marginBottom: 4 }}>Loyalty Streak</h3>
            <p style={{ fontSize: 14, fontWeight: 600, marginBottom: 16 }}>8 weeks · No fraud detected <span style={{ fontSize: 18 }}>🔥</span></p>
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
                  transition={{ duration: 1, delay: 0.5 }}
                />
              </div>
            </div>
            <p style={{ fontSize: 13, color: 'var(--green)' }}>Current discount: 10% off premium</p>
            <p style={{ fontSize: 12, color: 'var(--muted)', marginTop: 4 }}>Next: 12 weeks → 15% discount</p>
          </motion.div>
        </div>
      </div>
    </motion.div>
  );
}
