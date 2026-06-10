import { PrismaClient } from "@prisma/client";
import { FileBarChart, Download, Mail } from "lucide-react";
import Link from "next/link";

export const dynamic = 'force-dynamic';

const prisma = new PrismaClient();

export default async function ReportsPage() {
  const clients = await prisma.agencyClient.findMany({
    include: {
      reports: {
        orderBy: { createdAt: 'desc' },
        take: 1
      }
    },
    orderBy: { name: 'asc' }
  });

  return (
    <div className="p-8 text-white max-w-7xl mx-auto">
      <div className="mb-8">
        <h1 className="text-3xl font-bold mb-2">Client Reports</h1>
        <p className="text-zinc-400">Generate, view, and send automated monthly performance reports.</p>
      </div>
      
      {clients.length === 0 ? (
        <div className="bg-zinc-900 border border-zinc-800 rounded-xl p-8 text-center text-zinc-500">
          No clients found. Add a client to generate reports.
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {clients.map(client => {
            const latestReport = client.reports[0];
            
            return (
              <div key={client.id} className="bg-zinc-900 border border-zinc-800 rounded-xl p-6 flex flex-col h-full">
                <div className="flex items-start justify-between mb-4">
                  <div>
                    <h3 className="font-semibold text-lg text-white mb-1">{client.name}</h3>
                    <p className="text-xs text-zinc-500">{client.website.replace(/^https?:\/\//, '')}</p>
                  </div>
                  <div className="bg-indigo-500/10 p-2 rounded-lg">
                    <FileBarChart className="w-5 h-5 text-indigo-400" />
                  </div>
                </div>
                
                <div className="flex-1">
                  {latestReport ? (
                    <div className="space-y-3">
                      <div className="text-sm">
                        <span className="text-zinc-500 block mb-1">Latest Report:</span>
                        <span className="text-zinc-300 font-medium">
                          {new Date(latestReport.createdAt).toLocaleDateString('en-US', { month: 'long', year: 'numeric' })}
                        </span>
                      </div>
                      <div className="text-sm">
                        <span className="text-zinc-500 block mb-1">Status:</span>
                        <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                          latestReport.sentAt ? 'bg-emerald-500/10 text-emerald-400' : 'bg-amber-500/10 text-amber-400'
                        }`}>
                          {latestReport.sentAt ? 'Sent' : 'Draft'}
                        </span>
                      </div>
                    </div>
                  ) : (
                    <div className="text-sm text-zinc-500 italic py-4 border-y border-zinc-800/50 my-2">
                      No reports generated for this client yet.
                    </div>
                  )}
                </div>
                
                <div className="mt-6 pt-4 border-t border-zinc-800 flex gap-3">
                  <button className="flex-1 bg-zinc-800 hover:bg-zinc-700 text-white px-4 py-2 rounded-lg text-sm font-medium transition-colors flex items-center justify-center gap-2">
                    <Download className="w-4 h-4" /> Generate
                  </button>
                  <button 
                    disabled={!latestReport}
                    className="flex-1 bg-indigo-600 disabled:bg-zinc-800 disabled:text-zinc-500 hover:bg-indigo-500 text-white px-4 py-2 rounded-lg text-sm font-medium transition-colors flex items-center justify-center gap-2"
                  >
                    <Mail className="w-4 h-4" /> Send
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}
