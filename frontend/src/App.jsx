import Navbar from './components/landing/Navbar';
import Hero from './components/landing/Hero';
import Problem from './components/landing/Problem';
import HowItWorks from './components/landing/HowItWorks';
import Triggers from './components/landing/Triggers';
import CoverageTiers from './components/landing/CoverageTiers';
import TriBrain from './components/landing/TriBrain';
import Footer from './components/landing/Footer';

export default function App() {
  return (
    <>
      <div className="grain-overlay" />
      <Navbar />
      <Hero />
      <hr className="section-divider" />
      <Problem />
      <hr className="section-divider" />
      <HowItWorks />
      <hr className="section-divider" />
      <Triggers />
      <hr className="section-divider" />
      <CoverageTiers />
      <hr className="section-divider" />
      <TriBrain />
      <Footer />
    </>
  );
}
