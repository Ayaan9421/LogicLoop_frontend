import React, { useState } from "react";
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  Tooltip,
  Legend,
  CartesianGrid,
  ResponsiveContainer,
  BarChart,
  Bar,
  LabelList,
} from "recharts";
import "./MethanPlanning.css";

const MethanePlanning = () => {
  const [panels, setPanels] = useState([
    {
      name: "A",
      seam_depth: "300",
      seam_thickness: "3",
      gas_class: "3",
      incident_rate: "5",
      shutdowns: "2",
      production_rate: "640",
      ventilation_capacity: "400",
    },
    {
      name: "B",
      seam_depth: "450",
      seam_thickness: "4",
      gas_class: "4",
      incident_rate: "3",
      shutdowns: "1",
      production_rate: "720",
      ventilation_capacity: "450",
    },
    {
      name: "C",
      seam_depth: "280",
      seam_thickness: "2.5",
      gas_class: "2",
      incident_rate: "4",
      shutdowns: "3",
      production_rate: "580",
      ventilation_capacity: "380",
    },
    {
      name: "D",
      seam_depth: "520",
      seam_thickness: "3.5",
      gas_class: "5",
      incident_rate: "6",
      shutdowns: "2",
      production_rate: "800",
      ventilation_capacity: "500",
    },
    {
      name: "E",
      seam_depth: "350",
      seam_thickness: "3",
      gas_class: "3",
      incident_rate: "2",
      shutdowns: "1",
      production_rate: "680",
      ventilation_capacity: "420",
    },
  ]);
  const [result, setResult] = useState(null);
  const [loading, setLoading] = useState(false);
  const [simulationRunning, setSimulationRunning] = useState(false);
  const [currentSimulationStep, setCurrentSimulationStep] = useState(0);

  const inputConfig = [
    { field: "name", label: "Name", type: "text" },
    { field: "seam_depth", label: "Seam Depth (m)", type: "number", min: 0, max: 2000 },
    { field: "seam_thickness", label: "Thickness (m)", type: "number", min: 1, max: 10 },
    { field: "gas_class", label: "Gas Class (1-5)", type: "number", min: 1, max: 5 },
    { field: "incident_rate", label: "Incident Rate", type: "number", min: 0, max: 10 },
    { field: "shutdowns", label: "Shutdowns", type: "number", min: 0, max: 5 },
    { field: "production_rate", label: "Production Rate (t/day)", type: "number", min: 0, max: 5000 },
    { field: "ventilation_capacity", label: "Ventilation Capacity (m³/min)", type: "number", min: 1000, max: 5000 },
  ];

  const handleChange = (index, field, value) => {
    const newPanels = [...panels];
    newPanels[index][field] = value;
    setPanels(newPanels);
  };

  const addPanel = () => {
    setPanels([
      ...panels,
      {
        name: `P${panels.length + 1}`,
        seam_depth: "",
        seam_thickness: "",
        gas_class: "",
        incident_rate: "",
        shutdowns: "",
        production_rate: "",
        ventilation_capacity: "",
      },
    ]);
  };

  const removePanel = (index) => {
    if (panels.length > 1) {
      const newPanels = panels.filter((_, i) => i !== index);
      setPanels(newPanels);
    }
  };

  const runOptimization = async () => {
    setLoading(true);
    try {
      const formattedPanels = panels.map((p) => ({
        name: p.name,
        seam_depth: parseFloat(p.seam_depth),
        seam_thickness: parseFloat(p.seam_thickness),
        gas_class: parseFloat(p.gas_class),
        incident_rate: parseFloat(p.incident_rate),
        shutdowns: parseFloat(p.shutdowns),
        production_rate: parseFloat(p.production_rate),
        ventilation_capacity: parseFloat(p.ventilation_capacity),
      }));

      const res = await fetch("https://coletta-snouted-rigoberto.ngrok-free.dev/optimize", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ panels: formattedPanels }),
      });

      if (!res.ok) throw new Error("Backend fetch failed");
      const data = await res.json();
      setResult(data);
    } catch (err) {
      console.error(err);
      alert(err.message);
    } finally {
      setLoading(false);
    }
  };

  const runSimulation = () => {
    if (!result) return;
    setSimulationRunning(true);
    setCurrentSimulationStep(0);
    
    const interval = setInterval(() => {
      setCurrentSimulationStep(prev => {
        if (prev >= result.optimized.sequence.length - 1) {
          clearInterval(interval);
          setSimulationRunning(false);
          return prev;
        }
        return prev + 1;
      });
    }, 1500);
  };

  const sequenceChartData = () => {
    if (!result) return [];
    return [
      { sequence: "Baseline", total_methane: result.baseline.total_methane },
      { sequence: "Optimized", total_methane: result.optimized.total_methane },
    ];
  };

  const panelLineChartData = () => {
    if (!result) return [];
    return result.optimized.sequence.map((panelName) => {
      const panel = result.optimized.panel_scores.find((p) => p.name === panelName);
      return {
        name: panel.name,
        methane: panel.final_score,
      };
    });
  };

  const comparisonChartData = () => {
    if (!result) return [];

    const baselineMap = new Map(
      result.baseline.panel_scores.map(p => [p.name, p.final_score])
    );

    const optimizedMap = new Map(
      result.optimized.panel_scores.map(p => [p.name, p.final_score])
    );

    const allPanels = [...new Set([
      ...result.baseline.panel_scores.map(p => p.name),
      ...result.optimized.panel_scores.map(p => p.name)
    ])];

    return allPanels.map(name => ({
      name,
      baseline: baselineMap.get(name) || 0,
      optimized: optimizedMap.get(name) || 0,
    }));
  };

  return (
    <div className="methane-planning">
      {/* Input Section */}
      <div className="mp-input-section">
        <div className="mp-section-header">
          <div>
            <h2>Panel Data Input</h2>
            <p>Enter mining panel parameters for optimization analysis</p>
          </div>
          <button className="mp-btn-add" onClick={addPanel}>
            + Add Panel
          </button>
        </div>

        <div className="mp-panels-container">
          {panels.map((panel, index) => (
            <div key={index} className="mp-panel-card">
              <div className="mp-panel-header">
                <h3>Panel {index + 1}</h3>
                {panels.length > 1 && (
                  <button
                    className="mp-btn-remove"
                    onClick={() => removePanel(index)}
                  >
                    Remove
                  </button>
                )}
              </div>

              <div className="mp-input-grid">
                {inputConfig.map((config) => (
                  <div key={config.field} className="mp-input-field">
                    <label>{config.label}</label>
                    <input
                      type={config.type}
                      value={panel[config.field]}
                      min={config.min}
                      max={config.max}
                      placeholder={config.min !== undefined ? `${config.min}-${config.max}` : ""}
                      onChange={(e) => handleChange(index, config.field, e.target.value)}
                    />
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>

        <button
          className={`mp-btn-optimize ${loading ? 'loading' : ''}`}
          onClick={runOptimization}
          disabled={loading}
        >
          {loading ? "Running Optimization..." : "Run Optimization"}
        </button>
      </div>

      {/* Results */}
      {result && (
        <>
          {/* Results Title */}
          <div className="mp-results-title-section">
            <h2>Optimization Results</h2>
            <p>Comparative analysis of baseline vs. optimized sequences</p>
          </div>

          {/* Main Grid Layout */}
          <div className="mp-main-grid">
            {/* Left Column - Stats and Reduction */}
            <div className="mp-grid-left">
              {/* Reduction Card */}
              <div className="mp-reduction-card">
                <div className="mp-reduction-header">
                  <span className="mp-reduction-icon">🎯</span>
                  <span className="mp-reduction-label">Reduction Achieved</span>
                </div>
                <div className="mp-reduction-value">{result.reduction_percent.toFixed(2)}%</div>
                <div className="mp-reduction-subtitle">Methane Emissions Reduced</div>
              </div>

              {/* Stats Cards */}
              <div className="mp-stat-card">
                <div className="mp-stat-label">Baseline Emissions</div>
                <div className="mp-stat-value">{result.baseline.total_methane.toFixed(4)}</div>
                <div className="mp-stat-subtitle">Total Methane (m³)</div>
              </div>
              <div className="mp-stat-card">
                <div className="mp-stat-label">Optimized Emissions</div>
                <div className="mp-stat-value">{result.optimized.total_methane.toFixed(4)}</div>
                <div className="mp-stat-subtitle">Total Methane (m³)</div>
              </div>
              <div className="mp-stat-card">
                <div className="mp-stat-label">Total Panels</div>
                <div className="mp-stat-value">{result.baseline.sequence.length}</div>
                <div className="mp-stat-subtitle">Mining Panels Analyzed</div>
              </div>

              {/* Simulation Control */}
              <div className="mp-simulation-card">
                <h3 className="mp-simulation-title">🚜 Panel Movement Simulation</h3>
                <button 
                  className={`mp-btn-simulate ${simulationRunning ? 'running' : ''}`}
                  onClick={runSimulation}
                  disabled={simulationRunning}
                >
                  {simulationRunning ? '▶ Running...' : '▶ Start Simulation'}
                </button>
                
                <div className="mp-simulation-view">
                  {result.optimized.sequence.map((panel, idx) => {
                    const panelScore = result.optimized.panel_scores.find(p => p.name === panel);
                    const methaneLevel = panelScore ? panelScore.final_score : 0;
                    
                    return (
                      <div 
                        key={idx}
                        className={`mp-sim-panel ${idx <= currentSimulationStep ? 'active' : ''} ${idx === currentSimulationStep ? 'current' : ''}`}
                      >
                        <div className="mp-sim-panel-left">
                          <div className="mp-sim-panel-icon">
                            {idx === currentSimulationStep ? '🚜' : idx < currentSimulationStep ? '✓' : '⚪'}
                          </div>
                          <div className="mp-sim-panel-info">
                            <div className="mp-sim-panel-name">Panel {panel}</div>
                            <div className="mp-sim-panel-step">Step {idx + 1} of {result.optimized.sequence.length}</div>
                          </div>
                        </div>
                        <div className="mp-sim-panel-right">
                          <div className="mp-sim-methane-bar">
                            <div 
                              className="mp-sim-methane-fill"
                              style={{ 
                                width: `${(methaneLevel / Math.max(...result.optimized.panel_scores.map(p => p.final_score))) * 100}%`
                              }}
                            />
                          </div>
                          <div className="mp-sim-methane-value">
                            {methaneLevel.toFixed(3)} m³
                          </div>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>
            </div>

            {/* Right Column - Charts */}
            <div className="mp-grid-right">
              {/* Total Methane Emissions Comparison Chart */}
              <div className="mp-chart-card">
                <h3 className="mp-chart-title">Total Methane Emissions Comparison</h3>
                <ResponsiveContainer width="100%" height={300}>
                  <BarChart data={sequenceChartData()} margin={{ top: 20, right: 30, left: 20, bottom: 20 }}>
                    <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" />
                    <XAxis dataKey="sequence" stroke="#64748b" style={{ fontSize: '13px' }} />
                    <YAxis stroke="#64748b" style={{ fontSize: '13px' }} />
                    <Tooltip
                      contentStyle={{
                        background: '#fff',
                        border: '1px solid #e2e8f0',
                        borderRadius: '8px',
                        boxShadow: '0 4px 12px rgba(0,0,0,0.1)'
                      }}
                      formatter={(value) => [value.toFixed(3), "Total Methane"]}
                    />
                    <Legend wrapperStyle={{ fontSize: '13px' }} />
                    <Bar dataKey="total_methane" fill="#10b981" radius={[8, 8, 0, 0]}>
                      <LabelList
                        dataKey="total_methane"
                        position="top"
                        formatter={(val) => val.toFixed(3)}
                        style={{ fontSize: '12px', fontWeight: '600' }}
                      />
                    </Bar>
                  </BarChart>
                </ResponsiveContainer>
              </div>

              {/* Sequence Cards */}
              <div className="mp-sequences-grid">
                <div className="mp-sequence-card baseline">
                  <h4>Baseline Sequence</h4>
                  <div className="mp-sequence-flow">
                    {result.baseline.sequence.map((panel, idx) => (
                      <React.Fragment key={idx}>
                        <span className="mp-sequence-panel">{panel}</span>
                        {idx < result.baseline.sequence.length - 1 && (
                          <span className="mp-sequence-arrow">→</span>
                        )}
                      </React.Fragment>
                    ))}
                  </div>
                </div>

                <div className="mp-sequence-card optimized">
                  <h4>Optimized Sequence</h4>
                  <div className="mp-sequence-flow">
                    {result.optimized.sequence.map((panel, idx) => (
                      <React.Fragment key={idx}>
                        <span className="mp-sequence-panel">{panel}</span>
                        {idx < result.optimized.sequence.length - 1 && (
                          <span className="mp-sequence-arrow">→</span>
                        )}
                      </React.Fragment>
                    ))}
                  </div>
                </div>
              </div>

              {/* Panel Comparison Chart */}
              <div className="mp-chart-card">
                <h3 className="mp-chart-title">Panel Methane Comparison (Baseline vs Optimized)</h3>
                <ResponsiveContainer width="100%" height={300}>
                  <BarChart data={comparisonChartData()} margin={{ top: 20, right: 30, left: 20, bottom: 20 }}>
                    <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" />
                    <XAxis dataKey="name" stroke="#64748b" style={{ fontSize: '13px' }} />
                    <YAxis stroke="#64748b" style={{ fontSize: '13px' }} />
                    <Tooltip
                      contentStyle={{
                        background: '#fff',
                        border: '1px solid #e2e8f0',
                        borderRadius: '8px',
                        boxShadow: '0 4px 12px rgba(0,0,0,0.1)'
                      }}
                      formatter={(value) => [value.toFixed(4), "Methane"]}
                    />
                    <Legend wrapperStyle={{ fontSize: '13px' }} />
                    <Bar dataKey="baseline" fill="#dc2626" radius={[8, 8, 0, 0]} name="Baseline" />
                    <Bar dataKey="optimized" fill="#10b981" radius={[8, 8, 0, 0]} name="Optimized" />
                  </BarChart>
                </ResponsiveContainer>
              </div>

              {/* Methane Contribution Line Chart */}
              <div className="mp-chart-card">
                <h3 className="mp-chart-title">Methane Contribution by Panel Order (Optimized)</h3>
                <ResponsiveContainer width="100%" height={300}>
                  <LineChart data={panelLineChartData()} margin={{ top: 20, right: 30, left: 20, bottom: 20 }}>
                    <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" />
                    <XAxis dataKey="name" stroke="#64748b" style={{ fontSize: '13px' }} />
                    <YAxis stroke="#64748b" style={{ fontSize: '13px' }} />
                    <Tooltip
                      contentStyle={{
                        background: '#fff',
                        border: '1px solid #e2e8f0',
                        borderRadius: '8px',
                        boxShadow: '0 4px 12px rgba(0,0,0,0.1)'
                      }}
                      formatter={(value) => [value.toFixed(3), "Methane"]}
                    />
                    <Legend wrapperStyle={{ fontSize: '13px' }} />
                    <Line
                      type="monotone"
                      dataKey="methane"
                      stroke="#10b981"
                      strokeWidth={3}
                      dot={{ fill: '#10b981', r: 5 }}
                      activeDot={{ r: 7 }}
                    />
                  </LineChart>
                </ResponsiveContainer>
              </div>
            </div>
          </div>
        </>
      )}
    </div>
  );
};

export default MethanePlanning;