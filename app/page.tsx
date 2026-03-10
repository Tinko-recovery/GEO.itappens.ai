'use client';
import NavBar from "@/components/NavBar";
import HeroSection from "@/components/sections/HeroSection";
import SolutionSection from "@/components/sections/SolutionSection";
import PackagesSection from "@/components/sections/PackagesSection";
import ProofSection from "@/components/sections/ProofSection";
import FAQSection from "@/components/sections/FAQSection";
import CTASection from "@/components/sections/CTASection";
import BlogTeaser from "@/components/sections/BlogTeaser";

export default function Home() {
  return (
    <main className="min-h-screen">
      <NavBar />

      <div className="layer-top">
        <HeroSection />
        <SolutionSection />
        <PackagesSection />
        <ProofSection />
        <BlogTeaser />
        <FAQSection />
        <CTASection />
      </div>

      <footer style={{ padding: '40px 48px', borderTop: '1px solid var(--border)', background: 'var(--bg)' }} className="site-footer">
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '16px' }}>
          <div style={{ fontSize: '10px', color: 'var(--muted)', letterSpacing: '1px' }}>
            © 2026 itappens.ai — Blocks and Loops Technologies Pvt Ltd. All rights reserved.
          </div>
          <div style={{ display: 'flex', gap: '24px', flexWrap: 'wrap' }}>
            <a href="/blog" style={{ fontSize: '10px', color: 'var(--muted)', textDecoration: 'none' }}>Blog</a>
            <a href="/pricing" style={{ fontSize: '10px', color: 'var(--muted)', textDecoration: 'none' }}>Pricing</a>
            <a href="/privacy" style={{ fontSize: '10px', color: 'var(--muted)', textDecoration: 'none' }}>Privacy Policy</a>
            <a href="mailto:founder@tinko.in" style={{ fontSize: '10px', color: 'var(--muted)', textDecoration: 'none' }}>founder@tinko.in</a>
          </div>
        </div>
      </footer>

    </main>
  );
}
