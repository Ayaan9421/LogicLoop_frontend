import { useState, useEffect } from "react";
import SensorSidebar from "../components/SensorSidebar";
import MapCanvas from "../components/MapCanvas";
import AlertPanel from "../components/AlertPanel";

const MineMonitor = () => {
        const [mapUrl, setMapUrl] = useState(null);
        const [mapId, setMapId] = useState(null);
        const [sensors, setSensors] = useState([]);
        const [activeSensorType, setActiveSensorType] = useState(null);
        const [sensorReadings, setSensorReadings] = useState([]);

        useEffect(() => {
                if (!mapId) return;

                const interval = setInterval(async () => {
                        const res = await fetch(
                                `http://localhost:8000/simulate/readings?map_id=${mapId}`
                        );
                        const data = await res.json();
                        setSensorReadings(data.readings || []);
                }, 15000);

                return () => clearInterval(interval);
        }, [mapId]);



        return (
                <div className="mine-monitor">

                        <AlertPanel readings={sensorReadings} />

                        <SensorSidebar
                                setMapUrl={setMapUrl}
                                setMapId={setMapId}
                                setActiveSensorType={setActiveSensorType}
                        />

                        <MapCanvas
                                mapUrl={mapUrl}
                                sensors={sensors}
                                setSensors={setSensors}
                                activeSensorType={activeSensorType}
                                sensorReadings={sensorReadings}
                        />

                        {mapId && (
                                <button
                                        style={{
                                                position: "fixed",
                                                bottom: 20,
                                                right: 20,
                                                padding: "12px 18px",
                                                background: "#10b981",
                                                color: "white",
                                                borderRadius: "8px",
                                                border: "none",
                                        }}
                                        onClick={async () => {
                                                await fetch("http://localhost:8000/sensors/save", {
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
                                                alert("Sensors saved");
                                        }}
                                >
                                        💾 Save Sensors
                                </button>
                        )}
                </div>
        );
};

export default MineMonitor;