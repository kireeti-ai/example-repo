import { motion } from 'framer-motion';
import { useInView } from 'react-intersection-observer';

const riders = [
  {
    emoji: '🌧️',
    name: 'Raju, 28',
    platform: 'Blinkit',
    area: 'Bellandur',
    scenario:
      "It's Tuesday evening. The monsoon hit at 6pm. Roads are flooded. He can't reach the dark store.",
    earned: '₹0',
  },
  {
    emoji: '😷',
    name: 'Babu, 24',
    platform: 'Zepto',
    area: 'HSR Layout',
    scenario:
      "Diwali week. AQI crosses 270. He's been riding since 9am. Another 4 hours outside isn't safe.",
    earned: '₹0',
  },
  {
    emoji: '🚗',
    name: 'Suresh, 32',
    platform: 'Swiggy Instamart',
    area: 'Whitefield',
    scenario:
      "Outer Ring Road. 3 hours of gridlock. He's expected to deliver in 10 minutes.",
    earned: '₹0',
  },
];

export default function Problem() {
  const [ref, inView] = useInView({ triggerOnce: true, threshold: 0.15 });

  return (
    <section className="section" id="for-riders" ref={ref}>
      <h2 className="section-heading">
        Every disruption is a pay cut they take alone.
      </h2>

      <div className="problem-cards">
        {riders.map((rider, i) => (
          <motion.div
            className="problem-card"
            key={rider.name}
            initial={{ opacity: 0, y: 30 }}
            animate={inView ? { opacity: 1, y: 0 } : {}}
            transition={{
              duration: 0.6,
              delay: i * 0.15,
              ease: [0.22, 1, 0.36, 1],
            }}
            whileHover={{ scale: 1.02, boxShadow: '0 12px 40px rgba(0,0,0,0.5)' }}
          >
            <div className="card-header">
              <span className="emoji">{rider.emoji}</span>
              <span className="name">{rider.name}</span>
              <span className="platform-badge">{rider.platform}</span>
              <span style={{ color: '#737373', fontSize: '0.8rem' }}>{rider.area}</span>
            </div>
            <p className="card-scenario">{rider.scenario}</p>
            <p className="card-earned">Earned that day: {rider.earned}</p>
          </motion.div>
        ))}
      </div>

      <motion.p
        className="problem-footer"
        initial={{ opacity: 0 }}
        animate={inView ? { opacity: 1 } : {}}
        transition={{ duration: 0.8, delay: 0.6 }}
      >
        No platform compensates them. No insurance product covers this.
        Bangalore had 36% excess rainfall in 2024.
        It is the 2nd most congested city in the world.
        This happens every week.
      </motion.p>
    </section>
  );
}
