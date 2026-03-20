import { useState } from 'react';
import ClaimCard from '../components/ClaimCard';

function Claims({ claims }) {
  const [message, setMessage] = useState('');

  return (
    <main className="page page-stack">
      <section>
        <p className="eyebrow">Claims</p>
        <h2 className="page-title">Past claims</h2>
        <p className="page-copy">Track paid, pending, and rejected claims in one place.</p>
      </section>

      {claims.map((claim) => (
        <ClaimCard key={claim.id} claim={claim} />
      ))}

      <section className="card">
        <button
          type="button"
          className="button"
          onClick={() => setMessage('Dispute request drafted. A support callback is due within 24 hours.')}
        >
          Raise a dispute
        </button>
        {message ? <p className="helper-text">{message}</p> : null}
      </section>
    </main>
  );
}

export default Claims;
