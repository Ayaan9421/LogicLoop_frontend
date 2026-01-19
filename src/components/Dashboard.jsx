import React from 'react';
import { 
  Cloud, 
  AlertTriangle, 
  Trees, 
  TrendingUp, 
  TrendingDown 
} from 'lucide-react';
import './Dashboard.css';

const Dashboard = () => {
  const monthlyData = [
    { month: 'Apr', value: 85 },
    { month: 'May', value: 95 },
    { month: 'Jun', value: 75 },
    { month: 'Jul', value: 92 },
    { month: 'Aug', value: 100 },
    { month: 'Sep', value: 82 },
    { month: 'Oct', value: 100, highlight: true },
    { month: 'Nov', value: 40 }
  ];

  const maxValue = Math.max(...monthlyData.map(d => d.value));

  return (
    <div className="dashboard-content">
      <div className="page-header">
        <h1>Executive Overview</h1>
        <p>Monitor key sustainability metrics and safety indicators for Gevra Open Cast Project.</p>
      </div>

      <div className="metrics-grid">
        <div className="metric-card">
          <div className="metric-icon">
            <Cloud size={32} color="#94a3b8" />
          </div>
          <div className="metric-badge decrease">↗ 2.4%</div>
          <div className="metric-label">Total Emissions</div>
          <div className="metric-value">
            1.2M <span className="metric-unit">tCO2e</span>
          </div>
        </div>

        <div className="metric-card alert">
          <div className="metric-icon">
            <AlertTriangle size={32} color="#f59e0b" />
          </div>
          <div className="metric-badge-alert">High Alert</div>
          <div className="metric-label">Methane Risk Index</div>
          <div className="metric-value">
            7.8 <span className="metric-unit">/ 10</span>
          </div>
          <div className="metric-progress">
            <div className="progress-bar" style={{ width: '78%' }}></div>
          </div>
        </div>

        <div className="metric-card success">
          <div className="metric-icon">
            <Trees size={32} color="#10b981" />
          </div>
          <div className="metric-badge-success">Afforestation</div>
          <div className="metric-label">Carbon Sinks</div>
          <div className="metric-value">
            145k <span className="metric-unit">t</span>
          </div>
        </div>

        <div className="metric-card">
          <div className="metric-icon">
            <TrendingUp size={32} color="#94a3b8" />
          </div>
          <div className="metric-badge-info">Target Gap</div>
          <div className="metric-label">Net Emission Gap</div>
          <div className="metric-value">1.05M</div>
          <div className="metric-target">Target: Net Zero by 2070</div>
        </div>
      </div>

      <div className="content-row">
        <div className="chart-card">
          <div className="card-header">
            <div>
              <h3>Emissions Trend</h3>
              <p>Monthly gross emissions vs. targets</p>
            </div>
            <div className="chart-tabs">
              <button className="tab active">Monthly</button>
              <button className="tab">Quarterly</button>
            </div>
          </div>
          <div className="chart-container">
            {monthlyData.map((data, index) => (
              <div key={index} className="chart-bar-wrapper">
                <div 
                  className={`chart-bar ${data.highlight ? 'highlight' : ''}`}
                  style={{ height: `${(data.value / maxValue) * 200}px` }}
                ></div>
                <div className="chart-label">{data.month}</div>
              </div>
            ))}
          </div>
        </div>

        <div className="actions-card">
          <div className="card-header">
            <h3>Priority Safety Actions</h3>
          </div>
          
          <div className="action-item">
            <div className="action-header">
              <span className="action-title">Ventilation upgrade</span>
              <span className="action-badge critical">CRITICAL</span>
            </div>
            <p className="action-desc">Sector 4 methane concentration rising. Immediate fan overhaul required.</p>
            <div className="action-due">⏰ Due: Today, 14:00</div>
          </div>

          <div className="action-item">
            <div className="action-header">
              <span className="action-title">Sensor Calibration</span>
              <span className="action-badge medium">MEDIUM</span>
            </div>
            <p className="action-desc">Routine drift check for wireless methane sensors in Drift 3B.</p>
            <div className="action-due">⏰ Due: Tomorrow</div>
          </div>

          <div className="action-item">
            <div className="action-header">
              <span className="action-title">Tree Plantation</span>
              <span className="action-badge success">ON TRACK</span>
            </div>
            <p className="action-desc">Phase 2 afforestation drive near perimeter wall. 500 saplings.</p>
          </div>

          <button className="view-all-btn">View All Actions</button>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;