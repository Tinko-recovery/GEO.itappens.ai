"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue
} from "@/components/ui/select";
import NavBar from "@/components/NavBar";

export default function AuditPage() {
  const [formData, setFormData] = useState({
    domain: "",
    email: "",
    company_name: "",
    user_name: "",
    phone: "",
    user_role: "",
    vertical: ""
  });

  const [isLoading, setIsLoading] = useState(false);
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [error, setError] = useState("");

  const handleChange = (field: string, value: string) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
    setError("");
  };

  const validateForm = () => {
    if (!formData.domain || !formData.email) {
      setError("Domain and email are required");
      return false;
    }
    if (!formData.domain.includes(".")) {
      setError("Enter a valid domain (e.g., example.com)");
      return false;
    }
    if (!formData.email.includes("@")) {
      setError("Enter a valid email");
      return false;
    }
    return true;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!validateForm()) return;

    setIsLoading(true);
    try {
      const response = await fetch("/api/audit/submit", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData)
      });

      if (!response.ok) {
        const data = await response.json();
        setError(data.error || "Something went wrong");
        setIsLoading(false);
        return;
      }

      setIsSubmitted(true);
    } catch (err) {
      setError("Network error. Please try again.");
      setIsLoading(false);
    }
  };

  if (isSubmitted) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-slate-50 to-slate-100 p-4">
        <div className="bg-white rounded-lg shadow-lg p-8 max-w-md w-full text-center">
          <div className="w-16 h-16 bg-green-500 rounded-full flex items-center justify-center mx-auto mb-6">
            <svg className="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
            </svg>
          </div>
          <h2 className="text-2xl font-bold text-gray-900 mb-2">Audit Submitted!</h2>
          <p className="text-gray-600 mb-4">
            Check your email at <strong>{formData.email}</strong> in 5 minutes for your audit.
          </p>
          <p className="text-sm text-gray-500 mb-6">
            You'll receive: Technical SEO analysis, On-page gaps, AEO visibility score, and 90-day action plan.
          </p>
          <Button
            onClick={() => (window.location.href = "/")}
            className="w-full"
          >
            Back to Home
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100">
      <NavBar />

      {/* Hero Section */}
      <div className="max-w-7xl mx-auto px-4 pt-32 pb-20">
        <div className="text-center mb-12">
          <h1 className="text-5xl font-bold text-gray-900 mb-4">
            See Why ChatGPT Isn't Citing Your Website
          </h1>
          <p className="text-xl text-gray-600 max-w-2xl mx-auto">
            Get your free AEO audit. Discover your AI visibility gaps in 5 minutes.
            No credit card required.
          </p>
        </div>

        {/* Form Container */}
        <div className="max-w-2xl mx-auto">
          <div className="bg-white rounded-2xl shadow-xl p-8 md:p-12">
            <form onSubmit={handleSubmit} className="space-y-6">
              {error && (
                <div className="p-4 bg-red-50 border border-red-200 rounded-lg text-red-700 text-sm">
                  {error}
                </div>
              )}

              {/* Domain */}
              <div>
                <label className="block text-sm font-semibold text-gray-900 mb-2">
                  Website URL *
                </label>
                <Input
                  type="text"
                  placeholder="https://example.com"
                  value={formData.domain}
                  onChange={(e) => handleChange("domain", e.target.value)}
                  className="text-base"
                />
                <p className="text-xs text-gray-500 mt-1">
                  Include your full URL (e.g., example.com)
                </p>
              </div>

              {/* Email */}
              <div>
                <label className="block text-sm font-semibold text-gray-900 mb-2">
                  Business Email *
                </label>
                <Input
                  type="email"
                  placeholder="your-email@company.com"
                  value={formData.email}
                  onChange={(e) => handleChange("email", e.target.value)}
                  className="text-base"
                />
                <p className="text-xs text-gray-500 mt-1">
                  We'll send your audit here (no spam)
                </p>
              </div>

              {/* Company Name */}
              <div>
                <label className="block text-sm font-semibold text-gray-900 mb-2">
                  Company Name (optional)
                </label>
                <Input
                  type="text"
                  placeholder="Company Name"
                  value={formData.company_name}
                  onChange={(e) => handleChange("company_name", e.target.value)}
                  className="text-base"
                />
              </div>

              {/* Name */}
              <div>
                <label className="block text-sm font-semibold text-gray-900 mb-2">
                  Your Name (optional)
                </label>
                <Input
                  type="text"
                  placeholder="John Doe"
                  value={formData.user_name}
                  onChange={(e) => handleChange("user_name", e.target.value)}
                  className="text-base"
                />
              </div>

              {/* Role */}
              <div>
                <label className="block text-sm font-semibold text-gray-900 mb-2">
                  Your Role (optional)
                </label>
                <Select value={formData.user_role} onValueChange={(value) => handleChange("user_role", value)}>
                  <SelectTrigger className="text-base">
                    <SelectValue placeholder="Select your role" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="CMO">CMO / Marketing Director</SelectItem>
                    <SelectItem value="VP Marketing">VP Marketing</SelectItem>
                    <SelectItem value="Head of Demand Gen">Head of Demand Gen</SelectItem>
                    <SelectItem value="Founder/CEO">Founder / CEO</SelectItem>
                    <SelectItem value="COO">COO / Operations</SelectItem>
                    <SelectItem value="Other">Other</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              {/* Vertical */}
              <div>
                <label className="block text-sm font-semibold text-gray-900 mb-2">
                  Industry (optional)
                </label>
                <Select value={formData.vertical} onValueChange={(value) => handleChange("vertical", value)}>
                  <SelectTrigger className="text-base">
                    <SelectValue placeholder="Select your industry" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="B2B SaaS">B2B SaaS / Software</SelectItem>
                    <SelectItem value="Healthcare">Healthcare</SelectItem>
                    <SelectItem value="FinTech">Financial Services / FinTech</SelectItem>
                    <SelectItem value="E-commerce">E-commerce / Retail</SelectItem>
                    <SelectItem value="Professional Services">Professional Services</SelectItem>
                    <SelectItem value="Other">Other</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              {/* Submit Button */}
              <Button
                type="submit"
                disabled={isLoading}
                className="w-full h-12 text-base font-semibold"
              >
                {isLoading ? (
                  <>
                    <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                    </svg>
                    GENERATING AUDIT...
                  </>
                ) : (
                  "GET YOUR FREE AUDIT NOW"
                )}
              </Button>
            </form>

            {/* Social Proof */}
            <div className="mt-12 pt-8 border-t border-gray-200 text-center">
              <p className="text-sm text-gray-600 mb-4">
                ✓ 400+ audits completed | 2,500+ issues identified
              </p>
              <p className="text-xs text-gray-500">
                Join leading brands optimizing their AI search visibility
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
