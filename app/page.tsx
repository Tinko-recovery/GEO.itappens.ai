import NavBar from '@/components/NavBar';
import HeroSection from '@/components/sections/HeroSection';
import ProblemSection from '@/components/sections/ProblemSection';
import FounderManualSection from '@/components/sections/FounderManualSection';
import SolutionSection from '@/components/sections/SolutionSection';
import ProofSection from '@/components/sections/ProofSection';
import FAQSection from '@/components/sections/FAQSection';
import CTASection from '@/components/sections/CTASection';

export default function Home() {
  return (
    <main className="layer-top">
      <NavBar />
      {/* Section 1 — The Disruption */}
      <HeroSection />
      {/* Section 2 — The Solution */}
      <SolutionSection />
      {/* Section 3 — The Proof */}
      <ProofSection />
      {/* Section 4 — The Void (Death of the Link) */}
      <ProblemSection />
      {/* Section 5 — The Roadmap (₹0 → ₹1Cr) */}
      <FounderManualSection />
      {/* Section 6 — Semantic FAQ */}
      <FAQSection />
      {/* CTA + Footer */}
      <CTASection />
    </main>
  );
}
