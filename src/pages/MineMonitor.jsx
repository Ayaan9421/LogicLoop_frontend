import React, { useState, useEffect, useRef } from "react";
import { v4 as uuid } from "uuid";

const MineMonitor = () => {
  const [mapUrl, setMapUrl] = useState(null);
  const [mapId, setMapId] = useState(null);
  const [sensors, setSensors] = useState([]);
  const [activeSensorType, setActiveSensorType] = useState(null);
  const [sensorReadings, setSensorReadings] = useState([]);
  const [mode, setMode] = useState("interact");
  const [position, setPosition] = useState({ x: 50, y: 50 });
  const [size, setSize] = useState({ width: 600, height: 400 });
  const [isDragging, setIsDragging] = useState(false);
  const [newSensorId, setNewSensorId] = useState(null);
  const wrapperRef = useRef(null);

  useEffect(() => {
    if (!mapId) return;
    console.log(mapId);
    const interval = setInterval(async () => {
      try {
        const res = await fetch(
          `https://coletta-snouted-rigoberto.ngrok-free.dev/simulate/readings?map_id=${mapId}`
        );
        const data = await res.json();
        console.log(data);
        setSensorReadings(data.readings || []);
      } catch (error) {
        console.error("Error fetching readings:", error);
      }
    }, 15000);

    return () => clearInterval(interval);
  }, [mapId]);

  const handleImageLoad = (e) => {
    const ratio = e.target.naturalHeight / e.target.naturalWidth;
    setSize((prev) => ({ ...prev, height: prev.width * ratio }));
  };

  const startDragMove = (e) => {
    if (mode !== "edit") return;
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(true);

    const startX = e.clientX;
    const startY = e.clientY;
    const initialLeft = position.x;
    const initialTop = position.y;

    const onMouseMove = (moveEvent) => {
      const dx = moveEvent.clientX - startX;
      const dy = moveEvent.clientY - startY;
      setPosition({
        x: initialLeft + dx,
        y: initialTop + dy,
      });
    };

    const onMouseUp = () => {
      setIsDragging(false);
      document.removeEventListener("mousemove", onMouseMove);
      document.removeEventListener("mouseup", onMouseUp);
    };

    document.addEventListener("mousemove", onMouseMove);
    document.addEventListener("mouseup", onMouseUp);
  };

  const startResize = (e, direction) => {
    e.preventDefault();
    e.stopPropagation();

    const startX = e.clientX;
    const startY = e.clientY;
    const startWidth = size.width;
    const startHeight = size.height;
    const startLeft = position.x;
    const startTop = position.y;

    const onMouseMove = (moveEvent) => {
      const dx = moveEvent.clientX - startX;
      const dy = moveEvent.clientY - startY;

      const newSize = { width: startWidth, height: startHeight };
      const newPos = { x: startLeft, y: startTop };

      if (direction.includes("e")) {
        newSize.width = Math.max(100, startWidth + dx);
      }
      if (direction.includes("w")) {
        newSize.width = Math.max(100, startWidth - dx);
        newPos.x = startLeft + dx;
      }
      if (direction.includes("s")) {
        newSize.height = Math.max(100, startHeight + dy);
      }
      if (direction.includes("n")) {
        newSize.height = Math.max(100, startHeight - dy);
        newPos.y = startTop + dy;
      }

      setSize(newSize);
      setPosition(newPos);
    };

    const onMouseUp = () => {
      document.removeEventListener("mousemove", onMouseMove);
      document.removeEventListener("mouseup", onMouseUp);
    };

    document.addEventListener("mousemove", onMouseMove);
    document.addEventListener("mouseup", onMouseUp);
  };

  const handleMapClick = (e) => {
    if (mode === "edit" || !activeSensorType || !wrapperRef.current) return;

    const rect = wrapperRef.current.getBoundingClientRect();
    const x = (e.clientX - rect.left) / rect.width;
    const y = (e.clientY - rect.top) / rect.height;

    if (x < 0 || y < 0 || x > 1 || y > 1) return;

    const newId = uuid();
    setSensors((prev) => [
      ...prev,
      { id: newId, type: activeSensorType, x, y },
    ]);
    
    setNewSensorId(newId);
    setTimeout(() => setNewSensorId(null), 800);
  };

  const Handle = ({ dir, onResize }) => {
    const size = 14;
    const offset = -size / 2;
    const style = {
      position: "absolute",
      width: size,
      height: size,
      backgroundColor: "white",
      border: "2px solid #10b981",
      zIndex: 50,
      cursor: `${dir}-resize`,
      borderRadius: "50%",
      boxShadow: "0 2px 8px rgba(16, 185, 129, 0.3)"
    };

    if (dir.includes("n")) style.top = offset;
    if (dir.includes("s")) style.bottom = offset;
    if (dir.includes("w")) style.left = offset;
    if (dir.includes("e")) style.right = offset;
    if (dir === "n" || dir === "s") { style.left = "50%"; style.marginLeft = offset; }
    if (dir === "e" || dir === "w") { style.top = "50%"; style.marginTop = offset; }

    return <div onMouseDown={(e) => onResize(e, dir)} style={style} />;
  };

  const sensorTypes = [
    { type: "methane", icon: "🟢", label: "Methane", color: "#10b981" },
    { type: "airflow", icon: "💨", label: "Airflow", color: "#06b6d4" },
    { type: "temperature", icon: "🌡️", label: "Temperature", color: "#84cc16" },
  ];

  const statusColor = {
    SAFE: "#10b981",
    WARNING: "#f59e0b",
    DANGER: "#ef4444",
  };

  const sensorIcon = {
    methane: "🟢",
    airflow: "💨",
    temperature: "🌡️",
  };

  const alerts = sensorReadings.filter(
    (r) => r.status === "WARNING" || r.status === "DANGER"
  );

  const hasAlerts = alerts.length > 0;
  const allNormal = sensorReadings.length > 0 && !hasAlerts;

  return (
    <div style={{ display: "flex", height: "100vh", fontFamily: "system-ui, -apple-system, sans-serif" }}>
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

        @keyframes popIn {
          0% {
            transform: translate(-50%, -50%) scale(0);
            opacity: 0;
          }
          50% {
            transform: translate(-50%, -50%) scale(1.2);
          }
          100% {
            transform: translate(-50%, -50%) scale(1);
            opacity: 1;
          }
        }

        @keyframes slideIn {
          from {
            transform: translateX(-20px);
            opacity: 0;
          }
          to {
            transform: translateX(0);
            opacity: 1;
          }
        }
      `}</style>

      {/* Left Sidebar */}
      <div style={{
        width: 320,
        background: "white",
        borderRight: "2px solid #10b981",
        display: "flex",
        flexDirection: "column",
        boxShadow: "4px 0 12px rgba(16, 185, 129, 0.1)"
      }}>
        {/* Header */}
        <div style={{
          padding: 24,
          background: "linear-gradient(135deg, #10b981 0%, #059669 100%)",
          color: "white"
        }}>
          <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
            <span style={{ fontSize: 32 }}>⛏️</span>
            <div>
              <h1 style={{ margin: 0, fontSize: 24, fontWeight: 700 }}>
                Mine Monitor
              </h1>
              <p style={{ margin: "4px 0 0", fontSize: 13, opacity: 0.9 }}>
                Real-time sensor management
              </p>
            </div>
          </div>
        </div>

        {/* System Status */}
        {sensorReadings.length > 0 && (
          <div style={{
            margin: 20,
            padding: 20,
            background: allNormal 
              ? "linear-gradient(135deg, #d1fae5, #a7f3d0)" 
              : "linear-gradient(135deg, #fee2e2, #fecaca)",
            borderRadius: 12,
            border: `3px solid ${allNormal ? "#10b981" : "#ef4444"}`,
            animation: "slideIn 0.5s ease-out"
          }}>
            <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
              <div style={{ 
                fontSize: 40,
                animation: allNormal ? "none" : "pulse 2s ease-in-out infinite"
              }}>
                {allNormal ? "✅" : "⚠️"}
              </div>
              <div style={{ flex: 1 }}>
                <div style={{ fontSize: 12, fontWeight: 600, color: "#6b7280", textTransform: "uppercase", letterSpacing: 0.5 }}>
                  System Status
                </div>
                <div style={{ fontSize: 18, fontWeight: 700, color: allNormal ? "#059669" : "#dc2626", marginTop: 4 }}>
                  {allNormal ? "All Systems Normal" : `${alerts.length} Alert${alerts.length > 1 ? 's' : ''}`}
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Upload Section */}
        <div style={{ padding: "0 20px 20px" }}>
          <h3 style={{
            margin: "0 0 12px",
            fontSize: 13,
            fontWeight: 600,
            color: "#6b7280",
            textTransform: "uppercase",
            letterSpacing: 1
          }}>
            📍 Map Upload
          </h3>
          <label style={{
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            gap: 10,
            padding: 16,
            background: mapUrl ? "#f0fdf4" : "linear-gradient(135deg, #10b981, #059669)",
            color: mapUrl ? "#059669" : "white",
            borderRadius: 12,
            cursor: "pointer",
            fontWeight: 600,
            fontSize: 14,
            border: mapUrl ? "2px solid #10b981" : "none",
            boxShadow: mapUrl ? "none" : "0 4px 12px rgba(16, 185, 129, 0.3)",
            transition: "all 0.2s"
          }}
          onMouseEnter={(e) => {
            if (!mapUrl) {
              e.currentTarget.style.transform = "translateY(-2px)";
              e.currentTarget.style.boxShadow = "0 6px 20px rgba(16, 185, 129, 0.4)";
            }
          }}
          onMouseLeave={(e) => {
            if (!mapUrl) {
              e.currentTarget.style.transform = "translateY(0)";
              e.currentTarget.style.boxShadow = "0 4px 12px rgba(16, 185, 129, 0.3)";
            }
          }}>
            <span style={{ fontSize: 20 }}>{mapUrl ? "✓" : "📤"}</span>
            {mapUrl ? "Map Uploaded" : "Upload Mine Map"}
            <input
              type="file"
              hidden
              accept="image/*"
              onChange={async (e) => {
                const file = e.target.files[0];
                if (!file) return;

                const formData = new FormData();
                formData.append("file", file);

                try {
                  const res = await fetch(
                    "https://coletta-snouted-rigoberto.ngrok-free.dev/map/upload",
                    { method: "POST", body: formData }
                  );
                  const data = await res.json();
                  const fullUrl = `https://coletta-snouted-rigoberto.ngrok-free.dev${data.map_url}`;
                  setMapUrl(fullUrl);

                  const filename = data.map_url.split("/").pop();
                  const mapId = filename.split(".")[0];
                  setMapId(mapId);
                } catch (error) {
                  console.error("Upload error:", error);
                }
              }}
            />
          </label>
        </div>

        {/* Sensor Types */}
        <div style={{ padding: "0 20px", flex: 1 }}>
          <h3 style={{
            margin: "0 0 12px",
            fontSize: 13,
            fontWeight: 600,
            color: "#6b7280",
            textTransform: "uppercase",
            letterSpacing: 1
          }}>
            🔧 Sensor Types
          </h3>
          <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
            {sensorTypes.map((sensor) => (
              <button
                key={sensor.type}
                onClick={() => setActiveSensorType(sensor.type)}
                style={{
                  padding: 14,
                  background: activeSensorType === sensor.type 
                    ? "linear-gradient(135deg, #d1fae5, #a7f3d0)" 
                    : "white",
                  color: activeSensorType === sensor.type ? sensor.color : "#374151",
                  border: activeSensorType === sensor.type 
                    ? `3px solid ${sensor.color}` 
                    : "2px solid #e5e7eb",
                  borderRadius: 12,
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
                    e.currentTarget.style.background = "#f9fafb";
                    e.currentTarget.style.borderColor = sensor.color;
                  }
                }}
                onMouseLeave={(e) => {
                  if (activeSensorType !== sensor.type) {
                    e.currentTarget.style.background = "white";
                    e.currentTarget.style.borderColor = "#e5e7eb";
                  }
                }}
              >
                <span style={{ fontSize: 24 }}>{sensor.icon}</span>
                <span>{sensor.label} Sensor</span>
                {activeSensorType === sensor.type && (
                  <span style={{ marginLeft: "auto", color: sensor.color, fontSize: 18 }}>✓</span>
                )}
              </button>
            ))}
          </div>
        </div>

        {/* Save Button */}
        {mapId && sensors.length > 0 && (
          <div style={{ padding: 20, borderTop: "2px solid #e5e7eb" }}>
            <button
              style={{
                width: "100%",
                padding: 16,
                background: "linear-gradient(135deg, #10b981, #059669)",
                color: "white",
                borderRadius: 12,
                border: "none",
                cursor: "pointer",
                fontSize: 15,
                fontWeight: 600,
                boxShadow: "0 4px 12px rgba(16, 185, 129, 0.3)",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                gap: 10,
                transition: "all 0.2s"
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.transform = "translateY(-2px)";
                e.currentTarget.style.boxShadow = "0 6px 20px rgba(16, 185, 129, 0.4)";
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.transform = "translateY(0)";
                e.currentTarget.style.boxShadow = "0 4px 12px rgba(16, 185, 129, 0.3)";
              }}
              onClick={async () => {
                try {
                  await fetch("https://coletta-snouted-rigoberto.ngrok-free.dev/sensors/save", {
                    method: "POST",
                    headers: { "Content-Type": "application/json" },
                    body: JSON.stringify({
                      map_id: mapId,
                      sensors: sensors.map(s => ({
                        ...s,
                        threshold: s.type === "methane" ? 2.0 : 0
                      }))
                    })
                  });
                  alert("✓ Sensors saved successfully!");
                } catch (error) {
                  alert("Error saving sensors");
                }
              }}
            >
              <span style={{ fontSize: 20 }}>💾</span>
              Save {sensors.length} Sensor{sensors.length > 1 ? 's' : ''}
            </button>
          </div>
        )}
      </div>

      {/* Main Canvas Area */}
      <div style={{
        flex: 1,
        position: "relative",
        background: "linear-gradient(135deg, #f0fdf4 0%, #dcfce7 100%)",
        overflow: "hidden"
      }}>
        {/* Mode Toggle */}
        <div style={{
          position: "absolute",
          top: 20,
          left: "50%",
          transform: "translateX(-50%)",
          zIndex: 100,
          background: "white",
          padding: 6,
          borderRadius: 12,
          boxShadow: "0 4px 20px rgba(16, 185, 129, 0.2)",
          display: "flex",
          gap: 6,
          border: "2px solid #10b981"
        }}>
          <button
            onClick={() => setMode("interact")}
            style={{
              padding: "10px 20px",
              background: mode === "interact" ? "linear-gradient(135deg, #10b981, #059669)" : "white",
              color: mode === "interact" ? "white" : "#374151",
              border: "none",
              borderRadius: 8,
              cursor: "pointer",
              fontSize: 14,
              fontWeight: 600,
              transition: "all 0.2s"
            }}
          >
            📍 Place Sensors
          </button>
          <button
            onClick={() => setMode("edit")}
            style={{
              padding: "10px 20px",
              background: mode === "edit" ? "linear-gradient(135deg, #10b981, #059669)" : "white",
              color: mode === "edit" ? "white" : "#374151",
              border: "none",
              borderRadius: 8,
              cursor: "pointer",
              fontSize: 14,
              fontWeight: 600,
              transition: "all 0.2s"
            }}
          >
            ✋ Drag/Resize
          </button>
        </div>

        {!mapUrl ? (
          <div style={{
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            justifyContent: "center",
            height: "100%",
            color: "#9ca3af"
          }}>
            <div style={{ fontSize: 80, marginBottom: 20 }}>📁</div>
            <div style={{ fontSize: 20, fontWeight: 600 }}>Upload a mine map to start</div>
            <div style={{ fontSize: 14, marginTop: 8 }}>Use the upload button in the sidebar</div>
          </div>
        ) : (
          <div
            ref={wrapperRef}
            onMouseDown={startDragMove}
            onClick={handleMapClick}
            style={{
              position: "absolute",
              left: `${position.x}px`,
              top: `${position.y}px`,
              width: `${size.width}px`,
              height: `${size.height}px`,
              cursor: mode === "edit" ? (isDragging ? "grabbing" : "grab") : "crosshair",
              boxShadow: "0 8px 32px rgba(16, 185, 129, 0.2)",
              userSelect: "none",
              borderRadius: 12,
              overflow: "hidden",
              border: mode === "edit" ? "3px solid #10b981" : "2px solid #10b981"
            }}
          >
            <img
              src={mapUrl}
              alt="Mine Map"
              onLoad={handleImageLoad}
              draggable={false}
              style={{
                width: "100%",
                height: "100%",
                pointerEvents: "none",
                display: "block"
              }}
            />

            {/* Sensors */}
            {sensors.map((s) => {
              const live = sensorReadings.find((r) => r.sensor_id === s.id);
              const status = live?.status || "SAFE";
              const color = statusColor[status];
              const isNew = s.id === newSensorId;

              return (
                <div
                  key={s.id}
                  style={{
                    position: "absolute",
                    left: `${s.x * 100}%`,
                    top: `${s.y * 100}%`,
                    transform: "translate(-50%, -50%)",
                    cursor: "pointer",
                    animation: isNew ? "popIn 0.5s ease-out" : "none"
                  }}
                  title={
                    live
                      ? `${s.type.toUpperCase()}: ${live.value} ${live.unit} (${status})`
                      : s.type
                  }
                >
                  <div style={{
                    width: 44,
                    height: 44,
                    borderRadius: "50%",
                    background: "white",
                    border: `3px solid ${color}`,
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    fontSize: 22,
                    boxShadow: `0 4px 16px ${color}60`,
                    position: "relative",
                    zIndex: 2
                  }}>
                    {sensorIcon[s.type]}
                  </div>

                  {live && (
                    <span
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

            {mode === "edit" && (
              <>
                <Handle dir="nw" onResize={startResize} />
                <Handle dir="ne" onResize={startResize} />
                <Handle dir="sw" onResize={startResize} />
                <Handle dir="se" onResize={startResize} />
                <Handle dir="n" onResize={startResize} />
                <Handle dir="s" onResize={startResize} />
                <Handle dir="e" onResize={startResize} />
                <Handle dir="w" onResize={startResize} />
              </>
            )}
          </div>
        )}
      </div>

      {/* Right Alert Panel */}
      <div style={{
        width: 360,
        background: "white",
        borderLeft: "2px solid #10b981",
        display: "flex",
        flexDirection: "column",
        boxShadow: "-4px 0 12px rgba(16, 185, 129, 0.1)"
      }}>
        <div style={{
          padding: 20,
          borderBottom: "2px solid #e5e7eb",
          background: "linear-gradient(135deg, #f0fdf4, white)"
        }}>
          <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
            <span style={{ fontSize: 28 }}>🚨</span>
            <div style={{ flex: 1 }}>
              <h2 style={{ margin: 0, fontSize: 20, fontWeight: 700, color: "#059669" }}>
                Live Alerts
              </h2>
              <p style={{ margin: "4px 0 0", fontSize: 13, color: "#6b7280" }}>
                Real-time monitoring
              </p>
            </div>
            {alerts.length > 0 && (
              <span style={{
                background: "#ef4444",
                color: "white",
                padding: "6px 12px",
                borderRadius: 20,
                fontSize: 14,
                fontWeight: 700,
                animation: "pulse 2s ease-in-out infinite"
              }}>
                {alerts.length}
              </span>
            )}
          </div>
        </div>

        <div style={{
          flex: 1,
          overflowY: "auto",
          padding: 20
        }}>
          {alerts.length === 0 ? (
            <div style={{
              textAlign: "center",
              padding: 40,
              color: "#9ca3af"
            }}>
              <div style={{ fontSize: 48, marginBottom: 12 }}>✓</div>
              <div style={{ fontSize: 16, fontWeight: 600 }}>No Active Alerts</div>
              <div style={{ fontSize: 13, marginTop: 4 }}>All systems operating normally</div>
            </div>
          ) : (
            <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
              {alerts.map((alert, index) => (
                <div
                  key={alert.sensor_id}
                  style={{
                    background: alert.status === "DANGER" 
                      ? "linear-gradient(135deg, #fee2e2, #fecaca)"
                      : "linear-gradient(135deg, #fef3c7, #fde68a)",
                    padding: 16,
                    borderRadius: 12,
                    border: `3px solid ${statusColor[alert.status]}`,
                    cursor: "pointer",
                    transition: "all 0.2s",
                    animation: `slideIn ${0.3 + index * 0.1}s ease-out`
                  }}
                  onMouseEnter={(e) => {
                    e.currentTarget.style.transform = "translateX(4px)";
                    e.currentTarget.style.boxShadow = `0 4px 16px ${statusColor[alert.status]}40`;
                  }}
                  onMouseLeave={(e) => {
                    e.currentTarget.style.transform = "translateX(0)";
                    e.currentTarget.style.boxShadow = "none";
                  }}
                >
                  <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 8 }}>
                    <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
                      <span style={{ fontSize: 20 }}>{sensorIcon[alert.type]}</span>
                      <strong style={{ fontSize: 15, color: "#1f2937" }}>
                        {alert.type.toUpperCase()}
                      </strong>
                    </div>
                    <span style={{
                      fontSize: 11,
                      padding: "4px 10px",
                      background: statusColor[alert.status],
                      color: "white",
                      borderRadius: 12,
                      fontWeight: 700,
                      letterSpacing: 0.5
                    }}>
                      {alert.status}
                    </span>
                  </div>
                  <div style={{ fontSize: 14, color: "#374151", fontWeight: 600 }}>
                    Reading: {alert.value} {alert.unit}
                  </div>
                  <div style={{ fontSize: 12, color: "#6b7280", marginTop: 4 }}>
                    Threshold: {alert.threshold} {alert.unit}
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default MineMonitor;