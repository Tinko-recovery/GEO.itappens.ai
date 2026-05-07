'use client';
import { motion } from 'framer-motion';

const pillars = [
  {
    number: '01',
    title: 'Technical Signals',
    description: 'llms.txt, structured schema, semantic HTML, canonical signals, and AI-readable metadata deployed in week one.',
    color: 'var(--brand-blue)',
  },
  {
    number: '02',
    title: 'Content Architecture',
    description: 'High-density answer clusters engineered for LLM retrieval — not keyword ranking. Built around the exact prompts your buyers use.',
    color: 'var(--brand-green)',
  },
  {
    number: '03',
    title: 'Entity Corroboration',
    description: 'Cross-platform entity signals that connect your brand to trusted external nodes so AI models can independently verify your authority.',
    color: 'var(--brand-orange)',
  },
  {
    number: '04',
    title: 'Citation Tracking',
    description: 'Weekly engine-by-engine citation monitoring across ChatGPT, Perplexity, Gemini, and Claude. Data drives every iteration.',
    color: 'var(--brand-pink)',
  },
];

export default function CompanyCredibilitySection() {
  return (
    <section style={{ padding: '140px 0', backgroundColor: 'var(--surface-alt)', borderTop: '1px solid var(--border)' }}>
      <div className="container">
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1.2fr', gap: '100px', alignItems: 'start' }}>
          {/* Left: Company Statement */}
          <div style={{ position: 'sticky', top: '120px' }}>
            <motion.div
              initial={{ opacity: 0, x: -30 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
            >
              <span className="overline" style={{ marginBottom: '24px' }}>The System</span>
              <h2 className="headline-lg" style={{ margin: '24px 0 40px', lineHeight: 1.1 }}>
                A four-pillar framework built for{' '}
                <span style={{ color: 'var(--brand-blue)' }}>machine retrieval.</span>
              </h2>
              <p style={{ fontSize: '18px', color: 'var(--text-dim)', lineHeight: 1.8, marginBottom: '48px' }}>
                itappens.ai runs a 90-day operating model that transforms how AI platforms perceive and cite your brand — from invisible to the default answer on target queries.
              </p>

              {/* Company Trust Signals */}
              <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
                {[
                  { label: 'Serving clients in', value: 'US · UK · Australia · India' },
                  { label: 'Platforms tracked', value: 'ChatGPT · Perplexity · Gemini · Claude' },
                  { label: 'Engagement model', value: '90-Day GEO System' },
                ].map((item, i) => (
                  <div key={i} style={{
                    display: 'flex',
                    justifyContent: 'space-between',
                    alignItems: 'center',
                    padding: '16px 24px',
                    background: 'rgba(255,255,255,0.02)',
                    border: '1px solid var(--border)',
                    borderRadius: '12px',
                  }}>
                    <span style={{ fontSize: '13px', color: 'var(--text-muted)', fontFamily: 'var(--font-mono)' }}>{item.label}</span>
                    <span style={{ fontSize: '14px', color: 'var(--text)', fontWeight: 600 }}>{item.value}</span>
                  </div>
                ))}
              </div>

              <div style={{ marginTop: '48px' }}>
                <a href="/about" className="btn-secondary" style={{ display: 'inline-flex', alignItems: 'center', gap: '8px' }}>
                  About the Company →
                </a>
              </div>
            </motion.div>
          </div>

          {/* Right: Pillars */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
            {pillars.map((pillar, i) => (
              <motion.div
                key={pillar.number}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.1, duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
                className="card-glass"
                style={{ padding: '40px 48px', display: 'flex', gap: '32px', alignItems: 'flex-start' }}
                whileHover={{ borderColor: pillar.color, boxShadow: `0 0 30px ${pillar.color}20` }}
              >
                <span style={{ fontSize: '13px', fontFamily: 'var(--font-mono)', color: pillar.color, fontWeight: 700, minWidth: '28px', paddingTop: '4px' }}>
                  {pillar.number}
                </span>
                <div>
                  <h3 style={{ fontSize: '20px', fontWeight: 700, color: 'var(--text)', marginBottom: '12px', letterSpacing: '-0.02em' }}>
                    {pillar.title}
                  </h3>
                  <p style={{ fontSize: '15px', color: 'var(--text-dim)', lineHeight: 1.7, margin: 0 }}>
                    {pillar.description}
                  </p>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
