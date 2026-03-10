'use client';
import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import Script from 'next/script';

const STEPS = ['Your Business', 'Your Goals', 'Choose Package', 'Confirmation'];

const GOALS = [
    'Get cited in ChatGPT & Perplexity',
    'Dominate Google SGE answers',
    'Build brand authority in my category',
    'Automate social media content',
    'Increase AI-driven inbound leads',
    'Track AI citation performance',
];

const PACKAGES = [
    {
        id: 'geo',
        label: 'itappens GEO',
        price: '₹19,999/mo',
        desc: 'Get your brand into AI answers — ChatGPT, Perplexity, Gemini. Full 6-phase service.',
    },
    {
        id: 'content-pro',
        label: 'itappens Content Pro',
        price: '₹9,999/mo',
        desc: 'Daily LinkedIn, Instagram Reels, YouTube Shorts. All channels on autopilot.',
    },
    {
        id: 'content-growth',
        label: 'itappens Content Growth',
        price: '₹4,999/mo',
        desc: 'LinkedIn + Twitter/X daily posts. First post live in 5 minutes.',
    },
    {
        id: 'bundle',
        label: 'GEO + Content Bundle',
        price: 'Custom',
        desc: 'Everything — full AI presence + daily content automation. Best value.',
    },
];

const inputStyle: React.CSSProperties = {
    width: '100%',
    background: 'var(--surface2)',
    border: '1px solid var(--border2)',
    padding: '14px 16px',
    color: 'var(--text)',
    fontSize: '14px',
    outline: 'none',
    fontFamily: 'var(--font-body)',
    marginTop: '8px',
    transition: 'border-color 0.2s',
};

const labelStyle: React.CSSProperties = {
    fontSize: '9px',
    letterSpacing: '2px',
    textTransform: 'uppercase',
    color: 'var(--muted)',
    fontFamily: 'var(--font-body)',
    display: 'block',
};

