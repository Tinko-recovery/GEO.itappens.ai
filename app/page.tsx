import NavBar from '@/components/NavBar';
import HeroSection from '@/components/sections/HeroSection';
import ProblemSection from '@/components/sections/ProblemSection';
import FounderManualSection from '@/components/sections/FounderManualSection';
import FAQSection from '@/components/sections/FAQSection';
import CTASection from '@/components/sections/CTASection';

export default function Home() {
  return (
    <main className="layer-top">
      <NavBar />
      {/* Section 1 — The Disruption */}
      <HeroSection />
      {/* Section 2 — The Void (Death of the Link) */}
      <ProblemSection />
      {/* Section 3 — The Roadmap (₹0 → ₹1Cr) */}
      <FounderManualSection />
      {/* Section 4 — Semantic FAQ */}
      <FAQSection />
      {/* CTA + Footer */}
      <CTASection />
    </main>
  );
}
