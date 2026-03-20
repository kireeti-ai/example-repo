import { motion } from 'framer-motion';
import { useInView } from 'react-intersection-observer';

const steps = [
  {
    num: '01',
    title: (
      <>
        Pay <span className="orange">₹35–90</span>/week
      </>
    ),
    desc: "Based on your zone's flood, AQI, and traffic risk score.",
  },
  {
    num: '02',
    title: 'We monitor your pincode',
    desc: 'Open-Meteo, WAQI, and TomTom polled every 15 minutes. Pincode level — not city level.',
  },
  {
    num: '03',
    title: 'Disruption crosses threshold',
    desc: 'RainLock. AQI Guard. TrafficBlock. ZoneLock. HeatBlock. Rules evaluated instantly.',
  },
  {
    num: '04',
    title: 'Money in your UPI',
    desc: "Razorpay dispatches the payout in under 10 seconds. You don't open the app. You don't file anything.",
  },
];

export default function HowItWorks() {
  const [ref, inView] = useInView({ triggerOnce: true, threshold: 0.2 });

  return (
    <section className="section" id="how-it-works" ref={ref}>
      <h2 className="section-heading">How it works</h2>

      <div className="timeline">
        {steps.map((step, i) => (
          <motion.div
            className="timeline-step"
            key={step.num}
            initial={{ opacity: 0, x: -30 }}
            animate={inView ? { opacity: 1, x: 0 } : {}}
            transition={{
              duration: 0.6,
              delay: i * 0.2,
              ease: [0.22, 1, 0.36, 1],
            }}
          >
            <div className="step-number">{step.num}</div>
            <p className="step-title">{step.title}</p>
            <p className="step-desc">{step.desc}</p>
          </motion.div>
        ))}
      </div>
    </section>
  );
}
