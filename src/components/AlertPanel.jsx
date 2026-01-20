import React from "react";

const statusStyles = {
  SAFE: { bg: "#dcfce7", color: "#166534" },
  WARNING: { bg: "#fef3c7", color: "#92400e" },
  DANGER: { bg: "#fee2e2", color: "#991b1b" },
};

const AlertPanel = ({ readings }) => {
  const alerts = readings.filter(
    (r) => r.status === "WARNING" || r.status === "DANGER"
  );

  return (
    <div
      style={{
        position: "fixed",
        bottom: 20,
        left: 20,
        width: 340,
        maxHeight: 450,
        background: "white",
        borderRadius: 16,
        boxShadow: "0 20px 60px rgba(0,0,0,0.15)",
        padding: 20,
        zIndex: 200,
        overflowY: "auto",
        border: "1px solid #e5e7eb"
      }}
    >
      <div style={{ 
        display: "flex", 
        alignItems: "center", 
        gap: 10, 
        marginBottom: 16,
        paddingBottom: 12,
        borderBottom: "2px solid #f3f4f6"
      }}>
        <span style={{ fontSize: 24 }}>🚨</span>
        <h3 style={{ margin: 0, fontSize: 18, fontWeight: 600 }}>Live Alerts</h3>
        {alerts.length > 0 && (
          <span style={{
            marginLeft: "auto",
            background: "#ef4444",
            color: "white",
            padding: "2px 8px",
            borderRadius: 12,
            fontSize: 12,
            fontWeight: 600
          }}>
            {alerts.length}
          </span>
        )}
      </div>

      {alerts.length === 0 && (
        <p style={{ color: "#6b7280", fontSize: 14, textAlign: "center", margin: "20px 0" }}>
          No active alerts
        </p>
      )}

      {alerts.map((a) => (
        <div
          key={a.sensor_id}
          style={{
            background: statusStyles[a.status].bg,
            color: statusStyles[a.status].color,
            padding: 14,
            borderRadius: 10,
            marginBottom: 10,
            cursor: "pointer",
            border: `2px solid ${statusStyles[a.status].color}20`,
            transition: "transform 0.2s",
          }}
          onMouseEnter={(e) => e.currentTarget.style.transform = "translateX(4px)"}
          onMouseLeave={(e) => e.currentTarget.style.transform = "translateX(0)"}
        >
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
            <strong style={{ fontSize: 14 }}>{a.type.toUpperCase()}</strong>
            <span style={{
              fontSize: 11,
              padding: "2px 6px",
              background: statusStyles[a.status].color,
              color: "white",
              borderRadius: 4,
              fontWeight: 600
            }}>
              {a.status}
            </span>
          </div>
          <div style={{ fontSize: 13, marginTop: 6, opacity: 0.9 }}>
            {a.value} {a.unit} <span style={{ opacity: 0.7 }}>(threshold: {a.threshold})</span>
          </div>
        </div>
      ))}
    </div>
  );
};

export default AlertPanel;