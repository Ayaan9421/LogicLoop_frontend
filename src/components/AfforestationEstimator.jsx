import React, { useState, useMemo, useEffect, useRef } from 'react';
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
  const emissionData = [
    {
      sno: 1,
      mine_name: "A SHYAMSUNOERPURA",
      state: "West Bengal",
      district: "Paschim Bardhaman",
      owner: "ECL",
      govt_private: "G",
      mine_type: "UG",
      latitude: 23.6483,
      longitude: 87.2575,
      sink_area: 600,
      coal_extracted: 830000,
      fuel_emission: 33366000,
      electricity_emission: 300792,
      total_emission: 33666792,
      methane_emission: 8300000,
      solar: "1916 kwh/m2/year"
    },
    {
      sno: 2,
      mine_name: "ALP",
      state: "Telangana",
      district: "Mancherial",
      owner: "SCCL",
      govt_private: "SG",
      mine_type: "UG",
      latitude: 18.6648,
      longitude: 79.579,
      sink_area: 750,
      coal_extracted: 2060188,
      fuel_emission: 77298253.76,
      electricity_emission: 746612.13,
      total_emission: 78044865.89,
      methane_emission: 20601880,
      solar: "1720 kwh/m2/year"
    },
    {
      sno: 3,
      mine_name: "AMALGAMATED KESHALPUR WEST MUDIDIH COLLIERY (AKWMC)",
      state: "Jharkhand",
      district: "Dhanbad",
      owner: "BCCL",
      govt_private: "G",
      mine_type: "Mixed",
      latitude: 23.8078,
      longitude: 86.3221,
      sink_area: 700,
      coal_extracted: 4220000,
      fuel_emission: 113096000,
      electricity_emission: 1338162,
      total_emission: 114434162,
      methane_emission: 59080000,
      solar: "1800 kwh/m2/year"
    },
    {
      sno: 4,
      mine_name: "BANGWARA",
      state: "Madhya Pradesh",
      district: "Shahdol",
      owner: "SECL",
      govt_private: "G",
      mine_type: "UG",
      latitude: 23.1542,
      longitude: 81.5361,
      sink_area: 850,
      coal_extracted: 650000,
      fuel_emission: 27872000,
      electricity_emission: 294450,
      total_emission: 28166450,
      methane_emission: 9100000,
      solar: "1700 kwh/m2/year"
    },
    {
      sno: 5,
      mine_name: "BANSRA",
      state: "West Bengal",
      district: "Paschim Bardhaman",
      owner: "ECL",
      govt_private: "G",
      mine_type: "Mixed",
      latitude: 23.6296,
      longitude: 87.1382,
      sink_area: 850,
      coal_extracted: 730000,
      fuel_emission: 11738400,
      electricity_emission: 198414,
      total_emission: 11936814,
      methane_emission: 6570000
    },
    {
      sno: 6,
      mine_name: "BHANORA W/B (UG & OC)",
      state: "West Bengal",
      district: "Paschim Bardhaman",
      owner: "ECL",
      govt_private: "G",
      mine_type: "Mixed",
      latitude: 23.7276,
      longitude: 86.9943,
      sink_area: 800,
      coal_extracted: 480000,
      fuel_emission: 7718400,
      electricity_emission: 173952,
      total_emission: 7892352,
      methane_emission: 4800000,
      solar: "1916 kwh/m2/year"
    },
    {
      sno: 7,
      mine_name: "BHUBANESWARI",
      state: "Orissa",
      district: "Angul",
      owner: "MCL",
      govt_private: "G",
      mine_type: "OC",
      latitude: 20.9725,
      longitude: 85.1732,
      sink_area: 700,
      coal_extracted: 28000000,
      fuel_emission: 525280000,
      electricity_emission: 5073600,
      total_emission: 530353600,
      methane_emission: 336000000,
      solar: "1900 kwh/m2/year"
    },
    {
      sno: 13,
      mine_name: "GEVRA OC",
      state: "Chhattisgarh",
      district: "Korba",
      owner: "SECL",
      govt_private: "G",
      mine_type: "OC",
      latitude: 22.3308,
      longitude: 82.5958,
      sink_area: 1900,
      coal_extracted: 45000000,
      fuel_emission: 964800000,
      electricity_emission: 6115500,
      total_emission: 970915500,
      methane_emission: 765000000,
      solar: "2007.5 kwh/m2/year"
    }
  ];

  const [selectedMine, setSelectedMine] = useState(emissionData[0]);
  const [inputs, setInputs] = useState({
    residualEmissions: 1050000,
    sequestrationRate: 5.5,
    treeSpacing: 3,
    survivalRate: 85,
    timeHorizon: 20
  });

  const [selectedTreeType, setSelectedTreeType] = useState('mixed');
  const [selectedLandType, setSelectedLandType] = useState('degraded');
  const canvasRef = useRef(null);

  // Update residual emissions when mine changes
  useEffect(() => {
    setInputs(prev => ({
      ...prev,
      residualEmissions: Math.round(selectedMine.total_emission / 1000) // Convert to tonnes
    }));
  }, [selectedMine]);

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

  // DBSCAN clustering algorithm
  const dbscan = (points, eps, minPts) => {
    const clusters = [];
    const visited = new Set();
    const noise = [];

    const getNeighbors = (pointIdx) => {
      const neighbors = [];
      const [x1, y1] = points[pointIdx];
      
      for (let i = 0; i < points.length; i++) {
        if (i === pointIdx) continue;
        const [x2, y2] = points[i];
        const dist = Math.sqrt((x2 - x1) ** 2 + (y2 - y1) ** 2);
        if (dist <= eps) {
          neighbors.push(i);
        }
      }
      return neighbors;
    };

    const expandCluster = (pointIdx, neighbors, cluster) => {
      cluster.push(pointIdx);
      visited.add(pointIdx);

      for (let i = 0; i < neighbors.length; i++) {
        const neighborIdx = neighbors[i];
        
        if (!visited.has(neighborIdx)) {
          visited.add(neighborIdx);
          const neighborNeighbors = getNeighbors(neighborIdx);
          
          if (neighborNeighbors.length >= minPts) {
            neighbors.push(...neighborNeighbors);
          }
        }

        let addedToCluster = false;
        for (const c of clusters) {
          if (c.includes(neighborIdx)) {
            addedToCluster = true;
            break;
          }
        }
        
        if (!addedToCluster && !cluster.includes(neighborIdx)) {
          cluster.push(neighborIdx);
        }
      }
    };

    for (let i = 0; i < points.length; i++) {
      if (visited.has(i)) continue;
      
      const neighbors = getNeighbors(i);
      
      if (neighbors.length < minPts) {
        noise.push(i);
        visited.add(i);
      } else {
        const cluster = [];
        expandCluster(i, neighbors, cluster);
        clusters.push(cluster);
      }
    }

    return { clusters, noise };
  };

  // Generate tree planting locations
  const generateTreeLocations = useMemo(() => {
    const numTrees = Math.min(Math.round(calculations.treesWithBuffer), 500);
    const points = [];
    
    const mineCenter = { x: 300, y: 300 };
    const mineRadius = 80;
    
    const zones = 4;
    const treesPerZone = Math.floor(numTrees / zones);
    
    for (let zone = 0; zone < zones; zone++) {
      const angle = (zone / zones) * 2 * Math.PI;
      const zoneDistance = mineRadius + 50 + Math.random() * 100;
      
      for (let i = 0; i < treesPerZone; i++) {
        const r = zoneDistance + Math.random() * 80;
        const theta = angle + (Math.random() - 0.5) * (2 * Math.PI / zones);
        
        const x = mineCenter.x + r * Math.cos(theta);
        const y = mineCenter.y + r * Math.sin(theta);
        
        if (x >= 0 && x <= 600 && y >= 0 && y <= 600) {
          points.push([x, y]);
        }
      }
    }
    
    return { points, mineCenter, mineRadius };
  }, [calculations.treesWithBuffer]);

  // Perform DBSCAN clustering
  const clusterData = useMemo(() => {
    const { points } = generateTreeLocations;
    const eps = 40;
    const minPts = 5;
    
    return dbscan(points, eps, minPts);
  }, [generateTreeLocations]);

  // Draw the visualization
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    
    const ctx = canvas.getContext('2d');
    const { points, mineCenter, mineRadius } = generateTreeLocations;
    const { clusters, noise } = clusterData;
    
    ctx.fillStyle = '#f8fafc';
    ctx.fillRect(0, 0, 900, 600);
    
    ctx.strokeStyle = '#e2e8f0';
    ctx.lineWidth = 1;
    for (let i = 0; i <= 900; i += 50) {
      ctx.beginPath();
      ctx.moveTo(i, 0);
      ctx.lineTo(i, 600);
      ctx.stroke();
    }
    for (let i = 0; i <= 600; i += 50) {
      ctx.beginPath();
      ctx.moveTo(0, i);
      ctx.lineTo(900, i);
      ctx.stroke();
    }
    
    const clusterColors = [
      '#10b981', '#3b82f6', '#f59e0b', '#ef4444', 
      '#8b5cf6', '#ec4899', '#06b6d4', '#84cc16'
    ];
    
    clusters.forEach((cluster, idx) => {
      const color = clusterColors[idx % clusterColors.length];
      
      ctx.fillStyle = color + '15';
      ctx.beginPath();
      cluster.forEach((pointIdx, i) => {
        const [x, y] = points[pointIdx];
        const adjustedX = (x / 600) * 900;
        if (i === 0) {
          ctx.moveTo(adjustedX, y);
        } else {
          ctx.lineTo(adjustedX, y);
        }
      });
      ctx.closePath();
      ctx.fill();
      
      cluster.forEach(pointIdx => {
        const [x, y] = points[pointIdx];
        const adjustedX = (x / 600) * 900;
        drawTree(ctx, adjustedX, y, color);
      });
    });
    
    noise.forEach(pointIdx => {
      const [x, y] = points[pointIdx];
      const adjustedX = (x / 600) * 900;
      drawTree(ctx, adjustedX, y, '#94a3b8');
    });
    
    const mineCenterX = (mineCenter.x / 600) * 900;
    ctx.fillStyle = '#78716c';
    ctx.strokeStyle = '#57534e';
    ctx.lineWidth = 3;
    ctx.beginPath();
    ctx.arc(mineCenterX, mineCenter.y, mineRadius, 0, 2 * Math.PI);
    ctx.fill();
    ctx.stroke();
    
    ctx.fillStyle = '#ffffff';
    ctx.font = 'bold 16px sans-serif';
    ctx.textAlign = 'center';
    ctx.fillText('MINE', mineCenterX, mineCenter.y - 5);
    ctx.font = '12px sans-serif';
    ctx.fillText('SITE', mineCenterX, mineCenter.y + 10);
    
    ctx.textAlign = 'left';
    ctx.fillStyle = '#1e293b';
    ctx.font = 'bold 14px sans-serif';
    ctx.fillText('DBSCAN Clusters:', 10, 25);
    
    clusters.slice(0, 4).forEach((cluster, idx) => {
      const color = clusterColors[idx % clusterColors.length];
      ctx.fillStyle = color;
      ctx.fillRect(10, 35 + idx * 25, 15, 15);
      ctx.fillStyle = '#1e293b';
      ctx.font = '12px sans-serif';
      ctx.fillText(`Cluster ${idx + 1} (${cluster.length} trees)`, 30, 47 + idx * 25);
    });
    
  }, [generateTreeLocations, clusterData]);

  const drawTree = (ctx, x, y, color) => {
    ctx.fillStyle = '#92400e';
    ctx.fillRect(x - 2, y, 4, 8);
    
    ctx.fillStyle = color;
    ctx.beginPath();
    ctx.moveTo(x, y - 8);
    ctx.lineTo(x - 6, y + 2);
    ctx.lineTo(x + 6, y + 2);
    ctx.closePath();
    ctx.fill();
    
    ctx.beginPath();
    ctx.moveTo(x, y - 4);
    ctx.lineTo(x - 5, y + 4);
    ctx.lineTo(x + 5, y + 4);
    ctx.closePath();
    ctx.fill();
  };

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
                className="select-field-white"
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

      <div className="result-card clustering-card-full">
        <div className="card-title">
          <MapPin size={20} />
          Plantation Layout - DBSCAN Clustering
        </div>
        
        <div className="mine-selector-wrapper">
          <label className="mine-selector-label">
            <span>Select Mine:</span>
            <select 
              className="mine-selector-dropdown"
              value={selectedMine.sno}
              onChange={(e) => {
                const mine = emissionData.find(m => m.sno === parseInt(e.target.value));
                setSelectedMine(mine);
              }}
            >
              {emissionData.map(mine => (
                <option key={mine.sno} value={mine.sno}>
                  {mine.mine_name} - {mine.state} ({mine.mine_type})
                </option>
              ))}
            </select>
          </label>
          <div className="mine-info-tags">
            <span className="info-tag">📍 {selectedMine.district}, {selectedMine.state}</span>
            <span className="info-tag">🏢 {selectedMine.owner}</span>
            <span className="info-tag">⛏️ {selectedMine.mine_type}</span>
            <span className="info-tag">🌳 Sink Area: {selectedMine.sink_area} hectares</span>
          </div>
        </div>

        <div className="clustering-visualization">
          <canvas 
            ref={canvasRef} 
            width={900} 
            height={600}
            className="clustering-canvas"
          />
        </div>
        <div className="cluster-info-banner">
          <strong>📊 Cluster Analysis for {selectedMine.mine_name}:</strong> Trees are grouped into clusters based on proximity (DBSCAN algorithm). 
          Each color represents a different plantation zone around the mine site for efficient management and monitoring.
          Total emissions: {(selectedMine.total_emission / 1000000).toFixed(2)} million kgCO2e/year
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