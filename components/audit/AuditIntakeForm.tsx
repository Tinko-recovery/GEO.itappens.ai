"use client";

import { useEffect, useState, useTransition, useRef } from "react";
import { useRouter } from "next/navigation";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { Loader2, ShieldEllipsis, CheckCircle2, LockKeyhole } from "lucide-react";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

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
  query1: z.string().min(2, "Please select at least one audit question."),
  query2: z.string().optional(),
  query3: z.string().optional(),
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
    if (isAnalyzing) {
      interval = setInterval(() => {
        setLoadingMsgIdx((prev) => (prev + 1) % loadingMessages.length);
      }, 3000);
    } else {
      setLoadingMsgIdx(0);
    }
    return () => clearInterval(interval);
  }, [isAnalyzing]);

  const form = useForm<FormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      name: "",
      email: "",
      company: "",
      website: "",
      industry: "",
      query1: "",
      query2: "",
      query3: "",
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

  async function submit(mode: "free" | "paid", values: FormValues) {
    if (!captcha) {
      setMessage("Captcha failed to load. Refresh and try again.");
      return;
    }

    setMessage(null);

    // If it's free and we haven't requested OTP yet, request it.
    if (mode === "free" && !otpMode) {
      await handleSendOTP(values);
      return;
    }

    // If it's free and we are in OTP mode, verify OTP first.
    if (mode === "free" && otpMode) {
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

    // PAID FLOW 
    const payload = {
      siteUrl: values.website,
      email: values.email,
      targetKeywords: [values.query1, values.query2, values.query3].filter(Boolean),
      captchaToken: captcha.token,
      captchaAnswer: values.captchaAnswer,
      plan: selectedPlan,
    };

    const response = await fetch("/api/audit/checkout", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(payload),
    });

    let data: any = null;
    try {
      data = await response.json();
    } catch (e) {}

    if (!response.ok) {
      setMessage(data?.error || "Payment session failed.");
      return;
    }

    if (data.provider === "razorpay" && data.order) {
      const RazorpayCtor = (window as any).Razorpay;
      const razorpay = new RazorpayCtor({
        key: data.keyId,
        amount: data.order.amount,
        currency: data.order.currency,
        name: "itappens.ai",
        order_id: data.order.id,
        handler: async (payment: any) => {
          const verifyResponse = await fetch("/api/payments/razorpay/confirm", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({
              auditId: data.auditId,
              orderId: payment.razorpay_order_id,
              paymentId: payment.razorpay_payment_id,
              signature: payment.razorpay_signature,
            }),
          });
          const verified = await verifyResponse.json();
          if (verifyResponse.ok) {
            router.push(`/audit/success?token=${verified.shareToken}`);
          } else {
            setMessage(verified.error || "Payment verification failed.");
          }
        },
        prefill: { email: values.email },
        theme: { color: "#4f46e5" },
      });
      razorpay.open();
    }
  }

  if (isAnalyzing) {
    return (
      <div className="card-glass" style={{ padding: '60px 40px', textAlign: 'center', display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '24px', backgroundColor: '#ffffff', border: '1px solid rgba(0,0,0,0.1)', borderRadius: '24px', boxShadow: '0 20px 40px rgba(0,0,0,0.1)' }}>
        <div style={{ backgroundColor: 'rgba(79, 70, 229, 0.1)', color: '#4f46e5', padding: '24px', borderRadius: '50%' }}>
          <Loader2 className="h-16 w-16 animate-spin" />
        </div>
        <h2 style={{ fontSize: '24px', fontWeight: 800, color: '#0F172A', transition: 'opacity 0.5s ease' }}>{loadingMessages[loadingMsgIdx]}</h2>
        <p style={{ color: '#64748b', lineHeight: 1.6, fontSize: '15px' }}>Please do not close this window.<br/>Your GEO audit is being generated in real-time.</p>
      </div>
    );
  }

  if (success) {
    return (
      <div className="card-glass" style={{ padding: '60px 40px', textAlign: 'center', display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '24px' }}>
        <div style={{ backgroundColor: 'rgba(57, 181, 73, 0.1)', color: 'var(--brand-green)', padding: '20px', borderRadius: '50%' }}>
          <CheckCircle2 className="h-12 w-12" />
        </div>
        <h2 style={{ fontSize: '24px', fontWeight: 800 }}>Audit in Progress.</h2>
        <p style={{ color: 'var(--text-dim)', lineHeight: 1.6 }}>Your GEO audit is running. Check your inbox in 5 minutes.</p>
        <Button variant="secondary" onClick={() => { setSuccess(false); setOtpMode(false); }}>Run another</Button>
      </div>
    );
  }

  return (
    <div className="card-glass" style={{ 
      padding: '0', 
      overflow: 'hidden', 
      border: '1px solid rgba(255,255,255,0.15)', 
      borderRadius: '24px',
      backgroundColor: '#ffffff', 
      color: '#0F172A',
      width: '100%',
      boxShadow: '0 20px 40px rgba(0,0,0,0.3)'
    }}>
      <Tabs value={activeTab} onValueChange={(val) => { setActiveTab(val); setOtpMode(false); }} className="w-full">
        <div style={{ padding: '32px 40px', borderBottom: '1px solid #E2E8F0', backgroundColor: '#F8FAFF' }}>
          <TabsList className="grid w-full grid-cols-2 mb-6" style={{ backgroundColor: '#E2E8F0', borderRadius: '12px', padding: '4px' }}>
            <TabsTrigger value="free" style={{ borderRadius: '8px', fontSize: '13px', fontWeight: 600, color: '#0F172A' }}>Quick Free Snapshot</TabsTrigger>
            <TabsTrigger value="paid" style={{ borderRadius: '8px', fontSize: '13px', fontWeight: 600, color: '#0F172A' }}>Deep Paid Audit</TabsTrigger>
          </TabsList>
          
          <Badge variant="accent" className="mb-4">Diagnostic Intake</Badge>
          <h2 style={{ fontSize: '24px', fontWeight: 800, color: '#0F172A', margin: '0 0 8px 0' }}>
            {activeTab === 'free' ? 'GEO Score Snapshot.' : 'Full Entity Audit.'}
          </h2>
          <p style={{ color: '#475569', fontSize: '14px', opacity: 0.9 }}>
            {activeTab === 'free' ? 'Get your baseline visibility score in 5 mins.' : 'Deep technical and competitive landscape.'}
          </p>
        </div>
        
        <CardContent style={{ padding: '40px' }}>
          <form className="grid gap-4" onSubmit={form.handleSubmit((v) => startTransition(() => void submit(activeTab as any, v)))}>
            
            {/* Standard Form Inputs (Hidden if in OTP mode for Free) */}
            <div style={{ display: otpMode && activeTab === 'free' ? 'none' : 'block' }}>
              <div className="grid grid-cols-2 gap-4 mb-4">
                <div className="grid gap-2">
                  <Label htmlFor="name" style={{ color: '#0F172A', fontWeight: 600 }}>Your Name</Label>
                  <Input id="name" placeholder="John Doe" {...form.register("name")} style={{ backgroundColor: '#F8FAFF', color: '#0F172A', borderColor: '#E2E8F0', borderRadius: '10px' }} />
                  {form.formState.errors.name && <p className="text-xs text-red-500">{form.formState.errors.name.message}</p>}
                </div>
                <div className="grid gap-2">
                  <Label htmlFor="email" style={{ color: '#0F172A', fontWeight: 600 }}>Business Email</Label>
                  <Input id="email" type="email" placeholder="john@company.com" {...form.register("email")} style={{ backgroundColor: '#F8FAFF', color: '#0F172A', borderColor: '#E2E8F0', borderRadius: '10px' }} />
                  {form.formState.errors.email && <p className="text-xs text-red-500">{form.formState.errors.email.message}</p>}
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4 mb-4">
                <div className="grid gap-2">
                  <Label htmlFor="company" style={{ color: '#0F172A', fontWeight: 600 }}>Company</Label>
                  <Input id="company" placeholder="Acme Inc" {...form.register("company")} style={{ backgroundColor: '#F8FAFF', color: '#0F172A', borderColor: '#E2E8F0', borderRadius: '10px' }} />
                  {form.formState.errors.company && <p className="text-xs text-red-500">{form.formState.errors.company.message}</p>}
                </div>
                <div className="grid gap-2">
                  <Label htmlFor="website" style={{ color: '#0F172A', fontWeight: 600 }}>Website URL</Label>
                  <Input id="website" placeholder="https://acme.inc" {...form.register("website")} style={{ backgroundColor: '#F8FAFF', color: '#0F172A', borderColor: '#E2E8F0', borderRadius: '10px' }} />
                  {form.formState.errors.website && <p className="text-xs text-red-500">{form.formState.errors.website.message}</p>}
                </div>
              </div>

              <div className="grid gap-2 mb-4">
                <Label htmlFor="industry" style={{ color: '#0F172A', fontWeight: 600 }}>Industry</Label>
                <Input id="industry" placeholder="SaaS, Hospitality, Fintech..." {...form.register("industry")} style={{ backgroundColor: '#F8FAFF', color: '#0F172A', borderColor: '#E2E8F0', borderRadius: '10px' }} />
                {form.formState.errors.industry && <p className="text-xs text-red-500">{form.formState.errors.industry.message}</p>}
              </div>

              <div className="grid gap-2 mb-4">
                <Label style={{ color: '#0F172A', fontWeight: 600 }}>Target Audit Questions (Choose Top 3)</Label>
                <div className="flex flex-col gap-3">
                  <select 
                    {...form.register("query1")} 
                    style={{ 
                      backgroundColor: '#F8FAFF', 
                      borderRadius: '10px', 
                      padding: '12px', 
                      fontSize: '14px', 
                      color: '#0F172A', 
                      border: '1px solid #E2E8F0',
                      width: '100%',
                      cursor: 'pointer'
                    }}
                  >
                    <option value="" disabled>Question 1 (Required) — Pick what to audit...</option>
                    {queryOptions.map(q => <option key={q} value={q}>{q}</option>)}
                  </select>

                  <select 
                    {...form.register("query2")} 
                    style={{ 
                      backgroundColor: '#F8FAFF', 
                      borderRadius: '10px', 
                      padding: '12px', 
                      fontSize: '14px', 
                      color: '#0F172A', 
                      border: '1px solid #E2E8F0',
                      width: '100%',
                      cursor: 'pointer'
                    }}
                  >
                    <option value="">Question 2 (Optional) — Pick another...</option>
                    {queryOptions.map(q => <option key={q} value={q}>{q}</option>)}
                  </select>

                  <select 
                    {...form.register("query3")} 
                    style={{ 
                      backgroundColor: '#F8FAFF', 
                      borderRadius: '10px', 
                      padding: '12px', 
                      fontSize: '14px', 
                      color: '#0F172A', 
                      border: '1px solid #E2E8F0',
                      width: '100%',
                      cursor: 'pointer'
                    }}
                  >
                    <option value="">Question 3 (Optional) — Pick another...</option>
                    {queryOptions.map(q => <option key={q} value={q}>{q}</option>)}
                  </select>
                </div>
                {form.formState.errors.query1 && <p className="text-xs text-red-500">{form.formState.errors.query1.message}</p>}
              </div>

              <div style={{ padding: '16px', borderRadius: '12px', border: '1px solid #E2E8F0', backgroundColor: '#F8FAFF', marginTop: '8px' }}>
                <div className="flex items-center gap-3 mb-2">
                  <ShieldEllipsis className="h-4 w-4 text-blue-600" />
                  <span className="text-xs font-bold uppercase tracking-wider text-slate-500">Security Check</span>
                </div>
                <div className="flex items-center justify-between gap-4">
                  <span className="text-sm font-medium" style={{ color: '#0F172A' }}>{captcha?.question || "Loading..."}</span>
                  <Input placeholder="Solve" {...form.register("captchaAnswer")} style={{ width: '80px', backgroundColor: '#ffffff', color: '#0F172A', borderColor: '#E2E8F0', borderRadius: '8px' }} />
                </div>
                {form.formState.errors.captchaAnswer && <p className="text-xs text-red-500 mt-1">{form.formState.errors.captchaAnswer.message}</p>}
              </div>
            </div>

            {/* OTP Verification UI */}
            {otpMode && activeTab === 'free' && (
              <div style={{ padding: '32px', borderRadius: '16px', border: '1px solid #E2E8F0', backgroundColor: '#F8FAFF', textAlign: 'center' }}>
                <LockKeyhole className="h-10 w-10 text-indigo-600 mx-auto mb-4" />
                <h3 className="text-lg font-bold mb-2">Verify Your Email</h3>
                <p className="text-sm text-slate-500 mb-6">Enter the 6-digit code sent to {form.getValues("email")}</p>
                <Input 
                  value={otpValue}
                  onChange={(e) => setOtpValue(e.target.value)}
                  placeholder="000000"
                  className="text-center text-xl tracking-[0.5em] font-mono h-14"
                  maxLength={6}
                />
              </div>
            )}

            <Button type="submit" disabled={isPending || otpPending} variant="accent" className="w-full mt-4" style={{ borderRadius: '12px', padding: '16px', fontWeight: 600 }}>
              {(isPending || otpPending) ? <Loader2 className="h-4 w-4 animate-spin mr-2" /> : null}
              {
                activeTab === 'paid' 
                ? `Unlock ${selectedPlan.toUpperCase()} Audit` 
                : otpMode 
                  ? isPending 
                    ? loadingMessages[loadingMsgIdx]
                    : 'Verify & Run Audit'
                  : 'Run Free Analysis'
              }
            </Button>
            {message && <p className="text-sm text-center font-medium mt-2" style={{ color: otpMode ? '#0f172a' : '#ef4444' }}>{message}</p>}
            
            {otpMode && !isPending && activeTab === 'free' && (
              <p className="text-xs text-center mt-2 text-slate-500 cursor-pointer hover:underline" onClick={() => setOtpMode(false)}>
                Change details or resend code
              </p>
            )}
          </form>
        </CardContent>
      </Tabs>
    </div>
  );
}
