'use client';
import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

const platforms = ['LinkedIn', 'Instagram', 'Twitter/X', 'YouTube'];
const steps = ['Your Brand', 'Generating...', 'Your Content'];

export default function OnboardPage() {
    const [step, setStep] = useState(0);
    const [form, setForm] = useState({ company: '', niche: '', audience: '', email: '' });
    const [selectedPlatforms, setSelectedPlatforms] = useState(['LinkedIn', 'Instagram']);
    const [content, setContent] = useState<any>(null);
    const [error, setError] = useState('');

    const togglePlatform = (p: string) => {
        setSelectedPlatforms(prev => prev.includes(p) ? prev.filter(x => x !== p) : [...prev, p]);
    };

    const handleGenerate = async () => {
        if (!form.company || !form.niche) { setError('Please fill in company name and niche.'); return; }
        setError('');
        setStep(1);
        try {
            const res = await fetch('/api/generate', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ ...form, platforms: selectedPlatforms })
            });
            const data = await res.json();
            if (data.error) throw new Error(data.error);
            setContent(data);
            setStep(2);
        } catch (e: any) {
            setError(e.message || 'Generation failed. Please try again.');
            setStep(0);
        }
    };

    const inputStyle = {
        width: '100%', background: 'var(--surface2)', border: '1px solid var(--border)',
        padding: '14px 16px', color: 'var(--text)', fontSize: '14px', outline: 'none',
        fontFamily: 'var(--font-mono)', marginTop: '8px'
    };

    return (
        <main style={{ minHeight: '100vh', background: 'var(--bg)', padding: '120px 24px 80px', display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
            <a href="/" style={{ position: 'fixed', top: '24px', left: '24px', zIndex: 100 }}>
                <img src="/logo.png" alt="itappens.ai" style={{ height: '22px' }} />
            </a>

            {/* Step Indicators */}
            <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '48px' }}>
                {steps.map((s, i) => (
                    <div key={s} style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                        <div style={{
                            width: '28px', height: '28px', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center',
                            background: i <= step ? 'var(--accent)' : 'var(--surface)', border: '1px solid var(--border)',
                            fontSize: '10px', fontWeight: 700, color: i <= step ? 'var(--bg)' : 'var(--muted)', transition: 'all 0.3s'
                        }}>
                            {i < step ? '✓' : i + 1}
                        </div>
                        <span style={{ fontSize: '10px', letterSpacing: '1.5px', textTransform: 'uppercase', color: i === step ? 'var(--text)' : 'var(--muted)' }}>{s}</span>
                        {i < steps.length - 1 && <div style={{ width: '32px', height: '1px', background: 'var(--border)' }} />}
                    </div>
                ))}
            </div>

            <AnimatePresence mode="wait">
                {/* Step 0: Form */}
                {step === 0 && (
                    <motion.div key="form" initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }}
                        style={{ width: '100%', maxWidth: '560px' }}>
                        <div style={{ textAlign: 'center', marginBottom: '40px' }}>
                            <div style={{ fontSize: '9px', letterSpacing: '3px', textTransform: 'uppercase', color: 'var(--accent)', marginBottom: '12px' }}>
                                Free First Content
                            </div>
                            <h1 style={{ fontFamily: 'var(--font-display)', fontSize: 'clamp(28px, 5vw, 40px)', fontWeight: 800, lineHeight: 1.1, marginBottom: '12px' }}>
                                Generate your first<br /><span style={{ color: 'var(--accent)' }}>AI post in 60 seconds.</span>
                            </h1>
                            <p style={{ fontSize: '13px', color: 'var(--muted)' }}>No sign-up. No credit card. Just your brand details.</p>
                        </div>

                        <div style={{ background: 'var(--surface)', border: '1px solid var(--border)', padding: '36px', display: 'flex', flexDirection: 'column', gap: '20px' }}>
                            <div>
                                <label style={{ fontSize: '10px', letterSpacing: '2px', textTransform: 'uppercase', color: 'var(--muted)' }}>Company Name *</label>
                                <input style={inputStyle} placeholder="e.g. Zenbyte Tech" value={form.company}
                                    onChange={e => setForm(f => ({ ...f, company: e.target.value }))} />
                            </div>
                            <div>
                                <label style={{ fontSize: '10px', letterSpacing: '2px', textTransform: 'uppercase', color: 'var(--muted)' }}>Your Niche / Industry *</label>
                                <input style={inputStyle} placeholder="e.g. B2B SaaS for HR teams" value={form.niche}
                                    onChange={e => setForm(f => ({ ...f, niche: e.target.value }))} />
                            </div>
                            <div>
                                <label style={{ fontSize: '10px', letterSpacing: '2px', textTransform: 'uppercase', color: 'var(--muted)' }}>Target Audience</label>
                                <input style={inputStyle} placeholder="e.g. HR managers at Indian startups" value={form.audience}
                                    onChange={e => setForm(f => ({ ...f, audience: e.target.value }))} />
                            </div>
                            <div>
                                <label style={{ fontSize: '10px', letterSpacing: '2px', textTransform: 'uppercase', color: 'var(--muted)' }}>Platforms</label>
                                <div style={{ display: 'flex', gap: '8px', flexWrap: 'wrap', marginTop: '10px' }}>
                                    {platforms.map(p => (
                                        <button key={p} onClick={() => togglePlatform(p)} style={{
                                            padding: '6px 14px', fontSize: '10px', letterSpacing: '1px',
                                            border: `1px solid ${selectedPlatforms.includes(p) ? 'var(--accent)' : 'var(--border)'}`,
                                            background: selectedPlatforms.includes(p) ? 'var(--accent-dim)' : 'transparent',
                                            color: selectedPlatforms.includes(p) ? 'var(--accent)' : 'var(--muted)',
                                            cursor: 'pointer', transition: 'all 0.2s'
                                        }}>{p}</button>
                                    ))}
                                </div>
                            </div>
                            {error && <div style={{ color: '#ff6b6b', fontSize: '12px' }}>{error}</div>}
                            <button onClick={handleGenerate} className="btn-primary"
                                style={{ padding: '16px', fontSize: '11px', letterSpacing: '3px', width: '100%', marginTop: '8px', cursor: 'pointer', border: 'none' }}>
                                Generate My First Post →
                            </button>
                            <div style={{ textAlign: 'center', fontSize: '10px', color: 'var(--muted)' }}>
                                Powered by itappens.ai — Free, no sign-up needed.
                            </div>
                        </div>
                    </motion.div>
                )}

                {/* Step 1: Generating */}
                {step === 1 && (
                    <motion.div key="loading" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
                        style={{ textAlign: 'center', maxWidth: '400px' }}>
                        <div style={{ fontSize: '48px', marginBottom: '24px' }}>⚡</div>
                        <h2 style={{ fontFamily: 'var(--font-display)', fontSize: '28px', marginBottom: '12px' }}>Generating your content...</h2>
                        <p style={{ fontSize: '13px', color: 'var(--muted)', marginBottom: '32px' }}>
                            Claude AI is reading today's top trends and writing in your brand's voice. Takes about 15 seconds.
                        </p>
                        <div style={{ display: 'flex', gap: '8px', justifyContent: 'center' }}>
                            {[0, 1, 2].map(i => (
                                <motion.div key={i} animate={{ opacity: [0.3, 1, 0.3] }}
                                    transition={{ duration: 1.2, repeat: Infinity, delay: i * 0.4 }}
                                    style={{ width: '8px', height: '8px', borderRadius: '50%', background: 'var(--accent)' }} />
                            ))}
                        </div>
                    </motion.div>
                )}

                {/* Step 2: Content Preview */}
                {step === 2 && content && (
                    <motion.div key="result" initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}
                        style={{ width: '100%', maxWidth: '700px' }}>
                        <div style={{ textAlign: 'center', marginBottom: '32px' }}>
                            <div style={{ fontSize: '9px', letterSpacing: '3px', textTransform: 'uppercase', color: 'var(--accent)', marginBottom: '12px' }}>✓ Done in under 60 seconds</div>
                            <h2 style={{ fontFamily: 'var(--font-display)', fontSize: '32px', marginBottom: '8px' }}>Your first AI content 🎉</h2>
                            <p style={{ fontSize: '13px', color: 'var(--muted)' }}>This is what itappens Content generates for you — daily, automatically.</p>
                        </div>

                        {content.linkedin && (
                            <div style={{ background: 'var(--surface)', border: '1px solid var(--border)', padding: '28px', marginBottom: '16px' }}>
                                <div style={{ fontSize: '9px', letterSpacing: '2px', textTransform: 'uppercase', color: 'var(--accent)', marginBottom: '12px' }}>LinkedIn Post</div>
                                <p style={{ fontSize: '13px', color: 'var(--text2)', lineHeight: 1.7, whiteSpace: 'pre-wrap' }}>{content.linkedin}</p>
                            </div>
                        )}
                        {content.twitter && (
                            <div style={{ background: 'var(--surface)', border: '1px solid var(--border)', padding: '28px', marginBottom: '16px' }}>
                                <div style={{ fontSize: '9px', letterSpacing: '2px', textTransform: 'uppercase', color: 'var(--accent)', marginBottom: '12px' }}>Twitter/X</div>
                                <p style={{ fontSize: '13px', color: 'var(--text2)', lineHeight: 1.7 }}>{content.twitter}</p>
                            </div>
                        )}
                        {content.instagram && (
                            <div style={{ background: 'var(--surface)', border: '1px solid var(--border)', padding: '28px', marginBottom: '32px' }}>
                                <div style={{ fontSize: '9px', letterSpacing: '2px', textTransform: 'uppercase', color: 'var(--accent)', marginBottom: '12px' }}>Instagram Caption</div>
                                <p style={{ fontSize: '13px', color: 'var(--text2)', lineHeight: 1.7, whiteSpace: 'pre-wrap' }}>{content.instagram}</p>
                            </div>
                        )}

                        {/* Upgrade CTA */}
                        <div style={{ background: 'var(--accent-dim)', border: '1px solid var(--accent-border)', padding: '32px', textAlign: 'center' }}>
                            <h3 style={{ fontFamily: 'var(--font-display)', fontSize: '22px', marginBottom: '12px' }}>
                                Love it? Get this <span style={{ color: 'var(--accent)' }}>every single day.</span>
                            </h3>
                            <p style={{ fontSize: '13px', color: 'var(--muted)', marginBottom: '24px', maxWidth: '400px', margin: '0 auto 24px' }}>
                                itappens Content automates this across all your channels — LinkedIn, Instagram Reels, YouTube Shorts, and Twitter/X.
                            </p>
                            <a href="mailto:founder@tinko.in?subject=itappens Content Enquiry&body=Hi itappens team, I just tried itappens Content and I'm interested in automating my social media. My company is: ..."
                                style={{
                                    display: 'inline-block', background: 'var(--accent)', color: 'var(--bg)',
                                    padding: '14px 32px', fontSize: '11px', letterSpacing: '2px',
                                    textTransform: 'uppercase', textDecoration: 'none', fontWeight: 700
                                }}>
                                Start itappens Content →
                            </a>
                            <div style={{ marginTop: '12px', fontSize: '11px', color: 'var(--muted)' }}>
                                founder@tinko.in — we reply within 24h
                            </div>
                        </div>
                    </motion.div>
                )}
            </AnimatePresence>
        </main>
    );
}
