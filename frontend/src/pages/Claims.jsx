import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import CountUp from 'react-countup';
import { useInView } from 'react-intersection-observer';
import { Check, Upload, X } from 'lucide-react';

const container = {
  hidden: { opacity: 0 },
  show: { opacity: 1, transition: { staggerChildren: 0.08, delayChildren: 0.1 } },
};
const item = {
  hidden: { opacity: 0, y: 24 },
  show: { opacity: 1, y: 0, transition: { duration: 0.5, ease: [0.25, 0.1, 0.25, 1] } },
};

const allClaims = [
  { id: 'CLM-2024-0318', emoji: '🌧', trigger: 'RainLock', date: 'Mar 18, 2026', zone: 'Bellandur', desc: '52mm rainfall in 3hr window', amount: 400, status: 'Paid', reading: '52mm rainfall (threshold: 35mm)', confidence: '0.94', tier: 'Tier 1', fraud: 'Passed (Layer A + B)', time: '8.4 seconds' },
  { id: 'CLM-2024-0315', emoji: '🚦', trigger: 'TrafficBlock', date: 'Mar 15, 2026', zone: 'Bellandur', desc: '3.2 kmph avg speed for 2.5hr', amount: 280, status: 'Paid', reading: '3.2 kmph (threshold: 5 kmph)', confidence: '0.91', tier: 'Tier 1', fraud: 'Passed (Layer A + B)', time: '6.1 seconds' },
  { id: 'CLM-2024-0312', emoji: '🚦', trigger: 'TrafficBlock', date: 'Mar 12, 2026', zone: 'Bellandur', desc: '4.1 kmph avg over 3hr', amount: 280, status: 'Paid', reading: '4.1 kmph (threshold: 5 kmph)', confidence: '0.88', tier: 'Tier 2', fraud: 'Passed (Layer A)', time: '12.3 seconds' },
  { id: 'CLM-2024-0307', emoji: '😷', trigger: 'AQI Guard', date: 'Mar 07, 2026', zone: 'Bellandur', desc: 'AQI 284 sustained 5hr', amount: 320, status: 'Paid', reading: 'AQI 284 (threshold: 250)', confidence: '0.96', tier: 'Tier 1', fraud: 'Passed (Layer A + B)', time: '5.2 seconds' },
  { id: 'CLM-2024-0228', emoji: '🌧', trigger: 'RainLock', date: 'Feb 28, 2026', zone: 'Bellandur', desc: '38mm rainfall in 3hr window', amount: 400, status: 'Under Review', reading: '38mm rainfall (threshold: 35mm)', confidence: '0.72', tier: 'Tier 2', fraud: 'Passed (Layer A)', time: 'Pending' },
  { id: 'CLM-2024-0220', emoji: '🌧', trigger: 'RainLock', date: 'Feb 20, 2026', zone: 'Bellandur', desc: '61mm rainfall in 2hr window', amount: 400, status: 'Paid', reading: '61mm rainfall (threshold: 35mm)', confidence: '0.99', tier: 'Tier 1', fraud: 'Passed (Layer A + B)', time: '3.8 seconds' },
  { id: 'CLM-2024-0214', emoji: '🚦', trigger: 'TrafficBlock', date: 'Feb 14, 2026', zone: 'Bellandur', desc: '2.8 kmph congestion for 2hr', amount: 280, status: 'Paid', reading: '2.8 kmph (threshold: 5 kmph)', confidence: '0.93', tier: 'Tier 1', fraud: 'Passed (Layer A + B)', time: '7.1 seconds' },
  { id: 'CLM-2024-0201', emoji: '😷', trigger: 'AQI Guard', date: 'Feb 01, 2026', zone: 'Bellandur', desc: 'AQI 210 — below threshold', amount: 0, status: 'Rejected', reading: 'AQI 210 (threshold: 250)', confidence: '0.12', tier: 'Tier 3', fraud: 'N/A', time: 'N/A' },
];

const filters = ['All', 'Paid', 'Under Review', 'Rejected'];

