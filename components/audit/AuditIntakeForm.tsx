"use client";

import { useEffect, useState, useTransition } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { Loader2, ShieldEllipsis, CheckCircle2, LockKeyhole } from "lucide-react";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";

import type { AuditPlanKey } from "@/lib/audit/types";

const queryOptions = [
  "Does AI identify our brand as a category leader in our industry?",
  "How well are our current products/services recommended by AI?",
  "What are the top 3 strengths and weaknesses AI associates with us?",
  "How does our brand sentiment compare against our primary competitors?",
  "Is our website cited as an authoritative source for industry data?",
  "Are our current pricing, offers, and locations accurately reflected?",
  "What specific industry trends or pain points does AI link to us?",
];

const loadingMessages = [
  "Bypassing anti-bot checks...",
  "Analyzing entity graphs across ChatGPT, Claude & Perplexity...",
  "Extracting semantic nodes...",
  "Corroborating technical SERP footprint...",
  "Engineering strategic roadmap...",
  "Generating final PDF blueprint...",
];

const formSchema = z.object({
  name: z.string().min(2, "Name is required."),
  email: z.string().email("Enter a valid business email."),
  company: z.string().min(2, "Company name is required."),
  website: z.string().min(4, "Enter a valid website URL."),
  industry: z.string().min(2, "Industry is required."),
  query1: z.string().optional(),
  query2: z.string().optional(),
  query3: z.string().optional(),
  message: z.string().optional(),
  captchaAnswer: z.string().min(1, "Solve the captcha."),
});

type FormValues = z.infer<typeof formSchema>;

type CaptchaState = {
  question: string;
  token: string;
};

type AuditIntakeFormProps = {
  selectedPlan: Exclude<AuditPlanKey, "free">;
};

