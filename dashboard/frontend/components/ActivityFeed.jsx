// dashboard/frontend/components/ActivityFeed.jsx
import React from 'react';

export default function ActivityFeed({ activity }) {
    if (!activity || activity.length === 0) {
        return (
            <div style={{ color: "#475569", fontSize: 13, textAlign: "center", padding: "20px 0" }}>
                No recent activity.
            </div>
        );
    }

    return (
        <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
            {activity.map((item, idx) => (
                <div key={idx} style={{
                    background: "rgba(255,255,255,0.03)",
                    borderLeft: "2px solid rgba(139,92,246,0.5)",
                    padding: "10px 14px",
                    borderRadius: "0 8px 8px 0",
                    fontSize: 13,
                    animation: "fadeIn 0.3s ease-out"
                }}>
                    <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 4 }}>
                        <span style={{ fontWeight: 700, color: "#a78bfa" }}>{item.agent}</span>
                        <span style={{ fontSize: 10, color: "#475569" }}>
                            {new Date(item.timestamp).toLocaleTimeString()}
                        </span>
                    </div>
                    <div style={{ color: "#94a3b8", fontStyle: "italic", marginBottom: 4 }}>
                        {item.action}
                    </div>
                    <div style={{ color: "#e2e8f0", fontSize: 12, lineHeight: 1.4 }}>
                        {item.thought}
                    </div>
                </div>
            ))}
            <style>{`
                @keyframes fadeIn {
                    from { opacity: 0; transform: translateY(-5px); }
                    to { opacity: 1; transform: translateY(0); }
                }
            `}</style>
        </div>
    );
}
