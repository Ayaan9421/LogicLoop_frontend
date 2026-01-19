// MineLocation.jsx
import React, { useState, useEffect } from 'react';
import { MapContainer, TileLayer, Marker, Popup, useMap } from 'react-leaflet';
import { Pie } from 'react-chartjs-2';
import { Chart as ChartJS, ArcElement, Tooltip, Legend } from 'chart.js';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';
import './MineLocation.css';


ChartJS.register(ArcElement, Tooltip, Legend);

delete L.Icon.Default.prototype._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon-2x.png',
  iconUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon.png',
  shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-shadow.png',
});

// Emission data from your JSON file
const emissionData = [
  {
    sno: 1,
    mine_name: "A SHYAMSUNOERPURA",
    state: "West Bengal",
    district: "Paschim Bardhaman",
    owner: "ECL",
    govt_private: "G",
    mine_type: "UG",
    latitude: 23.6483,
    longitude: 87.2575,
    sink_area: 600,
    coal_extracted: 830000,
    fuel_emission: 33366000,
    electricity_emission: 300792,
    total_emission: 33666792,
    methane_emission: 8300000,
    solar: "1916 kwh/m2/year"
  },
  {
    sno: 2,
    mine_name: "ALP",
    state: "Telangana",
    district: "Mancherial",
    owner: "SCCL",
    govt_private: "SG",
    mine_type: "UG",
    latitude: 18.6648,
    longitude: 79.579,
    sink_area: 750,
    coal_extracted: 2060188,
    fuel_emission: 77298253.76,
    electricity_emission: 746612.13,
    total_emission: 78044865.89,
    methane_emission: 20601880,
    solar: "1720 kwh/m2/year"
  },
  {
    sno: 3,
    mine_name: "AMALGAMATED KESHALPUR WEST MUDIDIH COLLIERY (AKWMC)",
    state: "Jharkhand",
    district: "Dhanbad",
    owner: "BCCL",
    govt_private: "G",
    mine_type: "Mixed",
    latitude: 23.8078,
    longitude: 86.3221,
    sink_area: 700,
    coal_extracted: 4220000,
    fuel_emission: 113096000,
    electricity_emission: 1338162,
    total_emission: 114434162,
    methane_emission: 59080000,
    solar: "1800 kwh/m2/year"
  },
  {
    sno: 4,
    mine_name: "BANGWARA",
    state: "Madhya Pradesh",
    district: "Shahdol",
    owner: "SECL",
    govt_private: "G",
    mine_type: "UG",
    latitude: 23.1542,
    longitude: 81.5361,
    sink_area: 850,
    coal_extracted: 650000,
    fuel_emission: 27872000,
    electricity_emission: 294450,
    total_emission: 28166450,
    methane_emission: 9100000,
    solar: "1700 kwh/m2/year"
  },
  {
    sno: 5,
    mine_name: "BANSRA",
    state: "West Bengal",
    district: "Paschim Bardhaman",
    owner: "ECL",
    govt_private: "G",
    mine_type: "Mixed",
    latitude: 23.6296,
    longitude: 87.1382,
    sink_area: 850,
    coal_extracted: 730000,
    fuel_emission: 11738400,
    electricity_emission: 198414,
    total_emission: 11936814,
    methane_emission: 6570000
  },
  {
    sno: 6,
    mine_name: "BHANORA W/B (UG & OC)",
    state: "West Bengal",
    district: "Paschim Bardhaman",
    owner: "ECL",
    govt_private: "G",
    mine_type: "Mixed",
    latitude: 23.7276,
    longitude: 86.9943,
    sink_area: 800,
    coal_extracted: 480000,
    fuel_emission: 7718400,
    electricity_emission: 173952,
    total_emission: 7892352,
    methane_emission: 4800000,
    solar: "1916 kwh/m2/year"
  },
  {
    sno: 7,
    mine_name: "BHUBANESWARI",
    state: "Orissa",
    district: "Angul",
    owner: "MCL",
    govt_private: "G",
    mine_type: "OC",
    latitude: 20.9725,
    longitude: 85.1732,
    sink_area: 700,
    coal_extracted: 28000000,
    fuel_emission: 525280000,
    electricity_emission: 5073600,
    total_emission: 530353600,
    methane_emission: 336000000,
    solar: "1900 kwh/m2/year"
  },
  {
    sno: 13,
    mine_name: "GEVRA OC",
    state: "Chhattisgarh",
    district: "Korba",
    owner: "SECL",
    govt_private: "G",
    mine_type: "OC",
    latitude: 22.3308,
    longitude: 82.5958,
    sink_area: 1900,
    coal_extracted: 45000000,
    fuel_emission: 964800000,
    electricity_emission: 6115500,
    total_emission: 970915500,
    methane_emission: 765000000,
    solar: "2007.5 kwh/m2/year"
  }
];

