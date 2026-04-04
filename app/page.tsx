'use client';

import BackgroundMesh from '@/components/BackgroundMesh';
import CursorSpotlight from '@/components/CursorSpotlight';
import LenisProvider from '@/components/LenisProvider';
import NavBar from '@/components/NavBar';
import HeroSection from '@/components/sections/HeroSection';
import ProblemSection from '@/components/sections/ProblemSection';
import SolutionSection from '@/components/sections/SolutionSection';
import ProofSection from '@/components/sections/ProofSection';
import RoadmapSection from '@/components/sections/RoadmapSection';
import FounderSection from '@/components/sections/FounderSection';
import FAQSection from '@/components/sections/FAQSection';
import CTASection from '@/components/sections/CTASection';

export default function Page() {
  return (
    <LenisProvider>
      <div className="layer-bg">
        <BackgroundMesh />
        <CursorSpotlight />
      </div>

      <div className="layer-top">
        <NavBar />
        
        <main>
          <HeroSection />
          <ProblemSection />
          <SolutionSection />
          <ProofSection />
          <RoadmapSection />
          <FounderSection />
          <FAQSection />
          <CTASection />
        </main>

        <footer style={{
          padding: '80px 48px',
          borderTop: '1px solid var(--border)',
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          background: 'var(--bg)',
          position: 'relative',
          zIndex: 10
        }}>
          <div style={{ fontFamily: 'var(--font-display)', fontWeight: 800, fontSize: '14px', color: 'var(--text)' }}>
            it<span style={{ color: 'var(--accent)' }}>appens</span>.ai
          </div>
          <div style={{ fontSize: '10px', color: 'var(--muted)', letterSpacing: '1px' }}>
            © 2026 Blocks & Loops Technologies Pvt Ltd · Bengaluru, India
          </div>
          <div style={{ display: 'flex', gap: '24px' }}>
            <a href="#" style={{ fontSize: '10px', color: 'var(--muted)', textDecoration: 'none' }}>Privacy</a>
            <a href="#" style={{ fontSize: '10px', color: 'var(--muted)', textDecoration: 'none' }}>Terms</a>
          </div>
        </footer>
      </div>

      {/* WhatsApp Float */}
      <a
        href="https://wa.me/919353015844?text=Hi%20Sadish%2C%20I%20want%20a%20free%20AI%20audit%20for%20my%20brand."
        target="_blank"
        rel="noopener noreferrer"
        style={{
          position: "fixed",
          bottom: 32,
          right: 32,
          width: 56,
          height: 56,
          background: "#25d366",
          borderRadius: "50%",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          boxShadow: "0 10px 30px rgba(37,211,102,0.3)",
          zIndex: 1000,
        }}
      >
        <svg width="28" height="28" viewBox="0 0 24 24" fill="#ffffff">
          <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z"/>
        </svg>
      </a>
    </LenisProvider>
  );
}
