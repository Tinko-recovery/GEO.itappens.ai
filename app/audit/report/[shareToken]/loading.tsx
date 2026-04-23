export default function AuditReportLoading() {
  return (
    <div className="min-h-screen bg-audit-grid">
      <div className="container mx-auto max-w-7xl space-y-8 px-6 py-16">
        <div className="animate-pulse space-y-4">
          <div className="h-6 w-48 rounded-full bg-slate-200" />
          <div className="h-14 max-w-4xl rounded-3xl bg-slate-200" />
          <div className="grid gap-4 md:grid-cols-4">
            {Array.from({ length: 4 }).map((_, index) => (
              <div key={index} className="h-32 rounded-[28px] bg-white" />
            ))}
          </div>
          <div className="h-[720px] rounded-[28px] bg-white" />
        </div>
      </div>
    </div>
  );
}
