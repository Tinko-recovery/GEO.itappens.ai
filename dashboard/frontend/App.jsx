// dashboard/frontend/App.jsx
// Main itappens.ai customer dashboard — 4 live panels
// Polls API every 15 seconds for real-time updates

import { useState, useEffect, useCallback } from "react";
import TeamCard from "./components/TeamCard.jsx";
import OutputReview from "./components/OutputReview.jsx";
import CostMeter from "./components/CostMeter.jsx";
import ActivityFeed from "./components/ActivityFeed.jsx";

const API = "http://localhost:8000/api";

const PANEL_TABS = [
    { id: "teams", label: "🤖 Live Teams" },
    { id: "activity", label: "🧠 Live Activity" },
    { id: "vault", label: "🧠 Knowledge Vault" },
    { id: "outputs", label: "📋 Review Queue" },
    { id: "cost", label: "💰 Cost & Tokens" },
    { id: "history", label: "🕰️ Job History" },
    { id: "weekly", label: "📈 Weekly Win" },
];

export default function App() {
    const [activeTab, setActiveTab] = useState("teams");
    const [teams, setTeams] = useState({});
    const [outputs, setOutputs] = useState([]);
    const [cost, setCost] = useState(null);
    const [quality, setQuality] = useState(null);
    const [activity, setActivity] = useState([]);
    const [history, setHistory] = useState([]);
    const [loading, setLoading] = useState(true);
    const [lastUpdate, setLastUpdate] = useState(null);

    // [New State for Tiered Gating]
    const [userTier, setUserTier] = useState(localStorage.getItem("itappens_user_tier") || "Basic");
    const [hasPaidAudit, setHasPaidAudit] = useState(localStorage.getItem("itappens_has_paid_audit") === "true");
    const [userStatus, setUserStatus] = useState(localStorage.getItem("itappens_user_status") || "active");
    const [partnerCode, setPartnerCode] = useState("");

    const fetchAll = useCallback(async () => {
        try {
            const [teamsRes, outputsRes, costRes, qualityRes, activityRes, historyRes] = await Promise.all([
                fetch(`${API}/teams`).then(r => r.json()).catch(() => ({})),
                fetch(`${API}/outputs`).then(r => r.json()).catch(() => ({ outputs: [] })),
                fetch(`${API}/cost`).then(r => r.json()).catch(() => null),
                fetch(`${API}/quality`).then(r => r.json()).catch(() => null),
                fetch(`${API}/activity`).then(r => r.json()).catch(() => []),
                fetch(`${API}/history`).then(r => r.json()).catch(() => []),
            ]);
            setTeams(teamsRes);
            setOutputs(outputsRes.outputs || []);
            setCost(costRes);
            setQuality(qualityRes);
            setActivity(activityRes);
            setHistory(historyRes);
            setLastUpdate(new Date().toLocaleTimeString());
            setLoading(false);
        } catch (e) {
            console.error("Dashboard fetch error:", e);
            setLoading(false);
        }
    }, []);

    useEffect(() => {
        fetchAll();
        const interval = setInterval(fetchAll, 15_000); // refresh every 15s
        return () => clearInterval(interval);
    }, [fetchAll]);

    // [Bypass Persistence Effect]
    useEffect(() => {
        localStorage.setItem("itappens_user_tier", userTier);
        localStorage.setItem("itappens_has_paid_audit", hasPaidAudit.toString());
        localStorage.setItem("itappens_user_status", userStatus);
    }, [userTier, hasPaidAudit, userStatus]);

    const handlePartnerCode = (val) => {
        setPartnerCode(val);
        if (val === "prelaunch_testing") {
            setUserTier("Scale");
            setHasPaidAudit(true);
            setUserStatus("verified");
            // Immediate UI feedback
            alert("Partner Access Unlocked: Scale Tier Active.");
        }
    };

    const teamList = Object.values(teams).filter(t => t.team_id !== "ceo" && t.team_id !== "cto" && t.team_id !== "cpo");
    const pendingCount = outputs.length;

    return (
        <div style={{ minHeight: "100vh", background: "#08090d", color: "#e2e8f0", fontFamily: "'Inter', sans-serif" }}>
            {/* Global styles */}
            <style>{`
        @keyframes pulse { 0%,100%{opacity:1} 50%{opacity:0.4} }
        ::-webkit-scrollbar { width:6px; } ::-webkit-scrollbar-track { background:transparent; }
        ::-webkit-scrollbar-thumb { background:rgba(255,255,255,0.1); border-radius:3px; }
      `}</style>

            {/* Header */}
            <header style={{
                padding: "0 32px", height: 64, display: "flex", alignItems: "center", justifyContent: "space-between",
                borderBottom: "1px solid rgba(255,255,255,0.07)",
                background: "rgba(255,255,255,0.02)", backdropFilter: "blur(12px)",
                position: "sticky", top: 0, zIndex: 100,
            }}>
                <div style={{ display: "flex", alignItems: "center", gap: 14 }}>
                    <div style={{
                        width: 36, height: 36, borderRadius: 10, display: "flex", alignItems: "center", justifyContent: "center",
                        background: "linear-gradient(135deg, #8b5cf6, #6366f1)", fontSize: 18,
                    }}>⚡</div>
                    <div>
                        <div style={{ fontSize: 16, fontWeight: 700, color: "#f1f5f9", letterSpacing: "-0.02em" }}>
                            itappens.ai
                        </div>
                        <div style={{ fontSize: 11, color: "#475569" }}>Autonomous AI Company</div>
                    </div>
                </div>

                <div style={{ display: "flex", alignItems: "center", gap: 20 }}>
                    {/* Live indicator */}
                    <div style={{ display: "flex", alignItems: "center", gap: 7, fontSize: 12, color: "#64748b" }}>
                        <span style={{
                            width: 7, height: 7, borderRadius: "50%", background: "#10b981",
                            boxShadow: "0 0 8px #10b981", animation: "pulse 2s infinite", display: "inline-block"
                        }} />
                        Live  {lastUpdate && `· ${lastUpdate}`}
                    </div>

                    {pendingCount > 0 && (
                        <div style={{
                            background: "rgba(245,158,11,0.15)", border: "1px solid rgba(245,158,11,0.3)",
                            borderRadius: 20, padding: "3px 10px", fontSize: 12, color: "#f59e0b", fontWeight: 600
                        }}>
                            {pendingCount} pending review
                        </div>
                    )}
                </div>
            </header>

            {/* Main layout */}
            <div style={{ display: "flex", minHeight: "calc(100vh - 64px)" }}>

                {/* Sidebar */}
                <nav style={{
                    width: 220, flexShrink: 0, padding: "24px 16px",
                    borderRight: "1px solid rgba(255,255,255,0.07)",
                    display: "flex", flexDirection: "column", gap: 4,
                }}>
                    {PANEL_TABS.map(tab => (
                        <button key={tab.id} onClick={() => setActiveTab(tab.id)} style={{
                            width: "100%", textAlign: "left", padding: "10px 14px", borderRadius: 10,
                            background: activeTab === tab.id ? "rgba(139,92,246,0.15)" : "transparent",
                            border: activeTab === tab.id ? "1px solid rgba(139,92,246,0.3)" : "1px solid transparent",
                            color: activeTab === tab.id ? "#a78bfa" : "#64748b",
                            fontSize: 13, fontWeight: activeTab === tab.id ? 600 : 400,
                            cursor: "pointer", transition: "all 0.15s", fontFamily: "'Inter', sans-serif",
                            display: "flex", alignItems: "center", gap: 8,
                        }}>
                            {tab.label}
                            {tab.id === "outputs" && pendingCount > 0 && (
                                <span style={{
                                    marginLeft: "auto", background: "#f59e0b", color: "#1a1200",
                                    borderRadius: 10, fontSize: 10, fontWeight: 700, padding: "1px 6px"
                                }}>{pendingCount}</span>
                            )}
                        </button>
                    ))}

                    {/* Quality summary in sidebar */}
                    {quality && (
                        <div style={{
                            marginTop: "auto", background: "rgba(255,255,255,0.04)",
                            border: "1px solid rgba(255,255,255,0.08)", borderRadius: 12, padding: "14px",
                            marginBottom: 16
                        }}>
                            <div style={{ fontSize: 11, color: "#64748b", fontWeight: 600, textTransform: "uppercase", letterSpacing: "0.06em", marginBottom: 8 }}>
                                Quality Today
                            </div>
                            <div style={{
                                fontSize: 28, fontWeight: 800, color: quality.today_average_score >= 8 ? "#10b981" : "#f59e0b",
                                fontFamily: "'JetBrains Mono', monospace"
                            }}>
                                {quality.today_average_score}/10
                            </div>
                            <div style={{ fontSize: 11, color: "#475569", marginTop: 2 }}>
                                {quality.total_reviewed_today} outputs reviewed
                            </div>
                        </div>
                    )}

                    {/* Partner Access Input */}
                    <div style={{
                        marginTop: quality ? 0 : "auto", 
                        padding: "12px", borderTop: "1px solid rgba(255,255,255,0.05)",
                        opacity: userTier === "Scale" ? 0.4 : 1
                    }}>
                        <div style={{ fontSize: 10, color: "#475569", marginBottom: 6, textTransform: "uppercase" }}>Partner Access</div>
                        <input 
                            type="password"
                            placeholder="Enter code..."
                            value={partnerCode}
                            onChange={(e) => handlePartnerCode(e.target.value)}
                            disabled={userTier === "Scale"}
                            style={{
                                width: "100%", background: "rgba(0,0,0,0.2)", border: "1px solid rgba(255,255,255,0.1)",
                                borderRadius: 6, padding: "6px 8px", color: "#fff", fontSize: 11, outline: "none"
                            }}
                        />
                    </div>
                </nav>

                {/* Main content */}
                <main style={{ flex: 1, padding: "32px", overflow: "auto" }}>
                    {loading ? (
                        <div style={{ textAlign: "center", paddingTop: 80, color: "#475569", fontSize: 14 }}>
                            Connecting to itappens.ai...
                        </div>
                    ) : (
                        <>
                            {/* Vigil Status Banner */}
                            {userStatus === "pending" && (
                                <div style={{
                                    background: "rgba(139,92,246,0.1)", border: "1px solid rgba(139,92,246,0.3)",
                                    borderRadius: 12, padding: "12px 20px", marginBottom: 24, 
                                    display: "flex", alignItems: "center", gap: 12, color: "#a78bfa", fontSize: 14
                                }}>
                                    <span style={{ fontSize: 18 }}>🕵️</span>
                                    <span>The Principal is verifying your data. Results arriving shortly.</span>
                                </div>
                            )}
                             {activeTab === "teams" && (
                                <div>
                                    <SectionHeader title="Live Teams" subtitle={`${teamList.length} teams running`} />
                                    
                                    {/* Audit Upsell Card */}
                                    {!hasPaidAudit && (
                                        <div style={{
                                            background: "linear-gradient(135deg, #1e1b4b, #0c0a21)",
                                            border: "1px solid #312e81", borderRadius: 20, padding: "24px",
                                            marginBottom: 24, display: "flex", alignItems: "center", justifyContent: "space-between"
                                        }}>
                                            <div style={{ maxWidth: "60%" }}>
                                                <h3 style={{ margin: 0, fontSize: 18, color: "#fff" }}>Claim Your GEO Blueprint</h3>
                                                <p style={{ margin: "8px 0 0", fontSize: 13, color: "#94a3b8" }}>
                                                    Weaponize your site for the AI Search Era. Get a 15-page "Semantic Displacement" audit today.
                                                </p>
                                            </div>
                                            <button 
                                                onClick={() => window.open(`https://rzp.io/l/itappens-geo-audit-499?email=${encodeURIComponent("user@itappens.ai")}`, "_blank")}
                                                style={{
                                                    background: "#6366f1", color: "#fff", border: "none", borderRadius: 10,
                                                    padding: "12px 20px", fontWeight: 700, fontSize: 14, cursor: "pointer",
                                                    boxShadow: "0 4px 12px rgba(99,102,241,0.4)"
                                                }}
                                            >
                                                Get Detailed Audit (₹499)
                                            </button>
                                        </div>
                                    )}

                                    {teamList.length === 0 ? (
                                        <EmptyState icon="🤖" text="No active teams yet. Run main.py to start the company." />
                                    ) : (
                                        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(300px, 1fr))", gap: 16 }}>
                                            {teamList.map(team => <TeamCard key={team.team_id} team={team} />)}
                                        </div>
                                    )}
                                </div>
                            )}

                            {/* PANEL 2 — Live Activity */}
                            {activeTab === "activity" && (
                                <div style={{ maxWidth: 800 }}>
                                    <SectionHeader title="Live Activity" subtitle="Real-time thoughts and actions from your AI team" />
                                    <ActivityFeed activity={activity} />
                                </div>
                            )}

                             {/* PANEL 3 — Output Review */}
                            {activeTab === "outputs" && (
                                <div>
                                    <SectionHeader title="Output Review" subtitle="AI-generated content awaiting your approval" />
                                    <OutputReview outputs={outputs} onRefresh={fetchAll} />
                                </div>
                            )}

                            {/* PANEL - Knowledge Vault (Tiered) */}
                            {activeTab === "vault" && (
                                <div style={{ position: "relative", minHeight: 400 }}>
                                    <SectionHeader title="Knowledge Vault" subtitle="Autonomous ingestion & entity mapping" />
                                    
                                    {userTier !== "Scale" ? (
                                        <div style={{
                                            position: "absolute", inset: 0, 
                                            background: "rgba(8,9,13,0.8)", backdropFilter: "blur(4px)",
                                            zIndex: 10, display: "flex", flexDirection: "column", 
                                            alignItems: "center", justifyContent: "center", textAlign: "center",
                                            borderRadius: 20, border: "1px solid rgba(255,255,255,0.05)"
                                        }}>
                                            <div style={{ fontSize: 48, marginBottom: 16 }}>🔒</div>
                                            <h3 style={{ fontSize: 24, color: "#fff", margin: 0 }}>Scale Plan Required</h3>
                                            <p style={{ color: "#64748b", maxWidth: 400, marginTop: 12 }}>
                                                Unlock the full power of the GEO Foundry. Upload PDFs, connect URLs, and watch the AI build your Knowledge Brain.
                                            </p>
                                            <button 
                                                style={{
                                                    marginTop: 24, background: "linear-gradient(135deg, #8b5cf6, #6366f1)",
                                                    color: "#fff", border: "none", borderRadius: 10, padding: "14px 28px",
                                                    fontWeight: 700, cursor: "pointer", fontSize: 16
                                                }}
                                            >
                                                Upgrade to Scale (₹2,497/mo)
                                            </button>
                                        </div>
                                    ) : (
                                        <div style={{ opacity: userTier === "Scale" ? 1 : 0.3 }}>
                                            <div style={{ background: "rgba(255,255,255,0.03)", borderRadius: 16, padding: 32, border: "1px solid rgba(255,255,255,0.06)" }}>
                                                <h4 style={{ color: "#a78bfa", marginBottom: 16 }}>Ingestion Status: Verified</h4>
                                                <p>Vault is active. Agents are pulling context from <code>brain.json</code>.</p>
                                                <div style={{ marginTop: 20, padding: 20, background: "#000", borderRadius: 12, fontFamily: "monospace", fontSize: 13, color: "#10b981" }}>
                                                    {`{ "entities": ["Principal", "GEO Foundry", "itappens.ai"], "status": "synced" }`}
                                                </div>
                                            </div>
                                        </div>
                                    )}
                                </div>
                            )}

                            {/* PANEL 4 — Cost Meter & Tokens */}
                            {activeTab === "cost" && (
                                <div style={{ maxWidth: 900 }}>
                                    <SectionHeader title="Cost & Tokens" subtitle="Detailed spend breakdown by task and agent" />
                                    <div style={{ display: "grid", gridTemplateColumns: "1fr 1.5fr", gap: 24 }}>
                                        <div style={{
                                            background: "rgba(255,255,255,0.04)", border: "1px solid rgba(255,255,255,0.08)",
                                            borderRadius: 20, padding: "28px", height: "fit-content"
                                        }}>
                                            <CostMeter cost={cost} />
                                        </div>
                                        <div style={{
                                            background: "rgba(255,255,255,0.04)", border: "1px solid rgba(255,255,255,0.08)",
                                            borderRadius: 20, padding: "24px", overflow: "hidden"
                                        }}>
                                            <h3 style={{ fontSize: 14, color: "#64748b", marginBottom: 16 }}>Detailed Transaction Log</h3>
                                            <div style={{ maxHeight: 500, overflowY: "auto" }}>
                                                <table style={{ width: "100%", fontSize: 12, borderCollapse: "collapse" }}>
                                                    <thead>
                                                        <tr style={{ textAlign: "left", color: "#475569", borderBottom: "1px solid rgba(255,255,255,0.05)" }}>
                                                            <th style={{ padding: "8px 4px" }}>Agent</th>
                                                            <th style={{ padding: "8px 4px" }}>Task</th>
                                                            <th style={{ padding: "8px 4px" }}>Cost</th>
                                                        </tr>
                                                    </thead>
                                                    <tbody>
                                                        {cost?.detailed_logs?.map((log, i) => (
                                                            <tr key={i} style={{ borderBottom: "1px solid rgba(255,255,255,0.03)" }}>
                                                                <td style={{ padding: "10px 4px", color: "#a78bfa", fontWeight: 600 }}>{log.agent}</td>
                                                                <td style={{ padding: "10px 4px", color: "#94a3b8" }}>{log.task || "—"}</td>
                                                                <td style={{ padding: "10px 4px", color: "#e2e8f0", fontFamily: "monospace" }}>${log.cost_usd.toFixed(4)}</td>
                                                            </tr>
                                                        ))}
                                                    </tbody>
                                                </table>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            )}

                            {/* PANEL 5 — Job History */}
                            {activeTab === "history" && (
                                <div style={{ maxWidth: 800 }}>
                                    <SectionHeader title="Job History" subtitle="Archive of all completed and submitted tasks" />
                                    <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
                                        {history.length === 0 ? (
                                            <EmptyState icon="🕰️" text="No finished jobs in history yet." />
                                        ) : (
                                            history.map((job, idx) => (
                                                <div key={idx} style={{
                                                    background: "rgba(255,255,255,0.04)", border: "1px solid rgba(255,255,255,0.08)",
                                                    padding: "16px 20px", borderRadius: 12,
                                                    display: "flex", alignItems: "center", gap: 20
                                                }}>
                                                    <div style={{ fontSize: 24 }}>✅</div>
                                                    <div style={{ flex: 1 }}>
                                                        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "baseline" }}>
                                                            <h4 style={{ margin: 0, fontSize: 14, color: "#f1f5f9" }}>{job.team_id} ({job.type})</h4>
                                                            <span style={{ fontSize: 11, color: "#475569" }}>{new Date(job.timestamp).toLocaleString()}</span>
                                                        </div>
                                                        <p style={{ margin: "4px 0 0", fontSize: 13, color: "#94a3b8" }}>{job.goal}</p>
                                                    </div>
                                                    {job.quality_score && (
                                                        <div style={{ textAlign: "center" }}>
                                                            <div style={{ fontSize: 10, color: "#475569", textTransform: "uppercase" }}>Quality</div>
                                                            <div style={{ fontSize: 16, fontWeight: 700, color: "#10b981" }}>{job.quality_score}/10</div>
                                                        </div>
                                                    )}
                                                </div>
                                            ))
                                        )}
                                    </div>
                                </div>
                            )}

                            {/* PANEL 6 — Weekly Win Summary */}
                            {activeTab === "weekly" && (
                                <div style={{ maxWidth: 600 }}>
                                    <SectionHeader title="Weekly Win Summary" subtitle="This week's autonomous accomplishments" />
                                    <WeeklyWinPanel quality={quality} cost={cost} teams={teams} />
                                </div>
                            )}
                        </>
                    )}
                </main>
            </div>
        </div>
    );
}

