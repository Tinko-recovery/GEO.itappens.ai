// dashboard/frontend/App.jsx
// Main itappens.ai customer dashboard — 4 live panels
// Polls API every 15 seconds for real-time updates

import { useState, useEffect, useCallback } from "react";
import TeamCard from "./components/TeamCard.jsx";
import OutputReview from "./components/OutputReview.jsx";
import CostMeter from "./components/CostMeter.jsx";

const API = "http://localhost:8000/api";

const PANEL_TABS = [
    { id: "teams", label: "🤖 Live Teams" },
    { id: "outputs", label: "📋 Review Queue" },
    { id: "cost", label: "💰 Cost Meter" },
    { id: "weekly", label: "📈 Weekly Win" },
];

export default function App() {
    const [activeTab, setActiveTab] = useState("teams");
    const [teams, setTeams] = useState({});
    const [outputs, setOutputs] = useState([]);
    const [cost, setCost] = useState(null);
    const [quality, setQuality] = useState(null);
    const [loading, setLoading] = useState(true);
    const [lastUpdate, setLastUpdate] = useState(null);

    const fetchAll = useCallback(async () => {
        try {
            const [teamsRes, outputsRes, costRes, qualityRes] = await Promise.all([
                fetch(`${API}/teams`).then(r => r.json()).catch(() => ({})),
                fetch(`${API}/outputs`).then(r => r.json()).catch(() => ({ outputs: [] })),
                fetch(`${API}/cost`).then(r => r.json()).catch(() => null),
                fetch(`${API}/quality`).then(r => r.json()).catch(() => null),
            ]);
            setTeams(teamsRes);
            setOutputs(outputsRes.outputs || []);
            setCost(costRes);
            setQuality(qualityRes);
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
                </nav>

                {/* Main content */}
                <main style={{ flex: 1, padding: "32px", overflow: "auto" }}>
                    {loading ? (
                        <div style={{ textAlign: "center", paddingTop: 80, color: "#475569", fontSize: 14 }}>
                            Connecting to itappens.ai...
                        </div>
                    ) : (
                        <>
                            {/* PANEL 1 — Live Teams */}
                            {activeTab === "teams" && (
                                <div>
                                    <SectionHeader title="Live Teams" subtitle={`${teamList.length} teams running`} />
                                    {teamList.length === 0 ? (
                                        <EmptyState icon="🤖" text="No active teams yet. Run main.py to start the company." />
                                    ) : (
                                        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(300px, 1fr))", gap: 16 }}>
                                            {teamList.map(team => <TeamCard key={team.team_id} team={team} />)}
                                        </div>
                                    )}
                                </div>
                            )}

                            {/* PANEL 2 — Output Review */}
                            {activeTab === "outputs" && (
                                <div>
                                    <SectionHeader title="Output Review" subtitle="AI-generated content awaiting your approval" />
                                    <OutputReview outputs={outputs} onRefresh={fetchAll} />
                                </div>
                            )}

                            {/* PANEL 3 — Cost Meter */}
                            {activeTab === "cost" && (
                                <div style={{ maxWidth: 520 }}>
                                    <SectionHeader title="Cost Meter" subtitle="Live spend vs daily budget" />
                                    <div style={{
                                        background: "rgba(255,255,255,0.04)", border: "1px solid rgba(255,255,255,0.08)",
                                        borderRadius: 20, padding: "28px 32px",
                                    }}>
                                        <CostMeter cost={cost} />
                                    </div>
                                </div>
                            )}

                            {/* PANEL 4 — Weekly Win Summary */}
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
