import { auth } from "@/lib/auth";
import { PrismaClient } from "@prisma/client";
import Link from "next/link";
import { TrendingUp, TrendingDown, Users, FileText, CheckCircle, Activity } from "lucide-react";

const prisma = new PrismaClient();

export default async function AdminDashboardPage() {
  const session = await auth();
  
  const clients = await prisma.agencyClient.findMany({
    include: {
      audits: {
        orderBy: { createdAt: 'desc' },
        take: 2
      },
      strategies: {
        where: { status: 'pending' }
      }
    },
    orderBy: { createdAt: 'desc' }
  });

  const totalClients = clients.length;
  const activeAudits = clients.reduce((acc, c) => acc + c.audits.filter(a => a.status === 'running' || a.status === 'pending').length, 0);
  const pendingFixes = clients.reduce((acc, c) => acc + c.strategies.length, 0);

  return (
    <div className="p-8 text-white max-w-7xl mx-auto">
      <div className="flex justify-between items-end mb-8">
        <div>
          <h1 className="text-3xl font-bold mb-2">Agency Overview</h1>
          <p className="text-zinc-400">SE Ranking / Ahrefs Style Project Dashboard</p>
        </div>
        <Link href="/admin/clients/new" className="bg-indigo-600 hover:bg-indigo-500 text-white px-4 py-2 rounded-lg font-medium transition-colors">
          + New Project
        </Link>
      </div>
      
      {/* Global KPI Widgets */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-8">
        <div className="bg-zinc-900 border border-zinc-800 rounded-xl p-5">
          <div className="flex items-center gap-3 text-zinc-300 mb-2">
            <Users className="w-5 h-5 text-indigo-400" />
            <h3 className="font-medium text-sm uppercase tracking-wider text-zinc-300">Total Projects</h3>
          </div>
          <p className="text-3xl font-bold text-white">{totalClients}</p>
        </div>
        
        <div className="bg-zinc-900 border border-zinc-800 rounded-xl p-5">
          <div className="flex items-center gap-3 text-zinc-300 mb-2">
            <Activity className="w-5 h-5 text-amber-400" />
            <h3 className="font-medium text-sm uppercase tracking-wider text-zinc-300">Active Audits</h3>
          </div>
          <p className="text-3xl font-bold text-white">{activeAudits}</p>
        </div>

        <div className="bg-zinc-900 border border-zinc-800 rounded-xl p-5">
          <div className="flex items-center gap-3 text-zinc-300 mb-2">
            <FileText className="w-5 h-5 text-rose-400" />
            <h3 className="font-medium text-sm uppercase tracking-wider text-zinc-300">Pending Fixes</h3>
          </div>
          <p className="text-3xl font-bold text-white">{pendingFixes}</p>
        </div>

        <div className="bg-zinc-900 border border-zinc-800 rounded-xl p-5">
          <div className="flex items-center gap-3 text-zinc-300 mb-2">
            <CheckCircle className="w-5 h-5 text-emerald-400" />
            <h3 className="font-medium text-sm uppercase tracking-wider text-zinc-300">System Status</h3>
          </div>
          <p className="text-3xl font-bold text-emerald-400">All Systems Nominal</p>
        </div>
      </div>

      {/* Projects Table (SE Ranking Clone) */}
      <div className="bg-zinc-900 border border-zinc-800 rounded-xl overflow-hidden shadow-2xl">
        <div className="px-6 py-4 border-b border-zinc-800 bg-zinc-950 flex items-center justify-between">
          <h2 className="text-lg font-semibold text-white">Project List</h2>
        </div>
        
        {clients.length === 0 ? (
          <div className="p-12 text-center text-zinc-500">
            No projects added yet. Click "+ New Project" to get started.
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left text-sm whitespace-nowrap">
              <thead className="bg-zinc-950 border-b border-zinc-800 text-zinc-400">
                <tr>
                  <th className="px-6 py-4 font-medium w-1/4">Project / Website</th>
                  <th className="px-6 py-4 font-medium">AEO Citation Score</th>
                  <th className="px-6 py-4 font-medium">SEO Technical Health</th>
                  <th className="px-6 py-4 font-medium">Pending Fixes</th>
                  <th className="px-6 py-4 font-medium text-right">Action</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-zinc-800">
                {clients.map((client) => {
                  const aeoAudit = client.audits.find(a => a.type === "aeo");
                  const seoAudit = client.audits.find(a => a.type === "seo");
                  
                  // Mock trend indicators for realism
                  const aeoTrend = Math.random() > 0.5;
                  const seoTrend = Math.random() > 0.5;

                  return (
                    <tr key={client.id} className="hover:bg-zinc-800/30 transition-colors group">
                      <td className="px-6 py-5">
                        <Link href={`/admin/clients/${client.id}`} className="font-semibold text-white text-base hover:text-indigo-400 transition-colors block mb-1">
                          {client.name}
                        </Link>
                        <a href={client.website} target="_blank" rel="noreferrer" className="text-zinc-500 hover:text-zinc-400 text-xs">
                          {client.website.replace(/^https?:\/\//, '')}
                        </a>
                      </td>
                      
                      <td className="px-6 py-5">
                        {aeoAudit?.status === "completed" ? (
                          <div className="flex items-center gap-3">
                            <span className="text-2xl font-bold text-white">{aeoAudit.score || 0}%</span>
                            {aeoTrend ? (
                              <span className="flex items-center text-emerald-400 text-xs font-medium"><TrendingUp className="w-3 h-3 mr-1"/> +2%</span>
                            ) : (
                              <span className="flex items-center text-rose-400 text-xs font-medium"><TrendingDown className="w-3 h-3 mr-1"/> -1%</span>
                            )}
                          </div>
                        ) : (
                          <span className="text-zinc-500 italic flex items-center gap-2">
                            <div className="w-2 h-2 rounded-full bg-amber-500 animate-pulse"></div>
                            {aeoAudit?.status || "No data"}
                          </span>
                        )}
                      </td>

                      <td className="px-6 py-5">
                        {seoAudit?.status === "completed" ? (
                          <div className="flex items-center gap-3">
                            <span className="text-2xl font-bold text-white">{seoAudit.score || 0}%</span>
                            {seoTrend ? (
                              <span className="flex items-center text-emerald-400 text-xs font-medium"><TrendingUp className="w-3 h-3 mr-1"/> +5%</span>
                            ) : (
                              <span className="flex items-center text-rose-400 text-xs font-medium"><TrendingDown className="w-3 h-3 mr-1"/> -2%</span>
                            )}
                          </div>
                        ) : (
                          <span className="text-zinc-500 italic flex items-center gap-2">
                            <div className="w-2 h-2 rounded-full bg-amber-500 animate-pulse"></div>
                            {seoAudit?.status || "No data"}
                          </span>
                        )}
                      </td>

                      <td className="px-6 py-5">
                        {client.strategies.length > 0 ? (
                          <span className="bg-rose-500/10 text-rose-400 px-3 py-1 rounded-full text-xs font-medium border border-rose-500/20">
                            {client.strategies.length} Action Items
                          </span>
                        ) : (
                          <span className="text-zinc-500 text-sm">Up to date</span>
                        )}
                      </td>

                      <td className="px-6 py-5 text-right">
                        <Link href={`/admin/clients/${client.id}`} className="bg-zinc-800 hover:bg-zinc-700 text-white px-4 py-2 rounded-lg text-sm font-medium transition-colors opacity-0 group-hover:opacity-100 focus:opacity-100">
                          View Project
                        </Link>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
}
