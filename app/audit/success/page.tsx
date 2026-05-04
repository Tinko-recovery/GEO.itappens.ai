import Link from "next/link";

import NavBar from "@/components/NavBar";
import SiteFooter from "@/components/SiteFooter";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";

export default async function AuditSuccessPage({ searchParams }: { searchParams: Promise<{ token?: string }> }) {
  const { token } = await searchParams;

  return (
    <div className="page-shell">
      <NavBar />
      <main>
        <div className="container" style={{ padding: '160px 0', display: 'flex', justifyContent: 'center' }}>
          <div className="card-bento" style={{ maxWidth: '640px', padding: '64px', backgroundColor: 'var(--surface)', border: '1px solid var(--border)', borderRadius: '32px', textAlign: 'center' }}>
            <span className="overline" style={{ color: 'var(--accent)', marginBottom: '24px', display: 'block' }}>Payment Received</span>
            <h1 className="headline-lg" style={{ marginBottom: '24px' }}>The deep audit is <br />now running.</h1>
            <p style={{ color: 'var(--text-dim)', fontSize: '17px', lineHeight: 1.6, marginBottom: '40px' }}>
              We’ve captured the payment and queued the full crawl, competitor analysis, and narrative generation. 
              The final report will be delivered after processing citation signals across ChatGPT, Perplexity, and Gemini.
            </p>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
              {token && (
                <a href={`/audit/report/${token}`} className="btn-primary" style={{ display: 'block', textAlign: 'center' }}>
                  Open report status
                </a>
              )}
              <a href="/audit" className="btn-secondary" style={{ display: 'block', textAlign: 'center' }}>
                Run another audit
              </a>
            </div>
          </div>
        </div>
      </main>
      <SiteFooter />
    </div>
  );
}
