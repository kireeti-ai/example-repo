import { motion } from 'framer-motion';
import { useInView } from 'react-intersection-observer';
import CountUp from 'react-countup';
import { useNavigate } from 'react-router-dom';
import { ChevronRight } from 'lucide-react';
import useLenis from '../hooks/useLenis';

/* ===== ANIMATION VARIANTS ===== */
const container = {
  hidden: { opacity: 0 },
  show: { opacity: 1, transition: { staggerChildren: 0.08, delayChildren: 0.1 } },
};
const item = {
  hidden: { opacity: 0, y: 24 },
  show: { opacity: 1, y: 0, transition: { duration: 0.5, ease: [0.25, 0.1, 0.25, 1] } },
};

/* ===== DATA ===== */
const riders = [
  { emoji: '🌧️', name: 'Raju, 28', platform: 'Blinkit', area: 'Bellandur', scenario: "It's Tuesday evening. The monsoon hit at 6pm. Roads are flooded. He can't reach the dark store.", earned: '₹0' },
  { emoji: '😷', name: 'Babu, 24', platform: 'Zepto', area: 'HSR Layout', scenario: "Diwali week. AQI crosses 270. He's been riding since 9am. Another 4 hours outside isn't safe.", earned: '₹0' },
  { emoji: '🚗', name: 'Suresh, 32', platform: 'Swiggy Instamart', area: 'Whitefield', scenario: "Outer Ring Road. 3 hours of gridlock. He's expected to deliver in 10 minutes.", earned: '₹0' },
];

const steps = [
  { num: '01', title: <>Pay <span className="orange">₹35–90</span>/week</>, desc: "Based on your zone's flood, AQI, and traffic risk score." },
  { num: '02', title: 'We monitor your pincode', desc: 'Open-Meteo, WAQI, and TomTom polled every 15 minutes. Pincode level — not city level.' },
  { num: '03', title: 'Disruption crosses threshold', desc: 'RainLock. AQI Guard. TrafficBlock. ZoneLock. HeatBlock. Rules evaluated instantly.' },
  { num: '04', title: 'Money in your UPI', desc: "Razorpay dispatches the payout in under 10 seconds. You don't open the app. You don't file anything." },
];

const triggers = [
  { name: 'RainLock', desc: 'Heavy rainfall', threshold: '> 35mm / 3hr', payout: '100%' },
  { name: 'AQI Guard', desc: 'Hazardous air quality', threshold: 'AQI > 250 / 4hr', payout: '80%' },
  { name: 'TrafficBlock', desc: 'Severe congestion', threshold: '< 5kmph / 2hr', payout: '70%' },
  { name: 'ZoneLock', desc: 'Curfew / bandh / strike', threshold: 'NLP confirmed', payout: '100%' },
  { name: 'HeatBlock', desc: 'Extreme heat + humidity', threshold: '39°C + 70% RH', payout: '60%' },
];

const tiers = [
  { name: 'Basic', price: '₹35–52/week', daily: '₹250/day', maxDays: '2 days max', highlighted: false },
  { name: 'Standard', price: '₹53–68/week', daily: '₹400/day', maxDays: '3 days max', highlighted: true },
  { name: 'Premium', price: '₹69–90/week', daily: '₹550/day', maxDays: '4 days max', highlighted: false },
];

const brains = [
  { tier: 'Tier 1', title: 'Rule Engine', desc: 'Confidence ≥ 0.90 — fires instantly. No model call. No latency. Most claims end here.' },
  { tier: 'Tier 2', title: 'ML Engine', desc: 'Confidence 0.60–0.89 — Random Forest + Isolation Forest evaluate the edge case.' },
  { tier: 'Tier 3', title: 'LLM Brain (Groq)', desc: 'Confidence < 0.60 — Llama 3.3 70B reasons over full claim context. Human reviewable.' },
];

