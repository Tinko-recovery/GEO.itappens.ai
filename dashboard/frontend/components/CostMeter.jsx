// dashboard/frontend/components/CostMeter.jsx
// Live cost tracker: spend bar, spend by agent, savings counter

export default function CostMeter({ cost }) {
    if (!cost) return <div style={skeleton}>Loading cost data...</div>;

    const {
        today_spent_usd: spent = 0,
        daily_budget_usd: budget = 20,
        budget_remaining_usd: remaining = 20,
        pct_used: pct = 0,
        spend_by_agent: byAgent = {},
        saved_today_vs_hiring: savedToday = 0,
        projected_monthly_usd: projMonthly = 0,
        saved_monthly_vs_hiring: savedMonthly = 0,
    } = cost;

    const barColor = pct >= 90 ? "#ef4444" : pct >= 70 ? "#f59e0b" : "#10b981";
    const top3 = Object.entries(byAgent).slice(0, 3);

    return (
        <div style={{ display: "flex", flexDirection: "column", gap: 20 }}>

            {/* Big spend number */}
            <div style={{ textAlign: "center" }}>
                <div style={{ fontSize: 11, color: "#64748b", fontWeight: 500, marginBottom: 6, textTransform: "uppercase", letterSpacing: "0.08em" }}>
                    Today's Spend
                </div>
                <div style={{
                    fontSize: 48, fontWeight: 800, fontFamily: "'JetBrains Mono', monospace",
                    color: barColor, lineHeight: 1
                }}>
                    ${spent.toFixed(2)}
                </div>
                <div style={{ color: "#475569", fontSize: 13, marginTop: 4 }}>of ${budget.toFixed(2)} budget</div>
            </div>

            {/* Progress bar */}
            <div>
                <div style={{ background: "rgba(255,255,255,0.07)", borderRadius: 8, height: 10, overflow: "hidden" }}>
                    <div style={{
                        background: `linear-gradient(90deg, ${barColor}, ${barColor}88)`,
                        height: "100%", borderRadius: 8,
                        width: `${Math.min(100, pct)}%`,
                        transition: "width 1s ease",
                        boxShadow: pct > 70 ? `0 0 12px ${barColor}60` : "none",
                    }} />
                </div>
                <div style={{ display: "flex", justifyContent: "space-between", marginTop: 6, fontSize: 12, color: "#475569" }}>
                    <span>{pct.toFixed(1)}% used</span>
                    <span>${remaining.toFixed(2)} remaining</span>
                </div>
            </div>

            {/* Savings counter — always running */}
            <div style={{
                background: "linear-gradient(135deg, rgba(16,185,129,0.1), rgba(99,102,241,0.1))",
                border: "1px solid rgba(16,185,129,0.2)", borderRadius: 12, padding: "14px 18px", textAlign: "center"
            }}>
                <div style={{ fontSize: 11, color: "#6ee7b7", fontWeight: 600, textTransform: "uppercase", letterSpacing: "0.08em", marginBottom: 4 }}>
                    💚 Saved vs Hiring Today
                </div>
                <div style={{ fontSize: 32, fontWeight: 800, color: "#10b981", fontFamily: "'JetBrains Mono', monospace" }}>
                    ${savedToday.toFixed(0)}
                </div>
                <div style={{ fontSize: 11, color: "#475569", marginTop: 2 }}>
                    ~${savedMonthly.toLocaleString()} saved this month at this rate
                </div>
            </div>

            {/* Spend by agent */}
            {top3.length > 0 && (
                <div>
                    <div style={{ fontSize: 11, color: "#64748b", fontWeight: 600, textTransform: "uppercase", letterSpacing: "0.08em", marginBottom: 10 }}>
                        Top Spenders
                    </div>
                    <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
                        {top3.map(([agent, agentCost]) => {
                            const barW = budget > 0 ? Math.min(100, (agentCost / budget) * 100) : 0;
                            return (
                                <div key={agent}>
                                    <div style={{ display: "flex", justifyContent: "space-between", fontSize: 12, marginBottom: 4 }}>
                                        <span style={{ color: "#94a3b8" }}>{agent}</span>
                                        <span style={{ color: "#64748b", fontFamily: "'JetBrains Mono', monospace" }}>${agentCost.toFixed(4)}</span>
                                    </div>
                                    <div style={{ background: "rgba(255,255,255,0.06)", borderRadius: 4, height: 4 }}>
                                        <div style={{
                                            background: "linear-gradient(90deg, #8b5cf6, #6366f1)",
                                            height: "100%", borderRadius: 4, width: `${barW}%`
                                        }} />
                                    </div>
                                </div>
                            );
                        })}
                    </div>
                </div>
            )}

            {/* Monthly projection */}
            <div style={{ borderTop: "1px solid rgba(255,255,255,0.07)", paddingTop: 14 }}>
                <div style={{ display: "flex", justifyContent: "space-between", fontSize: 13 }}>
                    <span style={{ color: "#64748b" }}>Projected monthly</span>
                    <span style={{ color: "#94a3b8", fontFamily: "'JetBrains Mono', monospace", fontWeight: 600 }}>
                        ${projMonthly.toFixed(2)}
                    </span>
                </div>
            </div>
        </div>
    );
}

const skeleton = { color: "#475569", fontSize: 13, textAlign: "center", padding: "20px 0" };
