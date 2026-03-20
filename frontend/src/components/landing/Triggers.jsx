import { motion } from 'framer-motion';
import { useInView } from 'react-intersection-observer';

const triggers = [
  {
    name: 'RainLock',
    desc: 'Heavy rainfall',
    threshold: '> 35mm / 3hr',
    payout: '100%',
  },
  {
    name: 'AQI Guard',
    desc: 'Hazardous air quality',
    threshold: 'AQI > 250 / 4hr',
    payout: '80%',
  },
  {
    name: 'TrafficBlock',
    desc: 'Severe congestion',
    threshold: '< 5kmph / 2hr',
    payout: '70%',
  },
  {
    name: 'ZoneLock',
    desc: 'Curfew / bandh / strike',
    threshold: 'NLP confirmed',
    payout: '100%',
  },
  {
    name: 'HeatBlock',
    desc: 'Extreme heat + humidity',
    threshold: '39°C + 70% RH',
    payout: '60%',
  },
];

export default function Triggers() {
  const [ref, inView] = useInView({ triggerOnce: true, threshold: 0.15 });

  return (
    <section className="section" ref={ref}>
      <h2 className="section-heading">
        Five triggers. Pincode level. Automatic.
      </h2>

      <div className="triggers-table">
        {triggers.map((t, i) => (
          <motion.div
            className="trigger-row"
            key={t.name}
            initial={{ opacity: 0, x: -30 }}
            animate={inView ? { opacity: 1, x: 0 } : {}}
            transition={{
              duration: 0.5,
              delay: i * 0.1,
              ease: [0.22, 1, 0.36, 1],
            }}
            whileHover={{ scale: 1.02 }}
          >
            <span className="trigger-name">{t.name}</span>
            <span className="trigger-desc">{t.desc}</span>
            <span className="trigger-threshold">{t.threshold}</span>
            <span className="trigger-payout">{t.payout}</span>
          </motion.div>
        ))}
      </div>

      <p className="triggers-note">
        A flood in Bellandur does not affect
        a rider registered in Whitefield.
      </p>
    </section>
  );
}
