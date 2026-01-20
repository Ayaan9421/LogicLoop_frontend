import React, { useRef, useState } from "react";
import Sensors from "./Sensors";
import { v4 as uuid } from "uuid";

const MapCanvas = ({ mapUrl, sensors, setSensors, activeSensorType, sensorReadings }) => {
  const [mode, setMode] = useState("interact");
  const [position, setPosition] = useState({ x: 50, y: 50 });
  const [size, setSize] = useState({ width: 600, height: 400 });
  const [isDragging, setIsDragging] = useState(false);
  const containerRef = useRef(null);
  const wrapperRef = useRef(null);

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

    setSensors((prev) => [
      ...prev,
      { id: uuid(), type: activeSensorType, x, y },
    ]);
  };

  const Handle = ({ dir, onResize }) => {
    const size = 14;
    const offset = -size / 2;
    const style = {
      position: "absolute",
      width: size,
      height: size,
      backgroundColor: "white",
      border: "2px solid #3b82f6",
      zIndex: 50,
      cursor: `${dir}-resize`,
      borderRadius: "50%",
      boxShadow: "0 2px 8px rgba(59,130,246,0.3)"
    };

    if (dir.includes("n")) style.top = offset;
    if (dir.includes("s")) style.bottom = offset;
    if (dir.includes("w")) style.left = offset;
    if (dir.includes("e")) style.right = offset;
    if (dir === "n" || dir === "s") { style.left = "50%"; style.marginLeft = offset; }
    if (dir === "e" || dir === "w") { style.top = "50%"; style.marginTop = offset; }

    return <div onMouseDown={(e) => onResize(e, dir)} style={style} />;
  };

  return (
    <div
      ref={containerRef}
      style={{
        position: "relative",
        width: "100%",
        height: "100vh",
        background: "linear-gradient(135deg, #f0f4f8 0%, #e2e8f0 100%)",
        overflow: "hidden",
      }}
    >
      <div
        style={{
          position: "absolute",
          top: 20,
          left: "50%",
          transform: "translateX(-50%)",
          zIndex: 100,
          backgroundColor: "white",
          padding: "6px",
          borderRadius: 12,
          boxShadow: "0 10px 40px rgba(0,0,0,0.12)",
          display: "flex",
          gap: "6px",
          border: "1px solid #e5e7eb"
        }}
      >
        <button
          onClick={() => setMode("interact")}
          style={{
            padding: "10px 16px",
            background: mode === "interact" ? "linear-gradient(135deg, #3b82f6, #2563eb)" : "#f9fafb",
            color: mode === "interact" ? "white" : "#6b7280",
            border: "none",
            borderRadius: 8,
            cursor: "pointer",
            fontSize: 14,
            fontWeight: 600,
            transition: "all 0.2s",
            boxShadow: mode === "interact" ? "0 4px 12px rgba(59,130,246,0.3)" : "none"
          }}
        >
          📍 Place Sensors
        </button>
        <button
          onClick={() => setMode("edit")}
          style={{
            padding: "10px 16px",
            background: mode === "edit" ? "linear-gradient(135deg, #3b82f6, #2563eb)" : "#f9fafb",
            color: mode === "edit" ? "white" : "#6b7280",
            border: "none",
            borderRadius: 8,
            cursor: "pointer",
            fontSize: 14,
            fontWeight: 600,
            transition: "all 0.2s",
            boxShadow: mode === "edit" ? "0 4px 12px rgba(59,130,246,0.3)" : "none"
          }}
        >
          ✋ Drag/Resize
        </button>
      </div>

      {!mapUrl ? (
        <div
          style={{
            textAlign: "center",
            marginTop: 100,
            color: "#9ca3af",
            fontSize: 16
          }}
        >
          <div style={{ fontSize: 64, marginBottom: 16 }}>📁</div>
          Upload a mine map to start
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
            cursor:
              mode === "edit"
                ? isDragging
                  ? "grabbing"
                  : "grab"
                : "crosshair",
            boxShadow: "0 20px 60px rgba(0,0,0,0.15)",
            userSelect: "none",
            borderRadius: 8,
            overflow: "hidden",
            border: mode === "edit" ? "3px solid #3b82f6" : "none"
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
              display: "block",
            }}
          />

          <Sensors sensors={sensors} readings={sensorReadings} />

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
  );
};

export default MapCanvas;