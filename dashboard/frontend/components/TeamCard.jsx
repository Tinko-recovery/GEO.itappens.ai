// dashboard/frontend/components/TeamCard.jsx
// Live status card for a single AI team

export default function TeamCard({ team }) {
    const status = team.status || "waiting";
    const statusColors = {
        active: { dot: "#10b981", label: "Active", bg: "rgba(16,185,129,0.12)" },
        waiting: { dot: "#f59e0b", label: "Waiting", bg: "rgba(245,158,11,0.12)" },
        blocked: { dot: "#ef4444", label: "Blocked", bg: "rgba(239,68,68,0.12)" },
        done: { dot: "#8b5cf6", label: "Done", bg: "rgba(139,92,246,0.12)" },
    };
    const sc = statusColors[status] || statusColors.waiting;

    const completed = team.completed_tasks || [];
    const scores = team.quality_scores || [];
    const avgScore = scores.length ? (scores.reduce((a, b) => a + b, 0) / scores.length).toFixed(1) : null;
    const lastUpdated = team.last_updated ? new Date(team.last_updated).toLocaleTimeString() : "—";

    return (
        <div style={{
            background: "rgba(255,255,255,0.04)",
            border: "1px solid rgba(255,255,255,0.08)",
            borderRadius: 16,
            padding: "20px 24px",
            display: "flex", flexDirection: "column", gap: 14,
            transition: "border-color 0.2s",
        }}
            onMouseEnter={e => e.currentTarget.style.borderColor = "rgba(255,255,255,0.16)"}
            onMouseLeave={e => e.currentTarget.style.borderColor = "rgba(255,255,255,0.08)"}
        >
            {/* Header */}
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                <span style={{ fontSize: 15, fontWeight: 600, color: "#f1f5f9" }}>
                    {team.team_id?.replace("_", " ").toUpperCase()}
                </span>
                <span style={{
                    display: "flex", alignItems: "center", gap: 6, fontSize: 12, fontWeight: 500,
                    background: sc.bg, color: sc.dot, borderRadius: 20, padding: "3px 10px"
                }}>
                    <span style={{
                        width: 7, height: 7, borderRadius: "50%", background: sc.dot,
                        boxShadow: status === "active" ? `0 0 8px ${sc.dot}` : "none",
                        animation: status === "active" ? "pulse 2s infinite" : "none"
                    }} />
                    {sc.label}
                </span>
            </div>

            {/* Current task */}
            <div>
                <div style={{ fontSize: 11, color: "#64748b", marginBottom: 4, fontWeight: 500, textTransform: "uppercase", letterSpacing: "0.06em" }}>
                    Current Task
                </div>
                <div style={{ fontSize: 13, color: "#cbd5e1", lineHeight: 1.5 }}>
                    {team.current_task || "Waiting for assignment"}
                </div>
            </div>

            {/* Progress bar */}
            <div>
                <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 6, fontSize: 12, color: "#64748b" }}>
                    <span>Tasks Completed</span>
                    <span style={{ color: "#94a3b8" }}>{completed.length}</span>
                </div>
                <div style={{ background: "rgba(255,255,255,0.07)", borderRadius: 4, height: 4 }}>
                    <div style={{
                        background: "linear-gradient(90deg, #8b5cf6, #6366f1)",
                        borderRadius: 4, height: "100%",
                        width: `${Math.min(100, completed.length * 10)}%`,
                        transition: "width 0.6s ease",
                    }} />
                </div>
            </div>

            {/* Footer row */}
            <div style={{ display: "flex", justifyContent: "space-between", fontSize: 12 }}>
                <span style={{ color: "#64748b" }}>
                    Avg Quality: <span style={{ color: avgScore >= 8 ? "#10b981" : avgScore >= 5 ? "#f59e0b" : "#ef4444", fontWeight: 600 }}>
                        {avgScore ? `${avgScore}/10` : "—"}
                    </span>
                </span>
                <span style={{ color: "#475569" }}>Updated {lastUpdated}</span>
            </div>

            {/* Blockers */}
            {(team.blockers || []).length > 0 && (
                <div style={{
                    background: "rgba(239,68,68,0.08)", border: "1px solid rgba(239,68,68,0.2)",
                    borderRadius: 8, padding: "8px 12px", fontSize: 12, color: "#fca5a5"
                }}>
                    ⚠️ {team.blockers[team.blockers.length - 1]}
                </div>
            )}
        </div>
    );
}
