import React from 'react';
import { 
  Plus, 
  Filter, 
  ChevronDown, 
  FileText, 
  Eye, 
  Download, 
  Printer, 
  MoreVertical, 
  TrendingDown 
} from 'lucide-react';
import './Report.css';

const Reports = () => {
  const reports = [
    {
      name: 'Q3 Methane Safety Audit - Zone A',
      type: 'Safety Compliance',
      date: 'Oct 15, 2023',
      status: 'Verified',
      statusColor: 'success'
    },
    {
      name: 'Monthly Carbon Footprint Summary',
      type: 'Environmental',
      date: 'Oct 01, 2023',
      status: 'Verified',
      statusColor: 'success'
    },
    {
      name: 'Equipment Emission Standard Check',
      type: 'Equipment Audit',
      date: 'Sep 28, 2023',
      status: 'Pending Review',
      statusColor: 'warning'
    }
  ];

  const performanceData = [
    { period: 'Q1', scope1: 245, scope2: 189, incidents: 2, compliance: 94 },
    { period: 'Q2', scope1: 238, scope2: 195, incidents: 1, compliance: 96 },
    { period: 'Q3', scope1: 229, scope2: 182, incidents: 3, compliance: 92 },
    { period: 'Q4', scope1: 0, scope2: 0, incidents: 0, compliance: 0 }
  ];

  return (
    <div className="reports-page">
      <div className="page-header-section">
        <div>
          <div className="breadcrumb-small">
            <span>Home</span>
            <span>/</span>
            <span>Reports & Compliance</span>
          </div>
          <h1>Reports & Compliance Progress</h1>
          <p>Manage audits, track Jharia Coalfield sustainability goals, and export regulatory compliance documentation.</p>
        </div>
        <button className="btn-primary">
          <Plus size={20} />
          Generate New Report
        </button>
      </div>

      <div className="filters-row">
        <div className="filter-group">
          <button className="filter-btn">
            Date: This Quarter
            <ChevronDown size={16} />
          </button>
          <button className="filter-btn">
            Site: Jharia Coalfield
            <ChevronDown size={16} />
          </button>
          <button className="filter-btn">
            Type: All Reports
            <ChevronDown size={16} />
          </button>
        </div>
        <button className="filter-btn-advanced">
          <Filter size={16} />
          Advanced Filters
        </button>
      </div>

      <div className="reports-table-card">
        <div className="table-header">
          <div className="table-title">
            <FileText size={20} color="#10b981" />
            <h3>Recent Generated Reports</h3>
          </div>
          <button className="link-btn">View All History</button>
        </div>

        <table className="reports-table">
          <thead>
            <tr>
              <th>Report Name</th>
              <th>Type</th>
              <th>Date Generated</th>
              <th>Status</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {reports.map((report, index) => (
              <tr key={index}>
                <td className="report-name">{report.name}</td>
                <td className="report-type">{report.type}</td>
                <td className="report-date">{report.date}</td>
                <td>
                  <span className={`status-badge ${report.statusColor}`}>
                    {report.status}
                  </span>
                </td>
                <td>
                  <div className="action-buttons">
                    <button className="icon-btn" title="View">
                      <Eye size={18} />
                    </button>
                    <button className="icon-btn" title="Download">
                      <Download size={18} />
                    </button>
                    <button className="icon-btn" title="Print">
                      <Printer size={18} />
                    </button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <div className="charts-row">
        <div className="chart-card-large">
          <div className="chart-header">
            <div>
              <h3>Net Carbon Emissions</h3>
              <p className="chart-subtitle">Tons of CO2 equivalent vs. Monthly Limit</p>
            </div>
            <div className="chart-tabs">
              <button className="tab active">Month</button>
              <button className="tab">Year</button>
            </div>
          </div>
          <div className="emissions-chart">
            <div className="chart-y-axis">
              <span className="limit-line">Limit</span>
            </div>
            <div className="chart-bars">
              {['May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct'].map((month, i) => (
                <div key={i} className="month-bar">
                  <div className="bar-container">
                    <div 
                      className="emission-bar" 
                      style={{ height: `${70 + Math.random() * 30}%` }}
                    ></div>
                  </div>
                  <span className="month-label">{month}</span>
                </div>
              ))}
            </div>
          </div>
          <div className="chart-legend">
            <span className="legend-item">
              <span className="legend-dot actual"></span>
              Actual
            </span>
            <span className="legend-item reduction">
              <TrendingDown size={16} />
              12% Reduction
            </span>
          </div>
        </div>

        <div className="chart-card-medium">
          <div className="chart-header">
            <div>
              <h3>Methane Risk Incidents</h3>
              <p className="chart-subtitle">Incidents &gt; 1% CH4 concentration</p>
            </div>
            <button className="icon-btn">
              <MoreVertical size={20} />
            </button>
          </div>
          <div className="donut-chart">
            <svg viewBox="0 0 200 200" className="donut-svg">
              <circle cx="100" cy="100" r="80" fill="none" stroke="#f0f0f0" strokeWidth="30"/>
              <circle 
                cx="100" 
                cy="100" 
                r="80" 
                fill="none" 
                stroke="#10b981" 
                strokeWidth="30"
                strokeDasharray="440 503"
                strokeDashoffset="0"
                transform="rotate(-90 100 100)"
              />
              <text x="100" y="90" textAnchor="middle" fontSize="48" fontWeight="bold" fill="#1e293b">3</text>
              <text x="100" y="115" textAnchor="middle" fontSize="14" fill="#64748b">INCIDENTS</text>
            </svg>
          </div>
          <div className="incident-legend">
            <div className="incident-item">
              <span className="incident-dot minor"></span>
              <div>
                <div className="incident-label">Minor (0.5-1%)</div>
                <div className="incident-count">2 events - Resolved</div>
              </div>
            </div>
            <div className="incident-item">
              <span className="incident-dot warning"></span>
              <div>
                <div className="incident-label">Warning (1-2%)</div>
                <div className="incident-count">1 event - Investigating</div>
              </div>
            </div>
            <div className="incident-item">
              <span className="incident-dot critical"></span>
              <div>
                <div className="incident-label">Critical (&gt;2%)</div>
                <div className="incident-count">0 events</div>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="ledger-card">
        <div className="ledger-header">
          <FileText size={20} color="#10b981" />
          <h3>Detailed Performance Ledger (2023)</h3>
        </div>
        <table className="ledger-table">
          <thead>
            <tr>
              <th>PERIOD</th>
              <th>SCOPE 1 EMISSIONS (tCO2e)</th>
              <th>SCOPE 2 EMISSIONS (tCO2e)</th>
              <th>SAFETY INCIDENTS</th>
              <th>COMPLIANCE SCORE</th>
            </tr>
          </thead>
          <tbody>
            {performanceData.map((row, index) => (
              <tr key={index}>
                <td className="period-cell">{row.period}</td>
                <td className="data-cell">{row.scope1 || '-'}</td>
                <td className="data-cell">{row.scope2 || '-'}</td>
                <td className="data-cell">{row.incidents || '-'}</td>
                <td className="data-cell">{row.compliance ? `${row.compliance}%` : '-'}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default Reports;