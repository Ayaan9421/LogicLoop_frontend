// components/SensorSidebar.jsx
import React from "react";

const SensorSidebar = ({ setMapUrl, setMapId, setActiveSensorType }) => {
        return (
                <div className="sensor-sidebar">
                        <h2>Mine Monitor</h2>

                        <h4>Sensors</h4>

                        <div className="sensor-list">
                                <button onClick={() => setActiveSensorType("methane")}>
                                        🟢 Methane Sensor
                                </button>
                                <button onClick={() => setActiveSensorType("airflow")}>
                                        🔵 Airflow Sensor
                                </button>
                                <button onClick={() => setActiveSensorType("temperature")}>
                                        🔴 Temperature Sensor
                                </button>
                        </div>

                        <hr />

                        <label className="upload-btn">
                                Upload Mine Map
                                <input
                                        type="file"
                                        hidden
                                        onChange={async (e) => {
                                                const file = e.target.files[0];
                                                if (!file) return;

                                                const formData = new FormData();
                                                formData.append("file", file);

                                                const res = await fetch("http://localhost:8000/map/upload", {
                                                        method: "POST",
                                                        body: formData,
                                                });

                                                const data = await res.json();

                                                // ✅ Set map URL
                                                const fullUrl = `http://localhost:8000${data.map_url}`;
                                                setMapUrl(fullUrl);

                                                // ✅ Extract mapId (filename without extension)
                                                const filename = data.map_url.split("/").pop(); // uuid.png
                                                const mapId = filename.split(".")[0];           // uuid
                                                setMapId(mapId);
                                        }}
                                />
                        </label>
                </div>
        );
};

export default SensorSidebar;
