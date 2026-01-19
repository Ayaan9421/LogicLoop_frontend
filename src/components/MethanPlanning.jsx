import React, { useState } from 'react';
import { Wind, AlertTriangle, TrendingDown, MapPin, Clock, CheckCircle } from 'lucide-react';
import './MethanPlanning.css';

const MethanePlanning = () => {
  const [activeZone, setActiveZone] = useState('all');

  const zones = [
    { id: 'zone-a', name: 'Zone A', risk: 'high', concentration: '7.8%', status: 'critical', incidents: 3 },
    { id: 'zone-b', name: 'Zone B', risk: 'medium', concentration: '4.2%', status: 'warning', incidents: 1 },
    { id: 'zone-c', name: 'Zone C', risk: 'low', concentration: '1.5%', status: 'safe', incidents: 0 },
    { id: 'zone-d', name: 'Zone D', risk: 'medium', concentration: '3.8%', status: 'warning', incidents: 2 }
  ];

  const mitigationActions = [
    {
      action: 'Upgrade Ventilation System',
      zone: 'Zone A',
      priority: 'critical',
      progress: 65,
      deadline: 'Jan 25, 2026',
      assignee: 'Engineering Team'
    },
    {
      action: 'Install Additional CH4 Sensors',
      zone: 'Zone D',
      priority: 'high',
      progress: 40,
      deadline: 'Jan 30, 2026',
      assignee: 'Safety Team'
    },
    {
      action: 'Conduct Emergency Drill',
      zone: 'All Zones',
      priority: 'medium',
      progress: 100,
      deadline: 'Completed',
      assignee: 'Operations'
    },
    {
      action: 'Sensor Calibration Routine',
      zone: 'Zone B',
      priority: 'low',
      progress: 80,
      deadline: 'Feb 05, 2026',
      assignee: 'Maintenance'
    }
  ];

  const filteredActions = activeZone === 'all' 
    ? mitigationActions 
    : mitigationActions.filter(a => a.zone.toLowerCase().includes(activeZone.toLowerCase()) || a.zone === 'All Zones');

  return (
    <div className="methane-page">
      <div className="page-header-section">
        <div>
          <div className="breadcrumb-small">
            <span>Home</span>
            <span>/</span>
            <span>Methane Planning</span>
          </div>
          <h1>Methane Risk Management & Planning</h1>
          <p>Monitor methane concentrations, assess risks, and track mitigation strategies across mine zones</p>
        </div>
        <button className="btn-primary">
          <AlertTriangle size={20} />
          Create Safety Alert
        </button>
      </div>

      <div className="metrics-grid-methane">
        <div className="metric-card-methane alert">
          <div className="metric-icon">
            <Wind size={28} color="#f59e0b" />
          </div>
          <div className="metric-badge-alert">High Risk</div>
          <div className="metric-label">Average CH4 Concentration</div>
          <div className="metric-value">
            4.3<span className="metric-unit">%</span>
          </div>
          <div className="metric-target">Threshold: 2% CH4</div>
        </div>

        <div className="metric-card-methane">
          <div className="metric-icon">
            <AlertTriangle size={28} color="#64748b" />
          </div>
          <div className="metric-label">Active Risk Zones</div>
          <div className="metric-value">2</div>
          <div className="metric-target">Out of 4 zones</div>
        </div>

        <div className="metric-card-methane success">
          <div className="metric-icon">
            <TrendingDown size={28} color="#10b981" />
          </div>
          <div className="metric-badge-success">Improving</div>
          <div className="metric-label">Incident Reduction</div>
          <div className="metric-value">
            25<span className="metric-unit">%</span>
          </div>
          <div className="metric-target">vs. Last Quarter</div>
        </div>

        <div className="metric-card-methane">
          <div className="metric-icon">
            <CheckCircle size={28} color="#64748b" />
          </div>
          <div className="metric-label">Mitigation Actions</div>
          <div className="metric-value">12</div>
          <div className="metric-target">8 completed, 4 ongoing</div>
        </div>
      </div>

      <div className="methane-content-grid">
        <div className="zones-card">
          <div className="card-header">
            <div>
              <h3>Zone Risk Assessment</h3>
              <p className="card-subtitle">Real-time methane concentration by zone</p>
            </div>
            <div className="zone-filter">
              <button 
                className={`filter-tab ${activeZone === 'all' ? 'active' : ''}`}
                onClick={() => setActiveZone('all')}
              >
                All
              </button>
              <button 
                className={`filter-tab ${activeZone === 'zone-a' ? 'active' : ''}`}
                onClick={() => setActiveZone('zone-a')}
              >
                Zone A
              </button>
              <button 
                className={`filter-tab ${activeZone === 'zone-b' ? 'active' : ''}`}
                onClick={() => setActiveZone('zone-b')}
              >
                Zone B
              </button>
            </div>
          </div>

          <div className="zones-list">
            {zones.map((zone) => (
              <div key={zone.id} className={`zone-item ${zone.status}`}>
                <div className="zone-header">
                  <div className="zone-name">
                    <MapPin size={18} />
                    <span>{zone.name}</span>
                  </div>
                  <div className={`zone-badge ${zone.status}`}>
                    {zone.status === 'critical' && 'CRITICAL'}
                    {zone.status === 'warning' && 'WARNING'}
                    {zone.status === 'safe' && 'SAFE'}
                  </div>
                </div>
                <div className="zone-metrics">
                  <div className="zone-metric">
                    <span className="metric-label-small">CH4 Level</span>
                    <span className="metric-value-small">{zone.concentration}</span>
                  </div>
                  <div className="zone-metric">
                    <span className="metric-label-small">Risk Level</span>
                    <span className="metric-value-small">{zone.risk.toUpperCase()}</span>
                  </div>
                  <div className="zone-metric">
                    <span className="metric-label-small">Incidents</span>
                    <span className="metric-value-small">{zone.incidents}</span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        <div className="actions-list-card">
          <div className="card-header">
            <h3>Mitigation Actions Tracker</h3>
          </div>

          <div className="actions-list">
            {filteredActions.map((action, index) => (
              <div key={index} className="action-item-methane">
                <div className="action-header-row">
                  <span className="action-title">{action.action}</span>
                  <span className={`priority-badge ${action.priority}`}>
                    {action.priority.toUpperCase()}
                  </span>
                </div>
                <div className="action-details">
                  <span className="action-detail">
                    <MapPin size={14} />
                    {action.zone}
                  </span>
                  <span className="action-detail">
                    <Clock size={14} />
                    {action.deadline}
                  </span>
                </div>
                <div className="action-progress">
                  <div className="progress-bar-bg">
                    <div 
                      className="progress-bar-fill-methane" 
                      style={{ width: `${action.progress}%` }}
                    ></div>
                  </div>
                  <span className="progress-text">{action.progress}%</span>
                </div>
                <div className="action-assignee">Assigned: {action.assignee}</div>
              </div>
            ))}
          </div>
        </div>
      </div>

      <div className="monitoring-card">
        <div className="card-header">
          <h3>Sensor Network Status</h3>
          <p className="card-subtitle">30 sensors active across 4 zones</p>
        </div>
        <div className="sensor-grid">
          <div className="sensor-stat">
            <div className="stat-value">28</div>
            <div className="stat-label">Online</div>
            <div className="stat-indicator online"></div>
          </div>
          <div className="sensor-stat">
            <div className="stat-value">2</div>
            <div className="stat-label">Offline</div>
            <div className="stat-indicator offline"></div>
          </div>
          <div className="sensor-stat">
            <div className="stat-value">0</div>
            <div className="stat-label">Maintenance</div>
            <div className="stat-indicator maintenance"></div>
          </div>
          <div className="sensor-stat">
            <div className="stat-value">93%</div>
            <div className="stat-label">Uptime</div>
            <div className="stat-indicator success"></div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default MethanePlanning;