export default function Claims() {
  const [activeFilter, setActiveFilter] = useState('All');
  const [expandedId, setExpandedId] = useState(null);
  const [modalOpen, setModalOpen] = useState(false);
  const [disputeSubmitted, setDisputeSubmitted] = useState(false);
  const [disputeType, setDisputeType] = useState('');
  const [disputeText, setDisputeText] = useState('');
  const [fileName, setFileName] = useState('');
  const [ref, inView] = useInView({ triggerOnce: true, threshold: 0.1 });

  const filtered = activeFilter === 'All' ? allClaims : allClaims.filter(c => c.status === activeFilter);
  const paidTotal = allClaims.filter(c => c.status === 'Paid').reduce((s, c) => s + c.amount, 0);

  const submitDispute = () => {
    setDisputeSubmitted(true);
    setTimeout(() => { setModalOpen(false); setDisputeSubmitted(false); setDisputeType(''); setDisputeText(''); setFileName(''); }, 2500);
  };

  return (
    <motion.div className="page-container" variants={container} initial="hidden" animate="show" ref={ref}>
      {/* HEADER */}
      <motion.div variants={item} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 32 }}>
        <h1 style={{ fontFamily: 'var(--font-display)', fontSize: 28, fontWeight: 800 }}>Your Claims</h1>
        <motion.button className="btn-secondary" whileHover={{ borderColor: '#2563eb', color: '#fff' }} whileTap={{ scale: 0.97 }} onClick={() => setModalOpen(true)}>
          Raise a Dispute
        </motion.button>
      </motion.div>

      {/* SUMMARY STRIP */}
      <motion.div className="summary-strip" variants={item}>
        <div className="stat-card">
          <p className="stat-card-label">Total Claims</p>
          <p className="stat-card-value">{inView ? <CountUp end={8} duration={1} /> : 0}</p>
        </div>
        <div className="stat-card">
          <p className="stat-card-label">Total Paid</p>
          <p className="stat-card-value orange">{inView ? <CountUp end={paidTotal} duration={1.5} prefix="₹" separator="," /> : '₹0'}</p>
        </div>
        <div className="stat-card">
          <p className="stat-card-label">Under Review</p>
          <p className="stat-card-value" style={{ color: 'var(--yellow)' }}>{inView ? <CountUp end={1} duration={0.8} /> : 0}</p>
        </div>
        <div className="stat-card">
          <p className="stat-card-label">Rejected</p>
          <p className="stat-card-value" style={{ color: 'var(--red)' }}>{inView ? <CountUp end={1} duration={0.8} /> : 0}</p>
        </div>
      </motion.div>

      {/* FILTER TABS */}
      <motion.div className="filter-tabs" variants={item}>
        {filters.map((f) => (
          <button key={f} className={`filter-tab${activeFilter === f ? ' active' : ''}`} onClick={() => setActiveFilter(f)}>
            {f}
            {activeFilter === f && (
              <motion.div className="filter-underline" layoutId="filterUnderline" style={{ left: 0, right: 0, width: '100%' }} />
            )}
          </button>
        ))}
      </motion.div>

      {/* CLAIMS LIST */}
      <AnimatePresence mode="wait">
        <motion.div key={activeFilter} initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -10 }} transition={{ duration: 0.2 }}>
          {filtered.length === 0 ? (
            <div style={{ textAlign: 'center', padding: '60px 0' }}>
              <p style={{ fontSize: 16, color: 'var(--muted)', marginBottom: 4 }}>No {activeFilter.toLowerCase()} claims yet.</p>
              <p style={{ fontSize: 13, color: 'var(--muted2)' }}>Claims will appear here once triggers fire.</p>
            </div>
          ) : filtered.map((c, i) => (
            <motion.div className="claim-card" key={c.id} initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.4, delay: i * 0.05 }} onClick={() => setExpandedId(expandedId === c.id ? null : c.id)} whileHover={{ scale: 1.008 }}>
              <div className="claim-card-main">
                <span className="claim-card-emoji">{c.emoji}</span>
                <div className="claim-card-info">
                  <h4>{c.trigger}</h4>
                  <p>{c.date} · {c.zone}</p>
                </div>
                <div className="claim-card-right">
                  <p className="claim-card-amount">₹{c.amount.toLocaleString()}</p>
                  <span className={`badge ${c.status === 'Paid' ? 'badge-paid' : c.status === 'Rejected' ? 'badge-rejected' : 'badge-review'}`}>{c.status}</span>
                </div>
              </div>
              <AnimatePresence>
                {expandedId === c.id && (
                  <motion.div className="claim-expanded" initial={{ height: 0, opacity: 0 }} animate={{ height: 'auto', opacity: 1 }} exit={{ height: 0, opacity: 0 }} transition={{ duration: 0.25 }}>
                    <div className="claim-detail-row">Claim ID: <span style={{ fontFamily: 'var(--font-mono)' }}>{c.id}</span></div>
                    <div className="claim-detail-row">Pincode: <span>560103</span></div>
                    <div className="claim-detail-row">API reading: <span>{c.reading}</span></div>
                    <div className="claim-detail-row">TriBrain: <span>{c.tier} · Confidence: {c.confidence}</span></div>
                    <div className="claim-detail-row">Fraud check: <span>{c.fraud}</span></div>
                    <div className="claim-detail-row">Payout time: <span style={{ fontFamily: 'var(--font-mono)', color: c.time !== 'N/A' && c.time !== 'Pending' ? 'var(--green)' : 'var(--muted)' }}>{c.time}</span></div>
                  </motion.div>
                )}
              </AnimatePresence>
            </motion.div>
          ))}
        </motion.div>
      </AnimatePresence>

      {/* DISPUTE MODAL */}
      <AnimatePresence>
        {modalOpen && (
          <motion.div className="modal-backdrop" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} onClick={() => { if (!disputeSubmitted) { setModalOpen(false); } }}>
            <motion.div className="modal-card" initial={{ scale: 0.95, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} exit={{ scale: 0.95, opacity: 0 }} transition={{ duration: 0.2 }} onClick={(e) => e.stopPropagation()}>
              {!disputeSubmitted ? (
                <>
                  <h3>Raise a Dispute</h3>
                  <div className="form-group">
                    <label className="form-label">Disruption type</label>
                    <select className="form-select" value={disputeType} onChange={(e) => setDisputeType(e.target.value)}>
                      <option value="">Select type</option>
                      <option>RainLock</option>
                      <option>AQI Guard</option>
                      <option>TrafficBlock</option>
                      <option>ZoneLock</option>
                      <option>HeatBlock</option>
                      <option>Other</option>
                    </select>
                  </div>
                  <div className="form-group">
                    <label className="form-label">Describe what happened</label>
                    <textarea className="modal-textarea" placeholder="Tell us what you experienced..." value={disputeText} onChange={(e) => setDisputeText(e.target.value)} />
                  </div>
                  <div className="form-group">
                    <label className="form-label">Upload evidence (optional)</label>
                    <label className="file-input-styled">
                      <Upload size={16} color="var(--muted)" />
                      <span style={{ fontSize: 13, color: fileName ? 'var(--text)' : 'var(--muted)' }}>{fileName || 'Choose file...'}</span>
                      <input type="file" accept="image/*,video/*" onChange={(e) => setFileName(e.target.files?.[0]?.name || '')} />
                    </label>
                  </div>
                  <div className="modal-buttons">
                    <motion.button className="btn-secondary" whileHover={{ borderColor: '#2563eb', color: '#fff' }} whileTap={{ scale: 0.97 }} onClick={() => setModalOpen(false)}>Cancel</motion.button>
                    <motion.button className="btn-primary" whileHover={{ scale: 1.04, boxShadow: '0 8px 30px rgba(37,99,235,0.35)' }} whileTap={{ scale: 0.97 }} onClick={submitDispute} disabled={!disputeType || !disputeText}>Submit Dispute →</motion.button>
                  </div>
                </>
              ) : (
                <motion.div initial={{ scale: 0.8, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} style={{ textAlign: 'center', padding: '20px 0' }}>
                  <div className="success-check"><Check size={24} color="#22c55e" /></div>
                  <h3 style={{ marginBottom: 8 }}>Dispute submitted.</h3>
                  <p style={{ color: 'var(--muted)', fontSize: 14 }}>We'll review within 4 hours.</p>
                </motion.div>
              )}
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  );
}
