import StatusBadge from './StatusBadge';

function ClaimCard({ claim }) {
  return (
    <article className="card claim-card">
      <div className="claim-top">
        <div className="claim-meta">
          <p className="claim-trigger">{claim.triggerType}</p>
          <p className="muted">{claim.date}</p>
        </div>
        <StatusBadge value={claim.status} />
      </div>
      <div className="info-row compact-row">
        <span className="muted">Claim amount</span>
        <strong>Rs {claim.amount}</strong>
      </div>
      <div className="info-row compact-row">
        <span className="muted">Trigger type</span>
        <span>{claim.triggerType}</span>
      </div>
    </article>
  );
}

export default ClaimCard;
