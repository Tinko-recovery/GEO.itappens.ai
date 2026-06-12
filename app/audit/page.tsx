"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { TerminalSquare, CheckCircle2, ServerCog, ArrowRight } from "lucide-react";

import NavBar from "@/components/NavBar";
import SiteFooter from "@/components/SiteFooter";

const features = [
  "Crawl: Analyze existing citation signals & knowledge graphs.",
  "Benchmark: Measure against ChatGPT, Claude, and Perplexity.",
  "Optimize: Generate a technical roadmap to bridge the semantic gap.",
];

export default function AuditPage() {
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [email, setEmail] = useState("");

  const router = useRouter();

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setIsSubmitting(true);
    
    const formData = new FormData(e.currentTarget);
    const submittedEmail = formData.get("email") as string;
    const siteUrl = formData.get("website") as string;
    const business = formData.get("business") as string;
    
    try {
      const res = await fetch("/api/audit/free", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          siteUrl,
          email: submittedEmail,
          targetKeywords: [business],
        })
      });

      if (!res.ok) {
        const errorData = await res.json().catch(() => null);
        alert(errorData?.error || "An error occurred submitting your audit.");
        setIsSubmitting(false);
        return;
      }

      setEmail(submittedEmail);
      setIsSubmitted(true);
    } catch (err) {
      alert("Network error. Please try again.");
      setIsSubmitting(false);
    }
  };

  return (
    <div className="flex flex-col min-h-screen font-sans text-brand-text bg-brand-bg">
      <NavBar />
      
      <main className="flex-grow pt-24">
        {/* Header Hero Section */}
        <section className="py-20 md:py-32 bg-brand-bg">
          <div className="container mx-auto px-4 grid grid-cols-1 md:grid-cols-2 gap-12 lg:gap-20 items-center">
            <div className="flex flex-col">
              <div className="flex items-center gap-2 mb-6">
                <TerminalSquare className="h-5 w-5 text-brand-primary" />
                <span className="text-sm font-bold text-brand-primary uppercase tracking-wider">
                  Enterprise GEO Intelligence
                </span>
              </div>
              <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold text-brand-text mb-8 leading-tight">
                Master the <br />
                <span className="text-brand-primary">Generative Layer.</span>
              </h1>
              <p className="text-xl text-brand-text-muted mb-10 max-w-xl leading-relaxed">
                Answer Engines have replaced search. Our diagnostic engine maps exactly how ChatGPT, Claude, and Perplexity perceive your brand, revealing the precise technical and semantic gaps costing you pipeline.
              </p>
              <div className="flex flex-col gap-4">
                {features.map((item) => (
                  <div key={item} className="flex items-start gap-3 text-[15px] font-medium text-brand-text">
                    <CheckCircle2 className="h-5 w-5 text-brand-primary shrink-0 mt-0.5" />
                    <span className="leading-relaxed">{item}</span>
                  </div>
                ))}
              </div>
            </div>
            
            {/* Simple Audit Form */}
            <div className="w-full max-w-lg mx-auto md:ml-auto">
              <div className="bg-white border border-brand-border rounded-2xl p-8 shadow-xl">
                {!isSubmitted ? (
                  <>
                    <h2 className="text-2xl font-bold text-brand-text mb-2">Get Your Free Audit</h2>
                    <p className="text-brand-text-muted mb-8 text-sm">Enter your details and we will email you the complete GEO diagnostic report.</p>
                    
                    <form onSubmit={handleSubmit} className="flex flex-col gap-5">
                      <div className="flex flex-col gap-2">
                        <label htmlFor="website" className="text-sm font-semibold text-brand-text">Your Website URL <span className="text-red-500">*</span></label>
                        <input 
                          type="text" 
                          id="website" 
                          name="website" 
                          required 
                          placeholder="yourwebsite.com" 
                          className="w-full bg-brand-bg border border-brand-border px-4 py-3 rounded-lg text-brand-text focus:outline-none focus:border-brand-primary focus:ring-1 focus:ring-brand-primary"
                        />
                      </div>
                      
                      <div className="flex flex-col gap-2">
                        <label htmlFor="email" className="text-sm font-semibold text-brand-text">Email Address <span className="text-red-500">*</span></label>
                        <input 
                          type="email" 
                          id="email" 
                          name="email" 
                          required 
                          placeholder="you@company.com" 
                          className="w-full bg-brand-bg border border-brand-border px-4 py-3 rounded-lg text-brand-text focus:outline-none focus:border-brand-primary focus:ring-1 focus:ring-brand-primary"
                        />
                      </div>

                      <div className="flex flex-col gap-2">
                        <label htmlFor="company" className="text-sm font-semibold text-brand-text">Company Name <span className="text-red-500">*</span></label>
                        <input 
                          type="text" 
                          id="company" 
                          name="company" 
                          required 
                          placeholder="Acme Inc." 
                          className="w-full bg-brand-bg border border-brand-border px-4 py-3 rounded-lg text-brand-text focus:outline-none focus:border-brand-primary focus:ring-1 focus:ring-brand-primary"
                        />
                      </div>

                      <div className="flex flex-col gap-2">
                        <label htmlFor="business" className="text-sm font-semibold text-brand-text">What does your business do? <span className="text-red-500">*</span></label>
                        <input 
                          type="text" 
                          id="business" 
                          name="business" 
                          required 
                          placeholder="e.g., project management software" 
                          className="w-full bg-brand-bg border border-brand-border px-4 py-3 rounded-lg text-brand-text focus:outline-none focus:border-brand-primary focus:ring-1 focus:ring-brand-primary"
                        />
                      </div>

                      <button 
                        type="submit" 
                        disabled={isSubmitting}
                        className="w-full bg-brand-primary hover:bg-brand-primary-hover text-white font-bold py-4 rounded-xl mt-4 transition-colors disabled:opacity-70 flex items-center justify-center gap-2"
                      >
                        {isSubmitting ? (
                          <>
                            <svg className="animate-spin h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                              <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                              <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                            </svg>
                            Processing...
                          </>
                        ) : (
                          "Get My Free Audit"
                        )}
                      </button>
                    </form>
                  </>
                ) : (
                  <div className="flex flex-col items-center justify-center text-center py-10">
                    <div className="w-16 h-16 bg-green-100 text-green-600 rounded-full flex items-center justify-center mb-6">
                      <CheckCircle2 className="w-8 h-8" />
                    </div>
                    <h3 className="text-2xl font-bold text-brand-text mb-4">Audit Request Received!</h3>
                    <p className="text-brand-text-muted leading-relaxed">
                      We are running your GEO diagnostic audit now. We will send the full report directly to <strong>{email}</strong> once it's complete.
                    </p>
                    <button 
                      onClick={() => setIsSubmitted(false)}
                      className="mt-8 text-sm font-semibold text-brand-primary hover:underline"
                    >
                      Submit another domain
                    </button>
                  </div>
                )}
              </div>
            </div>
          </div>
        </section>

        {/* CTA Section */}
        <section className="py-24 bg-brand-bg-muted border-t border-brand-border">
          <div className="container mx-auto px-4 text-center">
            <div className="bg-white rounded-3xl p-12 max-w-4xl mx-auto shadow-sm border border-brand-border flex flex-col items-center gap-6">
              <div className="flex items-center gap-2">
                <ServerCog className="h-5 w-5 text-brand-primary" />
                <span className="text-sm font-bold text-brand-primary uppercase tracking-wider">
                  Direct Implementation
                </span>
              </div>
              <h2 className="text-3xl md:text-4xl font-bold text-brand-text">Execute the GEO Blueprint.</h2>
              <p className="text-lg text-brand-text-muted max-w-2xl">
                Once you have your audit, our engineering team can map out the 90-day technical signals and entity roadmap required for total AI dominance.
              </p>
              <a href="mailto:hello@itappens.ai" className="inline-flex items-center justify-center gap-2 bg-brand-primary hover:bg-brand-primary-hover text-white px-8 py-4 rounded-xl font-bold text-lg transition-colors mt-4">
                Get in touch.
                <ArrowRight className="h-5 w-5" />
              </a>
            </div>
          </div>
        </section>
      </main>
      
      <SiteFooter />
    </div>
  );
}
