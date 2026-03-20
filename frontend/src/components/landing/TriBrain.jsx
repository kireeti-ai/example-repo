import { motion } from 'framer-motion';
import { useInView } from 'react-intersection-observer';
import { ChevronRight } from 'lucide-react';

const brains = [
  {
    tier: 'Tier 1',
    title: 'Rule Engine',
    desc: 'Confidence ≥ 0.90 — fires instantly. No model call. No latency. Most claims end here.',
  },
  {
    tier: 'Tier 2',
    title: 'ML Engine',
    desc: 'Confidence 0.60–0.89 — Random Forest + Isolation Forest evaluate the edge case.',
  },
  {
    tier: 'Tier 3',
    title: 'LLM Brain (Groq)',
    desc: 'Confidence < 0.60 — Llama 3.3 70B reasons over full claim context. Human reviewable.',
  },
];

export default function TriBrain() {
  const [ref, inView] = useInView({ triggerOnce: true, threshold: 0.2 });

  return (
    <section className="section" ref={ref}>
      <h2 className="section-heading">
        Three-tier AI decides every claim in under{' '}
        <span style={{ color: '#f97316' }}>2 seconds</span>.
      </h2>

      <div className="tribrain-grid">
        {brains.map((b, i) => (
          <motion.div
            className="tribrain-card"
            key={b.tier}
            initial={{ opacity: 0, y: 30 }}
            animate={inView ? { opacity: 1, y: 0 } : {}}
            transition={{
              duration: 0.6,
              delay: i * 0.2,
              ease: [0.22, 1, 0.36, 1],
            }}
            whileHover={{ scale: 1.02, boxShadow: '0 12px 40px rgba(0,0,0,0.5)' }}
          >
            <span className="tribrain-tier-label">{b.tier}</span>
            <p className="tribrain-title">{b.title}</p>
            <p className="tribrain-desc">{b.desc}</p>

            {i < brains.length - 1 && (
              <span className="tribrain-arrow">
                <ChevronRight size={28} />
              </span>
            )}
          </motion.div>
        ))}
      </div>

      <motion.p
        className="tribrain-note"
        initial={{ opacity: 0 }}
        animate={inView ? { opacity: 1 } : {}}
        transition={{ duration: 0.8, delay: 0.7 }}
      >
        Orchestrated by LangGraph.
        Every decision is logged and auditable.
      </motion.p>
    </section>
  );
}
