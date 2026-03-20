import { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useNavigate, useLocation, Link } from 'react-router-dom';
import { Check } from 'lucide-react';
import Loader from '../components/Loader';

const container = {
  hidden: { opacity: 0 },
  show: { opacity: 1, transition: { staggerChildren: 0.08, delayChildren: 0.1 } },
};
const item = {
  hidden: { opacity: 0, y: 24 },
  show: { opacity: 1, y: 0, transition: { duration: 0.5, ease: [0.25, 0.1, 0.25, 1] } },
};

const tiers = [
  { name: 'Basic', price: '₹35–52/week', daily: '₹250/day', maxDays: '2 days max' },
  { name: 'Standard', price: '₹53–68/week', daily: '₹400/day', maxDays: '3 days max' },
  { name: 'Premium', price: '₹69–90/week', daily: '₹550/day', maxDays: '4 days max' },
];

const zones = ['Bellandur', 'HSR Layout', 'Whitefield', 'Marathahalli', 'Koramangala', 'Sarjapur Road'];
const platforms = ['Blinkit', 'Zepto', 'Swiggy Instamart'];

function StepIndicator({ current }) {
  return (
    <div className="step-indicator">
      {[1, 2, 3].map((s, i) => (
        <div key={s} style={{ display: 'flex', alignItems: 'center' }}>
          <motion.div
            className={`step-circle ${current > s ? 'completed' : current === s ? 'active' : ''}`}
            layout
          >
            {current > s ? <Check size={16} /> : s}
          </motion.div>
          {i < 2 && <div className={`step-line ${current > s ? 'filled' : ''}`} />}
        </div>
      ))}
    </div>
  );
}

