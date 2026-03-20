function TierCard({ tier, selected, onSelect }) {
  return (
    <button
      type="button"
      className={`tier-card${selected ? ' selected' : ''}`}
      onClick={() => onSelect(tier.id)}
    >
      <div className="tier-top">
        <div>
          <p className="tier-name">{tier.name}</p>
          <p className="tier-copy">{tier.description}</p>
        </div>
        <strong className="tier-price">Rs {tier.weeklyPremium}</strong>
      </div>
      <p className="tier-copy">{tier.payout}</p>
    </button>
  );
}

export default TierCard;
