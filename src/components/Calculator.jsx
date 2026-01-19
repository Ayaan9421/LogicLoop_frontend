import React, { useState } from 'react';
import { Calculator as CalcIcon, Zap, Activity, TrendingUp } from 'lucide-react';
import './Calculator.css';

const Calculator = () => {
  const [fuelUsage, setFuelUsage] = useState('');
  const [electricity, setElectricity] = useState('');
  const [blasting, setBlasting] = useState('');
  const [totalEmissions, setTotalEmissions] = useState(null);
  const [breakdown, setBreakdown] = useState(null);

  const calculateEmissions = () => {
    const fuelEmissions = parseFloat(fuelUsage || 0) * 2.68;
    const electricityEmissions = parseFloat(electricity || 0) * 0.82;
    const blastingEmissions = parseFloat(blasting || 0) * 1.5;
    const total = fuelEmissions + electricityEmissions + blastingEmissions;

    setTotalEmissions(total.toFixed(2));
    setBreakdown({
      fuel: fuelEmissions.toFixed(2),
      electricity: electricityEmissions.toFixed(2),
      blasting: blastingEmissions.toFixed(2),
      fuelPercent: ((fuelEmissions / total) * 100).toFixed(1),
      electricityPercent: ((electricityEmissions / total) * 100).toFixed(1),
      blastingPercent: ((blastingEmissions / total) * 100).toFixed(1)
    });
  };

  const resetForm = () => {
    setFuelUsage('');
    setElectricity('');
    setBlasting('');
    setTotalEmissions(null);
    setBreakdown(null);
  };

  return (
    <div className="calculator-page">
      <div className="page-header-section">
        <div>
          <div className="breadcrumb-small">
            <span>Home</span>
            <span>/</span>
            <span>Carbon Calculator</span>
          </div>
          <h1>Activity-Based Emission Calculator</h1>
          <p>Input operational data to compute emissions using India-specific emission factors</p>
        </div>
      </div>

      <div className="calculator-grid">
        <div className="input-card">
          <div className="card-header-calc">
            <CalcIcon size={24} color="#10b981" />
            <h3>Input Operational Data</h3>
          </div>

          <div className="input-group">
            <label>Fuel Usage (Liters)</label>
            <input
              type="number"
              value={fuelUsage}
              onChange={(e) => setFuelUsage(e.target.value)}
              placeholder="Enter diesel consumption"
            />
            <span className="input-hint">Emission Factor: 2.68 kgCO2e/L</span>
          </div>

          <div className="input-group">
            <label>Electricity Consumption (kWh)</label>
            <input
              type="number"
              value={electricity}
              onChange={(e) => setElectricity(e.target.value)}
              placeholder="Enter electricity usage"
            />
            <span className="input-hint">Emission Factor: 0.82 kgCO2e/kWh (India Grid)</span>
          </div>

          <div className="input-group">
            <label>Blasting Activity (kg explosives)</label>
            <input
              type="number"
              value={blasting}
              onChange={(e) => setBlasting(e.target.value)}
              placeholder="Enter explosive quantity"
            />
            <span className="input-hint">Emission Factor: 1.5 kgCO2e/kg</span>
          </div>

          <div className="button-group">
            <button className="btn-calculate" onClick={calculateEmissions}>
              Calculate Emissions
            </button>
            <button className="btn-reset" onClick={resetForm}>
              Reset
            </button>
          </div>
        </div>

        <div className="results-column">
          <div className="result-card-primary">
            <div className="result-icon">
              <Activity size={32} color="#10b981" />
            </div>
            <h3>Total Emissions</h3>
            <div className="result-value">
              {totalEmissions || '0.00'}
              <span className="result-unit">kgCO2e</span>
            </div>
            {totalEmissions && (
              <div className="result-comparison">
                ≈ {(parseFloat(totalEmissions) / 1000).toFixed(3)} tonnes CO2e
              </div>
            )}
          </div>

          {breakdown && (
            <div className="breakdown-card">
              <h3>Emission Breakdown</h3>
              
              <div className="breakdown-item">
                <div className="breakdown-header">
                  <span className="breakdown-label">
                    <Zap size={16} color="#3b82f6" />
                    Fuel Combustion
                  </span>
                  <span className="breakdown-value">{breakdown.fuel} kg</span>
                </div>
                <div className="progress-bar-container">
                  <div 
                    className="progress-bar-fill fuel" 
                    style={{ width: `${breakdown.fuelPercent}%` }}
                  ></div>
                </div>
                <span className="breakdown-percent">{breakdown.fuelPercent}%</span>
              </div>

              <div className="breakdown-item">
                <div className="breakdown-header">
                  <span className="breakdown-label">
                    <Activity size={16} color="#f59e0b" />
                    Electricity
                  </span>
                  <span className="breakdown-value">{breakdown.electricity} kg</span>
                </div>
                <div className="progress-bar-container">
                  <div 
                    className="progress-bar-fill electricity" 
                    style={{ width: `${breakdown.electricityPercent}%` }}
                  ></div>
                </div>
                <span className="breakdown-percent">{breakdown.electricityPercent}%</span>
              </div>

              <div className="breakdown-item">
                <div className="breakdown-header">
                  <span className="breakdown-label">
                    <TrendingUp size={16} color="#ef4444" />
                    Blasting
                  </span>
                  <span className="breakdown-value">{breakdown.blasting} kg</span>
                </div>
                <div className="progress-bar-container">
                  <div 
                    className="progress-bar-fill blasting" 
                    style={{ width: `${breakdown.blastingPercent}%` }}
                  ></div>
                </div>
                <span className="breakdown-percent">{breakdown.blastingPercent}%</span>
              </div>
            </div>
          )}
        </div>
      </div>

      <div className="info-cards-row">
        <div className="info-card">
          <h4>Carbon Sink Registry</h4>
          <p>Track afforestation and greenbelt areas to estimate carbon sequestration</p>
          <button className="link-btn-calc">Add Carbon Sink Data →</button>
        </div>
        <div className="info-card">
          <h4>Emission Factors</h4>
          <p>All factors comply with Indian emission standards and IPCC guidelines</p>
          <button className="link-btn-calc">View All Factors →</button>
        </div>
        <div className="info-card">
          <h4>Export Report</h4>
          <p>Download calculation results for compliance documentation</p>
          <button className="link-btn-calc">Generate PDF →</button>
        </div>
      </div>
    </div>
  );
};

export default Calculator;