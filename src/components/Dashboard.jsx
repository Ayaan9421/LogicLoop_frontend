import React, { useState, useEffect } from 'react';
import { 
  Cloud, 
  AlertTriangle, 
  Trees, 
  TrendingUp,
  TrendingDown,
  Activity,
  Zap,
  Target,
  ChevronRight,
  ArrowUpRight,
  ArrowDownRight
} from 'lucide-react';
import './Dashboard.css';

const Dashboard = () => {
  const [activeTab, setActiveTab] = useState('monthly');
  const [animateCards, setAnimateCards] = useState(false);

  useEffect(() => {
    setAnimateCards(true);
  }, []);

  const monthlyData = [
    { month: 'Apr', value: 142500, target: 145000 },
    { month: 'May', value: 138900, target: 145000 },
    { month: 'Jun', value: 151200, target: 145000 },
    { month: 'Jul', value: 147800, target: 145000 },
    { month: 'Aug', value: 143200, target: 145000 },
    { month: 'Sep', value: 149600, target: 145000 },
    { month: 'Oct', value: 152400, target: 145000, highlight: true },
    { month: 'Nov', value: 146800, target: 145000 }
  ];

  const quarterlyData = [
    { month: 'Q1 2024', value: 425000, target: 435000 },
    { month: 'Q2 2024', value: 448000, target: 435000 },
    { month: 'Q3 2024', value: 442000, target: 435000 },
    { month: 'Q4 2024', value: 451000, target: 435000, highlight: true }
  ];

  const currentData = activeTab === 'monthly' ? monthlyData : quarterlyData;
  const maxValue = Math.max(...currentData.map(d => Math.max(d.value, d.target)));

  const metrics = [
    {
      id: 1,
      icon: Cloud,
      iconColor: '#64748b',
      label: 'Total Emissions (FY 2024-25)',
      value: '1.76M',
      unit: 'tCO₂e',
      change: '+2.3%',
      changeType: 'increase',
      badge: null,
      trend: [65, 72, 68, 75, 71, 78, 82],
      cardType: 'default'
    },
    {
      id: 2,
      icon: AlertTriangle,
      iconColor: '#f59e0b',
      label: 'Methane Risk Index',
      value: '6.8',
      unit: '/ 10',
      change: 'High Alert',
      changeType: 'warning',
      badge: 'Immediate Action',
      progress: 68,
      trend: [45, 52, 58, 62, 65, 67, 68],
      cardType: 'alert'
    },
    {
      id: 3,
      icon: Trees,
      iconColor: '#10b981',
      label: 'Carbon Sequestration',
      value: '63.2K',
      unit: 'tCO₂e/yr',
      change: '+8.5%',
      changeType: 'decrease',
      badge: 'Active Growth',
      trend: [35, 38, 42, 48, 52, 58, 63],
      cardType: 'success'
    },
    {
      id: 4,
      icon: Target,
      iconColor: '#8b5cf6',
      label: 'Net Zero Gap',
      value: '1.69M',
      unit: 'tCO₂e',
      change: 'Target: 2070',
      changeType: 'neutral',
      badge: '96% Reduction Needed',
      progress: 4,
      trend: [100, 98, 95, 92, 88, 85, 82],
      cardType: 'info'
    }
  ];

  const actions = [
    {
      id: 1,
      title: 'Methane Ventilation Upgrade - Block 4A',
      description: 'CH₄ concentration at 0.89% (LEL 5%). Emergency ventilation system deployment required in underground section.',
      priority: 'critical',
      due: 'Today, 14:00 IST',
      location: 'Gevra OCP - Sector 4A',
      assignedTo: 'Safety Team Alpha'
    },
    {
      id: 2,
      title: 'Wireless Sensor Calibration',
      description: 'Quarterly calibration for 48 methane detection sensors across mining face. DGMS compliance verification pending.',
      priority: 'medium',
      due: 'Tomorrow, 10:00 IST',
      location: 'Underground Drift 3B',
      assignedTo: 'Instrumentation Team'
    },
    {
      id: 3,
      title: 'Afforestation Phase 3 - Eastern Boundary',
      description: 'Plantation of 12,000 native saplings (Sal, Neem, Bamboo) across 42 hectares as per approved CDM protocol.',
      priority: 'success',
      due: 'Next Week',
      location: 'Eastern Perimeter',
      assignedTo: 'Environment Cell'
    },
    {
      id: 4,
      title: 'Carbon Audit - Q3 Verification',
      description: 'Third-party verification of Scope 1, 2, 3 emissions data for UNFCCC reporting and carbon credit eligibility.',
      priority: 'medium',
      due: 'Dec 15, 2024',
      location: 'All Operations',
      assignedTo: 'Compliance Team'
    }
  ];

  const insights = [
    {
      icon: Zap,
      label: 'Energy Efficiency',
      value: '87.3%',
      change: '+3.2%',
      positive: true
    },
    {
      icon: Activity,
      label: 'Production Output',
      value: '2.4M tonnes',
      change: '+5.1%',
      positive: true
    },
    {
      icon: TrendingDown,
      label: 'Emission Intensity',
      value: '0.73 tCO₂e/t',
      change: '-2.8%',
      positive: true
    }
  ];

  return (
    <div className="dashboard-content">
      <div className="page-header">
        <div className="header-content">
          <h1>Executive Overview</h1>
          <p>Real-time sustainability metrics and safety indicators for Gevra Open Cast Project, SECL</p>
        </div>
        <div className="header-meta">
          <div className="last-updated">
            <span className="update-dot"></span>
            Last updated: {new Date().toLocaleTimeString('en-IN', { hour: '2-digit', minute: '2-digit' })} IST
          </div>
        </div>
      </div>

      {/* Quick Insights Bar */}
      <div className="insights-bar">
        {insights.map((insight, index) => (
          <div key={index} className="insight-chip">
            <insight.icon size={18} />
            <div className="insight-details">
              <span className="insight-label">{insight.label}</span>
              <div className="insight-value-row">
                <span className="insight-value">{insight.value}</span>
                <span className={`insight-change ${insight.positive ? 'positive' : 'negative'}`}>
                  {insight.positive ? <ArrowDownRight size={14} /> : <ArrowUpRight size={14} />}
                  {insight.change}
                </span>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Metrics Grid */}
      <div className={`metrics-grid ${animateCards ? 'animate' : ''}`}>
        {metrics.map((metric, index) => (
          <div 
            key={metric.id} 
            className={`metric-card ${metric.cardType}`}
            style={{ animationDelay: `${index * 0.1}s` }}
          >
            <div className="metric-header">
              <div className="metric-icon-wrapper" style={{ backgroundColor: `${metric.iconColor}15` }}>
                <metric.icon size={24} color={metric.iconColor} />
              </div>
              {metric.badge && (
                <div className={`metric-badge-new ${metric.changeType}`}>
                  {metric.badge}
                </div>
              )}
            </div>
            
            <div className="metric-body">
              <div className="metric-label">{metric.label}</div>
              <div className="metric-value-row">
                <span className="metric-value">
                  {metric.value}
                  <span className="metric-unit">{metric.unit}</span>
                </span>
              </div>
              
              <div className="metric-footer">
                <span className={`metric-change ${metric.changeType}`}>
                  {metric.changeType === 'increase' && <ArrowUpRight size={14} />}
                  {metric.changeType === 'decrease' && <ArrowDownRight size={14} />}
                  {metric.change}
                </span>
                
                {metric.progress !== undefined && (
                  <div className="metric-progress-mini">
                    <div 
                      className="progress-fill" 
                      style={{ width: `${metric.progress}%` }}
                    ></div>
                  </div>
                )}
              </div>

              {/* Mini Trend Line */}
              <div className="trend-line">
                {metric.trend.map((point, i) => (
                  <div 
                    key={i} 
                    className="trend-point"
                    style={{ 
                      height: `${(point / Math.max(...metric.trend)) * 100}%`,
                      backgroundColor: metric.iconColor 
                    }}
                  ></div>
                ))}
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Content Row */}
      <div className="content-row">
        <div className="chart-card">
          <div className="card-header">
            <div>
              <h3>Emissions Trend Analysis</h3>
              <p>Monthly gross emissions vs. regulatory targets (tCO₂e)</p>
            </div>
            <div className="chart-tabs">
              <button 
                className={`tab ${activeTab === 'monthly' ? 'active' : ''}`}
                onClick={() => setActiveTab('monthly')}
              >
                Monthly
              </button>
              <button 
                className={`tab ${activeTab === 'quarterly' ? 'active' : ''}`}
                onClick={() => setActiveTab('quarterly')}
              >
                Quarterly
              </button>
            </div>
          </div>
          
          <div className="chart-container">
            {currentData.map((data, index) => {
              const valueHeight = (data.value / maxValue) * 220;
              const targetHeight = (data.target / maxValue) * 220;
              
              return (
                <div key={index} className="chart-bar-wrapper">
                  <div className="bar-group">
                    <div 
                      className={`chart-bar actual ${data.highlight ? 'highlight' : ''}`}
                      style={{ height: `${valueHeight}px` }}
                    >
                      <span className="bar-tooltip">{(data.value / 1000).toFixed(1)}K</span>
                    </div>
                    <div 
                      className="chart-bar target"
                      style={{ height: `${targetHeight}px` }}
                    ></div>
                  </div>
                  <div className="chart-label">{data.month}</div>
                </div>
              );
            })}
          </div>
          
          <div className="chart-legend">
            <div className="legend-item">
              <span className="legend-color actual"></span>
              <span>Actual Emissions</span>
            </div>
            <div className="legend-item">
              <span className="legend-color target"></span>
              <span>Target Limit</span>
            </div>
          </div>
        </div>

        <div className="actions-card">
          <div className="card-header">
            <h3>Priority Action Items</h3>
            <span className="action-count">{actions.length} Active</span>
          </div>
          
          <div className="actions-list">
            {actions.slice(0, 3).map((action) => (
              <div key={action.id} className="action-item">
                <div className="action-priority-indicator">
                  <span className={`priority-dot ${action.priority}`}></span>
                </div>
                
                <div className="action-content">
                  <div className="action-header">
                    <span className="action-title">{action.title}</span>
                    <span className={`action-badge ${action.priority}`}>
                      {action.priority === 'critical' ? 'CRITICAL' : 
                       action.priority === 'medium' ? 'MEDIUM' : 'ON TRACK'}
                    </span>
                  </div>
                  
                  <p className="action-desc">{action.description}</p>
                  
                  <div className="action-meta">
                    <span className="action-due">⏰ {action.due}</span>
                    <span className="action-location">📍 {action.location}</span>
                  </div>
                </div>
              </div>
            ))}
          </div>

          <button className="view-all-btn">
            View All Action Items
            <ChevronRight size={18} />
          </button>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;