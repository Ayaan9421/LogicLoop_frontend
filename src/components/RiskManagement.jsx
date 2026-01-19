import React, { useState } from 'react';
import { AlertTriangle, Shield, Activity, TrendingUp, CheckCircle, XCircle, Clock, AlertCircle } from 'lucide-react';
import './RiskManagement.css';

const RiskManagement = () => {
  const [filterPriority, setFilterPriority] = useState('all');

  const risks = [
    {
      id: 1,
      title: 'Methane Concentration Spike - Zone A',
      category: 'Safety',
      priority: 'critical',
      probability: 'High',
      impact: 'Severe',
      status: 'active',
      mitigation: 'Emergency ventilation upgrade in progress',
      owner: 'Safety Team',
      deadline: 'Jan 25, 2026'
    },
    {
      id: 2,
      title: 'Emission Target Exceedance Risk',
      category: 'Compliance',
      priority: 'high',
      probability: 'Medium',
      impact: 'High',
      status: 'monitoring',
      mitigation: 'Accelerate renewable energy adoption',
      owner: 'Sustainability',
      deadline: 'Feb 15, 2026'
    },
    {
      id: 3,
      title: 'Sensor Network Degradation',
      category: 'Technology',
      priority: 'medium',
      probability: 'Medium',
      impact: 'Medium',
      status: 'mitigated',
      mitigation: 'Preventive maintenance schedule implemented',
      owner: 'Engineering',
      deadline: 'Completed'
    },
    {
      id: 4,
      title: 'Weather Impact on Afforestation',
      category: 'Environmental',
      priority: 'low',
      probability: 'Low',
      impact: 'Medium',
      status: 'monitoring',
      mitigation: 'Irrigation system enhancement planned',
      owner: 'Env. Team',
      deadline: 'Mar 01, 2026'
    },
    {
      id: 5,
      title: 'Equipment Failure Emissions Surge',
      category: 'Operational',
      priority: 'high',
      probability: 'Medium',
      impact: 'High',
      status: 'active',
      mitigation: 'Implementing predictive maintenance AI',
      owner: 'Operations',
      deadline: 'Jan 30, 2026'
    }
  ];

  const filteredRisks = filterPriority === 'all' 
    ? risks 
    : risks.filter(r => r.priority === filterPriority);

  const riskStats = {
    total: risks.length,
    critical: risks.filter(r => r.priority === 'critical').length,
    high: risks.filter(r => r.priority === 'high').length,
    active: risks.filter(r => r.status === 'active').length,
    mitigated: risks.filter(r => r.status === 'mitigated').length
  };

  return (
    <div className="risk-page">
      <div className="page-header-section">
        <div>
          <div className="breadcrumb-small">
            <span>Home</span>
            <span>/</span>
            <span>Risk Management</span>
          </div>
          <h1>Risk Management Dashboard</h1>
          <p>Identify, assess, and mitigate operational and environmental risks</p>
        </div>
      </div>

      <div className="risk-metrics-grid">
        <div className="risk-metric-card">
          <div className="metric-icon-risk">
            <AlertTriangle size={28} color="#ef4444" />
          </div>
          <div className="metric-content-risk">
            <div className="metric-label-risk">Total Active Risks</div>
            <div className="metric-value-risk">{riskStats.total}</div>
          </div>
        </div>

        <div className="risk-metric-card critical-card">
          <div className="metric-icon-risk">
            <XCircle size={28} color="#dc2626" />
          </div>
          <div className="metric-content-risk">
            <div className="metric-label-risk">Critical Priority</div>
            <div className="metric-value-risk">{riskStats.critical}</div>
          </div>
        </div>

        <div className="risk-metric-card high-card">
          <div className="metric-icon-risk">
            <AlertCircle size={28} color="#f59e0b" />
          </div>
          <div className="metric-content-risk">
            <div className="metric-label-risk">High Priority</div>
            <div className="metric-value-risk">{riskStats.high}</div>
          </div>
        </div>

        <div className="risk-metric-card success-card">
          <div className="metric-icon-risk">
            <CheckCircle size={28} color="#10b981" />
          </div>
          <div className="metric-content-risk">
            <div className="metric-label-risk">Mitigated</div>
            <div className="metric-value-risk">{riskStats.mitigated}</div>
          </div>
        </div>
      </div>

      <div className="risk-filter-bar">
        <h3>Risk Register</h3>
        <div className="filter-buttons-risk">
          <button 
            className={`filter-btn-risk ${filterPriority === 'all' ? 'active' : ''}`}
            onClick={() => setFilterPriority('all')}
          >
            All Risks
          </button>
          <button 
            className={`filter-btn-risk critical ${filterPriority === 'critical' ? 'active' : ''}`}
            onClick={() => setFilterPriority('critical')}
          >
            Critical
          </button>
          <button 
            className={`filter-btn-risk high ${filterPriority === 'high' ? 'active' : ''}`}
            onClick={() => setFilterPriority('high')}
          >
            High
          </button>
          <button 
            className={`filter-btn-risk medium ${filterPriority === 'medium' ? 'active' : ''}`}
            onClick={() => setFilterPriority('medium')}
          >
            Medium
          </button>
          <button 
            className={`filter-btn-risk low ${filterPriority === 'low' ? 'active' : ''}`}
            onClick={() => setFilterPriority('low')}
          >
            Low
          </button>
        </div>
      </div>

      <div className="risks-list">
        {filteredRisks.map((risk) => (
          <div key={risk.id} className={`risk-card priority-${risk.priority}`}>
            <div className="risk-card-header">
              <div className="risk-header-left">
                <div className={`priority-indicator ${risk.priority}`}></div>
                <div>
                  <h4 className="risk-title">{risk.title}</h4>
                  <div className="risk-meta">
                    <span className="risk-category">{risk.category}</span>
                    <span className="meta-separator">•</span>
                    <span className="risk-owner">{risk.owner}</span>
                  </div>
                </div>
              </div>
              <div className="risk-badges">
                <span className={`status-badge-risk ${risk.status}`}>
                  {risk.status === 'active' && 'ACTIVE'}
                  {risk.status === 'monitoring' && 'MONITORING'}
                  {risk.status === 'mitigated' && 'MITIGATED'}
                </span>
                <span className={`priority-badge-risk ${risk.priority}`}>
                  {risk.priority.toUpperCase()}
                </span>
              </div>
            </div>

            <div className="risk-assessment">
              <div className="assessment-item">
                <span className="assessment-label">Probability</span>
                <span className="assessment-value">{risk.probability}</span>
              </div>
              <div className="assessment-item">
                <span className="assessment-label">Impact</span>
                <span className="assessment-value">{risk.impact}</span>
              </div>
            </div>

            <div className="risk-mitigation">
              <div className="mitigation-label">
                <Shield size={16} />
                Mitigation Strategy
              </div>
              <div className="mitigation-text">{risk.mitigation}</div>
            </div>

            <div className="risk-footer">
              <div className="risk-deadline">
                <Clock size={14} />
                Deadline: {risk.deadline}
              </div>
              <button className="view-details-btn">View Details →</button>
            </div>
          </div>
        ))}
      </div>

      <div className="risk-matrix-section">
        <div className="card-header">
          <h3>Risk Assessment Matrix</h3>
          <p className="card-subtitle">Probability vs. Impact visualization</p>
        </div>
        <div className="risk-matrix">
          <div className="matrix-row">
            <div className="matrix-label">High</div>
            <div className="matrix-cell medium">1</div>
            <div className="matrix-cell high">2</div>
            <div className="matrix-cell critical">1</div>
          </div>
          <div className="matrix-row">
            <div className="matrix-label">Medium</div>
            <div className="matrix-cell low">0</div>
            <div className="matrix-cell medium">2</div>
            <div className="matrix-cell high">0</div>
          </div>
          <div className="matrix-row">
            <div className="matrix-label">Low</div>
            <div className="matrix-cell low">1</div>
            <div className="matrix-cell low">0</div>
            <div className="matrix-cell medium">0</div>
          </div>
          <div className="matrix-row">
            <div className="matrix-label"></div>
            <div className="matrix-label-bottom">Low</div>
            <div className="matrix-label-bottom">Medium</div>
            <div className="matrix-label-bottom">High</div>
          </div>
          <div className="matrix-axis-label">IMPACT →</div>
        </div>
      </div>
    </div>
  );
};

export default RiskManagement;