export default function Onboarding() {
  const navigate = useNavigate();
  const location = useLocation();
  const preselectedTier = location.state?.tier || 'Standard';

  const [step, setStep] = useState(1);
  const [phone, setPhone] = useState('');
  const [otpMode, setOtpMode] = useState(false);
  const [otp, setOtp] = useState(['', '', '', '']);
  const [countdown, setCountdown] = useState(30);
  const [platform, setPlatform] = useState('');
  const [zone, setZone] = useState('');
  const [selectedTier, setSelectedTier] = useState(preselectedTier);
  const [upi, setUpi] = useState('');
  const [agreed, setAgreed] = useState(false);
  const [loading, setLoading] = useState(false);
  const otpRefs = [useRef(), useRef(), useRef(), useRef()];

  useEffect(() => {
    if (!otpMode || countdown <= 0) return;
    const t = setTimeout(() => setCountdown(countdown - 1), 1000);
    return () => clearTimeout(t);
  }, [otpMode, countdown]);

  const handleOtpChange = (index, val) => {
    if (val.length > 1) return;
    const newOtp = [...otp];
    newOtp[index] = val;
    setOtp(newOtp);
    if (val && index < 3) otpRefs[index + 1].current?.focus();
  };

  const handleOtpKeyDown = (index, e) => {
    if (e.key === 'Backspace' && !otp[index] && index > 0) {
      otpRefs[index - 1].current?.focus();
    }
  };

  const sendOtp = () => {
    setOtpMode(true);
    setCountdown(30);
    setTimeout(() => otpRefs[0].current?.focus(), 100);
  };

  const verifyOtp = () => setStep(2);

  const goStep3 = () => {
    if (platform && zone) setStep(3);
  };

  const activate = () => {
    setLoading(true);
    setTimeout(() => navigate('/dashboard', { state: { newUser: true } }), 1500);
  };

  return (
    <motion.div className="onboarding-page" variants={container} initial="hidden" animate="show">
      <motion.div className="onboarding-container" variants={item}>
        <div className="onboarding-header">
          <Link to="/" className="nav-brand" style={{ fontSize: 18 }}>
            SaatDin<span className="nav-dot" />
          </Link>
          <Link to="/" style={{ fontSize: 13, color: 'var(--muted)' }}>← Back to home</Link>
        </div>

        <StepIndicator current={step} />

        <AnimatePresence mode="wait">
          {/* STEP 1 */}
          {step === 1 && (
            <motion.div key="step1" initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -20 }} transition={{ duration: 0.3 }}>
              <h2 style={{ fontFamily: 'var(--font-display)', fontSize: 24, fontWeight: 800, color: 'var(--white)', marginBottom: 8 }}>Verify your number</h2>
              <p style={{ color: 'var(--muted)', fontSize: 14, marginBottom: 32 }}>We'll send you a one-time code.</p>

              {!otpMode ? (
                <>
                  <div className="form-group">
                    <label className="form-label">Mobile Number</label>
                    <div style={{ display: 'flex', gap: 8 }}>
                      <div style={{ background: 'var(--bg2)', border: '1px solid var(--border)', borderRadius: 10, padding: '12px 14px', fontSize: 14, color: 'var(--muted)' }}>+91</div>
                      <input className="form-input" type="tel" maxLength={10} placeholder="98765 43210" value={phone} onChange={(e) => setPhone(e.target.value.replace(/\D/g, ''))} />
                    </div>
                  </div>
                  <motion.button className="btn-primary" style={{ width: '100%' }} whileHover={{ scale: 1.04, boxShadow: '0 8px 30px rgba(37,99,235,0.35)' }} whileTap={{ scale: 0.97 }} onClick={sendOtp} disabled={phone.length < 10}>
                    Send OTP →
                  </motion.button>
                </>
              ) : (
                <>
                  <p style={{ fontSize: 13, color: 'var(--muted)', marginBottom: 20, textAlign: 'center' }}>Enter the code sent to +91 {phone}</p>
                  <div className="otp-inputs">
                    {otp.map((digit, i) => (
                      <input key={i} ref={otpRefs[i]} className="otp-input" type="text" inputMode="numeric" maxLength={1} value={digit} onChange={(e) => handleOtpChange(i, e.target.value)} onKeyDown={(e) => handleOtpKeyDown(i, e)} />
                    ))}
                  </div>
                  <p style={{ textAlign: 'center', fontSize: 12, color: 'var(--muted)', marginBottom: 20 }}>
                    {countdown > 0 ? `Resend in ${countdown}s` : <button style={{ color: 'var(--blue)', background: 'none', border: 'none', cursor: 'pointer', fontSize: 12 }} onClick={sendOtp}>Resend OTP</button>}
                  </p>
                  <motion.button className="btn-primary" style={{ width: '100%' }} whileHover={{ scale: 1.04, boxShadow: '0 8px 30px rgba(37,99,235,0.35)' }} whileTap={{ scale: 0.97 }} onClick={verifyOtp} disabled={otp.join('').length < 4}>
                    Verify & Continue →
                  </motion.button>
                </>
              )}
            </motion.div>
          )}

          {/* STEP 2 */}
          {step === 2 && (
            <motion.div key="step2" initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -20 }} transition={{ duration: 0.3 }}>
              <h2 style={{ fontFamily: 'var(--font-display)', fontSize: 24, fontWeight: 800, color: 'var(--white)', marginBottom: 8 }}>Your delivery details</h2>
              <p style={{ color: 'var(--muted)', fontSize: 14, marginBottom: 32 }}>Tell us where and how you ride.</p>

              <div className="form-group">
                <label className="form-label">Delivery Platform</label>
                <select className="form-select" value={platform} onChange={(e) => setPlatform(e.target.value)}>
                  <option value="">Select platform</option>
                  {platforms.map((p) => <option key={p} value={p}>{p}</option>)}
                </select>
              </div>

              <div className="form-group">
                <label className="form-label">Your Zone</label>
                <select className="form-select" value={zone} onChange={(e) => setZone(e.target.value)}>
                  <option value="">Select zone</option>
                  {zones.map((z) => <option key={z} value={z}>{z}</option>)}
                </select>
              </div>

              <AnimatePresence>
                {platform && zone && (
                  <motion.div className="premium-preview" initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }} transition={{ duration: 0.4 }}>
                    <p style={{ fontSize: 12, color: 'var(--muted)' }}>Your estimated weekly premium</p>
                    <p className="amount">₹68</p>
                    <p className="breakdown">Base ₹45 × Zone 1.4 × Platform 1.1 × Loyalty 0.95</p>
                    <p style={{ fontSize: 11, color: 'var(--muted2)', marginTop: 8 }}>Recalculated every Sunday by ZAPE</p>
                  </motion.div>
                )}
              </AnimatePresence>

              <motion.button className="btn-primary" style={{ width: '100%' }} whileHover={{ scale: 1.04, boxShadow: '0 8px 30px rgba(37,99,235,0.35)' }} whileTap={{ scale: 0.97 }} onClick={goStep3} disabled={!platform || !zone}>
                Continue →
              </motion.button>
            </motion.div>
          )}

          {/* STEP 3 */}
          {step === 3 && (
            <motion.div key="step3" initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -20 }} transition={{ duration: 0.3 }}>
              <h2 style={{ fontFamily: 'var(--font-display)', fontSize: 24, fontWeight: 800, color: 'var(--white)', marginBottom: 8 }}>Choose your coverage</h2>
              <p style={{ color: 'var(--muted)', fontSize: 14, marginBottom: 32 }}>Pick a plan that works for you.</p>

              <div style={{ display: 'flex', flexDirection: 'column', gap: 12, marginBottom: 24 }}>
                {tiers.map((t, i) => (
                  <motion.div key={t.name} className={`tier-card tier-selectable${selectedTier === t.name ? ' selected' : ''}`} style={{ padding: '20px 24px' }} onClick={() => setSelectedTier(t.name)} whileHover={{ scale: 1.015 }} whileTap={{ scale: 0.99 }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                      <div>
                        <p style={{ fontSize: 16, fontWeight: 700 }}>{t.name}</p>
                        <p style={{ fontSize: 13, color: 'var(--muted)' }}>{t.daily} · {t.maxDays}</p>
                      </div>
                      <p style={{ color: 'var(--orange)', fontWeight: 700, fontSize: 15 }}>{t.price}</p>
                    </div>
                  </motion.div>
                ))}
              </div>

              <div className="form-group">
                <label className="form-label">UPI ID</label>
                <input className="form-input" type="text" placeholder="yourname@upi" value={upi} onChange={(e) => setUpi(e.target.value)} />
              </div>

              <div className="checkbox-row" onClick={() => setAgreed(!agreed)}>
                <div className={`custom-checkbox${agreed ? ' checked' : ''}`}>
                  {agreed && <Check size={12} color="#fff" />}
                </div>
                <span className="checkbox-label">I agree to weekly auto-debit every Monday</span>
              </div>

              <motion.button className="btn-primary" style={{ width: '100%', display: 'flex', justifyContent: 'center', gap: 8 }} whileHover={{ scale: 1.04, boxShadow: '0 8px 30px rgba(37,99,235,0.35)' }} whileTap={{ scale: 0.97 }} onClick={activate} disabled={!upi || !agreed || loading}>
                {loading ? <Loader /> : 'Activate Coverage →'}
              </motion.button>
            </motion.div>
          )}
        </AnimatePresence>
      </motion.div>
    </motion.div>
  );
}