export default function OnboardingPage() {
    const [step, setStep] = useState(0);
    const [form, setForm] = useState({
        company: '', website: '', industry: '', audience: '',
        goals: [] as string[],
        packageId: '',
        email: '', name: '',
    });
    const [submitted, setSubmitted] = useState(false);
    const [loading, setLoading] = useState(false);

    const update = (key: string, value: string) => setForm(f => ({ ...f, [key]: value }));
    const toggleGoal = (g: string) => setForm(f => ({
        ...f,
        goals: f.goals.includes(g) ? f.goals.filter(x => x !== g) : [...f.goals, g]
    }));

    const handleSubmit = async () => {
        setLoading(true);
        try {
            // 1. Create the Order on the backend
            const orderRes = await fetch('/api/razorpay/create-order', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ formSetup: form }),
            });
            const orderData = await orderRes.json();

            if (!orderRes.ok) throw new Error(orderData.error);

            // 2. Initialize Razorpay Checkout
            const options = {
                key: process.env.NEXT_PUBLIC_RAZORPAY_KEY_ID, // Use NEXT_PUBLIC prefix for client-side
                amount: orderData.amount,
                currency: "INR",
                name: "itappens.ai",
                description: PACKAGES.find(p => p.id === form.packageId)?.label,
                image: "/logo.png",
                order_id: orderData.id,
                handler: async function (response: any) {
                    // 3. Verify Payment
                    const verifyRes = await fetch('/api/razorpay/verify', {
                        method: 'POST',
                        headers: { 'Content-Type': 'application/json' },
                        body: JSON.stringify({
                            razorpay_payment_id: response.razorpay_payment_id,
                            razorpay_order_id: response.razorpay_order_id,
                            razorpay_signature: response.razorpay_signature,
                            formSetup: form
                        }),
                    });

                    if (verifyRes.ok) {
                        setSubmitted(true);
                    } else {
                        alert("Payment verification failed. Please contact support.");
                    }
                },
                prefill: {
                    name: form.name,
                    email: form.email,
                },
                theme: {
                    color: "#FF4500" // Our accent color
                }
            };

            const rzp1 = new (window as any).Razorpay(options);
            rzp1.on('payment.failed', function (response: any) {
                alert(`Payment Failed: ${response.error.description}`);
            });
            rzp1.open();

        } catch (error: any) {
            alert(error.message || "Failed to initialize checkout.");
        }
        setLoading(false);
    };

    const canNext = () => {
        if (step === 0) return form.company && form.website && form.industry;
        if (step === 1) return form.goals.length > 0;
        if (step === 2) return !!form.packageId;
        if (step === 3) return form.email && form.name;
        return false;
    };

    return (
        <main style={{ minHeight: '100vh', background: 'var(--bg)', display: 'flex', flexDirection: 'column', alignItems: 'center', padding: '40px 20px 80px' }}>
            <Script id="razorpay-checkout-js" src="https://checkout.razorpay.com/v1/checkout.js" />

            {/* Logo */}
            <a href="/" style={{ alignSelf: 'flex-start', marginBottom: '48px', display: 'inline-flex', alignItems: 'center' }}>
                <img src="/logo.png" alt="itappens.ai" style={{ height: '36px' }} />
            </a>

            {/* Step Indicator */}
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '48px', flexWrap: 'wrap', justifyContent: 'center' }}>
                {STEPS.map((s, i) => (
                    <div key={s} style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                        <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '6px' }}>
                            <div style={{
                                width: '32px', height: '32px', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center',
                                background: i < step ? 'var(--accent)' : i === step ? 'var(--accent)' : 'var(--surface2)',
                                border: `1px solid ${i <= step ? 'var(--accent)' : 'var(--border)'}`,
                                fontSize: '11px', fontWeight: 700,
                                color: i <= step ? 'var(--bg)' : 'var(--muted)',
                                transition: 'all 0.4s', flexShrink: 0,
                            }}>
                                {i < step ? '✓' : i + 1}
                            </div>
                            <span style={{ fontSize: '8px', letterSpacing: '1px', textTransform: 'uppercase', color: i === step ? 'var(--text)' : 'var(--muted)', whiteSpace: 'nowrap' }}>{s}</span>
                        </div>
                        {i < STEPS.length - 1 && (
                            <div style={{ width: '48px', height: '1px', background: i < step ? 'var(--accent)' : 'var(--border)', marginBottom: '20px', transition: 'background 0.4s' }} />
                        )}
                    </div>
                ))}
            </div>

            {/* Card */}
            {!submitted ? (
                <AnimatePresence mode="wait">
                    <motion.div
                        key={step}
                        initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -20 }}
                        transition={{ duration: 0.35 }}
                        style={{ width: '100%', maxWidth: '580px', background: 'var(--surface)', border: '1px solid var(--border2)', padding: '44px' }}
                    >
                        {/* Step 0 — Business */}
                        {step === 0 && (
                            <>
                                <div style={{ fontSize: '9px', letterSpacing: '3px', textTransform: 'uppercase', color: 'var(--accent)', marginBottom: '12px' }}>Step 1 of 4</div>
                                <h1 style={{ fontFamily: 'var(--font-display)', fontSize: '26px', fontWeight: 800, marginBottom: '8px' }}>Tell us about your business</h1>
                                <p style={{ fontSize: '12px', color: 'var(--muted)', marginBottom: '32px' }}>We'll use this to tailor your GEO strategy and content plan.</p>
                                <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
                                    <div>
                                        <label style={labelStyle}>Company Name *</label>
                                        <input style={inputStyle} placeholder="e.g. Zenbyte Technologies" value={form.company} onChange={e => update('company', e.target.value)} />
                                    </div>
                                    <div>
                                        <label style={labelStyle}>Website URL *</label>
                                        <input style={inputStyle} type="url" placeholder="https://yourcompany.com" value={form.website} onChange={e => update('website', e.target.value)} />
                                    </div>
                                    <div>
                                        <label style={labelStyle}>Industry / Niche *</label>
                                        <input style={inputStyle} placeholder="e.g. B2B SaaS, D2C Skincare, Fintech" value={form.industry} onChange={e => update('industry', e.target.value)} />
                                    </div>
                                    <div>
                                        <label style={labelStyle}>Target Audience</label>
                                        <input style={inputStyle} placeholder="e.g. HR managers at Indian startups" value={form.audience} onChange={e => update('audience', e.target.value)} />
                                    </div>
                                </div>
                            </>
                        )}

                        {/* Step 1 — Goals */}
                        {step === 1 && (
                            <>
                                <div style={{ fontSize: '9px', letterSpacing: '3px', textTransform: 'uppercase', color: 'var(--accent)', marginBottom: '12px' }}>Step 2 of 4</div>
                                <h1 style={{ fontFamily: 'var(--font-display)', fontSize: '26px', fontWeight: 800, marginBottom: '8px' }}>What are your goals?</h1>
                                <p style={{ fontSize: '12px', color: 'var(--muted)', marginBottom: '32px' }}>Select all that apply. This helps us prioritise the right strategy for you.</p>
                                <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
                                    {GOALS.map(g => (
                                        <button key={g} onClick={() => toggleGoal(g)} style={{
                                            textAlign: 'left', padding: '14px 16px', cursor: 'pointer', transition: 'all 0.2s',
                                            background: form.goals.includes(g) ? 'var(--accent-dim)' : 'var(--surface2)',
                                            border: `1px solid ${form.goals.includes(g) ? 'var(--accent-border)' : 'var(--border)'}`,
                                            color: form.goals.includes(g) ? 'var(--accent)' : 'var(--text2)',
                                            fontSize: '13px', fontFamily: 'var(--font-body)',
                                            display: 'flex', alignItems: 'center', gap: '12px',
                                        }}>
                                            <span style={{ width: '18px', height: '18px', border: `1px solid ${form.goals.includes(g) ? 'var(--accent)' : 'var(--border)'}`, display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0, fontSize: '10px', background: form.goals.includes(g) ? 'var(--accent)' : 'transparent', color: 'var(--bg)' }}>
                                                {form.goals.includes(g) ? '✓' : ''}
                                            </span>
                                            {g}
                                        </button>
                                    ))}
                                </div>
                            </>
                        )}

                        {/* Step 2 — Package */}
                        {step === 2 && (
                            <>
                                <div style={{ fontSize: '9px', letterSpacing: '3px', textTransform: 'uppercase', color: 'var(--accent)', marginBottom: '12px' }}>Step 3 of 4</div>
                                <h1 style={{ fontFamily: 'var(--font-display)', fontSize: '26px', fontWeight: 800, marginBottom: '8px' }}>Choose your package</h1>
                                <p style={{ fontSize: '12px', color: 'var(--muted)', marginBottom: '32px' }}>You can change or upgrade at any time. <a href="/pricing" style={{ color: 'var(--accent)' }}>See full pricing →</a></p>
                                <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
                                    {PACKAGES.map(pkg => (
                                        <button key={pkg.id} onClick={() => update('packageId', pkg.id)} style={{
                                            textAlign: 'left', padding: '18px 20px', cursor: 'pointer', transition: 'all 0.2s',
                                            background: form.packageId === pkg.id ? 'var(--accent-dim)' : 'var(--surface2)',
                                            border: `1px solid ${form.packageId === pkg.id ? 'var(--accent)' : 'var(--border)'}`,
                                            borderTop: form.packageId === pkg.id ? '2px solid var(--accent)' : '1px solid var(--border)',
                                        }}>
                                            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '6px' }}>
                                                <div style={{ fontFamily: 'var(--font-display)', fontWeight: 700, fontSize: '15px', color: 'var(--text)' }}>{pkg.label}</div>
                                                <div style={{ fontFamily: 'var(--font-display)', fontWeight: 700, fontSize: '14px', color: 'var(--accent)', marginLeft: '12px', flexShrink: 0 }}>{pkg.price}</div>
                                            </div>
                                            <div style={{ fontSize: '12px', color: 'var(--text2)', lineHeight: 1.6 }}>{pkg.desc}</div>
                                        </button>
                                    ))}
                                </div>
                            </>
                        )}

                        {/* Step 3 — Contact */}
                        {step === 3 && (
                            <>
                                <div style={{ fontSize: '9px', letterSpacing: '3px', textTransform: 'uppercase', color: 'var(--accent)', marginBottom: '12px' }}>Step 4 of 4</div>
                                <h1 style={{ fontFamily: 'var(--font-display)', fontSize: '26px', fontWeight: 800, marginBottom: '8px' }}>Almost there</h1>
                                <p style={{ fontSize: '12px', color: 'var(--muted)', marginBottom: '32px' }}>We'll reach out within 24 hours to confirm your onboarding.</p>
                                <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
                                    <div>
                                        <label style={labelStyle}>Your Name *</label>
                                        <input style={inputStyle} placeholder="e.g. Priya Sharma" value={form.name} onChange={e => update('name', e.target.value)} />
                                    </div>
                                    <div>
                                        <label style={labelStyle}>Business Email *</label>
                                        <input style={inputStyle} type="email" placeholder="name@company.com" value={form.email} onChange={e => update('email', e.target.value)} />
                                    </div>
                                    <div style={{ padding: '16px', background: 'var(--accent-dim)', border: '1px solid var(--accent-border)', fontSize: '11px', color: 'var(--text2)', lineHeight: 1.7 }}>
                                        <strong style={{ color: 'var(--accent)' }}>Your selected package:</strong><br />
                                        {PACKAGES.find(p => p.id === form.packageId)?.label} — {PACKAGES.find(p => p.id === form.packageId)?.price}
                                    </div>
                                </div>
                            </>
                        )}

                        {/* Nav Buttons */}
                        <div style={{ display: 'flex', justifyContent: 'space-between', marginTop: '36px', gap: '12px' }}>
                            {step > 0 ? (
                                <button onClick={() => setStep(s => s - 1)} style={{
                                    padding: '14px 24px', background: 'transparent', border: '1px solid var(--border)',
                                    color: 'var(--muted)', fontSize: '10px', letterSpacing: '2px', textTransform: 'uppercase',
                                    cursor: 'pointer', fontFamily: 'var(--font-body)', fontWeight: 700,
                                }}>← Back</button>
                            ) : <div />}

                            <button
                                onClick={step < 3 ? () => setStep(s => s + 1) : handleSubmit}
                                disabled={!canNext() || loading}
                                style={{
                                    padding: '14px 32px', background: canNext() ? 'var(--accent)' : 'var(--surface2)',
                                    border: 'none', color: canNext() ? 'var(--bg)' : 'var(--muted)',
                                    fontSize: '11px', letterSpacing: '2px', textTransform: 'uppercase',
                                    cursor: canNext() ? 'pointer' : 'not-allowed', fontFamily: 'var(--font-body)', fontWeight: 700,
                                    transition: 'all 0.2s',
                                }}
                            >
                                {loading ? 'Submitting...' : step < 3 ? 'Next Step →' : 'Submit →'}
                            </button>
                        </div>
                    </motion.div>
                </AnimatePresence>
            ) : (
                <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}
                    style={{ width: '100%', maxWidth: '520px', textAlign: 'center', padding: '60px 40px', background: 'var(--surface)', border: '1px solid var(--accent-border)' }}>
                    <div style={{ fontSize: '40px', marginBottom: '20px' }}>✅</div>
                    <div style={{ fontSize: '9px', letterSpacing: '3px', textTransform: 'uppercase', color: 'var(--accent)', marginBottom: '16px' }}>Onboarding Received</div>
                    <h2 style={{ fontFamily: 'var(--font-display)', fontSize: '28px', fontWeight: 800, marginBottom: '12px' }}>You&apos;re in.</h2>
                    <p style={{ fontSize: '13px', color: 'var(--text2)', lineHeight: 1.8, marginBottom: '32px' }}>
                        Our team will review your submission and reach out to <strong style={{ color: 'var(--text)' }}>{form.email}</strong> within 24 hours to confirm your onboarding and schedule a kickoff.
                    </p>
                    <a href="/" style={{
                        display: 'inline-block', padding: '12px 28px', background: 'var(--accent)', color: 'var(--bg)',
                        fontSize: '10px', letterSpacing: '2px', textTransform: 'uppercase', textDecoration: 'none', fontWeight: 700,
                    }}>Back to Home →</a>
                </motion.div>
            )}
        </main>
    );
}