/* ===== SECTION COMPONENTS ===== */
function HeroSection() {
  const navigate = useNavigate();
  const [ref, inView] = useInView({ triggerOnce: true, threshold: 0.3 });

  return (
    <section className="hero" ref={ref}>
      <div className="hero-grid" />
      <motion.p className="hero-label" initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.6, delay: 0.2 }}>
        Built for Blinkit · Zepto · Swiggy Instamart
      </motion.p>
      <motion.h1 initial={{ opacity: 0, y: 30, filter: 'blur(8px)' }} animate={{ opacity: 1, y: 0, filter: 'blur(0px)' }} transition={{ duration: 0.8, ease: [0.22, 1, 0.36, 1] }}>
        Your earnings stop.<br />Your payout shouldn't.
      </motion.h1>
      <motion.p className="hero-subtext" initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.7, delay: 0.3 }}>
        SaatDin monitors floods, AQI, and gridlock in your delivery zone — every 15 minutes. When a disruption hits, you're paid automatically. No forms. No calls.
      </motion.p>
      <div className="hero-stats">
        <motion.div className="stat-pill" initial={{ scale: 0.8, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} transition={{ duration: 0.5, delay: 0.6 }}>
          <span className="orange">₹{inView ? <CountUp end={35} duration={1.5} /> : '0'}</span>&nbsp;/ week
        </motion.div>
        <motion.div className="stat-pill" initial={{ scale: 0.8, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} transition={{ duration: 0.5, delay: 0.9 }}>
          {'< '}<span className="orange">{inView ? <CountUp end={10} duration={1.2} /> : '0'}</span>&nbsp;sec payout
        </motion.div>
      </div>
      <motion.div className="hero-cta" initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.6, delay: 1 }}>
        <motion.button className="btn-primary" style={{ padding: '14px 32px', fontSize: 15 }} whileHover={{ scale: 1.04, boxShadow: '0 8px 30px rgba(37,99,235,0.35)' }} whileTap={{ scale: 0.97 }} onClick={() => navigate('/onboarding')}>
          Get Started →
        </motion.button>
        <a className="sub-link" href="#" onClick={(e) => { e.preventDefault(); navigate('/dashboard'); }}>
          Already registered? View dashboard →
        </a>
      </motion.div>
      <motion.p className="hero-hindi" initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ duration: 0.8, delay: 1.3 }}>
        "ek hafte ki kamai, hamesha surakshit."
      </motion.p>
    </section>
  );
}

function ProblemSection() {
  const [ref, inView] = useInView({ triggerOnce: true, threshold: 0.15 });
  return (
    <section className="section" id="for-riders" ref={ref}>
      <p className="section-label">The problem</p>
      <h2 className="section-heading">Every disruption is a pay cut they take alone.</h2>
      <div className="problem-cards">
        {riders.map((r, i) => (
          <motion.div className="problem-card" key={r.name} initial={{ opacity: 0, y: 30 }} animate={inView ? { opacity: 1, y: 0 } : {}} transition={{ duration: 0.6, delay: i * 0.15, ease: [0.22, 1, 0.36, 1] }} whileHover={{ scale: 1.015, borderColor: '#2563eb22', background: '#161616', boxShadow: '0 0 0 1px #2563eb22, 0 20px 60px rgba(0,0,0,0.4)' }}>
            <div className="card-header">
              <span className="emoji">{r.emoji}</span>
              <span className="name">{r.name}</span>
              <span className="platform-badge">{r.platform}</span>
              <span style={{ color: 'var(--muted)', fontSize: '0.8rem' }}>{r.area}</span>
            </div>
            <p className="card-scenario">{r.scenario}</p>
            <p className="card-earned">Earned that day: {r.earned}</p>
          </motion.div>
        ))}
      </div>
      <motion.p className="problem-footer" initial={{ opacity: 0 }} animate={inView ? { opacity: 1 } : {}} transition={{ duration: 0.8, delay: 0.6 }}>
        No platform compensates them. No insurance product covers this. Bangalore had 36% excess rainfall in 2024. It is the 2nd most congested city in the world. This happens every week.
      </motion.p>
    </section>
  );
}

