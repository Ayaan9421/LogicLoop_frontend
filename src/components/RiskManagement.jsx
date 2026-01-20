import React, { useEffect, useState } from "react";
import L from "leaflet";
import "leaflet/dist/leaflet.css";
import "leaflet.heat";

const RiskManagement = () => {
  const [riskCounts, setRiskCounts] = useState({ Low: 0, Medium: 0, High: 0 });

  const getRiskLevel = (intensity) => {
    if (intensity < 0.05) return { level: "Low", color: "#006400" };
    if (intensity < 0.10) return { level: "Medium", color: "#ADFF2F" };
    return { level: "High", color: "#FFD700" };
  };

  useEffect(() => {
    const points = [
      { humidity: 43, intensity: 0.06999, lat: 23.6483, lng: 87.2575, mine: "A SHYAMSUNOERPURA", rain: 0, slope: 7 },
      { humidity: 29, intensity: 0.03868, lat: 18.6648, lng: 79.579, mine: "ALP", rain: 0, slope: 1 },
      { humidity: 28, intensity: 0.13516, lat: 23.8078, lng: 86.3221, mine: "AKWMC", rain: 0, slope: 27 },
      { humidity: 31, intensity: 0.08895, lat: 23.1542, lng: 81.5361, mine: "BANGWARA", rain: 0, slope: 16 },
      { humidity: 43, intensity: 0.09419, lat: 23.6296, lng: 87.1382, mine: "BANSRA", rain: 0, slope: 14 },
      { humidity: 30, intensity: 0.03494, lat: 23.7276, lng: 86.9943, mine: "BHANORA", rain: 0, slope: 1 },
      { humidity: 25, intensity: 0.1125, lat: 20.9725, lng: 85.1732, mine: "BHUBANESWARI", rain: 0, slope: 1 },
      { humidity: 25, intensity: 0.174, lat: 22.3308, lng: 82.5958, mine: "GEVRA OC", rain: 0, slope: 4 }
    ];

    // Calculate actual risk counts
    const counts = { Low: 0, Medium: 0, High: 0 };
    points.forEach(p => {
      const risk = getRiskLevel(p.intensity);
      counts[risk.level]++;
    });
    setRiskCounts(counts);

    const map = L.map("map").setView([23, 85], 5);

    L.tileLayer("https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png", {
      attribution: "&copy; OpenStreetMap contributors"
    }).addTo(map);

    // Normalize intensity
    const maxIntensity = Math.max(...points.map(p => p.intensity));

    const heatData = points.map(p => [
      p.lat,
      p.lng,
      p.intensity / maxIntensity
    ]);

    // Heatmap
    L.heatLayer(heatData, {
      radius: 35,
      blur: 30,
      minOpacity: 0.4,
      gradient: {
        0.2: "#006400",   // low risk
        0.5: "#ADFF2F",   // medium risk
        0.9: "#FFD700"    // high risk
      }
    }).addTo(map);

    // Popups
    points.forEach(p => {
      const risk = getRiskLevel(p.intensity);
      L.circleMarker([p.lat, p.lng], {
        radius: 8,
        color: risk.color,
        fillColor: risk.color,
        fillOpacity: 0.7,
        weight: 2
      })
        .addTo(map)
        .bindPopup(
          `<div style="font-family: Arial, sans-serif;">
             <b style="font-size: 14px; color: #333;">${p.mine}</b>
             <div style="margin-top: 8px; padding: 6px; background: ${risk.color}; color: #000; border-radius: 4px; font-weight: bold;">
               Risk Level: ${risk.level}
             </div>
             <div style="margin-top: 8px; line-height: 1.6;">
               <b>Intensity:</b> ${(p.intensity * 100).toFixed(2)}%<br>
               <b>Slope:</b> ${p.slope}°<br>
               <b>Rain:</b> ${p.rain} mm<br>
               <b>Humidity:</b> ${p.humidity}%
             </div>
           </div>`
        );
    });

    return () => map.remove();
  }, []);

  return (
    <div style={{ fontFamily: "Arial, sans-serif", height: "100%", display: "flex", flexDirection: "column" }}>
      {/* Risk Dashboard */}
      {/* Risk Gradient Bar */}
      <div
        style={{
          margin: "20px",
          padding: "14px 20px",
          background: "#242424",
          borderRadius: "10px",
          boxShadow: "0 2px 10px rgba(0,0,0,0.25)"
        }}
      >
        <div
          style={{
            height: "18px",
            borderRadius: "10px",
            background: "linear-gradient(to right, #006400, #ADFF2F, #FFD700, #ef4444)"
          }}
        />

        <div
          style={{
            display: "flex",
            justifyContent: "space-between",
            marginTop: "8px",
            fontSize: "12px",
            color: "#e5e7eb",
            fontWeight: "600"
          }}
        >
          <span>LOW RISK</span>
          <span>HIGH RISK</span>
        </div>

        <div
          style={{
            textAlign: "center",
            marginTop: "6px",
            fontSize: "11px",
            color: "#9ca3af"
          }}
        >
          Risk Intensity Scale
        </div>
      </div>


      {/* Map Container */}
      <div style={{ position: "relative", flex: 1, margin: "0 20px 20px" }}>
        {/* Legend */}

        <div id="map" style={{ height: "100%", width: "100%", borderRadius: "8px", overflow: "hidden" }} />
      </div>
    </div>
  );
};

export default RiskManagement;