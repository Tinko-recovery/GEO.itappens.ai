'use client';

import LenisProvider from '@/components/LenisProvider';
import NavBar from '@/components/NavBar';
import HeroSection from '@/components/sections/HeroSection';
import ProblemSection from '@/components/sections/ProblemSection';
import SolutionSection from '@/components/sections/SolutionSection';
import RoadmapSection from '@/components/sections/RoadmapSection';
import FounderSection from '@/components/sections/FounderSection';
import FAQSection from '@/components/sections/FAQSection';
import CTASection from '@/components/sections/CTASection';

export default function Page() {
  return (
    <LenisProvider>
      <div className="bg-slate-50 min-h-screen">
        <NavBar />
        
        <main>
          <HeroSection />
          
          <div style={{ background: 'var(--surface)', borderTop: '1px solid var(--border)', borderBottom: '1px solid var(--border)' }}>
            <ProblemSection />
          </div>

          <SolutionSection />
          
          <div style={{ background: 'var(--surface)', borderTop: '1px solid var(--border)', borderBottom: '1px solid var(--border)' }}>
            <RoadmapSection />
          </div>

          <FounderSection />
          
          <div style={{ borderTop: '1px solid var(--border)' }}>
            <FAQSection />
          </div>

          <CTASection />
        </main>

        <footer style={{
          padding: '80px 0',
          borderTop: '1px solid var(--border)',
          background: 'var(--surface)',
        }}>
          <div className="container">
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: '40px' }}>
              <div style={{ gridColumn: 'span 1' }}>
                <div style={{ fontFamily: 'var(--font-display)', fontWeight: 800, fontSize: '18px', marginBottom: '20px' }}>
                  it<span style={{ color: 'var(--accent)' }}>appens</span>.ai
                </div>
                <p style={{ fontSize: '13px', color: 'var(--text-dim)', lineHeight: 1.6 }}>
                  The Citation Layer for the AI Web. <br />
                  Specialized GEO for KIADB & B2B brands.
                </p>
              </div>

              <div>
                <h4 className="overline" style={{ fontSize: '10px', color: 'var(--text)' }}>Platform</h4>
                <ul style={{ listStyle: 'none', display: 'flex', flexDirection: 'column', gap: '12px', fontSize: '13px' }}>
                  <li><a href="#system" style={{ color: 'var(--text-dim)', textDecoration: 'none' }}>System</a></li>
                  <li><a href="#roadmap" style={{ color: 'var(--text-dim)', textDecoration: 'none' }}>Roadmap</a></li>
                  <li><a href="/itcontents" style={{ color: 'var(--text-dim)', textDecoration: 'none' }}>Insights</a></li>
                </ul>
              </div>

              <div>
                <h4 className="overline" style={{ fontSize: '10px', color: 'var(--text)' }}>Legal</h4>
                <ul style={{ listStyle: 'none', display: 'flex', flexDirection: 'column', gap: '12px', fontSize: '13px' }}>
                  <li><a href="#" style={{ color: 'var(--text-dim)', textDecoration: 'none' }}>Privacy Policy</a></li>
                  <li><a href="#" style={{ color: 'var(--text-dim)', textDecoration: 'none' }}>Terms of Service</a></li>
                </ul>
              </div>

              <div>
                <h4 className="overline" style={{ fontSize: '10px', color: 'var(--text)' }}>Contact</h4>
                <ul style={{ listStyle: 'none', display: 'flex', flexDirection: 'column', gap: '12px', fontSize: '13px' }}>
                  <li><a href="mailto:hello@itappens.ai" style={{ color: 'var(--text-dim)', textDecoration: 'none' }}>hello@itappens.ai</a></li>
                  <li><a href="https://wa.me/919353015844" style={{ color: 'var(--text-dim)', textDecoration: 'none' }}>+91 93530 15844</a></li>
                </ul>
              </div>
            </div>

            <div style={{ 
              marginTop: '60px', paddingTop: '32px', borderTop: '1px solid var(--border)',
              display: 'flex', justifyContent: 'space-between', alignItems: 'center',
              fontSize: '11px', color: 'var(--text-muted)'
            }}>
              <div>© 2026 itappens.ai · Bengaluru, India</div>
              <div style={{ display: 'flex', gap: '20px' }}>
                <a href="https://www.linkedin.com/company/itappens-ai/" style={{ color: 'inherit', textDecoration: 'none' }}>LinkedIn</a>
                <a href="#" style={{ color: 'inherit', textDecoration: 'none' }}>Twitter / X</a>
              </div>
            </div>
          </div>
        </footer>
      </div>

      {/* Minimalist WhatsApp Float (Outline Style) */}
      <a
        href="https://wa.me/919353015844?text=Hi%2C%20I%20want%20a%20free%20AI%20audit%20for%20my%20brand."
        target="_blank"
        rel="noopener noreferrer"
        style={{
          position: "fixed", bottom: 32, right: 32,
          width: 48, height: 48, borderRadius: "50%",
          display: "flex", alignItems: "center", justifyContent: "center",
          border: '1px solid var(--border)', background: 'var(--surface)',
          boxShadow: "0 4px 12px rgba(0,0,0,0.05)", zIndex: 1000,
          transition: 'all 0.2s ease'
        }}
        onMouseEnter={(e) => (e.currentTarget.style.borderColor = 'var(--accent)')}
        onMouseLeave={(e) => (e.currentTarget.style.borderColor = 'var(--border)')}
      >
        <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="var(--text-dim)" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
          <path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72 12.84 12.84 0 0 0 .7 2.81 2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45 12.84 12.84 0 0 0 2.81.7A2 2 0 0 1 22 16.92z"/>
        </svg>
      </a>
    </LenisProvider>
  );
}
