'use client';
import NavBar from "@/components/NavBar";
import HeroSection from "@/components/sections/HeroSection";
import SolutionSection from "@/components/sections/SolutionSection";
import PackagesSection from "@/components/sections/PackagesSection";
import ProofSection from "@/components/sections/ProofSection";
import RoadmapSection from "@/components/sections/RoadmapSection";
import FounderSection from "@/components/sections/FounderSection";
import FAQSection from "@/components/sections/FAQSection";
import CTASection from "@/components/sections/CTASection";

export default function Home() {
  return (
    <main className="min-h-screen">
      <NavBar />

      <div className="layer-top">
        <HeroSection />
        <SolutionSection />
        <PackagesSection />
        <ProofSection />
        <RoadmapSection />
        <FounderSection />
        <FAQSection />
        <CTASection />
      </div>

      <footer style={{ padding: '40px 48px', borderTop: '1px solid var(--border)', background: 'var(--bg)' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <div style={{ fontSize: '10px', color: 'var(--muted)', letterSpacing: '1px' }}>
            © 2026 itappens.ai — Blocks and Loops Technologies Pvt Ltd. All rights reserved.
          </div>
          <div style={{ display: 'flex', gap: '24px' }}>
            <a href="/privacy" style={{ fontSize: '10px', color: 'var(--muted)', textDecoration: 'none' }}>Privacy Policy</a>
            <a href="mailto:hello@itappens.ai" style={{ fontSize: '10px', color: 'var(--muted)', textDecoration: 'none' }}>hello@itappens.ai</a>
          </div>
        </div>
      </footer>
    </main>
  );
}
