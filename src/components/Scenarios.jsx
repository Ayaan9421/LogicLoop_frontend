import React, { useState } from 'react';
import { Layers, TrendingDown, TrendingUp, Zap, Trees, Plus, Play, Save } from 'lucide-react';
import './Scenarios.css';

const Scenarios = () => {
  const [selectedScenario, setSelectedScenario] = useState('baseline');
  const [electricityAdoption, setElectricityAdoption] = useState(20);
  const [afforestation, setAfforestation] = useState(145);
  const [renewableEnergy, setRenewableEnergy] = useState(15);

  const scenarios = {
    baseline: {
      name: 'Baseline (Current)',
      emissions: 1200,
      sinks: 145,
      net: 1055,
      description: 'Current operational emissions without changes'
    },
    moderate: {
      name: 'Moderate Mitigation',
      emissions: 980,
      sinks: 220,
      net: 760,
      description: '30% renewable energy, 50% electrification, enhanced afforestation'
    },
    aggressive: {
      name: 'Aggressive Reduction',
      emissions: 720,
      sinks: 380,
      net: 340,
      description: '60% renewable energy, 80% electrification, extensive afforestation'
    },
    custom: {
      name: 'Custom Scenario',
      emissions: Math.round(1200 - (electricityAdoption * 6) - (renewableEnergy * 8)),
      sinks: afforestation,
      net: 0,
      description: 'User-defined intervention parameters'
    }
  };

  const current = scenarios[selectedScenario];
  current.net = current.emissions - current.sinks;
  const reduction = ((1 - current.net / 1055) * 100).toFixed(1);

  return (
    <div className="scenarios-page">
      <div className="page-header-section">
        <div>
          <div className="breadcrumb-small">
            <span>Home</span>
            <span>/</span>
            <span>Mitigation Scenarios</span>
          </div>
          <h1>Mitigation Scenario Simulator</h1>
          <p>Model interventions and forecast emission reductions against baseline</p>
        </div>
        <button className="btn-primary">
          <Save size={20} />
          Save Scenario
        </button>
      </div>

      <div className="scenario-selector">
        <button 
          className={`scenario-btn ${selectedScenario === 'baseline' ? 'active' : ''}`}
          onClick={() => setSelectedScenario('baseline')}
        >
          <div className="scenario-btn-icon">📊</div>
          <div className="scenario-btn-text">
            <div className="scenario-btn-title">Baseline</div>
            <div className="scenario-btn-subtitle">Current State</div>
          </div>
        </button>
        <button 
          className={`scenario-btn ${selectedScenario === 'moderate' ? 'active' : ''}`}
          onClick={() => setSelectedScenario('moderate')}
        >
          <div className="scenario-btn-icon">⚡</div>
          <div className="scenario-btn-text">
            <div className="scenario-btn-title">Moderate</div>
            <div className="scenario-btn-subtitle">30-50% Reduction</div>
          </div>
        </button>
        <button 
          className={`scenario-btn ${selectedScenario === 'aggressive' ? 'active' : ''}`}
          onClick={() => setSelectedScenario('aggressive')}
        >
          <div className="scenario-btn-icon">🌱</div>
          <div className="scenario-btn-text">
            <div className="scenario-btn-title">Aggressive</div>
            <div className="scenario-btn-subtitle">60-80% Reduction</div>
          </div>
        </button>
        <button 
          className={`scenario-btn ${selectedScenario === 'custom' ? 'active' : ''}`}
          onClick={() => setSelectedScenario('custom')}
        >
          <div className="scenario-btn-icon">🎯</div>
          <div className="scenario-btn-text">
            <div className="scenario-btn-title">Custom</div>
            <div className="scenario-btn-subtitle">Build Your Own</div>
          </div>
        </button>
      </div>

      <div className="scenario-results">
        <div className="result-card-scenario baseline">
          <div className="result-label">Gross Emissions</div>
          <div className="result-value">{current.emissions}</div>
          <div className="result-unit">ktCO2e/year</div>
        </div>
        <div className="result-card-scenario sinks">
          <div className="result-label">Carbon Sinks</div>
          <div className="result-value">{current.sinks}</div>
          <div className="result-unit">ktCO2e/year</div>
        </div>
        <div className="result-card-scenario net">
          <div className="result-label">Net Emissions</div>
          <div className="result-value">{current.net}</div>
          <div className="result-unit">ktCO2e/year</div>
        </div>
        <div className="result-card-scenario reduction">
          <div className="result-label">Reduction vs. Baseline</div>
          <div className="result-value">{reduction}%</div>
          <div className="result-unit">
            {current.net < 1055 ? (
              <span style={{ color: '#10b981' }}>
                <TrendingDown size={16} style={{ verticalAlign: 'middle' }} /> Improvement
              </span>
            ) : (
              <span style={{ color: '#64748b' }}>No Change</span>
            )}
          </div>
        </div>
      </div>

      <div className="scenario-content-grid">
        <div className="interventions-card">
          <div className="card-header">
            <div>
              <h3>Intervention Parameters</h3>
              <p className="card-subtitle">{current.description}</p>
            </div>
          </div>

          {selectedScenario === 'custom' ? (
            <div className="interventions-sliders">
              <div className="slider-group">
                <div className="slider-header">
                  <label>Equipment Electrification</label>
                  <span className="slider-value">{electricityAdoption}%</span>
                </div>
                <input
                  type="range"
                  min="0"
                  max="100"
                  value={electricityAdoption}
                  onChange={(e) => setElectricityAdoption(parseInt(e.target.value))}
                  className="slider"
                />
                <div className="slider-hint">Replace diesel vehicles with electric alternatives</div>
              </div>

              <div className="slider-group">
                <div className="slider-header">
                  <label>Afforestation Capacity</label>
                  <span className="slider-value">{afforestation}k tonnes/yr</span>
                </div>
                <input
                  type="range"
                  min="50"
                  max="500"
                  value={afforestation}
                  onChange={(e) => setAfforestation(parseInt(e.target.value))}
                  className="slider"
                />
                <div className="slider-hint">Expand green belt and carbon sink areas</div>
              </div>

              <div className="slider-group">
                <div className="slider-header">
                  <label>Renewable Energy Adoption</label>
                  <span className="slider-value">{renewableEnergy}%</span>
                </div>
                <input
                  type="range"
                  min="0"
                  max="100"
                  value={renewableEnergy}
                  onChange={(e) => setRenewableEnergy(parseInt(e.target.value))}
                  className="slider"
                />
                <div className="slider-hint">Solar and wind power integration</div>
              </div>
            </div>
          ) : (
            <div className="predefined-interventions">
              <div className="intervention-item">
                <div className="intervention-icon">
                  <Zap size={20} color="#10b981" />
                </div>
                <div className="intervention-content">
                  <div className="intervention-title">Equipment Electrification</div>
                  <div className="intervention-desc">
                    {selectedScenario === 'baseline' && 'Current diesel-based operations'}
                    {selectedScenario === 'moderate' && '50% fleet electrification'}
                    {selectedScenario === 'aggressive' && '80% fleet electrification'}
                  </div>
                </div>
                <div className="intervention-impact">
                  {selectedScenario === 'baseline' && '0%'}
                  {selectedScenario === 'moderate' && '-180 kt'}
                  {selectedScenario === 'aggressive' && '-360 kt'}
                </div>
              </div>

              <div className="intervention-item">
                <div className="intervention-icon">
                  <Trees size={20} color="#10b981" />
                </div>
                <div className="intervention-content">
                  <div className="intervention-title">Afforestation Program</div>
                  <div className="intervention-desc">
                    {selectedScenario === 'baseline' && '145k tonnes carbon sink capacity'}
                    {selectedScenario === 'moderate' && 'Expand to 220k tonnes capacity'}
                    {selectedScenario === 'aggressive' && 'Expand to 380k tonnes capacity'}
                  </div>
                </div>
                <div className="intervention-impact">
                  {selectedScenario === 'baseline' && '145 kt'}
                  {selectedScenario === 'moderate' && '220 kt'}
                  {selectedScenario === 'aggressive' && '380 kt'}
                </div>
              </div>

              <div className="intervention-item">
                <div className="intervention-icon">
                  <TrendingUp size={20} color="#10b981" />
                </div>
                <div className="intervention-content">
                  <div className="intervention-title">Renewable Energy</div>
                  <div className="intervention-desc">
                    {selectedScenario === 'baseline' && 'Grid-based electricity (high carbon)'}
                    {selectedScenario === 'moderate' && '30% solar/wind power adoption'}
                    {selectedScenario === 'aggressive' && '60% solar/wind power adoption'}
                  </div>
                </div>
                <div className="intervention-impact">
                  {selectedScenario === 'baseline' && '0%'}
                  {selectedScenario === 'moderate' && '-120 kt'}
                  {selectedScenario === 'aggressive' && '-240 kt'}
                </div>
              </div>
            </div>
          )}

          <button className="btn-run-scenario">
            <Play size={18} />
            Run Scenario Analysis
          </button>
        </div>

        <div className="timeline-card">
          <div className="card-header">
            <h3>Emission Projection Timeline</h3>
            <p className="card-subtitle">2026-2070 Net Zero Pathway</p>
          </div>

          <div className="timeline-chart">
            {['2026', '2035', '2045', '2055', '2070'].map((year, idx) => {
              const progress = [100, 75, 50, 25, 0][idx];
              const emissions = Math.round(current.net * (progress / 100));
              return (
                <div key={year} className="timeline-year">
                  <div className="timeline-bar-container">
                    <div 
                      className="timeline-bar"
                      style={{ height: `${progress}%` }}
                    ></div>
                  </div>
                  <div className="timeline-label">{year}</div>
                  <div className="timeline-value">{emissions}kt</div>
                </div>
              );
            })}
          </div>

          <div className="timeline-footer">
            <div className="timeline-target">
              <div className="target-icon">🎯</div>
              <div className="target-text">
                <div className="target-title">Net Zero Target</div>
                <div className="target-date">By 2070</div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Scenarios;