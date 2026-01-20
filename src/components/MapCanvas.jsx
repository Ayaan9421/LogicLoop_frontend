import React, { useRef, useState, useEffect } from "react";
import Sensors from "./Sensors";
import { v4 as uuid } from "uuid";

// Simple icons for the toolbar
const IconMove = () => <span>✋ Drag/Resize</span>;
const IconSensor = () => <span>📍 Place Sensors</span>;

const MapCanvas = ({ mapUrl, sensors, setSensors, activeSensorType, sensorReadings, }) => {
        // --- STATE ---
        // Mode: 'interact' (place sensors) or 'edit' (move/resize map)
        const [mode, setMode] = useState("interact");

        // Map Transformation State
        const [position, setPosition] = useState({ x: 50, y: 50 });
        const [size, setSize] = useState({ width: 600, height: 400 });

        // Internal Dragging State
        const [isDragging, setIsDragging] = useState(false);

        // Refs
        const containerRef = useRef(null); // The full screen canvas
        const wrapperRef = useRef(null);   // The moving map wrapper

        // Set initial aspect ratio when image loads
        const handleImageLoad = (e) => {
                const ratio = e.target.naturalHeight / e.target.naturalWidth;
                setSize((prev) => ({ ...prev, height: prev.width * ratio }));
        };

        // ----------------------------------------------------------------
        // 1. DRAG (MOVE) LOGIC
        // Only works if mode === 'edit'
        // ----------------------------------------------------------------
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

        // ----------------------------------------------------------------
        // 2. RESIZE LOGIC
        // Works whenever you grab a handle, regardless of mode (usually better UX)
        // ----------------------------------------------------------------
        const startResize = (e, direction) => {
                e.preventDefault();
                e.stopPropagation(); // Stop it from triggering the "Move" logic below

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

                        // Width Changes
                        if (direction.includes("e")) {
                                newSize.width = Math.max(100, startWidth + dx);
                        }
                        if (direction.includes("w")) {
                                newSize.width = Math.max(100, startWidth - dx);
                                newPos.x = startLeft + dx;
                        }

                        // Height Changes
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

        // ----------------------------------------------------------------
        // 3. SENSOR PLACEMENT
        // Only works if mode === 'interact'
        // ----------------------------------------------------------------
        const handleMapClick = (e) => {
                if (mode === "edit" || !activeSensorType || !wrapperRef.current) return;

                const rect = wrapperRef.current.getBoundingClientRect();
                const x = (e.clientX - rect.left) / rect.width;
                const y = (e.clientY - rect.top) / rect.height;

                // Boundary check
                if (x < 0 || y < 0 || x > 1 || y > 1) return;

                setSensors((prev) => [
                        ...prev,
                        { id: uuid(), type: activeSensorType, x, y },
                ]);
        };

        return (
                <div
                        ref={containerRef}
                        className="map-canvas"
                        style={{
                                position: "relative",
                                width: "100%",
                                height: "100vh",
                                backgroundColor: "#e5e7eb",
                                overflow: "hidden",
                        }}
                >
                        {/* --- TOOLBAR --- */}
                        <div
                                style={{
                                        position: "absolute",
                                        top: 20,
                                        left: "50%",
                                        transform: "translateX(-50%)",
                                        zIndex: 100,
                                        backgroundColor: "white",
                                        padding: "8px 16px",
                                        borderRadius: "8px",
                                        boxShadow: "0 4px 6px rgba(0,0,0,0.1)",
                                        display: "flex",
                                        gap: "10px",
                                }}
                        >
                                <button
                                        onClick={() => setMode("interact")}
                                        style={{
                                                padding: "8px 12px",
                                                background: mode === "interact" ? "#3b82f6" : "#f3f4f6",
                                                color: mode === "interact" ? "white" : "black",
                                                border: "none",
                                                borderRadius: "4px",
                                                cursor: "pointer",
                                        }}
                                >
                                        <IconSensor />
                                </button>
                                <button
                                        onClick={() => setMode("edit")}
                                        style={{
                                                padding: "8px 12px",
                                                background: mode === "edit" ? "#3b82f6" : "#f3f4f6",
                                                color: mode === "edit" ? "white" : "black",
                                                border: "none",
                                                borderRadius: "4px",
                                                cursor: "pointer",
                                        }}
                                >
                                        <IconMove />
                                </button>
                        </div>

                        {!mapUrl ? (
                                <div style={{ textAlign: "center", marginTop: 100, color: "#666" }}>
                                        Upload a mine map to start
                                </div>
                        ) : (
                                <div
                                        ref={wrapperRef}
                                        onMouseDown={startDragMove} // Drag Logic attached here
                                        onClick={handleMapClick}    // Sensor Logic attached here
                                        style={{
                                                position: "absolute",
                                                left: `${position.x}px`,
                                                top: `${position.y}px`,
                                                width: `${size.width}px`,
                                                height: `${size.height}px`,
                                                cursor: mode === "edit" ? (isDragging ? "grabbing" : "grab") : "crosshair",
                                                boxShadow: "0 10px 15px rgba(0,0,0,0.1)",
                                                userSelect: "none", // Critical for clean dragging
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
                                                        pointerEvents: "none", // Allows clicks to pass through to the div
                                                        display: "block",
                                                }}
                                        />

                                        <Sensors
                                                sensors={sensors}
                                                readings={sensorReadings}
                                        />

                                        {/* Resize Handles - Only visible in Edit Mode? 
              Lets keep them visible but only 'active' feeling if you want. 
              Here I render them always, but you can wrap in {mode === 'edit' && ...}
          */}
                                        {mode === 'edit' && (
                                                <>
                                                        <Handle dir="nw" onResize={startResize} />
                                                        <Handle dir="ne" onResize={startResize} />
                                                        <Handle dir="sw" onResize={startResize} />
                                                        <Handle dir="se" onResize={startResize} />
                                                        <Handle dir="n" onResize={startResize} />
                                                        <Handle dir="s" onResize={startResize} />
                                                        <Handle dir="e" onResize={startResize} />
                                                        <Handle dir="w" onResize={startResize} />
                                                        {/* Border outline for visibility */}
                                                        <div style={{ position: 'absolute', inset: 0, border: '2px dashed #3b82f6', pointerEvents: 'none' }} />
                                                </>
                                        )}
                                </div>
                        )}
                </div>
        );
};

// Reusable Handle Component
const Handle = ({ dir, onResize }) => {
        const size = 12;
        const offset = -size / 2;
        const style = {
                position: "absolute",
                width: size,
                height: size,
                backgroundColor: "white",
                border: "1px solid #3b82f6",
                zIndex: 50,
                cursor: `${dir}-resize`,
        };

        // Position Logic
        if (dir.includes("n")) style.top = offset;
        if (dir.includes("s")) style.bottom = offset;
        if (dir.includes("w")) style.left = offset;
        if (dir.includes("e")) style.right = offset;
        if (dir === "n" || dir === "s") { style.left = "50%"; style.marginLeft = offset; }
        if (dir === "e" || dir === "w") { style.top = "50%"; style.marginTop = offset; }

        return <div onMouseDown={(e) => onResize(e, dir)} style={style} />;
};

export default MapCanvas;