function Profile({ worker }) {
  return (
    <main className="page page-stack">
      <section>
        <p className="eyebrow">Profile</p>
        <h2 className="page-title">Rider details</h2>
        <p className="page-copy">Review your identity, plan, and loyalty discount progress.</p>
      </section>

      <section className="card">
        <h3 className="card-title">Account</h3>
        <div className="info-row"><span className="muted">Name</span><strong>{worker.name}</strong></div>
        <div className="info-row"><span className="muted">Phone</span><span>{worker.phone}</span></div>
        <div className="info-row"><span className="muted">Platform</span><span>{worker.platform}</span></div>
        <div className="info-row"><span className="muted">Zone</span><span>{worker.zone}</span></div>
      </section>

      <section className="card">
        <h3 className="card-title">Plan details</h3>
        <div className="info-row"><span className="muted">Current tier</span><strong>{worker.tier}</strong></div>
        <div className="info-row"><span className="muted">Weekly premium</span><strong>Rs {worker.weeklyPremium}</strong></div>
        <div className="info-row"><span className="muted">UPI ID</span><span>{worker.upiId}</span></div>
        <div className="info-row"><span className="muted">Loyalty discount streak</span><strong>{worker.loyaltyStreak}</strong></div>
      </section>
    </main>
  );
}

export default Profile;
