import React, { useState, useMemo } from 'react';
import { 
  Trees, 
  MapPin, 
  TrendingDown, 
  Leaf, 
  Calculator,
  Info,
  AlertCircle,
  CheckCircle2,
  Sprout,
  BarChart3
} from 'lucide-react';
import './AfforestationEstimator.css';

const AfforestationEstimator = () => {
  const [inputs, setInputs] = useState({
    residualEmissions: 1050000,
    sequestrationRate: 5.5,
    treeSpacing: 3,
    survivalRate: 85,
    timeHorizon: 20
  });

  const [selectedTreeType, setSelectedTreeType] = useState('mixed');
  const [selectedLandType, setSelectedLandType] = useState('degraded');

  const treeTypes = [
    { id: 'mixed', name: 'Mixed Native', rate: 5.5, icon: '🌳' },
    { id: 'eucalyptus', name: 'Eucalyptus', rate: 6.2, icon: '🌲' },
    { id: 'bamboo', name: 'Bamboo', rate: 8.5, icon: '🎋' },
    { id: 'teak', name: 'Teak', rate: 4.8, icon: '🌴' },
  ];

  const landTypes = [
    { id: 'degraded', name: 'Degraded Land', efficiency: 0.85 },
    { id: 'wasteland', name: 'Wasteland', efficiency: 0.75 },
    { id: 'agricultural', name: 'Agricultural', efficiency: 0.95 },
    { id: 'mineperiphery', name: 'Mine Periphery', efficiency: 0.70 },
  ];

  const handleInputChange = (field, value) => {
    setInputs(prev => ({
      ...prev,
      [field]: parseFloat(value) || 0
    }));
  };

  const handleTreeTypeChange = (type) => {
    setSelectedTreeType(type);
    const selectedType = treeTypes.find(t => t.id === type);
    setInputs(prev => ({
      ...prev,
      sequestrationRate: selectedType.rate
    }));
  };

  const calculations = useMemo(() => {
    const { residualEmissions, sequestrationRate, treeSpacing, survivalRate, timeHorizon } = inputs;
    
    const landType = landTypes.find(l => l.id === selectedLandType);
    const effectiveSequestration = sequestrationRate * (landType?.efficiency || 1);
    
    const annualSequestrationNeeded = residualEmissions / timeHorizon;
    const treesPerHectare = 10000 / (treeSpacing * treeSpacing);
    const sequestrationPerHectare = treesPerHectare * effectiveSequestration;
    const hectaresRequired = annualSequestrationNeeded / sequestrationPerHectare;
    const totalTrees = hectaresRequired * treesPerHectare;
    const treesWithBuffer = totalTrees / (survivalRate / 100);
    const totalArea = hectaresRequired;
    const totalAreaAcres = hectaresRequired * 2.471;
    const totalCost = treesWithBuffer * 50;
    const maintenanceCost = totalArea * 15000 * timeHorizon;
    
    return {
      annualSequestrationNeeded,
      treesPerHectare: Math.round(treesPerHectare),
      sequestrationPerHectare: sequestrationPerHectare.toFixed(2),
      hectaresRequired: hectaresRequired.toFixed(2),
      totalTrees: Math.round(totalTrees),
      treesWithBuffer: Math.round(treesWithBuffer),
      totalArea: totalArea.toFixed(2),
      totalAreaAcres: totalAreaAcres.toFixed(2),
      totalCost: totalCost.toFixed(0),
      maintenanceCost: maintenanceCost.toFixed(0),
      totalInvestment: (totalCost + maintenanceCost).toFixed(0),
      effectiveSequestration: effectiveSequestration.toFixed(2)
    };
  }, [inputs, selectedLandType]);

  const formatNumber = (num) => {
    if (num >= 10000000) return `${(num / 10000000).toFixed(2)} Cr`;
    if (num >= 100000) return `${(num / 100000).toFixed(2)} L`;
    if (num >= 1000) return `${(num / 1000).toFixed(2)} K`;
    return num.toString();
  };

  return (
    <div className="afforestation-container">
      <div className="page-header">
        <h1>
          <Trees size={32} color="#10b981" />
          Afforestation Requirement Estimator
        </h1>
        <p>Calculate land area and plantation requirements to offset residual emissions through strategic afforestation.</p>
      </div>

      <div className="info-banner">
        <Info size={20} />
        <span>This calculator estimates afforestation needs based on carbon sequestration rates and land availability. Actual results may vary based on local conditions.</span>
      </div>

      <div className="content-grid">
        <div className="input-section">
          <div className="input-card">
            <div className="card-title">
              <Calculator size={20} />
              Input Parameters
            </div>

            <div className="input-group">
              <label className="input-label">Residual Emissions (tCO2e/year)</label>
              <div className="input-wrapper">
                <input
                  type="number"
                  className="input-field"
                  value={inputs.residualEmissions}
                  onChange={(e) => handleInputChange('residualEmissions', e.target.value)}
                  min="0"
                />
                <span className="input-unit">tCO2e</span>
              </div>
              <span className="input-hint">Annual emissions to offset</span>
            </div>

            <div className="input-group">
              <label className="input-label">Tree Type Selection</label>
              <div className="tree-type-grid">
                {treeTypes.map(type => (
                  <div
                    key={type.id}
                    className={`tree-type-card ${selectedTreeType === type.id ? 'active' : ''}`}
                    onClick={() => handleTreeTypeChange(type.id)}
                  >
                    <span className="tree-icon">{type.icon}</span>
                    <div className="tree-name">{type.name}</div>
                    <div className="tree-rate">{type.rate} tCO2e/tree/yr</div>
                  </div>
                ))}
              </div>
            </div>

            <div className="input-group">
              <label className="input-label">Carbon Sequestration Rate (tCO2e/tree/year)</label>
              <div className="input-wrapper">
                <input
                  type="number"
                  className="input-field"
                  value={inputs.sequestrationRate}
                  onChange={(e) => handleInputChange('sequestrationRate', e.target.value)}
                  min="0"
                  step="0.1"
                />
                <span className="input-unit">tCO2e</span>
              </div>
              <span className="input-hint">Average CO2 absorption per tree annually</span>
            </div>

            <div className="input-group">
              <label className="input-label">Land Type</label>
              <select 
                className="select-field"
                value={selectedLandType}
                onChange={(e) => setSelectedLandType(e.target.value)}
              >
                {landTypes.map(type => (
                  <option key={type.id} value={type.id}>
                    {type.name} (Efficiency: {type.efficiency * 100}%)
                  </option>
                ))}
              </select>
              <span className="input-hint">Land quality affects sequestration efficiency</span>
            </div>

            <div className="input-row">
              <div className="input-group">
                <label className="input-label">Tree Spacing (meters)</label>
                <div className="input-wrapper">
                  <input
                    type="number"
                    className="input-field"
                    value={inputs.treeSpacing}
                    onChange={(e) => handleInputChange('treeSpacing', e.target.value)}
                    min="1"
                    step="0.5"
                  />
                  <span className="input-unit">m</span>
                </div>
              </div>

              <div className="input-group">
                <label className="input-label">Survival Rate (%)</label>
                <div className="input-wrapper">
                  <input
                    type="number"
                    className="input-field"
                    value={inputs.survivalRate}
                    onChange={(e) => handleInputChange('survivalRate', e.target.value)}
                    min="0"
                    max="100"
                  />
                  <span className="input-unit">%</span>
                </div>
              </div>
            </div>

            <div className="input-group">
              <label className="input-label">Time Horizon (years)</label>
              <div className="input-wrapper">
                <input
                  type="number"
                  className="input-field"
                  value={inputs.timeHorizon}
                  onChange={(e) => handleInputChange('timeHorizon', e.target.value)}
                  min="1"
                />
                <span className="input-unit">years</span>
              </div>
              <span className="input-hint">Target period for carbon neutrality</span>
            </div>
          </div>
        </div>

        <div className="result-section">
          <div className="result-card highlight-card">
            <div className="card-title">
              <BarChart3 size={20} />
              Plantation Requirements
            </div>

            <div className="result-metrics">
              <div className="result-metric primary">
                <div className="metric-icon-wrapper">
                  <MapPin size={24} color="#10b981" />
                </div>
                <div className="metric-content">
                  <div className="metric-label">Total Land Required</div>
                  <div className="metric-value-large">
                    {calculations.totalArea}
                    <span className="metric-unit-large">hectares</span>
                  </div>
                  <div className="metric-secondary">≈ {calculations.totalAreaAcres} acres</div>
                </div>
              </div>

              <div className="result-metric primary">
                <div className="metric-icon-wrapper">
                  <Trees size={24} color="#10b981" />
                </div>
                <div className="metric-content">
                  <div className="metric-label">Trees to Plant</div>
                  <div className="metric-value-large">
                    {formatNumber(calculations.treesWithBuffer)}
                    <span className="metric-unit-large">trees</span>
                  </div>
                  <div className="metric-secondary">Including {100 - inputs.survivalRate}% buffer</div>
                </div>
              </div>
            </div>
          </div>

          <div className="result-card">
            <div className="card-title">
              <Leaf size={20} />
              Detailed Calculations
            </div>

            <div className="calculation-grid">
              <div className="calc-item">
                <div className="calc-label">Annual Sequestration Needed</div>
                <div className="calc-value">{formatNumber(calculations.annualSequestrationNeeded)} tCO2e/yr</div>
              </div>

              <div className="calc-item">
                <div className="calc-label">Trees per Hectare</div>
                <div className="calc-value">{calculations.treesPerHectare} trees/ha</div>
              </div>

              <div className="calc-item">
                <div className="calc-label">Effective Sequestration Rate</div>
                <div className="calc-value">{calculations.effectiveSequestration} tCO2e/tree/yr</div>
              </div>

              <div className="calc-item">
                <div className="calc-label">Sequestration per Hectare</div>
                <div className="calc-value">{calculations.sequestrationPerHectare} tCO2e/ha/yr</div>
              </div>

              <div className="calc-item">
                <div className="calc-label">Base Trees Required</div>
                <div className="calc-value">{formatNumber(calculations.totalTrees)} trees</div>
              </div>

              <div className="calc-item">
                <div className="calc-label">Trees with Survival Buffer</div>
                <div className="calc-value">{formatNumber(calculations.treesWithBuffer)} trees</div>
              </div>
            </div>
          </div>

          <div className="result-card cost-card">
            <div className="card-title">
              <Calculator size={20} />
              Cost Estimation
            </div>

            <div className="cost-breakdown">
              <div className="cost-item">
                <div className="cost-label">Plantation Cost</div>
                <div className="cost-value">₹ {formatNumber(calculations.totalCost)}</div>
                <div className="cost-desc">@ ₹50 per sapling</div>
              </div>

              <div className="cost-item">
                <div className="cost-label">Maintenance Cost ({inputs.timeHorizon} years)</div>
                <div className="cost-value">₹ {formatNumber(calculations.maintenanceCost)}</div>
                <div className="cost-desc">@ ₹15,000 per hectare/year</div>
              </div>

              <div className="cost-divider"></div>

              <div className="cost-item total">
                <div className="cost-label">Total Investment</div>
                <div className="cost-value total-value">₹ {formatNumber(calculations.totalInvestment)}</div>
              </div>
            </div>
          </div>

          <div className="status-cards">
            <div className="status-card success">
              <CheckCircle2 size={20} />
              <div className="status-content">
                <div className="status-title">Sequestration Target</div>
                <div className="status-value">Achievable in {inputs.timeHorizon} years</div>
              </div>
            </div>

            <div className="status-card info">
              <Sprout size={20} />
              <div className="status-content">
                <div className="status-title">Land Utilization</div>
                <div className="status-value">{calculations.treesPerHectare} trees/hectare</div>
              </div>
            </div>

            <div className={`status-card ${inputs.survivalRate < 80 ? 'warning' : 'success'}`}>
              <AlertCircle size={20} />
              <div className="status-content">
                <div className="status-title">Survival Rate</div>
                <div className="status-value">{inputs.survivalRate}% expected</div>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="recommendations-card">
        <div className="card-title">
          <Info size={20} />
          Recommendations
        </div>
        <div className="recommendations-grid">
          <div className="recommendation-item">
            <div className="rec-icon">🌱</div>
            <div className="rec-content">
              <div className="rec-title">Species Diversity</div>
              <div className="rec-desc">Plant a mix of native species to improve ecosystem resilience and carbon sequestration efficiency.</div>
            </div>
          </div>

          <div className="recommendation-item">
            <div className="rec-icon">💧</div>
            <div className="rec-content">
              <div className="rec-title">Water Management</div>
              <div className="rec-desc">Implement drip irrigation and rainwater harvesting to ensure {inputs.survivalRate}% survival rate.</div>
            </div>
          </div>

          <div className="recommendation-item">
            <div className="rec-icon">📊</div>
            <div className="rec-content">
              <div className="rec-title">Monitoring & Verification</div>
              <div className="rec-desc">Establish regular monitoring protocols and consider third-party verification for carbon credits.</div>
            </div>
          </div>

          <div className="recommendation-item">
            <div className="rec-icon">👥</div>
            <div className="rec-content">
              <div className="rec-title">Community Engagement</div>
              <div className="rec-desc">Involve local communities in plantation and maintenance for sustainable long-term management.</div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AfforestationEstimator;