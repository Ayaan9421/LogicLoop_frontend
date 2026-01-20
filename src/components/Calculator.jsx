import React, { useState } from 'react';
import { Calculator as CalcIcon, Zap, Activity, TrendingUp, Truck, Drill, Users, Package, Leaf, DollarSign } from 'lucide-react';
import './Calculator.css';

const Calculator = () => {
  // Form inputs with dummy data
  const [excavation, setExcavation] = useState('5000');
  const [transportation, setTransportation] = useState('250');
  const [fuel, setFuel] = useState('1200');
  const [equipment, setEquipment] = useState('180');
  const [workers, setWorkers] = useState('25');
  const [output, setOutput] = useState('8000');
  const [fuelType, setFuelType] = useState('coal');
  const [reduction, setReduction] = useState('500');
  
  // Results
  const [results, setResults] = useState(null);
  const [isCalculating, setIsCalculating] = useState(false);

  // Emission factors
  const EXCAVATION_FACTOR = 0.15;
  const TRANSPORTATION_FACTOR = 0.12;
  const EQUIPMENT_FACTOR = 0.08;
  const COAL_CO2_EMISSION_FACTOR = 2.42;
  const COST_PER_CC = 15;
  
  const emissionFactors = {
    coal: 2.42,
    diesel: 2.68,
    naturalGas: 2.03,
    petrol: 2.31
  };

  const calculateEmissions = () => {
    setIsCalculating(true);
    
    setTimeout(() => {
      const excavationVal = parseFloat(excavation || 0);
      const transportationVal = parseFloat(transportation || 0);
      const fuelVal = parseFloat(fuel || 0);
      const equipmentVal = parseFloat(equipment || 0);
      const workersVal = parseInt(workers || 1);
      const outputVal = parseFloat(output || 1);
      const reducedVal = parseFloat(reduction || 0);

      // Emission calculations
      const excavationEmissions = excavationVal * EXCAVATION_FACTOR;
      const transportationEmissions = transportationVal * TRANSPORTATION_FACTOR * 0.5;
      const equipmentEmissions = equipmentVal * EQUIPMENT_FACTOR;
      const totalEmissions = excavationEmissions + transportationEmissions + equipmentEmissions;

      // Per capita and per output
      const excavationPerCapita = excavationEmissions / workersVal;
      const transportationPerCapita = transportationEmissions / workersVal;
      const equipmentPerCapita = equipmentEmissions / workersVal;
      
      const excavationPerOutput = excavationEmissions / outputVal;
      const transportationPerOutput = transportationEmissions / outputVal;
      const equipmentPerOutput = equipmentEmissions / outputVal;

      // Carbon credits calculation
      const annualCoal = outputVal;
      const fuelEmissionFactor = emissionFactors[fuelType] || COAL_CO2_EMISSION_FACTOR;
      const fuelEmissions = fuelVal * fuelEmissionFactor;
      const total = annualCoal * COAL_CO2_EMISSION_FACTOR + fuelEmissions;
      const baselineEmissions = total;
      const carbonCredits = baselineEmissions - reducedVal;
      const worth = carbonCredits * COST_PER_CC;

      setResults({
        totalEmissions: totalEmissions.toFixed(2),
        excavationEmissions: excavationEmissions.toFixed(2),
        transportationEmissions: transportationEmissions.toFixed(2),
        equipmentEmissions: equipmentEmissions.toFixed(2),
        excavationPerCapita: excavationPerCapita.toFixed(2),
        transportationPerCapita: transportationPerCapita.toFixed(2),
        equipmentPerCapita: equipmentPerCapita.toFixed(2),
        excavationPerOutput: excavationPerOutput.toFixed(2),
        transportationPerOutput: transportationPerOutput.toFixed(2),
        equipmentPerOutput: equipmentPerOutput.toFixed(2),
        perCapitaEmissions: (totalEmissions / workersVal).toFixed(2),
        perOutputEmissions: (totalEmissions / outputVal).toFixed(2),
        baseline: baselineEmissions.toFixed(2),
        carbonCredits: carbonCredits.toFixed(2),
        reduced: reducedVal.toFixed(2),
        worth: worth.toFixed(2),
        total: total.toFixed(2),
        // Percentages for breakdown
        excavationPercent: ((excavationEmissions / totalEmissions) * 100).toFixed(1),
        transportationPercent: ((transportationEmissions / totalEmissions) * 100).toFixed(1),
        equipmentPercent: ((equipmentEmissions / totalEmissions) * 100).toFixed(1)
      });
      
      setIsCalculating(false);
    }, 800);
  };

  const resetForm = () => {
    setExcavation('');
    setTransportation('');
    setFuel('');
    setEquipment('');
    setWorkers('');
    setOutput('');
    setFuelType('coal');
    setReduction('');
    setResults(null);
  };

  return (
    <div className="calculator-page">
      <div className="page-header-section">
        <div>
          <h1>Mining Emission Calculator</h1>
          <p>Calculate comprehensive emissions from mining operations with carbon credit estimation</p>
        </div>
      </div>

      <div className="calculator-grid">
        <div className="input-card">
          <div className="card-header-calc">
            <CalcIcon size={24} color="#10b981" />
            <h3>Operational Data Input</h3>
          </div>

          <div className="input-group">
            <label>Excavation Activity (tonnes)</label>
            <input
              type="number"
              value={excavation}
              onChange={(e) => setExcavation(e.target.value)}
              placeholder="Enter excavation volume"
            />
            <span className="input-hint">Emission Factor: 0.15 kgCO2e/tonne</span>
          </div>

          <div className="input-group">
            <label>Transportation Distance (km)</label>
            <input
              type="number"
              value={transportation}
              onChange={(e) => setTransportation(e.target.value)}
              placeholder="Enter transport distance"
            />
            <span className="input-hint">Emission Factor: 0.06 kgCO2e/km (0.5x adjustment)</span>
          </div>

          <div className="input-group">
            <label>Fuel Consumption (liters)</label>
            <input
              type="number"
              value={fuel}
              onChange={(e) => setFuel(e.target.value)}
              placeholder="Enter fuel usage"
            />
          </div>

          <div className="input-group">
            <label>Fuel Type</label>
            <select 
              className="select-input"
              value={fuelType} 
              onChange={(e) => setFuelType(e.target.value)}
            >
              <option value="coal">Coal (2.42 kgCO2e/L)</option>
              <option value="diesel">Diesel (2.68 kgCO2e/L)</option>
              <option value="naturalGas">Natural Gas (2.03 kgCO2e/L)</option>
              <option value="petrol">Petrol (2.31 kgCO2e/L)</option>
            </select>
          </div>

          <div className="input-group">
            <label>Equipment Operation Hours (hours)</label>
            <input
              type="number"
              value={equipment}
              onChange={(e) => setEquipment(e.target.value)}
              placeholder="Enter equipment hours"
            />
            <span className="input-hint">Emission Factor: 0.08 kgCO2e/hour</span>
          </div>

          <div className="input-row">
            <div className="input-group">
              <label>Number of Workers</label>
              <input
                type="number"
                value={workers}
                onChange={(e) => setWorkers(e.target.value)}
                placeholder="Workers"
              />
            </div>

            <div className="input-group">
              <label>Annual Output (tonnes)</label>
              <input
                type="number"
                value={output}
                onChange={(e) => setOutput(e.target.value)}
                placeholder="Output"
              />
            </div>
          </div>

          <div className="input-group">
            <label>Emission Reduction Achieved (kgCO2e)</label>
            <input
              type="number"
              value={reduction}
              onChange={(e) => setReduction(e.target.value)}
              placeholder="Enter reduction amount"
            />
            <span className="input-hint">Through efficiency improvements or offsets</span>
          </div>

          <div className="button-group">
            <button 
              className={`btn-calculate ${isCalculating ? 'calculating' : ''}`}
              onClick={calculateEmissions}
              disabled={isCalculating}
            >
              {isCalculating ? 'Calculating...' : 'Calculate Emissions'}
            </button>
            <button className="btn-reset" onClick={resetForm}>
              Reset
            </button>
          </div>
        </div>

        <div className="results-column">
          <div className="result-card-primary show">
            <div className="result-icon">
              <Activity size={32} />
            </div>
            <h3>Total Operational Emissions</h3>
            <div className="result-value">
              {results?.totalEmissions || '0.00'}
              <span className="result-unit">kgCO2e</span>
            </div>
            <div className="result-comparison">
              ≈ {results ? (parseFloat(results.totalEmissions) / 1000).toFixed(3) : '0.000'} tonnes CO2e
            </div>
          </div>

          <div className="breakdown-card fade-in">
            <h3>Operational Breakdown</h3>
            
            <div className="breakdown-item">
              <div className="breakdown-header">
                <span className="breakdown-label">
                  <Drill size={16} color="#3b82f6" />
                  Excavation
                </span>
                <span className="breakdown-value">{results?.excavationEmissions || '0.00'} kg</span>
              </div>
              <div className="progress-bar-container">
                <div 
                  className="progress-bar-fill fuel" 
                  style={{ width: `${results?.excavationPercent || 0}%` }}
                ></div>
              </div>
              <span className="breakdown-percent">{results?.excavationPercent || '0.0'}%</span>
            </div>

            <div className="breakdown-item">
              <div className="breakdown-header">
                <span className="breakdown-label">
                  <Truck size={16} color="#f59e0b" />
                  Transportation
                </span>
                <span className="breakdown-value">{results?.transportationEmissions || '0.00'} kg</span>
              </div>
              <div className="progress-bar-container">
                <div 
                  className="progress-bar-fill electricity" 
                  style={{ width: `${results?.transportationPercent || 0}%` }}
                ></div>
              </div>
              <span className="breakdown-percent">{results?.transportationPercent || '0.0'}%</span>
            </div>

            <div className="breakdown-item">
              <div className="breakdown-header">
                <span className="breakdown-label">
                  <Zap size={16} color="#ef4444" />
                  Equipment
                </span>
                <span className="breakdown-value">{results?.equipmentEmissions || '0.00'} kg</span>
              </div>
              <div className="progress-bar-container">
                <div 
                  className="progress-bar-fill blasting" 
                  style={{ width: `${results?.equipmentPercent || 0}%` }}
                ></div>
              </div>
              <span className="breakdown-percent">{results?.equipmentPercent || '0.0'}%</span>
            </div>
          </div>

          <div className="stats-grid fade-in">
            <div className="stat-card">
              <Users size={20} color="#10b981" />
              <div>
                <div className="stat-value">{results?.perCapitaEmissions || '0.00'}</div>
                <div className="stat-label">kg per Worker</div>
              </div>
            </div>
            <div className="stat-card">
              <Package size={20} color="#6366f1" />
              <div>
                <div className="stat-value">{results?.perOutputEmissions || '0.00'}</div>
                <div className="stat-label">kg per Tonne Output</div>
              </div>
            </div>
          </div>

          <div className="carbon-credits-card fade-in">
            <div className="credits-header">
              <Leaf size={24} color="#10b981" />
              <h3>Carbon Credits</h3>
            </div>
            <div className="credits-body">
              <div className="credit-row">
                <span>Baseline Emissions:</span>
                <strong>{results?.baseline || '0.00'} kgCO2e</strong>
              </div>
              <div className="credit-row">
                <span>Reduction Achieved:</span>
                <strong className="text-green">{results?.reduced || '0.00'} kgCO2e</strong>
              </div>
              <div className="credit-row highlight">
                <span>Carbon Credits Earned:</span>
                <strong>{results?.carbonCredits || '0.00'} credits</strong>
              </div>
              <div className="credit-worth">
                ₹
                <div>
                  <div className="worth-value">₹{results?.worth || '0.00'}</div>
                  <div className="worth-label">Estimated Worth (@₹15/credit)</div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="info-cards-row">
        <div className="info-card">
          <h2>Export Report</h2>
          <p>Download comprehensive calculation results for compliance and auditing</p>
          <button className="link-btn-calc">Generate PDF →</button>
        </div>
        <div className="info-card">
          <h2>Historical Data</h2>
          <p>View trends and compare emissions across different time periods</p>
          <button className="link-btn-calc">View Analytics →</button>
        </div>
        <div className="info-card">
          <h2>Recommendations</h2>
          <p>Get AI-powered suggestions to reduce your carbon footprint</p>
          <button className="link-btn-calc">Get Insights →</button>
        </div>
      </div>
    </div>
  );
};

export default Calculator;