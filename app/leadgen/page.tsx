"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";

export default function LeadGenOnboarding() {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);

  const [formData, setFormData] = useState({
    host: "",
    port: "5432",
    database: "",
    username: "",
    password: ""
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleConnect = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);
    setSuccess(false);

    try {
      const res = await fetch("/api/leadgen/test-connection", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData)
      });
      
      const data = await res.json();
      
      if (!res.ok) {
        throw new Error(data.error || "Connection failed");
      }
      
      setSuccess(true);
      // Proceed to the next step or dashboard
      setTimeout(() => {
        router.push("/nimda");
      }, 1500);

    } catch (err: any) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const handleBypass = () => {
    // Founder bypass logic
    router.push("/nimda");
  };

  return (
    <div className="min-h-screen bg-[#050B14] text-white flex items-center justify-center p-6 font-sans">
      <div className="max-w-md w-full">
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold bg-gradient-to-r from-cyan-400 to-blue-600 bg-clip-text text-transparent mb-2">
            Connect Database
          </h1>
          <p className="text-cyan-200/60 text-sm">
            Link your PostgreSQL database to the Lead Engine to unlock multi-tenant syncing.
          </p>
        </div>

        <div className="bg-[#0B1221] border border-cyan-900/50 rounded-xl p-8 shadow-2xl shadow-cyan-900/20">
          <form onSubmit={handleConnect} className="space-y-4">
            
            <div>
              <label className="block text-xs font-medium text-cyan-300/80 uppercase tracking-wider mb-1">Host</label>
              <input 
                type="text" 
                name="host"
                placeholder="db.yourdomain.com"
                required
                className="w-full bg-[#050B14] border border-cyan-800/60 rounded-lg px-4 py-2.5 text-sm text-cyan-100 placeholder:text-cyan-800/50 focus:outline-none focus:border-cyan-400 focus:ring-1 focus:ring-cyan-400 transition-all"
                value={formData.host}
                onChange={handleChange}
              />
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-medium text-cyan-300/80 uppercase tracking-wider mb-1">Database</label>
                <input 
                  type="text" 
                  name="database"
                  placeholder="postgres"
                  required
                  className="w-full bg-[#050B14] border border-cyan-800/60 rounded-lg px-4 py-2.5 text-sm text-cyan-100 placeholder:text-cyan-800/50 focus:outline-none focus:border-cyan-400 focus:ring-1 focus:ring-cyan-400 transition-all"
                  value={formData.database}
                  onChange={handleChange}
                />
              </div>
              <div>
                <label className="block text-xs font-medium text-cyan-300/80 uppercase tracking-wider mb-1">Port</label>
                <input 
                  type="text" 
                  name="port"
                  placeholder="5432"
                  required
                  className="w-full bg-[#050B14] border border-cyan-800/60 rounded-lg px-4 py-2.5 text-sm text-cyan-100 placeholder:text-cyan-800/50 focus:outline-none focus:border-cyan-400 focus:ring-1 focus:ring-cyan-400 transition-all"
                  value={formData.port}
                  onChange={handleChange}
                />
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-medium text-cyan-300/80 uppercase tracking-wider mb-1">Username</label>
                <input 
                  type="text" 
                  name="username"
                  placeholder="postgres"
                  required
                  className="w-full bg-[#050B14] border border-cyan-800/60 rounded-lg px-4 py-2.5 text-sm text-cyan-100 placeholder:text-cyan-800/50 focus:outline-none focus:border-cyan-400 focus:ring-1 focus:ring-cyan-400 transition-all"
                  value={formData.username}
                  onChange={handleChange}
                />
              </div>
              <div>
                <label className="block text-xs font-medium text-cyan-300/80 uppercase tracking-wider mb-1">Password</label>
                <input 
                  type="password" 
                  name="password"
                  placeholder="••••••••"
                  required
                  className="w-full bg-[#050B14] border border-cyan-800/60 rounded-lg px-4 py-2.5 text-sm text-cyan-100 placeholder:text-cyan-800/50 focus:outline-none focus:border-cyan-400 focus:ring-1 focus:ring-cyan-400 transition-all"
                  value={formData.password}
                  onChange={handleChange}
                />
              </div>
            </div>

            {error && (
              <div className="p-3 bg-red-900/30 border border-red-500/50 rounded-lg text-red-200 text-sm">
                {error}
              </div>
            )}
            
            {success && (
              <div className="p-3 bg-emerald-900/30 border border-emerald-500/50 rounded-lg text-emerald-200 text-sm flex items-center">
                <svg className="w-5 h-5 mr-2 text-emerald-400" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7"></path></svg>
                Connection Verified! Redirecting...
              </div>
            )}

            <button 
              type="submit"
              disabled={loading || success}
              className="w-full mt-6 px-6 py-3 bg-cyan-600 hover:bg-cyan-500 disabled:opacity-50 text-white font-bold rounded-lg shadow-[0_0_15px_rgba(8,145,178,0.4)] transition-all hover:shadow-[0_0_25px_rgba(8,145,178,0.6)] flex items-center justify-center"
            >
              {loading ? (
                <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-white" fill="none" viewBox="0 0 24 24">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                </svg>
              ) : "Test & Connect Database"}
            </button>
          </form>

          <div className="mt-6 pt-6 border-t border-cyan-900/30 flex justify-center">
             <button 
                onClick={handleBypass}
                className="text-xs font-semibold px-4 py-2 bg-purple-900/40 hover:bg-purple-800/60 border border-purple-700/50 text-purple-200 rounded transition-all shadow-[0_0_10px_rgba(147,51,234,0.2)]"
              >
                Bypass (Founder Access)
             </button>
          </div>

        </div>
      </div>
    </div>
  );
}
