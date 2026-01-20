import React, { useState } from 'react';
import { Calculator as CalcIcon, Zap, Activity, TrendingUp, Truck, Drill, Users, Package, Leaf, DollarSign } from 'lucide-react';
import jsPDF from "jspdf";
import html2canvas from "html2canvas";
import './Calculator.css';
import { DNA } from "react-loader-spinner";

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
  const [showAIModal, setShowAIModal] = useState(false);
  const [aiLoading, setAiLoading] = useState(false);
  const [aiData, setAiData] = useState(null);
  const [aiError, setAiError] = useState(null);
  const [history, setHistory] = useState([]);
  const [showUploadModal, setShowUploadModal] = useState(false);
  const [uploadLoading, setUploadLoading] = useState(false);
  const [uploadError, setUploadError] = useState(null);



  const [showHistoryModal, setShowHistoryModal] = useState(false);
  // 🔹 CHANGE: Level-2 history detail modal
  const [selectedHistory, setSelectedHistory] = useState(null);

  // 🔹 CHANGE: AI insights for COMPLETE history
  const [historyAIData, setHistoryAIData] = useState(null);
  const [historyAILoading, setHistoryAILoading] = useState(false);
  const [historyAIError, setHistoryAIError] = useState(null);



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

      const historyEntry = {
        timestamp: new Date().toISOString(),

        excavation_emissions: excavationEmissions,
        transportation_emissions: transportationEmissions,
        equipment_emissions: equipmentEmissions,

        workers: workersVal,
        output_tonnes: outputVal,
        fuel_type: fuelType,
        total_emissions: totalEmissions
      };

      const existingHistory =
        JSON.parse(localStorage.getItem("emissionHistory")) || [];

      existingHistory.push(historyEntry);
      localStorage.setItem("emissionHistory", JSON.stringify(existingHistory));

      setIsCalculating(false);
    }, 800);
  };


  const handleFileUpload = async (e) => {
    const file = e.target.files[0];
    if (!file) return;

    const formData = new FormData();
    formData.append("file", file);

    try {
      const res = await fetch("https://coletta-snouted-rigoberto.ngrok-free.dev/parse-input", {
        method: "POST",
        body: formData
      });

      const data = await res.json();
      if (!data.parsed) return;

      const d = data.data;

      setExcavation(d.excavation || "");
      setTransportation(d.transportation || "");
      setFuel(d.fuel || "");
      setFuelType(d.fuel_type || "coal");
      setEquipment(d.equipment || "");
      setWorkers(d.workers || "");
      setOutput(d.output || "");
      setReduction(d.reduction || "");
    } catch (err) {
      alert("Failed to parse document");
    }
  };

  const downloadPDF = () => {
    if (!results) {
      alert("Please calculate emissions before generating the report.");
      return;
    }

    const input = document.getElementById("pdf-report");

    // Temporarily show it for capture
    input.style.display = "block";

    html2canvas(input, { scale: 2 }).then((canvas) => {
      const imgData = canvas.toDataURL("image/png");
      const pdf = new jsPDF("p", "mm", "a4");

      const pageWidth = pdf.internal.pageSize.getWidth();
      const pageHeight = pdf.internal.pageSize.getHeight();

      const imgWidth = pageWidth;
      const imgHeight = (canvas.height * imgWidth) / canvas.width;

      let heightLeft = imgHeight;
      let position = 0;

      pdf.addImage(imgData, "PNG", 0, position, imgWidth, imgHeight);
      heightLeft -= pageHeight;

      while (heightLeft > 0) {
        position = heightLeft - imgHeight;
        pdf.addPage();
        pdf.addImage(imgData, "PNG", 0, position, imgWidth, imgHeight);
        heightLeft -= pageHeight;
      }

      const dateStr = new Date().toISOString().split("T")[0];

      pdf.save(`Mining-Emission-Report-${dateStr}.pdf`);

      // Hide again after capture
      input.style.display = "none";
    });
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

  const fetchWithRetry = async (
    url,
    payload,
    retries = 3,
    delay = 1200
  ) => {
    try {
      const response = await fetch(url, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload)
      });

      if (!response.ok) throw new Error("Request failed");

      const data = await response.json();

      // 🚫 Null / empty guard
      if (
        data === null ||
        Object.keys(data).length === 0
      ) {
        throw new Error("Empty AI response");
      }

      return data;
    } catch (err) {
      if (retries > 0) {
        console.warn(`Retrying AI request... (${retries} left)`);
        await new Promise((res) => setTimeout(res, delay));
        return fetchWithRetry(url, payload, retries - 1, delay);
      }
      throw err;
    }
  };


  const fetchAIInsights = async () => {
    if (!results) return;

    setShowAIModal(true);
    setAiLoading(true);
    setAiError(null);
    setAiData(null);

    try {
      const data = await fetchWithRetry(
        "https://coletta-snouted-rigoberto.ngrok-free.dev/ai/recommendations",
        {
          excavation_emissions: Number(results.excavationEmissions),
          transportation_emissions: Number(results.transportationEmissions),
          equipment_emissions: Number(results.equipmentEmissions),
          workers: Number(workers),
          output_tonnes: Number(output),
          fuel_type: fuelType,
          total_emissions: Number(results.totalEmissions)
        },
        3,     // 🔁 retries
        1200   // ⏳ delay (ms)
      );

      setAiData(data);
    } catch (err) {
      console.log(err);
      setAiError("AI insights are currently unavailable.");
    } finally {
      setAiLoading(false);
    }
  };

  // 🔹 CHANGE: Open Historical Analytics
  const openHistory = () => {
    const data =
      JSON.parse(localStorage.getItem("emissionHistory")) || [];
    setHistory(data.reverse()); // latest first
    setShowHistoryModal(true);
  };

  // 🔹 CHANGE: Fetch AI insights for COMPLETE history
  const fetchCompleteHistoryAI = async () => {
    if (history.length === 0) return;

    setShowAIModal(true);
    setHistoryAILoading(true);
    setHistoryAIError(null);
    setHistoryAIData(null);
    setAiData(null);
    setAiError(null);

    try {
      const response = await fetch(
        "https://coletta-snouted-rigoberto.ngrok-free.dev/ai/recommendations/history",
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ history })
        }
      );

      if (!response.ok) throw new Error("AI history request failed");

      const data = await response.json();
      console.log(data);
      setHistoryAIData(data);
    } catch (err) {
      setHistoryAIError("AI analysis failed for historical data.");
    } finally {
      setHistoryAILoading(false);
    }
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

          <div className="or-upload-divider">
            <span>OR</span>
          </div>

          <div style={{ textAlign: "center", marginBottom: "20px" }}>
            <button
              className="link-btn-calc"
              onClick={() => setShowUploadModal(true)}
            >
              Upload File →
            </button>
          </div>

          {showUploadModal && (
            <div className="ai-modal-overlay">
              <div className="ai-modal">

                <button
                  className="ai-close"
                  onClick={() => {
                    setShowUploadModal(false);
                    setUploadError(null);
                  }}
                >
                  ✕
                </button>

                {!uploadLoading ? (
                  <>
                    <h2>Upload Operational Data</h2>
                    <p style={{ marginBottom: "16px" }}>
                      Upload a PDF, image, or CSV. AI will extract relevant fields automatically.
                    </p>

                    <input
                      type="file"
                      accept=".pdf,.png,.jpg,.jpeg,.csv"
                      onChange={async (e) => {
                        const file = e.target.files[0];
                        if (!file) return;

                        setUploadLoading(true);
                        setUploadError(null);

                        const formData = new FormData();
                        formData.append("file", file);

                        try {
                          const res = await fetch("https://coletta-snouted-rigoberto.ngrok-free.dev/file/parse-input", {
                            method: "POST",
                            body: formData
                          });

                          const data = await res.json();
                          if (!data.parsed) throw new Error("Parsing failed");

                          const d = data.data;

                          // ✅ Autofill existing fields
                          setExcavation(d.excavation || "");
                          setTransportation(d.transportation || "");
                          setFuel(d.fuel || "");
                          setFuelType(d.fuel_type || "coal");
                          setEquipment(d.equipment || "");
                          setWorkers(d.workers || "");
                          setOutput(d.output || "");
                          setReduction(d.reduction || "");

                          setShowUploadModal(false);
                        } catch (err) {
                          setUploadError("Failed to extract data from file.");
                        } finally {
                          setUploadLoading(false);
                        }
                      }}
                    />

                    {uploadError && (
                      <p className="ai-error" style={{ marginTop: "12px" }}>
                        {uploadError}
                      </p>
                    )}
                  </>
                ) : (
                  <div className="ai-loader">
                    <DNA
                      visible={true}
                      height={90}
                      width={90}
                      ariaLabel="dna-loading"
                      wrapperClass="dna-wrapper"
                      dnaColorOne="rgba(16, 185, 129, 0.65)"
                      dnaColorTwo="#059669"
                    />
                    <h3>Processing Document</h3>
                    <p>Extracting operational parameters…</p>
                  </div>
                )}

              </div>
            </div>
          )}


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

        <div className="results-column" >
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
          <button className="link-btn-calc" onClick={downloadPDF}>Generate PDF →</button>
        </div>
        <div className="info-card">
          <h2>Historical Data</h2>
          <p>View trends and compare emissions across different time periods</p>
          <button className="link-btn-calc" onClick={openHistory}>View Analytics →</button>
        </div>
        <div className="info-card">
          <h2>Recommendations</h2>
          <p>Get AI-powered suggestions to reduce your carbon footprint</p>
          <button className="link-btn-calc" onClick={fetchAIInsights}>Get Insights →</button>
        </div>
      </div>
      {showAIModal && (
        <div className="ai-modal-overlay ai-top-modal">

          <div className="ai-modal">
            <button className="ai-close" onClick={() => setShowAIModal(false)}>
              ✕
            </button>

            {/* 🔹 AI LOADING (single OR history) */}
            {(aiLoading || historyAILoading) && (
              <div className="ai-loader">
                <DNA
                  visible={true}
                  height={100}
                  width={100}
                  ariaLabel="dna-loading"
                  wrapperClass="dna-wrapper"
                  dnaColorOne="rgba(16, 185, 129, 0.65)"
                  dnaColorTwo="#059669"
                />
                <h2>
                  {historyAILoading
                    ? "Analyzing Historical Emissions"
                    : "Analyzing Mining Emissions"}
                </h2>
                <p>
                  {historyAILoading
                    ? "AI is reviewing trends across all records…"
                    : "AI is generating sustainability insights…"}
                </p>
              </div>
            )}

            {/* 🔹 SINGLE CALCULATION AI ERROR */}
            {!aiLoading && aiError && (
              <div className="ai-error">{aiError}</div>
            )}

            {/* 🔹 HISTORY AI ERROR */}
            {!historyAILoading && historyAIError && (
              <div className="ai-error">{historyAIError}</div>
            )}

            {/* 🔹 SINGLE CALCULATION AI */}
            {!aiLoading && aiData && (
              <div className="ai-content">
                <h2>AI Recommendations</h2>

                <p className="ai-summary">{aiData.summary}</p>

                <h4>🔥 High Impact Actions</h4>
                <ul>
                  {aiData.high_impact_actions.map((a, i) => (
                    <li key={i}>{a}</li>
                  ))}
                </ul>

                <h4>⚙️ Medium Impact Actions</h4>
                <ul>
                  {aiData.medium_impact_actions.map((a, i) => (
                    <li key={i}>{a}</li>
                  ))}
                </ul>

                <h4>⚡ Quick Wins</h4>
                <ul>
                  {aiData.quick_wins.map((a, i) => (
                    <li key={i}>{a}</li>
                  ))}
                </ul>

                <div className="ai-impact">
                  Estimated Reduction Potential:
                  <strong> {aiData.estimated_reduction_percent}%</strong>
                </div>
              </div>
            )}

            {/* 🔹 COMPLETE HISTORY AI */}
            {!historyAILoading && historyAIData && (
              <div className="ai-content">
                <h2>AI Analysis — Complete History</h2>

                <p className="ai-summary">{historyAIData.summary}</p>

                <h4>📊 Key Patterns</h4>
                <ul>
                  {historyAIData.patterns.map((p, i) => (
                    <li key={i}>{p}</li>
                  ))}
                </ul>

                <h4>🚀 Strategic Recommendations</h4>
                <ul>
                  {historyAIData.recommendations.map((r, i) => (
                    <li key={i}>{r}</li>
                  ))}
                </ul>

                <div className="ai-impact">
                  Estimated Overall Reduction Potential:
                  <strong> {historyAIData.estimated_overall_reduction_percent}%</strong>
                </div>
              </div>
            )}

          </div>
        </div>
      )}

      {/* 🔹 LEVEL 1: History Overview Modal */}
      {showHistoryModal && (
        <div className="ai-modal-overlay history-modal">

          <div className="ai-modal">
            <button
              className="ai-close"
              onClick={() => {
                setShowHistoryModal(false);
                setHistoryAIData(null);
                setHistoryAIData(null);
                setHistoryAIError(null);
              }
              }>
              ✕
            </button>

            <h2>Historical Emission Records</h2>

            {history.length === 0 && <p>No historical data available.</p>}

            {history.map((h, idx) => (
              <div
                key={idx}
                style={{
                  background: "#f8fafc",
                  padding: "14px",
                  borderRadius: "10px",
                  marginBottom: "10px",
                  cursor: "pointer",
                  borderLeft: "4px solid #10b981"
                }}
                onClick={() => setSelectedHistory(h)} // 🔹 CHANGE: open Level 2
              >
                <strong>{new Date(h.timestamp).toLocaleString()}</strong>
                <p>Total: <b>{h.total_emissions.toFixed(2)} kgCO2e</b></p>
                <p>Fuel: {h.fuel_type} | Output: {h.output_tonnes} t</p>
              </div>
            ))}

            {/* 🔹 CHANGE: AI insights for ENTIRE history */}
            <div style={{ textAlign: "right", marginTop: "20px" }}>
              <button
                className="link-btn-calc"
                onClick={fetchCompleteHistoryAI}
              >
                Get AI Insights →
              </button>
            </div>
          </div>
        </div>
      )}

      {/* 🔹 LEVEL 2: Detailed History View */}
      {selectedHistory && (
        <div className="ai-modal-overlay history-detail-modal">

          <div className="ai-modal">
            <button
              className="ai-close"
              onClick={() => setSelectedHistory(null)}
            >
              ✕
            </button>

            <h2>Emission Calculation Details</h2>

            <p><b>Date:</b> {new Date(selectedHistory.timestamp).toLocaleString()}</p>
            <p><b>Fuel Type:</b> {selectedHistory.fuel_type}</p>
            <p><b>Workers:</b> {selectedHistory.workers}</p>
            <p><b>Annual Output:</b> {selectedHistory.output_tonnes} tonnes</p>

            <hr />

            <p>Excavation: {selectedHistory.excavation_emissions.toFixed(2)} kgCO2e</p>
            <p>Transportation: {selectedHistory.transportation_emissions.toFixed(2)} kgCO2e</p>
            <p>Equipment: {selectedHistory.equipment_emissions.toFixed(2)} kgCO2e</p>

            <hr />

            <p>
              <b>Total Emissions:</b>{" "}
              {selectedHistory.total_emissions.toFixed(2)} kgCO2e
            </p>
          </div>
        </div>
      )}


      {/* Hidden PDF Report Layout */}
      <div id="pdf-report" style={{ padding: "30px", width: "800px", background: "white", color: "black" }}>

        <h1 style={{ textAlign: "center" }}>Mining Emission Assessment Report</h1>
        <div style={{ height: "20px" }}></div>
        <p style={{ textAlign: "center", marginBottom: "20px" }}>
          Generated on: {new Date().toLocaleString()}
        </p>

        <hr />

        {/* Input Summary */}
        <h2>Operational Input Summary</h2>
        <table style={{ width: "100%", borderCollapse: "collapse", marginBottom: "20px" }}>
          <tbody>
            <tr><td>Excavation Activity</td><td>{excavation || 0} tonnes</td></tr>
            <tr><td>Transportation Distance</td><td>{transportation || 0} km</td></tr>
            <tr><td>Fuel Consumption</td><td>{fuel || 0} liters</td></tr>
            <tr><td>Fuel Type</td><td>{fuelType}</td></tr>
            <tr><td>Equipment Hours</td><td>{equipment || 0} hours</td></tr>
            <tr><td>Number of Workers</td><td>{workers || 0}</td></tr>
            <tr><td>Annual Output</td><td>{output || 0} tonnes</td></tr>
            <tr><td>Emission Reduction</td><td>{reduction || 0} kgCO2e</td></tr>
          </tbody>
        </table>

        <hr />

        {/* Results Section */}
        <h2>Emission Calculation Results</h2>

        <table style={{ width: "100%", borderCollapse: "collapse" }}>
          <tbody>
            <tr><td>Total Operational Emissions</td><td>{results?.totalEmissions || 0} kgCO2e</td></tr>
            <tr><td>Excavation Emissions</td><td>{results?.excavationEmissions || 0} kgCO2e</td></tr>
            <tr><td>Transportation Emissions</td><td>{results?.transportationEmissions || 0} kgCO2e</td></tr>
            <tr><td>Equipment Emissions</td><td>{results?.equipmentEmissions || 0} kgCO2e</td></tr>
            <tr><td>Per Worker Emissions</td><td>{results?.perCapitaEmissions || 0} kgCO2e</td></tr>
            <tr><td>Per Output Emissions</td><td>{results?.perOutputEmissions || 0} kgCO2e</td></tr>
          </tbody>
        </table>

        <hr />

        {/* Carbon Credits Section */}
        <h2>Carbon Credit Summary</h2>

        <table style={{ width: "100%", borderCollapse: "collapse" }}>
          <tbody>
            <tr><td>Baseline Emissions</td><td>{results?.baseline || 0} kgCO2e</td></tr>
            <tr><td>Reduction Achieved</td><td>{results?.reduced || 0} kgCO2e</td></tr>
            <tr><td>Carbon Credits Earned</td><td>{results?.carbonCredits || 0}</td></tr>
            <tr><td>Estimated Worth</td><td>₹{results?.worth || 0}</td></tr>
          </tbody>
        </table>
        <hr />
        <hr />

        <div style={{ pageBreakBefore: "always" }}></div>
        {/* AI Insights Section */}
        {aiData ? (
          <>
            <h2>AI Sustainability Insights</h2>

            <p style={{ marginBottom: "15px" }}>
              <strong>Summary:</strong><br />
              {aiData.summary}
            </p>

            <h3>High Impact Actions</h3>
            <ul>
              {aiData.high_impact_actions.map((a, i) => (
                <li key={i}>{a}</li>
              ))}
            </ul>

            <h3>Medium Impact Actions</h3>
            <ul>
              {aiData.medium_impact_actions.map((a, i) => (
                <li key={i}>{a}</li>
              ))}
            </ul>

            <h3>Quick Wins</h3>
            <ul>
              {aiData.quick_wins.map((a, i) => (
                <li key={i}>{a}</li>
              ))}
            </ul>

            <p style={{ marginTop: "15px" }}>
              <strong>Estimated Reduction Potential:</strong>{" "}
              {aiData.estimated_reduction_percent}%
            </p>

            <p style={{ marginTop: "20px", fontSize: "12px", fontStyle: "italic" }}>
              These recommendations are AI-generated based on the provided operational data and are intended to support sustainability planning.
            </p>
          </>
        ) : (
          <>
            <h2>AI Sustainability Insights</h2>
            <p style={{ fontStyle: "italic", color: "#555" }}>
              AI recommendations were not generated for this report.
              Please run the AI analysis to include optimization insights.
            </p>
          </>
        )}

        <p style={{ marginTop: "30px", fontSize: "12px", textAlign: "center" }}>
          This report is system-generated for carbon auditing and compliance purposes.
        </p>

      </div>
    </div>
  );
};

export default Calculator;