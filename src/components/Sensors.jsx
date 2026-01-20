import React, { useEffect, useState } from "react";

const statusColor = {
  SAFE: "#22c55e",
  WARNING: "#f59e0b",
  DANGER: "#ef4444",
};

const sensorIcon = {
  methane: "🟢",
  airflow: "💨",
  temperature: "🌡️",
};

const Sensors = ({ sensors, readings }) => {
  const [pulseMap, setPulseMap] = useState({});

  useEffect(() => {
    if (readings.length > 0) {
      console.log("🔥 New Readings Received:", readings);
      console.log("📍 Sensors:", sensors);
    }

    const pulses = {};
    readings.forEach((r) => {
      pulses[r.sensor_id] = Date.now();
    });
    setPulseMap(pulses);
  }, [readings]);

  return (
    <>
      <style>{`
        @keyframes ripple {
          0% {
            transform: scale(0.5);
            opacity: 0.9;
          }
          20% {
            opacity: 0.9;
          }
          100% {
            transform: scale(3);
            opacity: 0;
          }
        }
      `}</style>
      {sensors.map((s) => {
        const live = readings.find((r) => r.sensor_id === s.id);
        const status = live?.status || "SAFE";
        const color = statusColor[status];
        const pulseKey = pulseMap[s.id] || "init";

        return (
          <div
            key={s.id}
            style={{
              position: "absolute",
              left: `${s.x * 100}%`,
              top: `${s.y * 100}%`,
              transform: "translate(-50%, -50%)",
              cursor: "pointer",
            }}
            title={
              live
                ? `${s.type.toUpperCase()}: ${live.value} ${live.unit} (${status})`
                : s.type
            }
          >
            <div style={{
              width: 40,
              height: 40,
              borderRadius: "50%",
              background: "white",
              border: `3px solid ${color}`,
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              fontSize: 20,
              boxShadow: `0 4px 12px ${color}40`,
              position: "relative",
              zIndex: 2
            }}>
              {sensorIcon[s.type]}
            </div>

            {live && (
              <span
                key={pulseKey}
                style={{
                  position: "absolute",
                  inset: -10,
                  borderRadius: "50%",
                  border: `3px solid ${color}`,
                  opacity: 0,
                  animation: `ripple ${status === "DANGER" ? "0.8s" : "1.6s"} ease-out infinite`,
                  pointerEvents: "none"
                }}
              />
            )}
          </div>
        );
      })}
    </>
  );
};

export default Sensors;