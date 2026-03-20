import { motion } from 'framer-motion';
import CountUp from 'react-countup';
import { useInView } from 'react-intersection-observer';

export default function Hero() {
  const [ref, inView] = useInView({ triggerOnce: true, threshold: 0.3 });

  return (
    <section className="hero" ref={ref}>
      <div className="hero-grid" />

      <motion.p
        className="hero-label"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, delay: 0.2 }}
      >
        Built for Blinkit · Zepto · Swiggy Instamart
      </motion.p>

      <motion.h1
        initial={{ opacity: 0, y: 30, filter: 'blur(8px)' }}
        animate={{ opacity: 1, y: 0, filter: 'blur(0px)' }}
        transition={{ duration: 0.8, ease: [0.22, 1, 0.36, 1] }}
      >
        Your earnings stop.
        <br />
        Your payout shouldn't.
      </motion.h1>

      <motion.p
        className="hero-subtext"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.7, delay: 0.3 }}
      >
        SaatDin monitors floods, AQI, and gridlock
        in your delivery zone — every 15 minutes.
        When a disruption hits, you're paid automatically.
        No forms. No calls.
      </motion.p>

      <div className="hero-stats">
        <motion.div
          className="stat-pill"
          initial={{ scale: 0.8, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={{ duration: 0.5, delay: 0.6 }}
        >
          <span className="orange">
            ₹{inView ? <CountUp end={35} duration={1.5} /> : '0'}
          </span>
          &nbsp;/ week
        </motion.div>

        <motion.div
          className="stat-pill"
          initial={{ scale: 0.8, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={{ duration: 0.5, delay: 0.9 }}
        >
          {'< '}
          <span className="orange">
            {inView ? <CountUp end={10} duration={1.2} /> : '0'}
          </span>
          &nbsp;sec payout
        </motion.div>
      </div>

      <motion.p
        className="hero-hindi"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.8, delay: 1.2 }}
      >
        "ek hafte ki kamai, hamesha surakshit."
      </motion.p>
    </section>
  );
}
