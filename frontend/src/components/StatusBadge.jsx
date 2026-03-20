const tones = {
  active: 'success',
  paid: 'success',
  low: 'success',
  moderate: 'warning',
  'under review': 'warning',
  inactive: 'danger',
  rejected: 'danger',
  high: 'danger',
};

function StatusBadge({ value, tone }) {
  const key = String(value).toLowerCase();
  const variant = tone || tones[key] || 'neutral';
  return <span className={`badge badge-${variant}`}>{value}</span>;
}

export default StatusBadge;
