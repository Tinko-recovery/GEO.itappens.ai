'use client';
import { motion } from 'framer-motion';

const plans = [
    {
        name: "Technical Sprint",
        price: "Fixed",
        description: "Foundational signal layer deployment.",
        features: [
            "llms.txt & entity schema",
            "Sitemap & robots optimization",
            "Semantic HTML audit",
            "Canonical normalization",
            "Week-one delivery"
        ],
        cta: "Get Sprint Details",
        popular: false
    },
    {
        name: "90-Day GEO System",
        price: "Custom",
        description: "Full-scale category domination.",
        features: [
            "Weekly answer clusters",
            "Entity citation support",
            "Weekly tracking reports",
            "Competitor gap analysis",
            "Dedicated analyst"
        ],
        cta: "Schedule Strategy Call",
        popular: true
    },
    {
        name: "Platform + Advisory",
        price: "Retainer",
        description: "Continuous AI visibility operations.",
        features: [
            "Continuous monitoring",
            "Schema operations",
            "Content automation guidance",
            "Quarterly roadmap review",
            "Executive reporting"
        ],
        cta: "Contact Sales",
        popular: false
    }
];

export default function PricingSection() {
    return (
        <section id="pricing" style={{ padding: '120px 0', backgroundColor: '#fff' }}>
            <div className="container">
                <div style={{ textAlign: 'center', marginBottom: '80px' }}>
                    <span className="badge-pill" style={{ marginBottom: '24px' }}>Investment</span>
                    <h2 className="headline-lg">Scalable Solutions for <br /> <span style={{ color: 'var(--blue)' }}>Every Stage of Growth.</span></h2>
                </div>

                <div className="bento-grid">
                    {plans.map((plan, i) => (
                        <motion.div
                            key={i}
                            initial={{ opacity: 0, y: 20 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            viewport={{ once: true }}
                            transition={{ duration: 0.5, delay: i * 0.1 }}
                            className="card-corporate"
                            style={{ 
                                display: 'flex', 
                                flexDirection: 'column', 
                                border: plan.popular ? '2px solid var(--blue)' : '1px solid var(--border)',
                                position: 'relative',
                                overflow: 'hidden'
                            }}
                        >
                            {plan.popular && (
                                <div style={{ 
                                    position: 'absolute', top: '12px', right: '-35px', 
                                    background: 'var(--blue)', color: 'white', 
                                    padding: '4px 40px', transform: 'rotate(45deg)', 
                                    fontSize: '11px', fontWeight: 700 
                                }}>
                                    MOST POPULAR
                                </div>
                            )}
                            <h3 style={{ fontSize: '24px', marginBottom: '8px' }}>{plan.name}</h3>
                            <div style={{ fontSize: '32px', fontWeight: 800, color: 'var(--slate-dark)', marginBottom: '16px' }}>{plan.price}</div>
                            <p style={{ color: 'var(--slate)', marginBottom: '32px', fontSize: '15px' }}>{plan.description}</p>
                            
                            <ul style={{ listStyle: 'none', padding: 0, margin: '0 0 40px', flex: 1 }}>
                                {plan.features.map((f, j) => (
                                    <li key={j} style={{ 
                                        display: 'flex', alignItems: 'center', gap: '12px', 
                                        marginBottom: '12px', fontSize: '14px', color: 'var(--slate)' 
                                    }}>
                                        <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="var(--blue)" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round">
                                            <polyline points="20 6 9 17 4 12"></polyline>
                                        </svg>
                                        {f}
                                    </li>
                                ))}
                            </ul>

                            <a 
                                href="/audit" 
                                className={plan.popular ? "btn-blue" : "btn-ghost"} 
                                style={{ justifyContent: 'center' }}
                            >
                                {plan.cta}
                            </a>
                        </motion.div>
                    ))}
                </div>
            </div>
        </section>
    );
}