// Layer Control Component
const LayerControl = () => {
  const map = useMap();

  useEffect(() => {
    const defaultLayer = L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
      maxZoom: 19,
      attribution: '© OpenStreetMap contributors'
    });

    const satelliteLayer = L.tileLayer('https://{s}.google.com/vt/lyrs=s&x={x}&y={y}&z={z}', {
      maxZoom: 19,
      subdomains: ['mt0', 'mt1', 'mt2', 'mt3']
    });

    satelliteLayer.addTo(map);

    const layerControl = L.control.layers({
      "Default": defaultLayer,
      "Satellite": satelliteLayer
    }).addTo(map);

    return () => {
      map.removeControl(layerControl);
    };
  }, [map]);

  return null;
};

// Sidebar Component
const MinesSidebar = ({ mines, onMineSelect, isOpen, onClose }) => {
  const [searchTerm, setSearchTerm] = useState('');

  const filteredMines = mines.filter(mine =>
    mine.mine_name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    mine.state.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className={`mines-sidebar ${isOpen ? 'mines-sidebar-open' : ''}`}>
      <div className="mines-sidebar-header">
        <h2>Coal Mines</h2>
        <button className="mines-close-btn" onClick={onClose}>×</button>
      </div>
      
      <input
        type="text"
        className="mines-search-input"
        placeholder="Search mines or states..."
        value={searchTerm}
        onChange={(e) => setSearchTerm(e.target.value)}
      />

      <ul className="mines-list">
        {filteredMines.map((mine) => (
          <li 
            key={mine.sno} 
            className="mine-list-item"
            onClick={() => onMineSelect(mine)}
          >
            <div className="mine-list-name">{mine.mine_name}</div>
            <div className="mine-list-location">{mine.state} - {mine.district}</div>
          </li>
        ))}
      </ul>
    </div>
  );
};