export function AuditIntakeForm({ selectedPlan }: AuditIntakeFormProps) {
  const router = useRouter();
  const searchParams = useSearchParams();
  const prefilledDomain = searchParams.get("domain") || "";
  
  const [captcha, setCaptcha] = useState<CaptchaState | null>(null);
  
  const [isPending, startTransition] = useTransition();
  const [message, setMessage] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);
  const [activeTab, setActiveTab] = useState<string>("free");

  // OTP State
  const [otpMode, setOtpMode] = useState(false);
  const [otpValue, setOtpValue] = useState("");
  const [otpPending, setOtpPending] = useState(false);

  // Loading animation state
  const [loadingMsgIdx, setLoadingMsgIdx] = useState(0);
  const [isAnalyzing, setIsAnalyzing] = useState(false);

  useEffect(() => {
    let interval: any;
    if (isAnalyzing && activeTab === "free") {
      interval = setInterval(() => {
        setLoadingMsgIdx((prev) => (prev + 1) % loadingMessages.length);
      }, 3000);
    } else {
      setLoadingMsgIdx(0);
    }
    return () => clearInterval(interval);
  }, [isAnalyzing, activeTab]);

  const form = useForm<FormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      name: "",
      email: "",
      company: "",
      website: prefilledDomain,
      industry: "",
      query1: "",
      query2: "",
      query3: "",
      message: "",
      captchaAnswer: "",
    },
  });

  async function loadCaptcha() {
    const response = await fetch("/api/captcha", { cache: "no-store" });
    if (!response.ok) return;
    const data = (await response.json()) as CaptchaState;
    setCaptcha(data);
  }

  useEffect(() => {
    void loadCaptcha();
  }, []);

  async function handleSendOTP(values: FormValues) {
    setMessage(null);
    setOtpPending(true);
    
    try {
      const res = await fetch("/api/audit/otp/send", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email: values.email }),
      });
      
      const data = await res.json();
      
      if (res.ok) {
        setOtpMode(true);
        setMessage("Security code sent to " + values.email);
      } else {
        setMessage(data?.error || "Failed to send code.");
      }
    } catch (e) {
      setMessage("Network error. Please try again.");
    } finally {
      setOtpPending(false);
    }
  }

  async function submit(mode: string, values: FormValues) {
    if (!captcha) {
      setMessage("Captcha failed to load. Refresh and try again.");
      return;
    }

    setMessage(null);

    // CONTACT US FLOW
    if (mode === "contact") {
      const payload = {
        name: values.name,
        email: values.email,
        company: values.company,
        siteUrl: values.website,
        industry: values.industry,
        message: values.message,
        captchaToken: captcha.token,
        captchaAnswer: values.captchaAnswer,
      };

      setIsAnalyzing(true);
      try {
        const response = await fetch("/api/contact", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(payload),
        });
        const data = await response.json();
        if (!response.ok) {
           setIsAnalyzing(false);
           setMessage(data?.error || "Error sending message. Please try again.");
           form.setValue("captchaAnswer", "");
           void loadCaptcha();
           return;
        }
        setIsAnalyzing(false);
        setSuccess(true);
      } catch (err) {
        setIsAnalyzing(false);
        setMessage("Network error. Please try again.");
      }
      return;
    }

    // FREE AUDIT FLOW
    if (mode === "free") {
      if (!values.query1) {
        setMessage("Please select at least one audit question.");
        return;
      }

      if (!otpMode) {
        await handleSendOTP(values);
        return;
      }

      // If we are in OTP mode, verify OTP first.
      const verifyRes = await fetch("/api/audit/otp/verify", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email: values.email, otp: otpValue }),
      });
      
      const verifyData = await verifyRes.json();
      if (!verifyRes.ok) {
        setMessage(verifyData?.error || "Invalid verification code.");
        return; // Halt audit execution
      }
      
      // OTP verified, now execute audit
      setIsAnalyzing(true);
      const payload = {
        name: values.name,
        email: values.email,
        company: values.company,
        siteUrl: values.website,
        industry: values.industry,
        targetKeywords: [values.query1, values.query2, values.query3].filter(Boolean),
        captchaToken: captcha.token,
        captchaAnswer: values.captchaAnswer,
      };

      try {
        const response = await fetch("/api/audit/free", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(payload),
        });

        const data = await response.json();

        if (response.ok && data.shareToken) {
          setIsAnalyzing(false);
          setSuccess(true);
          setTimeout(() => {
            window.location.href = `/audit/report/${data.shareToken}`;
          }, 3000);
          return;
        }

        if (!response.ok || !data.success) {
          setIsAnalyzing(false);
          setMessage(data?.message || "Error submitting audit. Please try again.");
          form.setValue("captchaAnswer", "");
          void loadCaptcha();
          return;
        }

        setIsAnalyzing(false);
        setSuccess(true);
      } catch (err) {
        setIsAnalyzing(false);
        setMessage("Network error. Please try again.");
      }
      return;
    }
  }

  // Common input styling to ensure consistency in Dark Theme
  const inputStyle = { 
    backgroundColor: '#0A192F', 
    color: '#D9E2FF', 
    borderColor: '#233554', 
    borderRadius: '4px',
    borderWidth: '1px'
  };
  const labelStyle = { color: '#8892B0', fontWeight: 500, fontSize: '13px', fontFamily: 'var(--font-inter, sans-serif)' };

  if (isAnalyzing && activeTab === 'free') {
    return (
      <div className="card-glass" style={{ padding: '60px 40px', textAlign: 'center', display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '24px', backgroundColor: '#112240', border: '1px solid #233554', borderRadius: '8px', boxShadow: '0 10px 30px -10px rgba(0,0,0,0.5)' }}>
        <div style={{ backgroundColor: 'rgba(0, 229, 255, 0.1)', color: '#00E5FF', padding: '24px', borderRadius: '50%' }}>
          <Loader2 className="h-16 w-16 animate-spin" />
        </div>
        <h2 style={{ fontSize: '24px', fontWeight: 600, color: '#D9E2FF', transition: 'opacity 0.5s ease', fontFamily: 'var(--font-inter, sans-serif)', letterSpacing: '-0.01em' }}>{loadingMessages[loadingMsgIdx]}</h2>
        <p style={{ color: '#8892B0', lineHeight: 1.6, fontSize: '15px' }}>Please do not close this window.<br/>Your GEO audit is being generated in real-time.</p>
      </div>
    );
  }
  
  if (isAnalyzing && activeTab === 'contact') {
    return (
      <div className="card-glass" style={{ padding: '60px 40px', textAlign: 'center', display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '24px', backgroundColor: '#112240', border: '1px solid #233554', borderRadius: '8px', boxShadow: '0 10px 30px -10px rgba(0,0,0,0.5)' }}>
        <div style={{ backgroundColor: 'rgba(0, 229, 255, 0.1)', color: '#00E5FF', padding: '24px', borderRadius: '50%' }}>
          <Loader2 className="h-16 w-16 animate-spin" />
        </div>
        <h2 style={{ fontSize: '24px', fontWeight: 600, color: '#D9E2FF', transition: 'opacity 0.5s ease', fontFamily: 'var(--font-inter, sans-serif)', letterSpacing: '-0.01em' }}>Sending Message...</h2>
      </div>
    );
  }

  if (success) {
    return (
      <div className="card-glass" style={{ padding: '60px 40px', textAlign: 'center', display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '24px', backgroundColor: '#112240', border: '1px solid #233554', borderRadius: '8px', boxShadow: '0 10px 30px -10px rgba(0,0,0,0.5)' }}>
        <div style={{ backgroundColor: 'rgba(0, 229, 255, 0.1)', color: '#00E5FF', padding: '20px', borderRadius: '50%' }}>
          <CheckCircle2 className="h-12 w-12" />
        </div>
        <h2 style={{ fontSize: '24px', fontWeight: 600, color: '#D9E2FF' }}>
          {activeTab === 'contact' ? 'Message Sent.' : 'Audit in Progress.'}
        </h2>
        <p style={{ color: '#8892B0', lineHeight: 1.6 }}>
          {activeTab === 'contact' 
            ? 'Thank you for reaching out. We will get back to you shortly.' 
            : 'Your GEO audit is running. Check your inbox in 5 minutes.'}
        </p>
        <Button variant="secondary" onClick={() => { setSuccess(false); setOtpMode(false); form.reset(); void loadCaptcha(); }} style={{ backgroundColor: '#1B4FDE', color: '#FFF', border: 'none' }}>
          {activeTab === 'contact' ? 'Send another message' : 'Run another'}
        </Button>
      </div>
    );
  }

  return (
    <div className="card-glass" style={{ 
      padding: '0', 
      overflow: 'hidden', 
      border: '1px solid #233554', 
      borderRadius: '8px',
      backgroundColor: '#112240', 
      color: '#D9E2FF',
      width: '100%',
      boxShadow: '0 10px 30px -10px rgba(0,0,0,0.5)'
    }}>
      <Tabs value={activeTab} onValueChange={(val) => { setActiveTab(val); setOtpMode(false); }} className="w-full">
        <div style={{ padding: '32px 40px', borderBottom: '1px solid #233554', backgroundColor: '#0A192F' }}>
          <TabsList className="grid w-full grid-cols-2 mb-6" style={{ backgroundColor: '#07122A', borderRadius: '4px', padding: '4px', border: '1px solid #233554' }}>
            <TabsTrigger value="free" style={{ borderRadius: '4px', fontSize: '13px', fontWeight: 500, color: activeTab === 'free' ? '#00E5FF' : '#8892B0', backgroundColor: activeTab === 'free' ? '#112240' : 'transparent' }}>Quick Free Snapshot</TabsTrigger>
            <TabsTrigger value="contact" style={{ borderRadius: '4px', fontSize: '13px', fontWeight: 500, color: activeTab === 'contact' ? '#00E5FF' : '#8892B0', backgroundColor: activeTab === 'contact' ? '#112240' : 'transparent' }}>Contact Us</TabsTrigger>
          </TabsList>
          
          <div style={{ display: 'inline-flex', alignItems: 'center', backgroundColor: 'rgba(0, 229, 255, 0.1)', color: '#00E5FF', padding: '4px 8px', borderRadius: '4px', fontSize: '12px', fontWeight: 600, letterSpacing: '0.05em', fontFamily: 'var(--font-mono, monospace)', marginBottom: '16px' }}>
            DIAGNOSTIC INTAKE
          </div>
          <h2 style={{ fontSize: '24px', fontWeight: 600, color: '#D9E2FF', margin: '0 0 8px 0', letterSpacing: '-0.01em' }}>
            {activeTab === 'free' ? 'GEO Score Snapshot.' : 'Get in touch.'}
          </h2>
          <p style={{ color: '#8892B0', fontSize: '14px', opacity: 0.9 }}>
            {activeTab === 'free' ? 'Get your baseline visibility score in 5 mins.' : 'Tell us about your needs and we will get back to you.'}
          </p>
        </div>
        
        <CardContent style={{ padding: '40px' }}>
          <form className="grid gap-4" onSubmit={form.handleSubmit((v) => startTransition(() => void submit(activeTab, v)))}>
            
            {/* Standard Form Inputs (Hidden if in OTP mode for Free) */}
            <div style={{ display: otpMode && activeTab === 'free' ? 'none' : 'block' }}>
              <div className="grid grid-cols-2 gap-4 mb-4">
                <div className="grid gap-2">
                  <Label htmlFor="name" style={labelStyle}>Your Name</Label>
                  <Input id="name" placeholder="John Doe" {...form.register("name")} style={inputStyle} />
                  {form.formState.errors.name && <p className="text-xs text-red-400">{form.formState.errors.name.message}</p>}
                </div>
                <div className="grid gap-2">
                  <Label htmlFor="email" style={labelStyle}>Business Email</Label>
                  <Input id="email" type="email" placeholder="john@company.com" {...form.register("email")} style={inputStyle} />
                  {form.formState.errors.email && <p className="text-xs text-red-400">{form.formState.errors.email.message}</p>}
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4 mb-4">
                <div className="grid gap-2">
                  <Label htmlFor="company" style={labelStyle}>Company</Label>
                  <Input id="company" placeholder="Acme Inc" {...form.register("company")} style={inputStyle} />
                  {form.formState.errors.company && <p className="text-xs text-red-400">{form.formState.errors.company.message}</p>}
                </div>
                <div className="grid gap-2">
                  <Label htmlFor="website" style={labelStyle}>Website URL</Label>
                  <Input id="website" placeholder="https://acme.inc" {...form.register("website")} style={inputStyle} />
                  {form.formState.errors.website && <p className="text-xs text-red-400">{form.formState.errors.website.message}</p>}
                </div>
              </div>

              <div className="grid gap-2 mb-4">
                <Label htmlFor="industry" style={labelStyle}>Industry</Label>
                <Input id="industry" placeholder="SaaS, Hospitality, Fintech..." {...form.register("industry")} style={inputStyle} />
                {form.formState.errors.industry && <p className="text-xs text-red-400">{form.formState.errors.industry.message}</p>}
              </div>

              <div className="grid gap-2 mb-4">
                {activeTab === 'free' ? (
                  <>
                    <Label style={labelStyle}>Target Audit Questions (Choose Top 3)</Label>
                    <div className="flex flex-col gap-3">
                      <select 
                        {...form.register("query1")} 
                        style={{ ...inputStyle, padding: '12px', fontSize: '14px', width: '100%', cursor: 'pointer' }}
                      >
                        <option value="" disabled>Question 1 (Required) — Pick what to audit...</option>
                        {queryOptions.map(q => <option key={q} value={q}>{q}</option>)}
                      </select>

                      <select 
                        {...form.register("query2")} 
                        style={{ ...inputStyle, padding: '12px', fontSize: '14px', width: '100%', cursor: 'pointer' }}
                      >
                        <option value="">Question 2 (Optional) — Pick another...</option>
                        {queryOptions.map(q => <option key={q} value={q}>{q}</option>)}
                      </select>

                      <select 
                        {...form.register("query3")} 
                        style={{ ...inputStyle, padding: '12px', fontSize: '14px', width: '100%', cursor: 'pointer' }}
                      >
                        <option value="">Question 3 (Optional) — Pick another...</option>
                        {queryOptions.map(q => <option key={q} value={q}>{q}</option>)}
                      </select>
                    </div>
                  </>
                ) : (
                  <>
                    <Label htmlFor="message" style={labelStyle}>Message / Queries</Label>
                    <textarea 
                      id="message" 
                      placeholder="How can we help you?" 
                      {...form.register("message")} 
                      style={{ ...inputStyle, padding: '12px', minHeight: '100px', width: '100%', resize: 'vertical' }} 
                    />
                  </>
                )}
              </div>

              <div style={{ padding: '16px', borderRadius: '4px', border: '1px solid #233554', backgroundColor: '#07122A', marginTop: '8px' }}>
                <div className="flex items-center gap-3 mb-2">
                  <ShieldEllipsis className="h-4 w-4 text-cyan-400" />
                  <span style={{ fontSize: '12px', fontWeight: 600, letterSpacing: '0.05em', color: '#8892B0', fontFamily: 'var(--font-mono, monospace)', textTransform: 'uppercase' }}>Security Check</span>
                </div>
                <div className="flex items-center justify-between gap-4">
                  <span className="text-sm font-medium" style={{ color: '#D9E2FF' }}>{captcha?.question || "Loading..."}</span>
                  <Input placeholder="Solve" {...form.register("captchaAnswer")} style={{ ...inputStyle, width: '80px', textAlign: 'center' }} />
                </div>
                {form.formState.errors.captchaAnswer && <p className="text-xs text-red-400 mt-1">{form.formState.errors.captchaAnswer.message}</p>}
              </div>
            </div>

            {/* OTP Verification UI */}
            {otpMode && activeTab === 'free' && (
              <div style={{ padding: '32px', borderRadius: '8px', border: '1px solid #233554', backgroundColor: '#07122A', textAlign: 'center' }}>
                <LockKeyhole className="h-10 w-10 text-cyan-400 mx-auto mb-4" />
                <h3 className="text-lg font-bold mb-2 text-[#D9E2FF]">Verify Your Email</h3>
                <p className="text-sm text-[#8892B0] mb-6">Enter the 6-digit code sent to {form.getValues("email")}</p>
                <Input 
                  value={otpValue}
                  onChange={(e) => setOtpValue(e.target.value)}
                  placeholder="000000"
                  className="text-center text-xl tracking-[0.5em] font-mono h-14"
                  maxLength={6}
                  style={{ ...inputStyle, letterSpacing: '0.5em' }}
                />
              </div>
            )}

            <Button type="submit" disabled={isPending || otpPending || isAnalyzing} className="w-full mt-4" style={{ borderRadius: '4px', padding: '16px', fontWeight: 600, backgroundColor: '#00E5FF', color: '#0A192F', border: 'none', transition: 'background-color 0.2s ease' }}>
              {(isPending || otpPending || isAnalyzing) ? <Loader2 className="h-4 w-4 animate-spin mr-2" /> : null}
              {
                activeTab === 'contact' 
                ? 'Send Message' 
                : otpMode 
                  ? 'Verify & Run Audit'
                  : 'Run Free Analysis'
              }
            </Button>
            {message && <p className="text-sm text-center font-medium mt-2" style={{ color: otpMode ? '#D9E2FF' : '#ffb4ab' }}>{message}</p>}
            
            {otpMode && !isPending && activeTab === 'free' && (
              <p className="text-xs text-center mt-2 cursor-pointer hover:underline" style={{ color: '#00E5FF' }} onClick={() => setOtpMode(false)}>
                Change details or resend code
              </p>
            )}
          </form>
        </CardContent>
      </Tabs>
    </div>
  );
}
