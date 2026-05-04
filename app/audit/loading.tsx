export default function AuditLoading() {
  return (
    <div className="min-h-screen bg-audit-grid">
      <div className="container mx-auto max-w-7xl px-6 py-24">
        <div className="animate-pulse space-y-6">
          <div className="h-6 w-40 rounded-full bg-slate-200" />
          <div className="h-16 max-w-3xl rounded-3xl bg-slate-200" />
          <div className="grid gap-6 lg:grid-cols-2">
            <div className="h-[560px] rounded-[32px] bg-white" />
            <div className="h-[560px] rounded-[32px] bg-white" />
          </div>
        </div>
      </div>
    </div>
  );
}