// ── Sub-components ────────────────────────────────────────────────────────────

function SectionHeader({ title, subtitle }) {
    return (
        <div style={{ marginBottom: 24 }}>
            <h1 style={{ fontSize: 22, fontWeight: 700, color: "#f1f5f9", letterSpacing: "-0.02em" }}>{title}</h1>
            {subtitle && <p style={{ fontSize: 13, color: "#64748b", marginTop: 4 }}>{subtitle}</p>}
        </div>
    );
}

function EmptyState({ icon, text }) {
    return (
        <div style={{
            textAlign: "center", padding: "60px 0", color: "#475569",
            background: "rgba(255,255,255,0.02)", borderRadius: 16, border: "1px dashed rgba(255,255,255,0.08)"
        }}>
            <div style={{ fontSize: 40, marginBottom: 12 }}>{icon}</div>
            <div style={{ fontSize: 14 }}>{text}</div>
        </div>
    );
}

function WeeklyWinPanel({ quality, cost, teams }) {
    const tasksDone = Object.values(teams).reduce((acc, t) => acc + (t.completed_tasks?.length || 0), 0);
    const hoursSaved = tasksDone * 2;
    const freelancerCost = hoursSaved * 75;
    const actualCost = 497;
    const saved = Math.max(0, freelancerCost - actualCost);

    const rows = [
        { label: "Total tasks completed this week", val: tasksDone },
        { label: "Hours equivalent saved", val: `~${hoursSaved} hrs` },
        { label: "Freelancer cost equivalent", val: `~$${freelancerCost.toLocaleString()}` },
        { label: "What you actually paid", val: `$${actualCost}`, highlight: true },
        { label: "You saved", val: `$${saved.toLocaleString()}`, accent: "#10b981" },
    ];

    return (
        <div style={{
            background: "rgba(255,255,255,0.04)", border: "1px solid rgba(255,255,255,0.08)",
            borderRadius: 20, padding: "28px 32px", display: "flex", flexDirection: "column", gap: 20
        }}>
            <div style={{
                background: "linear-gradient(135deg, rgba(139,92,246,0.15), rgba(99,102,241,0.1))",
                border: "1px solid rgba(139,92,246,0.2)", borderRadius: 12, padding: "14px 18px",
                fontSize: 13, color: "#a78bfa", lineHeight: 1.6
            }}>
                🚀 <strong>Your AI team never sleeps.</strong> Here's what they shipped while you did.
            </div>

            <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
                {rows.map(r => (
                    <div key={r.label} style={{
                        display: "flex", justifyContent: "space-between", alignItems: "center",
                        padding: "10px 0", borderBottom: "1px solid rgba(255,255,255,0.05)"
                    }}>
                        <span style={{ fontSize: 13, color: "#94a3b8" }}>{r.label}</span>
                        <span style={{
                            fontSize: 15, fontWeight: 700, fontFamily: "'JetBrains Mono', monospace",
                            color: r.accent || (r.highlight ? "#f1f5f9" : "#64748b")
                        }}>{r.val}</span>
                    </div>
                ))}
            </div>

            {quality && (
                <div style={{ fontSize: 13, color: "#64748b", borderTop: "1px solid rgba(255,255,255,0.07)", paddingTop: 14 }}>
                    Average quality score this week:{" "}
                    <strong style={{ color: quality.today_average_score >= 8 ? "#10b981" : "#f59e0b" }}>
                        {quality.today_average_score}/10
                    </strong>
                </div>
            )}
        </div>
    );
}
