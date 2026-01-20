import React, { useState, useEffect, useRef } from "react";
import { v4 as uuid } from "uuid";
import "./MineMonitor.css";

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
          `https://coletta-snouted-rigoberto.ngrok-free.dev/simulate/readings?map_id=${mapId}`,
          {
            headers: {
              "ngrok-skip-browser-warning": "true",
            },
          }
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

  const ResizeHandle = ({ direction }) => (
    <div
      className={`resize-handle ${direction}`}
      onMouseDown={(e) => startResize(e, direction)}
    />
  );

  const sensorTypes = [
    { type: "methane", label: "Methane Sensor", color: "#10b981" },
    { type: "airflow", label: "Airflow Sensor", color: "#06b6d4" },
    { type: "temperature", label: "Temperature Sensor", color: "#84cc16" },
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
    <div className="mine-monitor-container">
      {/* Left Sidebar */}
      <div className="mine-sidebar">
        {/* Header */}
        <div className="mine-header">
          <div className="mine-header-content">
            <div className="mine-header-text">
              <h1>Mine Monitor</h1>
              <p>Real-time sensor management</p>
            </div>
          </div>
        </div>

        {/* System Status */}
        {sensorReadings.length > 0 && (
          <div className="system-status-wrapper">
            <div className={`system-status-card ${allNormal ? 'normal' : 'alert'}`}>
              <div className="status-content">
                <div className={`status-icon ${!allNormal ? 'pulse' : ''}`}>
                  {allNormal ? "✓" : "⚠"}
                </div>
                <div className="status-text">
                  <div className="status-label">System Status</div>
                  <div className={`status-value ${allNormal ? 'normal' : 'alert'}`}>
                    {allNormal ? "All Systems Normal" : `${alerts.length} Alert${alerts.length > 1 ? 's' : ''}`}
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Upload Section */}
        <div className="sidebar-section">
          <h3 className="section-title">Map Upload</h3>
          <label className={`upload-button ${mapUrl ? 'uploaded' : 'empty'}`}>
            <span className="upload-icon">{mapUrl ? "✓" : "↑"}</span>
            {mapUrl ? "Map Uploaded" : "Upload Mine Map"}
            <input
              type="file"
              className="upload-input"
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
        <div className="sidebar-section flex">
          <h3 className="section-title">
            <span className="section-title-icon">🔧</span>
            Sensor Types
          </h3>
          <div className="sensor-types-grid">
            {sensorTypes.map((sensor) => (
              <button
                key={sensor.type}
                onClick={() => setActiveSensorType(sensor.type)}
                className={`sensor-type-button ${
                  activeSensorType === sensor.type ? 'active' : 'inactive'
                }`}
              >
                <span className="sensor-icon" style={{ color: sensor.color }}>
                  {sensorIcon[sensor.type]}
                </span>
                <span>{sensor.label}</span>
                {activeSensorType === sensor.type && (
                  <span className="sensor-checkmark">✓</span>
                )}
              </button>
            ))}
          </div>
        </div>

        {/* Save Button */}
        {mapId && sensors.length > 0 && (
          <div className="save-section">
            <button
              className="save-button"
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
                  alert("Sensors saved successfully!");
                } catch (error) {
                  alert("Error saving sensors");
                }
              }}
            >
              Save {sensors.length} Sensor{sensors.length > 1 ? 's' : ''}
            </button>
          </div>
        )}
      </div>

      {/* Main Canvas Area */}
      <div className="mine-canvas">
        {/* Mode Toggle */}
        <div className="mode-toggle">
          <button
            onClick={() => setMode("interact")}
            className={`mode-button ${mode === "interact" ? 'active' : 'inactive'}`}
          >
            <span className="mode-icon">+</span>
            Place Sensors
          </button>
          <button
            onClick={() => setMode("edit")}
            className={`mode-button ${mode === "edit" ? 'active' : 'inactive'}`}
          >
            <span className="mode-icon">✋</span>
            Drag/Resize
          </button>
        </div>

        {!mapUrl ? (
          <div className="empty-state">
            <div className="empty-icon">📍</div>
            <div className="empty-title">Upload a mine map to start</div>
            <div className="empty-subtitle">Use the upload button in the sidebar</div>
          </div>
        ) : (
          <div
            ref={wrapperRef}
            onMouseDown={startDragMove}
            onClick={handleMapClick}
            className={`map-wrapper ${mode} ${isDragging ? 'dragging' : ''}`}
            style={{
              left: `${position.x}px`,
              top: `${position.y}px`,
              width: `${size.width}px`,
              height: `${size.height}px`,
            }}
          >
            <img
              src={mapUrl}
              alt="Mine Map"
              onLoad={handleImageLoad}
              draggable={false}
              className="map-image"
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
                  className={`sensor-marker ${isNew ? 'new' : ''}`}
                  style={{
                    left: `${s.x * 100}%`,
                    top: `${s.y * 100}%`,
                  }}
                  title={
                    live
                      ? `${s.type.toUpperCase()}: ${live.value} ${live.unit} (${status})`
                      : s.type
                  }
                >
                  <div className={`sensor-dot ${status.toLowerCase()}`}>
                    {sensorIcon[s.type]}
                  </div>

                  {live && (
                    <span className={`sensor-ripple ${status.toLowerCase()}`} />
                  )}
                </div>
              );
            })}

            {mode === "edit" && (
              <>
                <ResizeHandle direction="nw" />
                <ResizeHandle direction="ne" />
                <ResizeHandle direction="sw" />
                <ResizeHandle direction="se" />
                <ResizeHandle direction="n" />
                <ResizeHandle direction="s" />
                <ResizeHandle direction="e" />
                <ResizeHandle direction="w" />
              </>
            )}
          </div>
        )}
      </div>

      {/* Right Alert Panel */}
      <div className="alert-panel">
        <div className="alert-header">
          <div className="alert-header-content">
            <div className="alert-header-text">
              <h2>Live Alerts</h2>
              <p>Real-time monitoring</p>
            </div>
            {alerts.length > 0 && (
              <span className="alert-badge">{alerts.length}</span>
            )}
          </div>
        </div>

        <div className="alert-list">
          {alerts.length === 0 ? (
            <div className="alert-empty">
              <div className="alert-empty-icon">✓</div>
              <div className="alert-empty-title">No Active Alerts</div>
              <div className="alert-empty-subtitle">All systems operating normally</div>
            </div>
          ) : (
            <div className="alerts-grid">
              {alerts.map((alert, index) => (
                <div
                  key={alert.sensor_id}
                  className={`alert-card ${alert.status.toLowerCase()}`}
                  style={{
                    animationDelay: `${index * 0.1}s`
                  }}
                >
                  <div className="alert-card-header">
                    <div className="alert-card-title">
                      <span className="alert-card-icon">
                        {sensorIcon[alert.type]}
                      </span>
                      <strong className="alert-card-name">
                        {alert.type.toUpperCase()}
                      </strong>
                    </div>
                    <span className={`alert-status-badge ${alert.status.toLowerCase()}`}>
                      {alert.status}
                    </span>
                  </div>
                  <div className="alert-reading">
                    Reading: {alert.value} {alert.unit}
                  </div>
                  <div className="alert-threshold">
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