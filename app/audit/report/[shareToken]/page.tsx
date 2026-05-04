import { notFound } from "next/navigation";
import type { AuditReport } from "@/lib/audit/types";

import NavBar from "@/components/NavBar";
import SiteFooter from "@/components/SiteFooter";
import { ReportViewer } from "@/components/audit/ReportViewer";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { prisma } from "@/lib/db";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

export default async function AuditReportPage({ params }: { params: Promise<{ shareToken: string }> }) {
  const { shareToken } = await params;

  const audit = await prisma.audit.findUnique({
    where: { shareToken },
    select: {
      siteUrl: true,
      status: true,
      reportJson: true,
      reportHtml: true,
      createdAt: true,
    },
  });

  if (!audit) {
    notFound();
  }

  if (!audit.reportJson || !audit.reportHtml) {
    return (
      <div className="page-shell">
        <NavBar />
        <main>
          <div className="container" style={{ padding: '120px 0', display: 'flex', justifyContent: 'center' }}>
            <div className="card-bento" style={{ maxWidth: '640px', padding: '64px', backgroundColor: 'var(--surface)', border: '1px solid var(--border)', borderRadius: '32px', textAlign: 'center' }}>
              <span className="overline" style={{ color: 'var(--accent)', marginBottom: '24px', display: 'block' }}>Report Processing</span>
              <h1 className="headline-lg" style={{ marginBottom: '24px' }}>Your report is still being <br />generated.</h1>
              <p style={{ color: 'var(--text-dim)', fontSize: '16px', lineHeight: 1.6, marginBottom: '32px' }}>
                The audit for <strong>{audit.siteUrl}</strong> was initiated on {audit.createdAt.toLocaleDateString("en-IN")}. Refresh in a moment or wait for the confirmation email.
              </p>
              <a href={`/audit/report/${shareToken}`} className="btn-primary" style={{ display: 'inline-block' }}>
                Refresh report
              </a>
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
      <main>
        <header className="section" style={{ padding: '100px 0 60px', backgroundColor: 'var(--bg)' }}>
          <div className="container">
            <div style={{ display: 'flex', flexDirection: 'column', gap: '32px' }}>
              <div style={{ maxWidth: '800px' }}>
                <span className="overline">Premium Audit Report</span>
                <h1 className="headline-xl" style={{ marginTop: '24px', letterSpacing: '-0.04em' }}>
                  GEO + SEO Analysis for <br />
                  <span style={{ color: 'var(--accent)' }}>{audit.siteUrl}</span>
                </h1>
              </div>
              <div style={{ display: 'flex', gap: '16px' }}>
                <a href={`/api/audit/download/${shareToken}`} className="btn-secondary" style={{ display: 'inline-flex', alignItems: 'center', gap: '8px' }}>
                  Download PDF
                </a>
              </div>
            </div>
          </div>
        </header>

        <section className="section" style={{ padding: '40px 0 100px' }}>
          <div className="container">
            <ReportViewer report={audit.reportJson as AuditReport} html={audit.reportHtml} />
          </div>
        </section>
      </main>
      <SiteFooter />
    </div>
  );
}