// Modal Component
const MineModal = ({ mine, onClose }) => {
  if (!mine) return null;

  const pieData = {
    labels: ['Fuel Emission', 'Electricity Emission', 'Methane Emission'],
    datasets: [{
      data: [
        Math.round(mine.fuel_emission),
        Math.round(mine.electricity_emission),
        Math.round(mine.methane_emission)
      ],
      backgroundColor: ['#ff6384', '#36a2eb', '#ffce56'],
      borderWidth: 2,
      borderColor: '#fff'
    }]
  };

  const pieOptions = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        position: 'bottom',
        labels: {
          padding: 15,
          font: { size: 12 }
        }
      },
      tooltip: {
        callbacks: {
          label: (context) => {
            const total = context.dataset.data.reduce((a, b) => a + b, 0);
            const value = context.raw;
            const percentage = ((value / total) * 100).toFixed(1);
            return `${context.label}: ${value.toLocaleString()} tons (${percentage}%)`;
          }
        }
      }
    }
  };

  return (
    <div className="mine-modal-overlay" onClick={onClose}>
      <div className="mine-modal-content" onClick={(e) => e.stopPropagation()}>
        <button className="mine-modal-close" onClick={onClose}>×</button>
        
        <h2 className="mine-modal-title">Mine Information</h2>
        
        <div className="mine-info-section">
          <div className="mine-info-grid">
            <div className="mine-info-item">
              <span className="mine-info-label">Mine Name:</span>
              <span className="mine-info-value">{mine.mine_name}</span>
            </div>
            <div className="mine-info-item">
              <span className="mine-info-label">State:</span>
              <span className="mine-info-value">{mine.state}</span>
            </div>
            <div className="mine-info-item">
              <span className="mine-info-label">District:</span>
              <span className="mine-info-value">{mine.district}</span>
            </div>
            <div className="mine-info-item">
              <span className="mine-info-label">Mine Type:</span>
              <span className="mine-info-value">{mine.mine_type}</span>
            </div>
            <div className="mine-info-item">
              <span className="mine-info-label">Owner:</span>
              <span className="mine-info-value">{mine.owner}</span>
            </div>
            <div className="mine-info-item">
              <span className="mine-info-label">Type:</span>
              <span className="mine-info-value">{mine.govt_private === 'G' ? 'Government' : 'Private'}</span>
            </div>
          </div>
        </div>

        <div className="mine-stats-section">
          <h3>Production & Emissions (2023)</h3>
          <div className="mine-stats-grid">
            <div className="mine-stat-card">
              <div className="mine-stat-label">Coal Extracted</div>
              <div className="mine-stat-value">{(mine.coal_extracted / 1000000).toFixed(2)}M tons</div>
            </div>
            <div className="mine-stat-card">
              <div className="mine-stat-label">Total Emissions</div>
              <div className="mine-stat-value">{(mine.total_emission / 1000000).toFixed(2)}M tons</div>
            </div>
            <div className="mine-stat-card">
              <div className="mine-stat-label">Sink Area</div>
              <div className="mine-stat-value">{mine.sink_area} hectares</div>
            </div>
            {mine.solar && (
              <div className="mine-stat-card">
                <div className="mine-stat-label">Solar Potential</div>
                <div className="mine-stat-value">{mine.solar}</div>
              </div>
            )}
          </div>
        </div>

        <div className="mine-chart-section">
          <h3>Emissions Breakdown</h3>
          <div className="mine-chart-container">
            <Pie data={pieData} options={pieOptions} />
          </div>
        </div>
      </div>
    </div>
  );
};

// Main Component
const MineLocation = () => {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [selectedMine, setSelectedMine] = useState(null);
  const [modalOpen, setModalOpen] = useState(false);
  const [mapKey, setMapKey] = useState(0);

  const handleMineSelect = (mine) => {
    setSelectedMine(mine);
    setModalOpen(true);
    setSidebarOpen(false);
    setMapKey(prev => prev + 1);
  };

  const handleMarkerClick = (mine) => {
    setSelectedMine(mine);
    setModalOpen(true);
  };

  return (
    <div className="mine-location-container">
      <button 
        className="mine-hamburger-btn"
        onClick={() => setSidebarOpen(!sidebarOpen)}
      >
        ☰
      </button>

      <MinesSidebar
        mines={emissionData}
        onMineSelect={handleMineSelect}
        isOpen={sidebarOpen}
        onClose={() => setSidebarOpen(false)}
      />

      <MapContainer
        key={mapKey}
        center={selectedMine ? [selectedMine.latitude, selectedMine.longitude] : [20.5937, 78.9629]}
        zoom={selectedMine ? 12 : 5}
        style={{ height: '100%', width: '100%' }}
      >
        <TileLayer
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
          attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
        />
        <LayerControl />

        {emissionData.map((mine) => (
          <Marker
            key={mine.sno}
            position={[mine.latitude, mine.longitude]}
            eventHandlers={{
              click: () => handleMarkerClick(mine)
            }}
          >
            <Popup>
              <strong>{mine.mine_name}</strong>
              <br />
              {mine.state}, {mine.district}
            </Popup>
          </Marker>
        ))}
      </MapContainer>

      {modalOpen && (
        <MineModal
          mine={selectedMine}
          onClose={() => setModalOpen(false)}
        />
      )}
    </div>
  );
};

export default MineLocation;