import React, { useState } from 'react';
import { Layers, TrendingDown, TrendingUp, Zap, Trees, Plus, Play, Save } from 'lucide-react';
import './Scenarios.css';
import { runSimulation } from "../api/simulation";


const Scenarios = () => {
  const [selectedScenario, setSelectedScenario] = useState('baseline');
  const [electricityAdoption, setElectricityAdoption] = useState(20);
  const [afforestation, setAfforestation] = useState(145);
  const [renewableEnergy, setRenewableEnergy] = useState(15);
  const [years, setYears] = useState(5);
  const [visibleYears, setVisibleYears] = useState([]); // 🔴 CHANGE


  const [simulationResult, setSimulationResult] = useState(null); // 🔴 CHANGE
  const [loading, setLoading] = useState(false);

  const BASELINE_TOTAL = simulationResult
    ? simulationResult.baseline_total
    : 19300; // fallback

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

  // 🔴 CHANGE: use backend result if available
  const current = simulationResult
    ? {
      emissions: Math.round(simulationResult.final_emissions),
      sinks: afforestation,
      net: Math.round(simulationResult.final_emissions - afforestation),
      description: 'Backend-simulated scenario'
    }
    : scenarios[selectedScenario];

  const reduction = (
    (1 - current.net / BASELINE_TOTAL) * 100
  ).toFixed(1);

  // 🔴 CHANGE: build backend interventions from UI
  const buildInterventions = () => {
    if (selectedScenario === "baseline") return [];

    if (selectedScenario === "moderate") {
      return [
        {
          name: "Electrification",
          target_agents: ["HEMM Fleet"],
          adoption_rate: 0.5,
          efficiency: 0.9,
          start_year: 1
        },
        {
          name: "Renewable Energy",
          target_agents: ["Grid Electricity"],
          adoption_rate: 0.3,
          efficiency: 0.7,
          start_year: 1
        }
      ];
    }

    if (selectedScenario === "aggressive") {
      return [
        {
          name: "Electrification",
          target_agents: ["HEMM Fleet"],
          adoption_rate: 0.8,
          efficiency: 0.9,
          start_year: 1
        },
        {
          name: "Renewable Energy",
          target_agents: ["Grid Electricity"],
          adoption_rate: 0.6,
          efficiency: 0.7,
          start_year: 1
        }
      ];
    }

    // custom
    return [
      {
        name: "Electrification",
        target_agents: ["HEMM Fleet"],
        adoption_rate: electricityAdoption / 100,
        efficiency: 0.9,
        start_year: 1
      },
      {
        name: "Renewable Energy",
        target_agents: ["Grid Electricity"],
        adoption_rate: renewableEnergy / 100,
        efficiency: 0.7,
        start_year: 1
      }
    ];
  };

  // 🔴 CHANGE: run backend simulation
  const runScenario = async () => {
    setLoading(true);
    setVisibleYears([]);

    try {
      const interventions = buildInterventions();
      const res = await runSimulation(interventions, years);
      setSimulationResult(res);

      // 🔴 CHANGE: year-by-year playback
      for (let i = 0; i < res.timeline.length; i++) {
        await new Promise(resolve => setTimeout(resolve, 700));
        setVisibleYears(v => [...v, res.timeline[i]]);
      }


    } catch (e) {
      alert("Simulation failed. Backend not reachab le.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="scenarios-page">
      <div className="page-header-section">
        <div>
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
                <div className="slider-hint">Solar and wind power integration</div>\
                {/* 🔴 CHANGE: Simulation horizon selector */}
                <div className="slider-group">
                  <div className="slider-header">
                    <label>Simulation Horizon</label>
                    <span className="slider-value">{years} years</span>
                  </div>
                  <input
                    type="range"
                    min="1"
                    max="20"
                    value={years}
                    onChange={(e) => setYears(parseInt(e.target.value))}
                    className="slider"
                  />
                  <div className="slider-hint">
                    Longer horizons show compounding mitigation impact
                  </div>
                </div>


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
                  {selectedScenario === 'moderate' && '≈50% adoption'}
                  {selectedScenario === 'aggressive' && '≈80% adoption'}
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
                  {selectedScenario === 'moderate' && '≈30% renewable share'}
                  {selectedScenario === 'aggressive' && '≈60% renewable share'}
                </div>
              </div>
              {/* 🔴 CHANGE: Simulation horizon selector */}
              <div className="slider-group">
                <div className="slider-header">
                  <label>Simulation Horizon</label>
                  <span className="slider-value">{years} years</span>
                </div>
                <input
                  type="range"
                  min="1"
                  max="20"
                  value={years}
                  onChange={(e) => setYears(parseInt(e.target.value))}
                  className="slider"
                />
                <div className="slider-hint">
                  Longer horizons show compounding mitigation impact
                </div>
              </div>

            </div>
          )}

          {/* 🔴 CHANGE: backend-triggered simulation */}
          <button className="btn-run-scenario" onClick={runScenario} disabled={loading}>
            <Play size={18} />
            {loading ? "Running Simulation..." : "Run Scenario Analysis"}
          </button>
        </div>

        <div className="timeline-card">
          <div className="card-header">
            <h3>Emission Projection Timeline</h3>
            <p className="card-subtitle">2026-{2026 + years} Net Zero Pathway</p>
          </div>

          <div className="timeline-chart">
            {visibleYears.map((t) => (
              <div key={t.year} className="timeline-year">
                <div className="timeline-bar-container">
                  <div
                    className="timeline-bar"
                    style={{
                      height: `${(t.emissions / simulationResult.baseline_total) * 100}%`
                    }}
                  ></div>
                </div>
                <div className="timeline-label">Year {t.year}</div>
                <div className="timeline-value">
                  {Math.round(t.emissions)} ktCO₂
                </div>
              </div>
            ))}
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