import StatusBadge from '../components/StatusBadge';

function Home({ worker, weather, payouts }) {
  return (
    <main className="page page-stack">
      <section>
        <p className="eyebrow">Dashboard</p>
        <h2 className="page-title">Hello, {worker.name}</h2>
        <p className="page-copy">Your SaatDin cover for {worker.zone}, Bangalore.</p>
      </section>

      <section className="card">
        <h3 className="card-title">Coverage summary</h3>
        <div className="info-row"><span className="muted">Zone</span><strong>{worker.zone}</strong></div>
        <div className="info-row"><span className="muted">Coverage status</span><StatusBadge value={worker.coverageStatus} /></div>
        <div className="info-row"><span className="muted">This week&apos;s premium</span><strong>Rs {worker.weeklyPremium}</strong></div>
      </section>

      <section className="card">
        <div className="section-head">
          <div>
            <h3 className="card-title">Weather and risk alert</h3>
            <p className="page-copy">Pincode {weather.pincode}</p>
          </div>
          <StatusBadge value={weather.risk} />
        </div>
        <p>{weather.summary}</p>
      </section>

      <section className="card">
        <div className="section-head">
          <h3 className="card-title">Recent payouts</h3>
          <span className="muted">Last 3 events</span>
        </div>
        <ul className="list">
          {payouts.map((payout) => (
            <li key={payout.id} className="list-item">
              <div>
                <strong>{payout.trigger}</strong>
                <p className="muted">{payout.date}</p>
              </div>
              <strong>Rs {payout.amount}</strong>
            </li>
          ))}
        </ul>
      </section>
    </main>
  );
}

export default Home;