function HowItWorksSection() {
  const [ref, inView] = useInView({ triggerOnce: true, threshold: 0.2 });
  return (
    <section className="section" id="how-it-works" ref={ref}>
      <p className="section-label">How it works</p>
      <h2 className="section-heading">Four steps. Fully automatic.</h2>
      <div className="timeline">
        {steps.map((s, i) => (
          <motion.div className="timeline-step" key={s.num} initial={{ opacity: 0, x: -30 }} animate={inView ? { opacity: 1, x: 0 } : {}} transition={{ duration: 0.6, delay: i * 0.2, ease: [0.22, 1, 0.36, 1] }}>
            <div className="step-number">{s.num}</div>
            <p className="step-title">{s.title}</p>
            <p className="step-desc">{s.desc}</p>
          </motion.div>
        ))}
      </div>
    </section>
  );
}

function TriggersSection() {
  const [ref, inView] = useInView({ triggerOnce: true, threshold: 0.15 });
  return (
    <section className="section" id="triggers" ref={ref}>
      <p className="section-label">Payout triggers</p>
      <h2 className="section-heading">Five triggers. Pincode level. Automatic.</h2>
      <div className="triggers-table">
        {triggers.map((t, i) => (
          <motion.div className="trigger-row" key={t.name} initial={{ opacity: 0, x: -30 }} animate={inView ? { opacity: 1, x: 0 } : {}} transition={{ duration: 0.5, delay: i * 0.1, ease: [0.22, 1, 0.36, 1] }} whileHover={{ scale: 1.015 }}>
            <span className="trigger-name">{t.name}</span>
            <span className="trigger-desc">{t.desc}</span>
            <span className="trigger-threshold">{t.threshold}</span>
            <span className="trigger-payout">{t.payout}</span>
          </motion.div>
        ))}
      </div>
      <p className="triggers-note">A flood in Bellandur does not affect a rider registered in Whitefield.</p>
    </section>
  );
}

function CoverageSection() {
  const navigate = useNavigate();
  const [ref, inView] = useInView({ triggerOnce: true, threshold: 0.2 });
  return (
    <section className="section" id="coverage" ref={ref}>
      <p className="section-label">Coverage tiers</p>
      <h2 className="section-heading">One week. Three tiers. Cancel anytime.</h2>
      <div className="tiers-grid">
        {tiers.map((t, i) => (
          <motion.div className={`tier-card${t.highlighted ? ' highlighted' : ''}`} key={t.name} initial={{ opacity: 0, scale: 0.95 }} animate={inView ? { opacity: 1, scale: 1 } : {}} transition={{ duration: 0.6, delay: i * 0.15, ease: [0.22, 1, 0.36, 1] }} whileHover={{ scale: 1.015, boxShadow: '0 0 0 1px #2563eb22, 0 20px 60px rgba(0,0,0,0.4)' }}>
            {t.highlighted && <span className="tier-badge">Most chosen</span>}
            <p className="tier-name">{t.name}</p>
            <p className="tier-price">{t.price}</p>
            <p className="tier-details">{t.daily} · {t.maxDays}</p>
            <motion.button className="btn-secondary" style={{ marginTop: 8, width: '100%' }} whileHover={{ borderColor: '#2563eb', color: '#fff' }} whileTap={{ scale: 0.97 }} onClick={() => navigate('/onboarding', { state: { tier: t.name } })}>
              Choose {t.name}
            </motion.button>
          </motion.div>
        ))}
      </div>
      <p className="tier-note">Premium recalculated every Sunday by ZAPE — our zone-adaptive pricing engine.</p>
    </section>
  );
}

