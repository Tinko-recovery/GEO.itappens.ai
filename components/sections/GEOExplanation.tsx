'use client';

import { motion } from 'framer-motion';
import { ShieldCheck, Share2, Layers, Cpu } from 'lucide-react';

const pillars = [
  {
    title: "Technical Signals",
    description: "Building the machine-readable foundation through llms.txt, enhanced schema, and semantic routing.",
    icon: <Cpu className="w-6 h-6" />,
    color: "var(--brand-blue)"
  },
  {
    title: "Content Clusters",
    description: "Structuring high-intent answers into dense clusters that AI engines prioritize for retrieval.",
    icon: <Layers className="w-6 h-6" />,
    color: "var(--brand-green)"
  },
  {
    title: "Entity Corroboration",
    description: "Connecting your brand to trusted external nodes to verify authority and build cross-engine trust.",
    icon: <Share2 className="w-6 h-6" />,
    color: "var(--brand-yellow)"
  },
  {
    title: "Citation Tracking",
    description: "Closing the loop with weekly engine-by-engine tracking to monitor and defend your AI visibility.",
    icon: <ShieldCheck className="w-6 h-6" />,
    color: "var(--brand-red)"
  }
];

export default function GEOExplanation() {
  return (
    <section id="how-it-works" style={{ padding: '140px 0', backgroundColor: 'var(--bg)', position: 'relative' }}>
      <div className="container">
        <div style={{ textAlign: 'center', marginBottom: '80px' }}>
          <motion.div
             initial={{ opacity: 0, y: 10 }}
             whileInView={{ opacity: 1, y: 0 }}
             viewport={{ once: true }}
          >
            <span className="overline" style={{ color: 'var(--brand-blue)', backgroundColor: 'rgba(58, 190, 249, 0.08)', padding: '4px 10px', borderRadius: '6px', display: 'inline-block' }}>
              The Methodology
            </span>
          </motion.div>
          <motion.h2 
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.1, duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
            className="headline-lg" 
            style={{ margin: '24px 0', lineHeight: 1.1 }}
          >
            How we solve for <span style={{ color: 'var(--brand-blue)' }}>AI Visibility.</span>
          </motion.h2>
          <motion.p 
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.2, duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
            className="text-sub" 
            style={{ margin: '0 auto', fontSize: '17px', maxWidth: '680px', opacity: 0.8 }}
          >
            itappens.ai uses a four-pillar engineering framework designed to move your brand from "unknown" to "default answer" across major AI platforms.
          </motion.p>
        </div>

        <div style={{ 
          display: 'grid', 
          gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', 
          gap: '24px',
        }}>
          {pillars.map((pillar, index) => (
            <motion.div
              key={pillar.title}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: index * 0.1, duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
              className="card-bento"
              style={{
                display: 'flex',
                flexDirection: 'column',
                gap: '24px',
                padding: '48px',
                border: '1px solid var(--border)',
                backgroundColor: 'var(--surface)',
                cursor: 'default'
              }}
              whileHover={{ 
                y: -12, 
                borderColor: pillar.color,
                boxShadow: `0 32px 64px -16px ${pillar.color}20`
              }}
            >
              <div style={{ 
                width: '64px', 
                height: '64px', 
                borderRadius: '16px', 
                backgroundColor: `${pillar.color}15`, 
                display: 'flex', 
                alignItems: 'center', 
                justifyContent: 'center',
                color: pillar.color,
                border: `1px solid ${pillar.color}20`
              }}>
                {pillar.icon}
              </div>
              <div>
                <h3 style={{ fontSize: '22px', fontWeight: 700, marginBottom: '16px', color: 'var(--text)', letterSpacing: '-0.02em' }}>
                  {pillar.title}
                </h3>
                <p style={{ fontSize: '15px', lineHeight: 1.6, color: 'var(--text-dim)', opacity: 0.8 }}>
                  {pillar.description}
                </p>
              </div>
            </motion.div>
          ))}
        </div>

        {/* Animated Agentic Status Monitor */}
        <motion.div 
           initial={{ opacity: 0 }}
           whileInView={{ opacity: 1 }}
           viewport={{ once: true }}
           transition={{ delay: 0.6 }}
           style={{ 
            marginTop: '80px', 
            padding: '24px 32px', 
            borderRadius: '16px', 
            backgroundColor: 'rgba(255, 255, 255, 0.02)', 
            border: '1px solid var(--border)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            gap: '12px'
          }}
        >
          <motion.div 
            animate={{ 
              scale: [1, 1.2, 1],
              opacity: [0.6, 1, 0.6]
            }}
            transition={{ repeat: Infinity, duration: 2 }}
            style={{ width: '8px', height: '8px', borderRadius: '50%', backgroundColor: 'var(--brand-green)' }}
          />
          <p style={{ fontFamily: 'var(--font-mono)', fontSize: '12px', color: 'var(--text-dim)', letterSpacing: '0.1em' }}>
            SYSTEM STATUS: <span style={{ color: 'var(--text)', fontWeight: 600 }}>AGENTIC_CRAWL_READY</span> [NODE_SECURE]
          </p>
        </motion.div>
      </div>
    </section>
  );
}
