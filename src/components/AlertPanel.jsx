// components/AlertPanel.jsx
import React from "react";

const statusStyles = {
        SAFE: { bg: "#dcfce7", color: "#166534" },
        WARNING: { bg: "#fef3c7", color: "#92400e" },
        DANGER: { bg: "#fee2e2", color: "#991b1b" },
};

const AlertPanel = ({ readings }) => {
        const alerts = readings.filter(
                r => r.status === "WARNING" || r.status === "DANGER"
        );

        return (
                <div
                        style={{
                                position: "fixed",
                                bottom: 20,
                                left: 20,
                                width: 320,
                                maxHeight: 420,
                                background: "white",
                                borderRadius: 12,
                                boxShadow: "0 10px 30px rgba(0,0,0,0.2)",
                                padding: 14,
                                zIndex: 200,
                                overflowY: "auto",
                        }}
                >
                        <h3 style={{ marginBottom: 10 }}>
                                🚨 Live Alerts
                        </h3>

                        {alerts.length === 0 && (
                                <p style={{ color: "#6b7280", fontSize: 14 }}>
                                        All sensors operating normally
                                </p>
                        )}

                        {alerts.map((a) => (
                                <div
                                        key={a.sensor_id}
                                        style={{
                                                background: statusStyles[a.status].bg,
                                                color: statusStyles[a.status].color,
                                                padding: 10,
                                                borderRadius: 8,
                                                marginBottom: 8,
                                                cursor: "pointer",
                                        }}
                                        title="Click to focus (coming next)"
                                >
                                        <strong>{a.type.toUpperCase()}</strong> — {a.status}
                                        <div style={{ fontSize: 13, marginTop: 4 }}>
                                                {a.value} {a.unit} (threshold {a.threshold})
                                        </div>
                                </div>
                        ))}
                </div>
        );
};

export default AlertPanel;
