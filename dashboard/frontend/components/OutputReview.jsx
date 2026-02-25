// dashboard/frontend/components/OutputReview.jsx
// Approve / Reject / Edit UI for pending AI outputs

import { useState } from "react";

const API = "http://localhost:8000/api";

export default function OutputReview({ outputs, onRefresh }) {
    const [loading, setLoading] = useState({});
    const [notes, setNotes] = useState({});

    const act = async (id, action) => {
        setLoading(l => ({ ...l, [id]: action }));
        try {
            await fetch(`${API}/outputs/${id}/${action}`, {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ note: notes[id] || "" }),
            });
            onRefresh?.();
        } catch (e) { console.error(e); }
        setLoading(l => ({ ...l, [id]: null }));
    };

    const scoreColor = (s) => s >= 9 ? "#10b981" : s >= 7 ? "#8b5cf6" : s >= 5 ? "#f59e0b" : "#ef4444";

    if (!outputs?.length) return (
        <div style={{ textAlign: "center", padding: "40px 0", color: "#475569", fontSize: 14 }}>
            ✅ No outputs pending review
        </div>
    );

    return (
        <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
            {outputs.map(o => (
                <div key={o.id} style={{
                    background: "rgba(255,255,255,0.04)", border: "1px solid rgba(255,255,255,0.08)",
                    borderRadius: 12, padding: "16px 20px",
                }}>
                    <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 10 }}>
                        <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
                            <span style={{
                                fontSize: 11, fontWeight: 600, textTransform: "uppercase", letterSpacing: "0.06em",
                                background: "rgba(99,102,241,0.15)", color: "#a5b4fc", borderRadius: 6, padding: "2px 8px"
                            }}>{o.output_type || "output"}</span>
                            <span style={{ fontSize: 12, color: "#64748b" }}>Team: {o.team_id}</span>
                        </div>
                        <span style={{
                            fontSize: 20, fontWeight: 800, color: scoreColor(o.quality_score),
                            fontFamily: "'JetBrains Mono', monospace"
                        }}>
                            {o.quality_score}/10
                        </span>
                    </div>

                    <pre style={{
                        background: "rgba(0,0,0,0.3)", borderRadius: 8, padding: "10px 14px",
                        fontSize: 12, color: "#94a3b8", fontFamily: "'JetBrains Mono', monospace",
                        whiteSpace: "pre-wrap", wordBreak: "break-word", marginBottom: 12, maxHeight: 120, overflow: "hidden"
                    }}>
                        {(o.preview || o.content || "").slice(0, 300)}
                    </pre>

                    {o.quality_note && (
                        <div style={{ fontSize: 12, color: "#fbbf24", marginBottom: 10, background: "rgba(251,191,36,0.08)", borderRadius: 6, padding: "6px 10px" }}>
                            {o.quality_note}
                        </div>
                    )}

                    <div style={{ display: "flex", gap: 8, alignItems: "center" }}>
                        <button disabled={loading[o.id]} onClick={() => act(o.id, "approve")} style={btnStyle("#10b981")}>
                            {loading[o.id] === "approve" ? "..." : "✅ Approve"}
                        </button>
                        <button disabled={loading[o.id]} onClick={() => act(o.id, "reject")} style={btnStyle("#ef4444")}>
                            {loading[o.id] === "reject" ? "..." : "❌ Reject"}
                        </button>
                        <input
                            placeholder="Optional note..."
                            value={notes[o.id] || ""}
                            onChange={e => setNotes(n => ({ ...n, [o.id]: e.target.value }))}
                            style={{
                                flex: 1, background: "rgba(255,255,255,0.06)", border: "1px solid rgba(255,255,255,0.1)",
                                borderRadius: 8, padding: "6px 12px", color: "#e2e8f0", fontSize: 12, outline: "none"
                            }}
                        />
                    </div>
                </div>
            ))}
        </div>
    );
}

const btnStyle = (color) => ({
    padding: "6px 14px", borderRadius: 8, border: `1px solid ${color}30`,
    background: `${color}15`, color, fontSize: 12, fontWeight: 600,
    cursor: "pointer", fontFamily: "'Inter', sans-serif",
    transition: "background 0.15s",
});
