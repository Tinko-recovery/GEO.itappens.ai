"use client";

import { Check, Sparkles } from "lucide-react";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { formatInr } from "@/lib/utils";

import { AUDIT_PRODUCTS } from "@/lib/payments/provider";
import type { AuditPlanKey } from "@/lib/audit/types";

const planFeatures: Record<Exclude<AuditPlanKey, "free">, string[]> = {
  starter: ["20-page crawl", "SERP snapshot + ideas", "Premium HTML + PDF", "Retainer rec"],
  growth: ["50-page crawl", "Competitor benchmark", "Roadmap + monetization", "Priority sequence"],
  authority: ["100-page crawl", "Deep GEO teardown", "Branded report", "Board review ready"],
};

type PricingGridProps = {
  selectedPlan: Exclude<AuditPlanKey, "free">;
  onSelect: (plan: Exclude<AuditPlanKey, "free">) => void;
};

export function PricingGrid({ selectedPlan, onSelect }: PricingGridProps) {
  return (
    <div className="grid gap-6 md:grid-cols-3">
      {Object.entries(AUDIT_PRODUCTS).map(([plan, config]) => {
        const active = selectedPlan === plan;
        const planColor = plan === "starter" ? "var(--brand-blue)" : plan === "growth" ? "var(--brand-green)" : "var(--brand-yellow)";
        
        return (
          <div 
            key={plan} 
            onClick={() => onSelect(plan as Exclude<AuditPlanKey, "free">)}
            className="card-glass"
            style={{ 
              padding: '32px', 
              display: 'flex', 
              flexDirection: 'column', 
              gap: '24px',
              cursor: 'pointer',
              transition: 'all 0.3s cubic-bezier(0.16, 1, 0.3, 1)',
              border: active ? `2px solid ${planColor}` : '1px solid var(--border)',
              transform: active ? 'scale(1.02)' : 'none',
              position: 'relative',
              minHeight: '520px' // Ensure consistent height
            }}
          >
            {active && (
              <div style={{ 
                position: 'absolute', 
                top: '12px', 
                right: '12px', 
                backgroundColor: planColor, 
                color: 'var(--bg)', 
                fontSize: '10px', 
                fontWeight: 900, 
                padding: '4px 10px', 
                borderRadius: '6px',
                textTransform: 'uppercase',
                letterSpacing: '0.05em',
                zIndex: 10
              }}>
                Selected
              </div>
            )}

            <div className="flex flex-col gap-3">
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <span className="overline" style={{ color: planColor, fontSize: '11px' }}>{plan}</span>
                {plan === "growth" && <Sparkles className="h-4 w-4" style={{ color: 'var(--brand-yellow)' }} />}
              </div>
              <h3 style={{ fontSize: '20px', fontWeight: 700, color: 'var(--text)', margin: 0 }}>{config.label}</h3>
              <p style={{ fontSize: '13px', color: 'var(--text-dim)', lineHeight: 1.5, opacity: 0.8, minHeight: '40px' }}>{config.description}</p>
            </div>

            <div style={{ padding: '16px 0', borderTop: '1px solid var(--border)', borderBottom: '1px solid var(--border)' }}>
              <div style={{ fontSize: '32px', fontWeight: 800, color: 'var(--text)', letterSpacing: '-0.02em' }}>{formatInr(config.amount)}</div>
              <p style={{ fontSize: '11px', color: 'var(--text-dim)', marginTop: '4px', opacity: 0.6 }}>One-time. Includes technical signals.</p>
            </div>

            <ul style={{ display: 'flex', flexDirection: 'column', gap: '12px', listStyle: 'none', padding: 0, margin: 0, flex: 1 }}>
              {planFeatures[plan as Exclude<AuditPlanKey, "free">].map((feature) => (
                <li key={feature} style={{ display: 'flex', alignItems: 'flex-start', gap: '10px', fontSize: '12px', color: 'var(--text-dim)' }}>
                  <Check className="h-3.5 w-3.5 shrink-0" style={{ color: 'var(--brand-green)', marginTop: '2px' }} />
                  <span style={{ lineHeight: 1.4 }}>{feature}</span>
                </li>
              ))}
            </ul>

            <Button 
              variant={active ? "accent" : "secondary"} 
              className="w-full" 
              style={{ padding: '12px', borderRadius: '10px', fontSize: '13px', fontWeight: 700, marginTop: '12px' }}
            >
              {active ? "Active Selection" : `Choose ${config.label}`}
            </Button>
          </div>
        );
      })}
    </div>
  );
}
