import { motion } from 'framer-motion';
import { useInView } from 'react-intersection-observer';

export default function ProgressBar({ value, max = 100, color = 'var(--blue)', delay = 0 }) {
  const [ref, inView] = useInView({ triggerOnce: true, threshold: 0.3 });
  const pct = Math.min((value / max) * 100, 100);

  return (
    <div className="risk-bar-track" ref={ref}>
      <motion.div
        className="risk-bar-fill"
        style={{ background: color }}
        initial={{ width: 0 }}
        animate={inView ? { width: `${pct}%` } : { width: 0 }}
        transition={{ duration: 0.8, delay, ease: [0.25, 0.1, 0.25, 1] }}
      />
    </div>
  );
}
