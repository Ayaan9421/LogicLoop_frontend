// components/Sensors.jsx
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

        // Update the pulse timestamp whenever readings change
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
                        {sensors.map((s) => {
                                // Find the reading for this sensor
                                const live = readings.find((r) => r.sensor_id === s.id);
                                const status = live?.status || "SAFE";
                                const color = statusColor[status];

                                // Get the timestamp for the "key"
                                const pulseKey = pulseMap[s.id] || "init";

                                return (
                                        <div
                                                key={s.id}
                                                className={`sensor-icon ${status.toLowerCase()}`}
                                                style={{
                                                        position: "absolute",
                                                        left: `${s.x * 100}%`,
                                                        top: `${s.y * 100}%`,
                                                        transform: "translate(-50%, -50%)",
                                                        cursor: "pointer", // Make it look interactive
                                                }}
                                                title={
                                                        live
                                                                ? `${s.type.toUpperCase()}: ${live.value} ${live.unit} (${status})`
                                                                : s.type
                                                }
                                        >
                                                <span style={{ fontSize: "22px", zIndex: 2 }}>
                                                        {sensorIcon[s.type]}
                                                </span>

                                                {/* 👇 FIX IS HERE: 
                           1. We only render the ripple if we have a live reading.
                           2. We use 'key={pulseKey}'. When this changes (new data), 
                              React removes this span and adds a new one.
                              This restarts the CSS animation from 0%.
                        */}
                                                {live && (
                                                        <span
                                                                key={pulseKey}
                                                                className="sensor-ripple"
                                                                style={{
                                                                        borderColor: color,
                                                                        // Optional: Make danger pulses faster via inline style or keep CSS class
                                                                        animationDuration: status === "DANGER" ? "0.8s" : "1.6s"
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