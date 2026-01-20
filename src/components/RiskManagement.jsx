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
      <div style={{ 
        display: "flex", 
        justifyContent: "center", 
        gap: "20px", 
        margin: "20px",
        flexWrap: "wrap"
      }}>
        <div style={{ 
          padding: "15px 30px", 
          background: "#006400", 
          color: "#fff", 
          borderRadius: "8px",
          minWidth: "120px",
          textAlign: "center",
          boxShadow: "0 2px 8px rgba(0,0,0,0.15)"
        }}>
          <div style={{ fontSize: "32px", fontWeight: "bold" }}>{riskCounts.Low}</div>
          <div style={{ fontSize: "12px", marginTop: "5px", opacity: 0.9 }}>Low Risk</div>
        </div>
        <div style={{ 
          padding: "15px 30px", 
          background: "#ADFF2F", 
          color: "#000", 
          borderRadius: "8px",
          minWidth: "120px",
          textAlign: "center",
          boxShadow: "0 2px 8px rgba(0,0,0,0.15)"
        }}>
          <div style={{ fontSize: "32px", fontWeight: "bold" }}>{riskCounts.Medium}</div>
          <div style={{ fontSize: "12px", marginTop: "5px" }}>Medium Risk</div>
        </div>
        <div style={{ 
          padding: "15px 30px", 
          background: "#FFD700", 
          color: "#000", 
          borderRadius: "8px",
          minWidth: "120px",
          textAlign: "center",
          boxShadow: "0 2px 8px rgba(0,0,0,0.15)"
        }}>
          <div style={{ fontSize: "32px", fontWeight: "bold" }}>{riskCounts.High}</div>
          <div style={{ fontSize: "12px", marginTop: "5px" }}>High Risk</div>
        </div>
      </div>

      {/* Map Container */}
      <div style={{ position: "relative", flex: 1, margin: "0 20px 20px" }}>
        {/* Legend */}
        <div style={{ 
          position: "absolute", 
          top: "20px", 
          right: "20px", 
          zIndex: 1000,
          background: "#000",
          color: "#fff",
          padding: "15px",
          borderRadius: "8px",
          boxShadow: "0 2px 10px rgba(0,0,0,0.3)",
          maxWidth: "200px"
        }}>
          <h4 style={{ margin: "0 0 10px 0", fontSize: "14px" }}>Risk Levels</h4>
          <div style={{ display: "flex", flexDirection: "column", gap: "8px" }}>
            <div style={{ display: "flex", alignItems: "center", gap: "8px" }}>
              <div style={{ width: "20px", height: "20px", background: "#006400", borderRadius: "3px" }}></div>
              <span style={{ fontSize: "12px" }}>Low (&lt;5%)</span>
            </div>
            <div style={{ display: "flex", alignItems: "center", gap: "8px" }}>
              <div style={{ width: "20px", height: "20px", background: "#ADFF2F", borderRadius: "3px" }}></div>
              <span style={{ fontSize: "12px" }}>Medium (5-10%)</span>
            </div>
            <div style={{ display: "flex", alignItems: "center", gap: "8px" }}>
              <div style={{ width: "20px", height: "20px", background: "#FFD700", borderRadius: "3px" }}></div>
              <span style={{ fontSize: "12px" }}>High (&gt;10%)</span>
            </div>
          </div>
          <div style={{ marginTop: "15px", paddingTop: "10px", borderTop: "1px solid #444" }}>
            <h4 style={{ margin: "0 0 8px 0", fontSize: "12px" }}>Risk Factors</h4>
            <ul style={{ margin: 0, paddingLeft: "20px", fontSize: "11px", lineHeight: "1.6" }}>
              <li>Slope angle</li>
              <li>Rainfall</li>
              <li>Humidity</li>
              <li>Intensity score</li>
            </ul>
          </div>
        </div>

        <div id="map" style={{ height: "100%", width: "100%", borderRadius: "8px", overflow: "hidden" }} />
      </div>
    </div>
  );
};

export default RiskManagement;