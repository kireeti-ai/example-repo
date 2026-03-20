import { motion } from 'framer-motion';
import { useInView } from 'react-intersection-observer';

const tiers = [
  {
    name: 'Basic',
    price: '₹35–52/week',
    daily: '₹250/day',
    maxDays: '2 days max',
    highlighted: false,
  },
  {
    name: 'Standard',
    price: '₹53–68/week',
    daily: '₹400/day',
    maxDays: '3 days max',
    highlighted: true,
  },
  {
    name: 'Premium',
    price: '₹69–90/week',
    daily: '₹550/day',
    maxDays: '4 days max',
    highlighted: false,
  },
];

export default function CoverageTiers() {
  const [ref, inView] = useInView({ triggerOnce: true, threshold: 0.2 });

  return (
    <section className="section" id="coverage" ref={ref}>
      <h2 className="section-heading">
        One week. Three tiers. Cancel anytime.
      </h2>

      <div className="tiers-grid">
        {tiers.map((tier, i) => (
          <motion.div
            className={`tier-card${tier.highlighted ? ' highlighted' : ''}`}
            key={tier.name}
            initial={{ opacity: 0, scale: 0.95 }}
            animate={inView ? { opacity: 1, scale: 1 } : {}}
            transition={{
              duration: 0.6,
              delay: i * 0.15,
              ease: [0.22, 1, 0.36, 1],
            }}
            whileHover={{ scale: 1.02, boxShadow: '0 12px 40px rgba(0,0,0,0.5)' }}
          >
            {tier.highlighted && (
              <span className="tier-badge">Most chosen</span>
            )}
            <p className="tier-name">{tier.name}</p>
            <p className="tier-price">{tier.price}</p>
            <p className="tier-details">
              {tier.daily} · {tier.maxDays}
            </p>
          </motion.div>
        ))}
      </div>

      <p className="tier-note">
        Premium recalculated every Sunday by ZAPE —
        our zone-adaptive pricing engine.
      </p>
    </section>
  );
}
