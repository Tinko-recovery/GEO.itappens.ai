"use client";

import { useEffect, useState } from "react";

type Audit = {
  id: string;
  email: string;
  siteUrl: string;
  plan: string;
  status: string;
  paymentStatus: string;
  createdAt: string;
};

type ClientProfile = {
  id: string;
  businessName: string;
  websiteUrl: string;
  email: string;
  status: string;
  createdAt: string;
};

export default function MissionCockpit() {
  const [activeTab, setActiveTab] = useState<"missions" | "clients">("missions");
  const [audits, setAudits] = useState<Audit[]>([]);
  const [clients, setClients] = useState<ClientProfile[]>([]);
  const [loading, setLoading] = useState(true);
  const [triggeringId, setTriggeringId] = useState<string | null>(null);

  const [logs, setLogs] = useState<string[]>([
    "[SYSTEM] Zenith CEO Agent Online.",
    "[SYSTEM] Mission Portal Connected to Supabase.",
    "[SYSTEM] Awaiting incoming missions..."
  ]);

  useEffect(() => {
    fetchData();
    const interval = setInterval(fetchData, 5000);
    return () => clearInterval(interval);
  }, []);

  const fetchData = async () => {
    try {
      // Fetch Audits
      const auditRes = await fetch("/api/dashboard/leads");
      if (auditRes.ok) {
        const auditData = await auditRes.json();
        setAudits(auditData.audits);
      }

      // Fetch Clients
      const clientRes = await fetch("/api/dashboard/clients");
      if (clientRes.ok) {
        const clientData = await clientRes.json();
        setClients(clientData.clients);
      }

      setLoading(false);
    } catch (err) {
      console.error(err);
      setLoading(false);
    }
  };

  const handleApprove = async (audit: Audit) => {
    setTriggeringId(audit.id);
    addLog(`[ACTION] Manual override authorized. Sending ${audit.siteUrl} to Zenith.`);
    
    try {
      const res = await fetch("/api/dashboard/trigger", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ auditId: audit.id })
      });
      
      if (res.ok) {
        addLog(`[QUEUE] Success! Upstash worker triggered for ${audit.siteUrl}.`);
        fetchData();
      } else {
        addLog(`[ERROR] Failed to trigger worker.`);
      }
    } catch (err) {
      addLog(`[ERROR] Network error triggering worker.`);
    } finally {
      setTriggeringId(null);
    }
  };

  const handleActivateClient = async (client: ClientProfile) => {
    addLog(`[BILLING] Activating subscription for ${client.businessName}.`);
    try {
      const res = await fetch("/api/dashboard/clients", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ id: client.id, status: "ACTIVE" })
      });
      if (res.ok) {
        addLog(`[SUCCESS] Client ${client.businessName} is now ACTIVE.`);
        fetchData();
      }
    } catch (err) {
      addLog(`[ERROR] Failed to activate client.`);
    }
  };

  const addLog = (msg: string) => {
    setLogs(prev => [...prev, `${new Date().toLocaleTimeString()} - ${msg}`].slice(-8));
  };

  return (
    <div className="min-h-screen bg-[#0A0A0A] text-gray-200 p-8 font-sans">
      <div className="max-w-6xl mx-auto space-y-8">
        
        {/* Header */}
        <div className="flex justify-between items-end border-b border-gray-800 pb-6">
          <div>
            <h1 className="text-3xl font-bold text-white mb-2">Mission Cockpit</h1>
            <p className="text-gray-400">itappens.ai Autonomous CEO Dashboard</p>
          </div>
          <div className="flex items-center gap-6">
            <div className="flex bg-[#111111] p-1 rounded-lg border border-gray-800">
               <button 
                onClick={() => setActiveTab("missions")}
                className={`px-4 py-1.5 rounded-md text-sm font-medium transition-all ${activeTab === 'missions' ? 'bg-gray-800 text-white' : 'text-gray-500 hover:text-gray-300'}`}
               >
                 Missions
               </button>
               <button 
                onClick={() => setActiveTab("clients")}
                className={`px-4 py-1.5 rounded-md text-sm font-medium transition-all ${activeTab === 'clients' ? 'bg-gray-800 text-white' : 'text-gray-500 hover:text-gray-300'}`}
               >
                 Clients
               </button>
            </div>
            <div className="flex items-center gap-3 border-l border-gray-800 pl-6">
              <div className="h-3 w-3 rounded-full bg-green-500 animate-pulse"></div>
              <span className="text-sm font-medium text-green-500">Live</span>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          
          <div className="lg:col-span-2 bg-[#111111] border border-gray-800 rounded-xl overflow-hidden">
            {activeTab === "missions" ? (
              <>
                <div className="px-6 py-4 border-b border-gray-800 bg-[#161616]">
                  <h2 className="text-lg font-semibold text-white">Incoming Missions (Audits)</h2>
                </div>
                <div className="p-0 overflow-x-auto">
                  <table className="w-full text-left text-sm">
                    <thead className="bg-[#0A0A0A] text-gray-400">
                      <tr>
                        <th className="px-6 py-3 font-medium">Target URL</th>
                        <th className="px-6 py-3 font-medium">Email</th>
                        <th className="px-6 py-3 font-medium">Status</th>
                        <th className="px-6 py-3 font-medium text-right">Action</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-800">
                      {loading ? (
                        <tr><td colSpan={4} className="px-6 py-8 text-center text-gray-500">Scanning satellite uplinks...</td></tr>
                      ) : audits.length === 0 ? (
                        <tr><td colSpan={4} className="px-6 py-8 text-center text-gray-500">No missions found.</td></tr>
                      ) : (
                        audits.map((audit) => (
                          <tr key={audit.id} className="hover:bg-[#1A1A1A] transition-colors">
                            <td className="px-6 py-4 font-mono text-blue-400">{audit.siteUrl}</td>
                            <td className="px-6 py-4">{audit.email}</td>
                            <td className="px-6 py-4">
                               <span className={`px-2 py-1 rounded text-xs font-semibold ${
                                 audit.status === 'AWAITING_PAYMENT' ? 'bg-orange-900/50 text-orange-300 border border-orange-800' :
                                 audit.status === 'RUNNING' ? 'bg-blue-900/50 text-blue-300 border border-blue-800 animate-pulse' :
                                 audit.status === 'COMPLETED' ? 'bg-green-900/50 text-green-300 border border-green-800' :
                                 'bg-gray-800 text-gray-300'
                               }`}>
                                {audit.status}
                              </span>
                            </td>
                            <td className="px-6 py-4 text-right">
                              {audit.status === 'AWAITING_PAYMENT' && (
                                <button 
                                  onClick={() => handleApprove(audit)}
                                  disabled={triggeringId === audit.id}
                                  className="px-3 py-1 bg-white text-black font-semibold rounded hover:bg-gray-200 transition-colors disabled:opacity-50"
                                >
                                  {triggeringId === audit.id ? '...' : 'Approve'}
                                </button>
                              )}
                            </td>
                          </tr>
                        ))
                      )}
                    </tbody>
                  </table>
                </div>
              </>
            ) : (
              <>
                <div className="px-6 py-4 border-b border-gray-800 bg-[#161616]">
                  <h2 className="text-lg font-semibold text-white">SaaS Clients (₹999)</h2>
                </div>
                <div className="p-0 overflow-x-auto">
                  <table className="w-full text-left text-sm">
                    <thead className="bg-[#0A0A0A] text-gray-400">
                      <tr>
                        <th className="px-6 py-3 font-medium">Business</th>
                        <th className="px-6 py-3 font-medium">Email</th>
                        <th className="px-6 py-3 font-medium">Status</th>
                        <th className="px-6 py-3 font-medium text-right">Action</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-800">
                      {loading ? (
                        <tr><td colSpan={4} className="px-6 py-8 text-center text-gray-500">Retrieving client database...</td></tr>
                      ) : clients.length === 0 ? (
                        <tr><td colSpan={4} className="px-6 py-8 text-center text-gray-500">No clients onboarded yet.</td></tr>
                      ) : (
                        clients.map((client) => (
                          <tr key={client.id} className="hover:bg-[#1A1A1A] transition-colors">
                            <td className="px-6 py-4 font-semibold text-white">{client.businessName}</td>
                            <td className="px-6 py-4 text-gray-400">{client.email}</td>
                            <td className="px-6 py-4">
                               <span className={`px-2 py-1 rounded text-xs font-semibold ${
                                 client.status === 'ACTIVE' ? 'bg-green-900/50 text-green-300 border border-green-800' :
                                 client.status === 'AWAITING_PAYMENT' ? 'bg-orange-900/50 text-orange-300 border border-orange-800' :
                                 'bg-gray-800 text-gray-300'
                               }`}>
                                {client.status}
                              </span>
                            </td>
                            <td className="px-6 py-4 text-right">
                              {client.status === 'AWAITING_PAYMENT' && (
                                <button 
                                  onClick={() => handleActivateClient(client)}
                                  className="px-3 py-1 bg-green-500 text-black font-semibold rounded hover:bg-green-400 transition-colors"
                                >
                                  Activate
                                </button>
                              )}
                            </td>
                          </tr>
                        ))
                      )}
                    </tbody>
                  </table>
                </div>
              </>
            )}
          </div>

          <div className="bg-black border border-gray-800 rounded-xl overflow-hidden flex flex-col font-mono text-sm">
            <div className="px-4 py-3 border-b border-gray-800 bg-[#0A0A0A] flex items-center gap-2">
              <div className="h-2 w-2 rounded-full bg-red-500"></div>
              <div className="h-2 w-2 rounded-full bg-yellow-500"></div>
              <div className="h-2 w-2 rounded-full bg-green-500"></div>
              <span className="ml-2 text-gray-500 text-xs">zenith-agent-terminal</span>
            </div>
            <div className="p-4 flex-1 space-y-2 overflow-y-auto max-h-[500px]">
              {logs.map((log, i) => (
                <div key={i} className={`${log.includes('ERROR') ? 'text-red-400' : log.includes('ACTION') || log.includes('QUEUE') || log.includes('BILLING') || log.includes('SUCCESS') ? 'text-green-400' : 'text-gray-400'}`}>
                  {log}
                </div>
              ))}
              <div className="animate-pulse text-gray-600">_</div>
            </div>
          </div>

        </div>
      </div>
    </div>
  );
}
