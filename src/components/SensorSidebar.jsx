import React from "react";

const SensorSidebar = ({ setMapUrl, setMapId, setActiveSensorType, activeSensorType, sensorReadings }) => {
  const sensors = [
    { type: "methane", icon: "🟢", label: "Methane", color: "#22c55e" },
    { type: "airflow", icon: "💨", label: "Airflow", color: "#3b82f6" },
    { type: "temperature", icon: "🌡️", label: "Temperature", color: "#ef4444" },
  ];

  // Check if all sensors are operating normally
  const hasAlerts = sensorReadings.some(r => r.status === "WARNING" || r.status === "DANGER");
  const allNormal = sensorReadings.length > 0 && !hasAlerts;

  return (
    <div
      style={{
        width: 300,
        padding: 24,
        background: "linear-gradient(to bottom, #1f2937, #111827)",
        color: "white",
        display: "flex",
        flexDirection: "column",
        gap: 24,
        borderRight: "1px solid #374151"
      }}
    >
      <div>
        <h2 style={{ 
          margin: 0, 
          fontSize: 24, 
          fontWeight: 700,
          background: "linear-gradient(135deg, #3b82f6, #8b5cf6)",
          WebkitBackgroundClip: "text",
          WebkitTextFillColor: "transparent"
        }}>
          Mine Monitor
        </h2>
        <p style={{ margin: "8px 0 0", fontSize: 13, color: "#9ca3af" }}>
          Real-time sensor management
        </p>
      </div>

      {/* Dashboard Status */}
      {sensorReadings.length > 0 && (
        <div style={{
          padding: 16,
          background: allNormal 
            ? "linear-gradient(135deg, #059669, #047857)" 
            : "linear-gradient(135deg, #dc2626, #991b1b)",
          borderRadius: 12,
          border: `2px solid ${allNormal ? "#10b981" : "#ef4444"}`,
          boxShadow: `0 4px 16px ${allNormal ? "#10b98140" : "#ef444440"}`
        }}>
          <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
            <div style={{ 
              fontSize: 32,
              animation: allNormal ? "none" : "pulse 2s ease-in-out infinite"
            }}>
              {allNormal ? "✅" : "⚠️"}
            </div>
            <div style={{ flex: 1 }}>
              <div style={{ fontSize: 13, fontWeight: 600, color: "white", opacity: 0.9 }}>
                System Status
              </div>
              <div style={{ fontSize: 15, fontWeight: 700, color: "white", marginTop: 2 }}>
                {allNormal ? "All Systems Normal" : "Alerts Active"}
              </div>
            </div>
          </div>
        </div>
      )}

      <div>
        <h4 style={{ 
          margin: "0 0 12px", 
          fontSize: 13, 
          fontWeight: 600, 
          color: "#9ca3af",
          textTransform: "uppercase",
          letterSpacing: 1
        }}>
          Sensor Types
        </h4>
        <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
          {sensors.map((sensor) => (
            <button
              key={sensor.type}
              onClick={() => setActiveSensorType(sensor.type)}
              style={{
                padding: "12px 16px",
                background: activeSensorType === sensor.type 
                  ? `linear-gradient(135deg, ${sensor.color}20, ${sensor.color}10)` 
                  : "#374151",
                color: activeSensorType === sensor.type ? sensor.color : "white",
                border: activeSensorType === sensor.type 
                  ? `2px solid ${sensor.color}` 
                  : "2px solid transparent",
                borderRadius: 10,
                cursor: "pointer",
                display: "flex",
                alignItems: "center",
                gap: 12,
                fontSize: 14,
                fontWeight: 600,
                transition: "all 0.2s",
              }}
              onMouseEnter={(e) => {
                if (activeSensorType !== sensor.type) {
                  e.currentTarget.style.background = "#4b5563";
                }
              }}
              onMouseLeave={(e) => {
                if (activeSensorType !== sensor.type) {
                  e.currentTarget.style.background = "#374151";
                }
              }}
            >
              <span style={{ fontSize: 20 }}>{sensor.icon}</span>
              {sensor.label} Sensor
            </button>
          ))}
        </div>
      </div>

      <div style={{ 
        height: 1, 
        background: "linear-gradient(to right, transparent, #374151, transparent)" 
      }} />

      <label
        style={{
          padding: "14px 20px",
          background: "linear-gradient(135deg, #10b981, #059669)",
          color: "white",
          borderRadius: 10,
          cursor: "pointer",
          textAlign: "center",
          fontSize: 14,
          fontWeight: 600,
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          gap: 8,
          transition: "all 0.2s",
          border: "none",
          boxShadow: "0 4px 12px #10b98140"
        }}
        onMouseEnter={(e) => {
          e.currentTarget.style.transform = "translateY(-2px)";
          e.currentTarget.style.boxShadow = "0 6px 20px #10b98160";
        }}
        onMouseLeave={(e) => {
          e.currentTarget.style.transform = "translateY(0)";
          e.currentTarget.style.boxShadow = "0 4px 12px #10b98140";
        }}
      >
        <span style={{ fontSize: 18 }}>📁</span>
        Upload Mine Map
        <input
          type="file"
          hidden
          accept="image/*"
          onChange={async (e) => {
            const file = e.target.files[0];
            if (!file) return;

            const formData = new FormData();
            formData.append("file", file);

            const res = await fetch(
              "https://coletta-snouted-rigoberto.ngrok-free.dev/map/upload",
              {
                method: "POST",
                body: formData,
              }
            );

            const data = await res.json();
            const fullUrl = `https://coletta-snouted-rigoberto.ngrok-free.dev${data.map_url}`;
            setMapUrl(fullUrl);

            const filename = data.map_url.split("/").pop();
            const mapId = filename.split(".")[0];
            setMapId(mapId);
          }}
        />
      </label>

      <style>{`
        @keyframes pulse {
          0%, 100% {
            opacity: 1;
            transform: scale(1);
          }
          50% {
            opacity: 0.8;
            transform: scale(1.1);
          }
        }
      `}</style>
    </div>
  );
};

export default SensorSidebar;