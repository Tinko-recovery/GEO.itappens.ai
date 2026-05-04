import { AuditPlan, AuditStatus, PaymentStatus } from "@prisma/client";

import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { prisma } from "@/lib/db";
import { formatInr } from "@/lib/utils";

function badgeForStatus(status: AuditStatus) {
  if (status === AuditStatus.COMPLETED) return "success" as const;
  if (status === AuditStatus.FAILED) return "danger" as const;
  if (status === AuditStatus.RUNNING) return "warning" as const;
  return "default" as const;
}

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

export default async function AdminAuditsPage() {
  const [audits, summary] = await Promise.all([
    prisma.audit.findMany({
      orderBy: { createdAt: "desc" },
      take: 50,
    }),
    prisma.audit.groupBy({
      by: ["status"],
      _count: { _all: true },
    }),
  ]);

  return (
    <div className="page-shell" style={{ backgroundColor: 'var(--bg-muted)', minHeight: '100vh' }}>
      <main className="container" style={{ padding: '80px 0' }}>
        <header style={{ marginBottom: '64px' }}>
          <span className="overline" style={{ color: 'var(--accent)' }}>System Admin</span>
          <h1 className="headline-lg" style={{ marginTop: '16px' }}>Audit Leads Dashboard</h1>
        </header>

        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))', gap: '24px', marginBottom: '48px' }}>
          {summary.map((item) => (
            <div key={item.status} className="card-bento" style={{ padding: '32px', backgroundColor: 'var(--surface)', border: '1px solid var(--border)', borderRadius: '24px' }}>
              <p className="overline" style={{ fontSize: '10px', color: 'var(--text-muted)' }}>{item.status}</p>
              <div style={{ fontSize: '48px', fontWeight: 900, letterSpacing: '-0.04em', color: 'var(--text)' }}>{item._count._all}</div>
            </div>
          ))}
        </div>

        <div className="card-bento" style={{ padding: '0', backgroundColor: 'var(--surface)', border: '1px solid var(--border)', borderRadius: '24px', overflow: 'hidden' }}>
          <div style={{ padding: '24px 32px', borderBottom: '1px solid var(--border)' }}>
            <h2 className="headline-sm" style={{ fontSize: '18px' }}>Latest Leads & Reports</h2>
          </div>
          <div style={{ overflowX: 'auto' }}>
            <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: '13px' }}>
              <thead>
                <tr style={{ textAlign: 'left', color: 'var(--text-muted)', borderBottom: '1px solid var(--border)' }}>
                  <th style={{ padding: '16px 32px', fontWeight: 600 }}>Created</th>
                  <th style={{ padding: '16px 32px', fontWeight: 600 }}>Website</th>
                  <th style={{ padding: '16px 32px', fontWeight: 600 }}>Email</th>
                  <th style={{ padding: '16px 32px', fontWeight: 600 }}>Plan</th>
                  <th style={{ padding: '16px 32px', fontWeight: 600 }}>Amount</th>
                  <th style={{ padding: '16px 32px', fontWeight: 600 }}>Status</th>
                  <th style={{ padding: '16px 32px', fontWeight: 600 }}>Report</th>
                </tr>
              </thead>
              <tbody>
                {audits.map((audit) => (
                  <tr key={audit.id} style={{ borderBottom: '1px solid var(--border-soft)' }}>
                    <td style={{ padding: '16px 32px', whiteSpace: 'nowrap' }}>{audit.createdAt.toLocaleDateString("en-IN")}</td>
                    <td style={{ padding: '16px 32px', fontWeight: 600, color: 'var(--text)' }}>{audit.siteUrl}</td>
                    <td style={{ padding: '16px 32px', color: 'var(--text-dim)' }}>{audit.email}</td>
                    <td style={{ padding: '16px 32px' }}>
                      <span className="overline" style={{ fontSize: '9px', padding: '4px 8px', backgroundColor: 'var(--accent-soft)', borderRadius: '4px' }}>
                        {audit.plan === AuditPlan.FREE ? "Free" : audit.plan}
                      </span>
                    </td>
                    <td style={{ padding: '16px 32px' }}>{audit.amount ? formatInr(audit.amount) : "—"}</td>
                    <td style={{ padding: '16px 32px' }}>
                      <span style={{ fontSize: '11px', fontWeight: 700, color: audit.status === AuditStatus.COMPLETED ? 'var(--accent)' : 'var(--text-muted)' }}>
                        {audit.status}
                      </span>
                    </td>
                    <td style={{ padding: '16px 32px' }}>
                      <a href={`/audit/report/${audit.shareToken}`} className="btn-secondary" style={{ padding: '6px 16px', fontSize: '11px', minWidth: 'auto' }}>
                        View
                      </a>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </main>
    </div>
  );
}
