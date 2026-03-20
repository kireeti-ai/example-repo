import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import TierCard from '../components/TierCard';

function StepOne({ form, setForm }) {
  return (
    <div className="form-grid">
      <label className="field"><span>Phone number</span><input className="input" value={form.phone} onChange={(e) => setForm({ ...form, phone: e.target.value })} placeholder="10-digit mobile number" /></label>
      <label className="field"><span>OTP</span><input className="input" value={form.otp} onChange={(e) => setForm({ ...form, otp: e.target.value })} placeholder="Enter OTP" /></label>
      <p className="helper-text">Demo mode: any 4-digit OTP continues to the next step.</p>
    </div>
  );
}

function StepTwo({ form, setForm, platforms, zones }) {
  return (
    <div className="form-grid">
      <div className="field"><span>Platform</span><div className="choice-grid">{platforms.map((platform) => <button key={platform} type="button" className={`choice-chip${form.platform === platform ? ' selected' : ''}`} onClick={() => setForm({ ...form, platform })}>{platform}</button>)}</div></div>
      <label className="field"><span>Zone</span><select className="input" value={form.zoneId} onChange={(e) => setForm({ ...form, zoneId: e.target.value })}>{zones.map((zone) => <option key={zone.id} value={zone.id}>{zone.name} ({zone.pincode})</option>)}</select></label>
    </div>
  );
}

function StepThree({ form, setForm, tiers }) {
  return (
    <div className="form-grid">
      <div className="tier-grid">{tiers.map((tier) => <TierCard key={tier.id} tier={tier} selected={form.tierId === tier.id} onSelect={(tierId) => setForm({ ...form, tierId })} />)}</div>
      <label className="field"><span>UPI ID</span><input className="input" value={form.upiId} onChange={(e) => setForm({ ...form, upiId: e.target.value })} placeholder="name@bank" /></label>
      <p className="helper-text">Confirm to activate cover and save your payout destination.</p>
    </div>
  );
}

function Onboarding({ worker, zones, tiers, platforms, onComplete }) {
  const navigate = useNavigate();
  const [step, setStep] = useState(1);
  const [form, setForm] = useState({ phone: worker.phone, otp: '2741', platform: worker.platform, zoneId: worker.pincode, tierId: worker.tier.toLowerCase(), upiId: worker.upiId });
  const activeTier = tiers.find((tier) => tier.id === form.tierId) || tiers[0];
  const finish = () => {
    const zone = zones.find((item) => item.id === form.zoneId) || zones[0];
    onComplete({ ...worker, phone: form.phone, platform: form.platform, zone: zone.name, pincode: zone.pincode, tier: activeTier.name, weeklyPremium: activeTier.weeklyPremium, upiId: form.upiId, coverageStatus: 'Active' });
    navigate('/');
  };

  return (
    <main className="page page-stack">
      <section className="card">
        <p className="eyebrow">Onboarding</p>
        <h2 className="page-title">Get covered in 3 steps</h2>
        <div className="step-bar">{['Phone', 'Work', 'Tier'].map((label, index) => <div key={label} className={`step-pill${step === index + 1 ? ' current' : ''}`}>{index + 1}. {label}</div>)}</div>
        {step === 1 ? <StepOne form={form} setForm={setForm} /> : null}
        {step === 2 ? <StepTwo form={form} setForm={setForm} platforms={platforms} zones={zones} /> : null}
        {step === 3 ? <StepThree form={form} setForm={setForm} tiers={tiers} /> : null}
        <div className="button-row">
          <button type="button" className="button button-secondary" onClick={() => setStep(Math.max(1, step - 1))} disabled={step === 1}>Back</button>
          <button type="button" className="button" onClick={() => (step === 3 ? finish() : setStep(step + 1))}>{step === 3 ? 'Confirm' : 'Continue'}</button>
        </div>
      </section>
    </main>
  );
}

export default Onboarding;
