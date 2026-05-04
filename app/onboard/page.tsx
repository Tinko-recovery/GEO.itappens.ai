"use client";

import { useState } from "react";
import NavBar from "@/components/NavBar";
import SiteFooter from "@/components/SiteFooter";

export default function OnboardingPage() {
    const [step, setStep] = useState(1);
    const [loading, setLoading] = useState(false);
    const [success, setSuccess] = useState(false);
    const [error, setError] = useState("");

    const [formData, setFormData] = useState({
        businessName: "",
        websiteUrl: "",
        email: "",
        industry: "",
        niche: "",
        targetAudience: "",
        bufferAccessToken: "",
        linkedinProfileId: "",
        twitterProfileId: "",
        instagramProfileId: ""
    });

    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const nextStep = () => setStep(step + 1);
    const prevStep = () => setStep(step - 1);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);
        setError("");

        try {
            const res = await fetch("/api/clients/register", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(formData)
            });

            const data = await res.json();
            if (res.ok) {
                setSuccess(true);
            } else {
                setError(data.error || "Something went wrong.");
            }
        } catch (err) {
            setError("Failed to connect to the server.");
        } finally {
            setLoading(false);
        }
    };

    if (success) {
        return (
            <div className="page-shell">
                <NavBar />
                <main className="container animate-in" style={{ padding: '140px 0', textAlign: 'center' }}>
                    <div className="card-glass" style={{ maxWidth: '600px', margin: '0 auto', padding: '64px' }}>
                        <div style={{ fontSize: '48px', marginBottom: '24px' }}>🚀</div>
                        <h1 className="headline-lg">Welcome to the Future.</h1>
                        <p className="text-sub" style={{ marginTop: '24px', marginInline: 'auto' }}>
                            Your business profile has been onboarded to the itappens.ai Foundry. 
                            <br /><br />
                            <strong>Next Step:</strong> Our team (The Principal) will contact you at <b>{formData.email}</b> within 2 hours to confirm your ₹999 payment and activate your autonomous content engine.
                        </p>
                        <div style={{ marginTop: '40px' }}>
                            <a href="/" className="btn-primary">Return Home</a>
                        </div>
                    </div>
                </main>
                <SiteFooter />
            </div>
        );
    }

    return (
        <div className="page-shell">
            <NavBar />
            <main className="container animate-in" style={{ padding: '100px 24px' }}>
                <div style={{ maxWidth: '800px', margin: '0 auto' }}>
                    <div style={{ marginBottom: '60px', textAlign: 'center' }}>
                        <span className="overline">Step {step} of 3</span>
                        <h1 className="headline-lg">Activate Your AI Workforce</h1>
                        <p className="text-sub" style={{ margin: '16px auto' }}>
                            Tell us about your brand. We'll use this data to train your custom Gemini agents.
                        </p>
                    </div>

                    <div className="card-glass" style={{ padding: '48px', position: 'relative' }}>
                        <div style={{ position: 'absolute', top: 0, left: 0, right: 0, height: '4px', background: 'linear-gradient(to right, var(--brand-blue), var(--brand-green), var(--brand-yellow), var(--brand-red))' }} />
                        
                        <form onSubmit={handleSubmit}>
                            {step === 1 && (
                                <div className="animate-in" style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
                                    <h2 style={{ fontSize: '20px', fontWeight: 700 }}>Brand Identity</h2>
                                    <div className="grid-form-row">
                                        <div className="input-group">
                                            <label style={{ display: 'block', fontSize: '13px', fontWeight: 600, marginBottom: '8px', opacity: 0.7 }}>Business Name</label>
                                            <input type="text" name="businessName" value={formData.businessName} onChange={handleChange} required className="w-full" style={{ width: '100%', padding: '12px', borderRadius: '8px', border: '1px solid var(--border)', background: 'var(--surface)' }} placeholder="e.g. Acme SaaS" />
                                        </div>
                                        <div className="input-group">
                                            <label style={{ display: 'block', fontSize: '13px', fontWeight: 600, marginBottom: '8px', opacity: 0.7 }}>Work Email</label>
                                            <input type="email" name="email" value={formData.email} onChange={handleChange} required className="w-full" style={{ width: '100%', padding: '12px', borderRadius: '8px', border: '1px solid var(--border)', background: 'var(--surface)' }} placeholder="you@company.com" />
                                        </div>
                                    </div>
                                    <div className="input-group">
                                        <label style={{ display: 'block', fontSize: '13px', fontWeight: 600, marginBottom: '8px', opacity: 0.7 }}>Website URL</label>
                                        <input type="url" name="websiteUrl" value={formData.websiteUrl} onChange={handleChange} required className="w-full" style={{ width: '100%', padding: '12px', borderRadius: '8px', border: '1px solid var(--border)', background: 'var(--surface)' }} placeholder="https://yourbrand.com" />
                                    </div>
                                    <div className="input-group">
                                        <label style={{ display: 'block', fontSize: '13px', fontWeight: 600, marginBottom: '8px', opacity: 0.7 }}>Industry</label>
                                        <input type="text" name="industry" value={formData.industry} onChange={handleChange} required className="w-full" style={{ width: '100%', padding: '12px', borderRadius: '8px', border: '1px solid var(--border)', background: 'var(--surface)' }} placeholder="e.g. Real Estate, Crypto, Healthcare" />
                                    </div>
                                    <div style={{ marginTop: '20px', display: 'flex', justifyContent: 'flex-end' }}>
                                        <button type="button" onClick={nextStep} className="btn-primary">Next: Content Strategy</button>
                                    </div>
                                </div>
                            )}

                            {step === 2 && (
                                <div className="animate-in" style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
                                    <h2 style={{ fontSize: '20px', fontWeight: 700 }}>Content Strategy</h2>
                                    <div className="input-group">
                                        <label style={{ display: 'block', fontSize: '13px', fontWeight: 600, marginBottom: '8px', opacity: 0.7 }}>Specific Niche</label>
                                        <textarea name="niche" value={formData.niche} onChange={handleChange} required rows={3} style={{ width: '100%', padding: '12px', borderRadius: '8px', border: '1px solid var(--border)', background: 'var(--surface)', fontFamily: 'inherit' }} placeholder="What exactly do you do? e.g. We provide AI-driven tax automation for US based freelancers." />
                                    </div>
                                    <div className="input-group">
                                        <label style={{ display: 'block', fontSize: '13px', fontWeight: 600, marginBottom: '8px', opacity: 0.7 }}>Target Audience</label>
                                        <textarea name="targetAudience" value={formData.targetAudience} onChange={handleChange} required rows={3} style={{ width: '100%', padding: '12px', borderRadius: '8px', border: '1px solid var(--border)', background: 'var(--surface)', fontFamily: 'inherit' }} placeholder="Who are you trying to reach? e.g. Freelance designers and developers earning $100k+." />
                                    </div>
                                    <div style={{ marginTop: '20px', display: 'flex', justifyContent: 'space-between' }}>
                                        <button type="button" onClick={prevStep} className="btn-secondary">Back</button>
                                        <button type="button" onClick={nextStep} className="btn-primary">Next: Social Connection</button>
                                    </div>
                                </div>
                            )}

                            {step === 3 && (
                                <div className="animate-in" style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
                                    <h2 style={{ fontSize: '20px', fontWeight: 700 }}>Social Distribution (Buffer)</h2>
                                    <div style={{ backgroundColor: 'rgba(58, 190, 249, 0.05)', padding: '20px', borderRadius: '12px', border: '1px solid var(--brand-blue)', fontSize: '14px' }}>
                                        <p style={{ fontWeight: 600, color: 'var(--brand-blue)', marginBottom: '8px' }}>How to connect your social accounts:</p>
                                        <ol style={{ paddingLeft: '20px', opacity: 0.8, display: 'flex', flexDirection: 'column', gap: '8px' }}>
                                            <li>Go to your <b>Buffer Account Settings</b> → Apps.</li>
                                            <li>Generate an <b>Access Token</b> and paste it below.</li>
                                            <li>Connect your LinkedIn, Twitter, and Instagram in Buffer and paste their Profile IDs.</li>
                                        </ol>
                                    </div>

                                    <div className="input-group">
                                        <label style={{ display: 'block', fontSize: '13px', fontWeight: 600, marginBottom: '8px', opacity: 0.7 }}>Buffer Access Token</label>
                                        <input type="password" name="bufferAccessToken" value={formData.bufferAccessToken} onChange={handleChange} required style={{ width: '100%', padding: '12px', borderRadius: '8px', border: '1px solid var(--border)', background: 'var(--surface)' }} placeholder="Paste your Buffer token" />
                                    </div>

                                    <div className="grid-3col">
                                        <div className="input-group">
                                            <label style={{ display: 'block', fontSize: '11px', fontWeight: 600, marginBottom: '4px', opacity: 0.7 }}>LinkedIn ID</label>
                                            <input type="text" name="linkedinProfileId" value={formData.linkedinProfileId} onChange={handleChange} style={{ width: '100%', padding: '10px', borderRadius: '8px', border: '1px solid var(--border)', background: 'var(--surface)', fontSize: '12px' }} placeholder="ID" />
                                        </div>
                                        <div className="input-group">
                                            <label style={{ display: 'block', fontSize: '11px', fontWeight: 600, marginBottom: '4px', opacity: 0.7 }}>Twitter ID</label>
                                            <input type="text" name="twitterProfileId" value={formData.twitterProfileId} onChange={handleChange} style={{ width: '100%', padding: '10px', borderRadius: '8px', border: '1px solid var(--border)', background: 'var(--surface)', fontSize: '12px' }} placeholder="ID" />
                                        </div>
                                        <div className="input-group">
                                            <label style={{ display: 'block', fontSize: '11px', fontWeight: 600, marginBottom: '4px', opacity: 0.7 }}>Instagram ID</label>
                                            <input type="text" name="instagramProfileId" value={formData.instagramProfileId} onChange={handleChange} style={{ width: '100%', padding: '10px', borderRadius: '8px', border: '1px solid var(--border)', background: 'var(--surface)', fontSize: '12px' }} placeholder="ID" />
                                        </div>
                                    </div>

                                    {error && <div style={{ color: 'var(--brand-red)', fontSize: '14px', fontWeight: 600 }}>{error}</div>}

                                    <div style={{ marginTop: '20px', display: 'flex', justifyContent: 'space-between' }}>
                                        <button type="button" onClick={prevStep} className="btn-secondary">Back</button>
                                        <button type="submit" disabled={loading} className="btn-primary">
                                            {loading ? "Registering..." : "Complete Onboarding"}
                                        </button>
                                    </div>
                                </div>
                            )}
                        </form>
                    </div>
                </div>
            </main>
            <SiteFooter />
        </div>
    );
}
