import { ArrowRight, BarChart3, Globe, Zap } from "lucide-react";

export default function AuditForm() {
  return (
    <div 
      className="card-bento" 
      style={{ 
        padding: '48px', 
        backgroundColor: 'var(--surface)', 
        border: '1px solid var(--border)',
        position: 'relative',
        overflow: 'hidden'
      }}
    >
      <div style={{ position: 'absolute', top: 0, right: 0, width: '150px', height: '150px', background: 'radial-gradient(circle, var(--accent-light) 0%, transparent 70%)', opacity: 0.1, zIndex: 0 }} />
      
      <div style={{ position: 'relative', zIndex: 1 }}>
        <span className="overline" style={{ color: 'var(--accent)', marginBottom: '16px', display: 'block' }}>REVENUE-FIRST DIAGNOSTICS</span>
        <h3 className="headline-sm" style={{ marginBottom: '24px', maxWidth: '400px' }}>
          Stop guessing. <br />
          <span style={{ color: 'var(--accent)' }}>Benchmark your footprint.</span>
        </h3>
        
        <p style={{ color: "var(--text-dim)", marginBottom: '32px', fontSize: '15px', lineHeight: 1.6, maxWidth: '440px' }}>
          Our audit engine simulates how ChatGPT, Perplexity, and SearchGPT perceive your brand. 
          Identify technical drift and citation gaps in minutes.
        </p>

        <div style={{ display: 'grid', gridTemplateColumns: '1fr', gap: '20px', marginBottom: '40px' }}>
          {[
            { icon: <Zap className="h-4 w-4" />, text: "Free on-page + technical scoreboard" },
            { icon: <BarChart3 className="h-4 w-4" />, text: "Paid deep crawl with competitor SERP data" },
            { icon: <Globe className="h-4 w-4" />, text: "Premium HTML report with PDF export" }
          ].map((item, i) => (
            <div key={i} style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
              <div style={{ color: 'var(--accent)' }}>{item.icon}</div>
              <span style={{ fontSize: '14px', fontWeight: 500, color: 'var(--text)' }}>{item.text}</span>
            </div>
          ))}
        </div>

        <a 
          href="/audit" 
          className="btn-primary" 
          style={{ 
            display: 'inline-flex', 
            alignItems: 'center', 
            gap: '12px',
            padding: '16px 32px',
            textDecoration: 'none'
          }}
        >
          Launch Audit Engine
          <ArrowRight className="h-4 w-4" />
        </a>
        
        <p style={{ fontSize: '11px', color: 'var(--text-muted)', marginTop: '20px', fontFamily: 'var(--font-mono)' }}>
          Powered by Firecrawl & DataForSEO
        </p>
      </div>
    </div>
  );
}