function TriBrainSection() {
  const [ref, inView] = useInView({ triggerOnce: true, threshold: 0.2 });
  return (
    <section className="section" ref={ref}>
      <p className="section-label">TriBrain AI</p>
      <h2 className="section-heading">Three-tier AI decides every claim in under <span style={{ color: 'var(--orange)' }}>2 seconds</span>.</h2>
      <div className="tribrain-grid">
        {brains.map((b, i) => (
          <motion.div className="tribrain-card" key={b.tier} initial={{ opacity: 0, y: 30 }} animate={inView ? { opacity: 1, y: 0 } : {}} transition={{ duration: 0.6, delay: i * 0.2, ease: [0.22, 1, 0.36, 1] }} whileHover={{ scale: 1.015, borderColor: '#2563eb22', background: '#161616', boxShadow: '0 0 0 1px #2563eb22, 0 20px 60px rgba(0,0,0,0.4)' }}>
            <span className="tribrain-tier-label">{b.tier}</span>
            <p className="tribrain-title">{b.title}</p>
            <p className="tribrain-desc">{b.desc}</p>
            {i < brains.length - 1 && <span className="tribrain-arrow"><ChevronRight size={24} /></span>}
          </motion.div>
        ))}
      </div>
      <motion.p className="tribrain-note" initial={{ opacity: 0 }} animate={inView ? { opacity: 1 } : {}} transition={{ duration: 0.8, delay: 0.7 }}>
        Orchestrated by LangGraph. Every decision is logged and auditable.
      </motion.p>
    </section>
  );
}

function CtaStrip() {
  const navigate = useNavigate();
  const [ref, inView] = useInView({ triggerOnce: true, threshold: 0.3 });
  return (
    <motion.section className="cta-strip" ref={ref} initial={{ opacity: 0, y: 30 }} animate={inView ? { opacity: 1, y: 0 } : {}} transition={{ duration: 0.6 }}>
      <h2>Ready to protect your earnings?</h2>
      <p>Takes 2 minutes to set up. Cancel anytime.</p>
      <motion.button className="btn-primary" style={{ padding: '14px 32px', fontSize: 15 }} whileHover={{ scale: 1.04, boxShadow: '0 8px 30px rgba(37,99,235,0.35)' }} whileTap={{ scale: 0.97 }} onClick={() => navigate('/onboarding')}>
        Start for ₹35/week →
      </motion.button>
    </motion.section>
  );
}

function Footer() {
  return (
    <footer className="footer">
      <div className="footer-grid">
        <div>
          <p className="footer-brand">SaatDin</p>
          <p className="footer-tagline">ek hafte ki kamai, hamesha surakshit.</p>
        </div>
        <div className="footer-col">
          <p className="footer-col-title">Product</p>
          <a href="/dashboard">Dashboard</a>
          <a href="/claims">Claims</a>
          <a href="/profile">Profile</a>
        </div>
        <div className="footer-col">
          <p className="footer-col-title">Company</p>
          <p>Built for Guidewire</p>
          <p>DEVTrails 2026</p>
        </div>
        <div className="footer-col">
          <p className="footer-col-title">Team</p>
          <p>Kireeti</p>
          <p>Aravind</p>
          <p>Harsha</p>
          <p>Pranav</p>
          <p>Sahitya</p>
        </div>
      </div>
      <div className="footer-bottom">
        Coverage scope: income loss only. Does not cover health, accidents, or vehicle damage. Thresholds are prototype design decisions.
      </div>
    </footer>
  );
}

/* ===== MAIN LANDING PAGE ===== */
export default function Landing() {
  useLenis();
  return (
    <motion.div variants={container} initial="hidden" animate="show">
      <HeroSection />
      <hr className="section-divider" />
      <ProblemSection />
      <hr className="section-divider" />
      <HowItWorksSection />
      <hr className="section-divider" />
      <TriggersSection />
      <hr className="section-divider" />
      <CoverageSection />
      <hr className="section-divider" />
      <TriBrainSection />
      <hr className="section-divider" />
      <CtaStrip />
      <Footer />
    </motion.div>
  );
}
