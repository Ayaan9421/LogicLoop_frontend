import React, { useState, useEffect } from 'react';
import { AreaChart, Area, BarChart, Bar, ScatterChart, Scatter, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer, Cell } from 'recharts';
import { TrendingDown, Leaf, Activity } from 'lucide-react';
import './GapAnalysis.css';

const minesData = [
  { mine_name: 'All', sinkarea: 21420, sinkoffset: 299880, gap: 5748027912, total_emission: 5748327792 },
  { mine_name: 'A SHYAMSUNOERPURA', mine_type: 'UG', sinkarea: 600, sinkoffset: 8400, gap: 33658392, total_emission: 33666792 },
  { mine_name: 'ALP', mine_type: 'UG', sinkarea: 750, sinkoffset: 10500, gap: 78034365, total_emission: 78044865 },
  { mine_name: 'AKWMC', mine_type: 'Mixed', sinkarea: 700, sinkoffset: 9800, gap: 114424362, total_emission: 114434162 },
  { mine_name: 'BANGWARA', mine_type: 'UG', sinkarea: 850, sinkoffset: 11900, gap: 28154550, total_emission: 28166450 },
  { mine_name: 'BANSRA', mine_type: 'Mixed', sinkarea: 850, sinkoffset: 11900, gap: 11924914, total_emission: 11936814 },
  { mine_name: 'BHANORA W/B', mine_type: 'Mixed', sinkarea: 800, sinkoffset: 11200, gap: 7881152, total_emission: 7892352 },
  { mine_name: 'BHUBANESWARI', mine_type: 'OC', sinkarea: 700, sinkoffset: 9800, gap: 530343800, total_emission: 530353600 },
  { mine_name: 'CHORA BLOCK', mine_type: 'Mixed', sinkarea: 450, sinkoffset: 6300, gap: 12127554, total_emission: 12133854 },
  { mine_name: 'CHURCHA RO', mine_type: 'UG', sinkarea: 850, sinkoffset: 11900, gap: 60293143, total_emission: 60305043 },
  { mine_name: 'DIPKA', mine_type: 'OC', sinkarea: 950, sinkoffset: 13300, gap: 474644808, total_emission: 474658108 },
  { mine_name: 'DUDHICHUA', mine_type: 'OC', sinkarea: 900, sinkoffset: 12600, gap: 430433520, total_emission: 430446120 },
  { mine_name: 'GDK 11 INC', mine_type: 'UG', sinkarea: 300, sinkoffset: 4200, gap: 30490770, total_emission: 30494970 },
  { mine_name: 'GEVRA OC', mine_type: 'OC', sinkarea: 1900, sinkoffset: 26600, gap: 970888900, total_emission: 970915500 },
  { mine_name: 'HALDIBARI', mine_type: 'UG', sinkarea: 320, sinkoffset: 4480, gap: 30364100, total_emission: 30368580 },
  { mine_name: 'JAYANT', mine_type: 'OC', sinkarea: 700, sinkoffset: 9800, gap: 423136945, total_emission: 423146745 },
  { mine_name: 'Jhanjhara Project', mine_type: 'UG', sinkarea: 700, sinkoffset: 9800, gap: 123357150, total_emission: 123366950 },
  { mine_name: 'KHAIRAHA', mine_type: 'UG', sinkarea: 650, sinkoffset: 9100, gap: 35486814, total_emission: 35495914 },
  { mine_name: 'KUSMUNDA', mine_type: 'OC', sinkarea: 1100, sinkoffset: 15400, gap: 911374898, total_emission: 911390298 },
  { mine_name: 'KUYA/KOCP', mine_type: 'Mixed', sinkarea: 1300, sinkoffset: 18200, gap: 23045800, total_emission: 23064000 },
  { mine_name: 'LAKHANPUR', mine_type: 'OC', sinkarea: 650, sinkoffset: 9100, gap: 396804800, total_emission: 396813900 },
  { mine_name: 'Mohar & Moher', mine_type: 'OC', sinkarea: 850, sinkoffset: 11900, gap: 404282918, total_emission: 404294818 },
  { mine_name: 'NEW AKASH KINAREE', mine_type: 'Mixed', sinkarea: 900, sinkoffset: 12600, gap: 19555200, total_emission: 19567800 },
  { mine_name: 'NEW GODHUR', mine_type: 'Mixed', sinkarea: 750, sinkoffset: 10500, gap: 15566745, total_emission: 15577245 },
  { mine_name: 'NIGAHI', mine_type: 'OC', sinkarea: 700, sinkoffset: 9800, gap: 476050708, total_emission: 476060508 },
  { mine_name: 'PHULARITAND', mine_type: 'Mixed', sinkarea: 800, sinkoffset: 11200, gap: 58419232, total_emission: 58430432 },
  { mine_name: 'SHARDA HIGHWALL', mine_type: 'UG', sinkarea: 800, sinkoffset: 11200, gap: 36274364, total_emission: 36285564 },
  { mine_name: 'TETULMARI', mine_type: 'Mixed', sinkarea: 600, sinkoffset: 8400, gap: 11008008, total_emission: 11016408 },
];

// Simple CountUp component
const CountUp = ({ end, decimals = 0, duration = 2 }) => {
  const [count, setCount] = useState(0);

  useEffect(() => {
    let startTime;
    let animationFrame;

    const animate = (currentTime) => {
      if (!startTime) startTime = currentTime;
      const progress = Math.min((currentTime - startTime) / (duration * 1000), 1);
      
      setCount(progress * end);

      if (progress < 1) {
        animationFrame = requestAnimationFrame(animate);
      }
    };

    animationFrame = requestAnimationFrame(animate);
    return () => cancelAnimationFrame(animationFrame);
  }, [end, duration]);

  return decimals > 0 
    ? count.toFixed(decimals)
    : Math.floor(count).toLocaleString();
};

const GapAnalysis = ({ onBack }) => {
  const [selectedMine, setSelectedMine] = useState('All');

  const selectedMineData = minesData.find((mine) => mine.mine_name === selectedMine);
  const filteredMinesData = minesData.filter((mine) => mine.mine_name !== 'All');

  // Area chart data for emissions over time (simulated monthly data)
  const emissionsAreaData = [
    { month: 'Jan', Fuel: 476, Electricity: 3.7, Methane: 313 },
    { month: 'Feb', Fuel: 465, Electricity: 3.6, Methane: 308 },
    { month: 'Mar', Fuel: 485, Electricity: 3.8, Methane: 318 },
    { month: 'Apr', Fuel: 470, Electricity: 3.65, Methane: 310 },
    { month: 'May', Fuel: 480, Electricity: 3.75, Methane: 315 },
    { month: 'Jun', Fuel: 475, Electricity: 3.7, Methane: 312 },
    { month: 'Jul', Fuel: 490, Electricity: 3.85, Methane: 320 },
    { month: 'Aug', Fuel: 478, Electricity: 3.72, Methane: 314 },
    { month: 'Sep', Fuel: 472, Electricity: 3.68, Methane: 311 },
    { month: 'Oct', Fuel: 482, Electricity: 3.77, Methane: 316 },
    { month: 'Nov', Fuel: 468, Electricity: 3.63, Methane: 309 },
    { month: 'Dec', Fuel: 476, Electricity: 3.7, Methane: 313 },
  ];

  // Bar chart colors - simplified to green, yellow, purple palette
  const sinkBarColors = [
    '#10b981', '#34d399', '#6ee7b7', // Greens
    '#eab308', '#fbbf24', '#fcd34d', // Yellows
    '#8b5cf6', '#a78bfa', '#c4b5fd', // Purples
  ];
  const greenColors = ['#059669', '#10b981', '#34d399', '#6ee7b7', '#a7f3d0']; // Green gradient
  const purpleColors = ['#7c3aed', '#8b5cf6', '#a78bfa', '#c4b5fd', '#ddd6fe']; // Purple gradient
  
  // Prepare sink data for horizontal bar chart
  const sinkChartData = filteredMinesData.map(mine => ({
    name: mine.mine_name,
    value: mine.sinkarea,
    type: mine.mine_type,
    isSelected: mine.mine_name === selectedMine
  }));

  return (
    <div className="gap-analysis-container">
      <div className="page-header">
        <h1 className="page-title">Gap Analysis</h1>
        <p className="page-subtitle">Carbon footprint and neutrality pathways</p>
      </div>

      <div className="stats-grid">
        <div className="stat-card gradient-green">
          <div className="stat-icon">
            <TrendingDown size={26} color="white" />
          </div>
          <div>
            <p className="stat-label" style={{ color: 'white' }}>Total Carbon Emissions (2023)</p>
            <h2 className="stat-value" style={{ color: 'white' }}>
              <CountUp end={5761.84} decimals={2} duration={2.5} />
            </h2>
            <p className="stat-unit" style={{ color: 'white' }}>Million tons of CO₂e</p>
          </div>
        </div>

        <div className="stat-card gradient-orange">
          <div className="stat-icon">
            <Activity size={26} color="white" />
          </div>
          <div>
            <p className="stat-label" style={{ color: 'white' }}>Total Methane Emissions (2023)</p>
            <h2 className="stat-value" style={{ color: 'white' }}>
              <CountUp end={3760.86} decimals={2} duration={2.5} />
            </h2>
            <p className="stat-unit" style={{ color: 'white' }}>Million tons of CH₄</p>
          </div>
        </div>
      </div>

      <div className="section">
        <h3 className="section-title">BREAKDOWN BY ACTIVITY (Monthly Trend)</h3>
        <div className="chart-container">
          <ResponsiveContainer width="100%" height="100%">
            <AreaChart data={emissionsAreaData} margin={{ top: 10, right: 30, left: 0, bottom: 0 }}>
              <defs>
                <linearGradient id="colorFuel" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#059669" stopOpacity={0.8}/>
                  <stop offset="95%" stopColor="#059669" stopOpacity={0.2}/>
                </linearGradient>
                <linearGradient id="colorElectricity" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#10b981" stopOpacity={0.8}/>
                  <stop offset="95%" stopColor="#10b981" stopOpacity={0.2}/>
                </linearGradient>
                <linearGradient id="colorMethane" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#34d399" stopOpacity={0.8}/>
                  <stop offset="95%" stopColor="#34d399" stopOpacity={0.2}/>
                </linearGradient>
              </defs>
              <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
              <XAxis 
                dataKey="month" 
                stroke="#111827" 
                style={{ fontSize: '13px', fontWeight: '600' }}
              />
              <YAxis 
                stroke="#111827" 
                style={{ fontSize: '13px', fontWeight: '600' }}
                label={{ value: 'Million Tons', angle: -90, position: 'insideLeft', style: { fontSize: '13px', fontWeight: '600', fill: '#111827' } }}
              />
              <Tooltip 
                contentStyle={{ 
                  backgroundColor: 'white', 
                  border: '2px solid #10b981', 
                  borderRadius: '8px',
                  fontSize: '13px',
                  fontWeight: '600'
                }}
              />
              <Legend 
                wrapperStyle={{ fontSize: '14px', fontWeight: '600' }}
              />
              <Area 
                type="monotone" 
                dataKey="Fuel" 
                stackId="1" 
                stroke="#047857" 
                strokeWidth={2}
                fill="url(#colorFuel)" 
                name="Fuel Emission"
              />
              <Area 
                type="monotone" 
                dataKey="Electricity" 
                stackId="1" 
                stroke="#059669" 
                strokeWidth={2}
                fill="url(#colorElectricity)" 
                name="Electricity Emission"
              />
              <Area 
                type="monotone" 
                dataKey="Methane" 
                stackId="1" 
                stroke="#10b981" 
                strokeWidth={2}
                fill="url(#colorMethane)" 
                name="Methane Emission"
              />
            </AreaChart>
          </ResponsiveContainer>
        </div>
      </div>

      <div className="section">
        <div className="section-header">
          <h3 className="section-title">Sink Analysis and Pathways to Neutrality</h3>
          <select value={selectedMine} onChange={(e) => setSelectedMine(e.target.value)} className="mine-select">
            {minesData.map((mine) => (
              <option key={mine.mine_name} value={mine.mine_name}>
                {mine.mine_name}
              </option>
            ))}
          </select>
        </div>

        <div className="metrics-grid">
          <div className="metric-card green">
            <div className="metric-header">
              <Leaf size={22} color="#10b981" />
              <h4 className="metric-title">Sink Area</h4>
            </div>
            <p className="metric-value green">
              <CountUp end={selectedMineData.sinkarea} duration={2} />
            </p>
            <p className="metric-unit">hectares</p>
          </div>

          <div className="metric-card green">
            <div className="metric-header">
              <TrendingDown size={22} color="#10b981" />
              <h4 className="metric-title">Current Offsets</h4>
            </div>
            <p className="metric-value green">
              <CountUp end={selectedMineData.sinkoffset} duration={2} />
            </p>
            <p className="metric-unit">tons CO₂e</p>
          </div>

          <div className="metric-card purple">
            <div className="metric-header">
              <Activity size={22} color="#7c3aed" />
              <h4 className="metric-title">Net Emissions Gap</h4>
            </div>
            <p className="metric-value purple">
              <CountUp end={selectedMineData.gap} duration={2} />
            </p>
            <p className="metric-unit">tons CO₂e</p>
          </div>
        </div>

        <div className="charts-grid">
          <div className="chart-section">
            <h4 className="chart-title">Sink Distribution by Mine</h4>
            <div className="chart-container-tall">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart 
                  data={sinkChartData} 
                  layout="vertical"
                  margin={{ top: 5, right: 30, left: 140, bottom: 20 }}
                  barCategoryGap="20%"
                >
                  <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
                  <XAxis 
                    type="number"
                    stroke="#111827" 
                    style={{ fontSize: '12px', fontWeight: '600' }}
                  />
                  <YAxis 
                    type="category"
                    dataKey="name" 
                    stroke="#111827" 
                    style={{ fontSize: '11px', fontWeight: '600' }}
                    width={130}
                  />
                  <Tooltip 
                    contentStyle={{ 
                      backgroundColor: 'white', 
                      border: '2px solid #10b981', 
                      borderRadius: '8px',
                      fontSize: '13px',
                      fontWeight: '600'
                    }}
                    formatter={(value, name, props) => [
                      `${value} ha`,
                      `${props.payload.type} Mine`
                    ]}
                  />
                  <Bar dataKey="value" radius={[0, 8, 8, 0]} barSize={10}>
                    {sinkChartData.map((entry, index) => (
                      <Cell 
                        key={`cell-${index}`}
                        fill={entry.isSelected ? '#ffffff' : sinkBarColors[index % sinkBarColors.length]}
                        stroke={entry.isSelected ? '#10b981' : 'none'}
                        strokeWidth={entry.isSelected ? 3 : 0}
                      />
                    ))}
                  </Bar>
                </BarChart>
              </ResponsiveContainer>
            </div>
          </div>

          <div className="chart-section">
            <h4 className="chart-title">Sink Area vs Total Emissions</h4>
            <div className="chart-container-tall">
              <ResponsiveContainer width="100%" height="100%">
                <ScatterChart margin={{ top: 20, right: 30, bottom: 60, left: 80 }}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
                  <XAxis 
                    type="number" 
                    dataKey="x" 
                    name="Sink Area"
                    stroke="#111827" 
                    style={{ fontSize: '12px', fontWeight: '600' }}
                    label={{ value: 'Sink Area (hectares)', position: 'insideBottom', offset: -10, style: { fontSize: '13px', fontWeight: '600', fill: '#111827' } }}
                  />
                  <YAxis 
                    type="number" 
                    dataKey="y" 
                    name="Total Emissions"
                    stroke="#111827" 
                    style={{ fontSize: '12px', fontWeight: '600' }}
                    label={{ value: 'Total Emissions (tons)', angle: -90, position: 'insideLeft', style: { fontSize: '13px', fontWeight: '600', fill: '#111827' } }}
                    tickFormatter={(value) => `${(value / 1000000).toFixed(0)}M`}
                  />
                  <Tooltip 
                    cursor={{ strokeDasharray: '3 3' }}
                    contentStyle={{ 
                      backgroundColor: 'white', 
                      border: '2px solid #7c3aed', 
                      borderRadius: '8px',
                      fontSize: '13px',
                      fontWeight: '600'
                    }}
                    formatter={(value, name) => [
                      name === 'Sink Area' ? `${value} ha` : `${value.toLocaleString()} tons`,
                      name
                    ]}
                  />
                  <Scatter 
                    data={filteredMinesData.map(mine => ({
                      x: mine.sinkarea,
                      y: mine.total_emission,
                      name: mine.mine_name
                    }))}
                    fill="#7c3aed"
                  >
                    {filteredMinesData.map((mine, index) => (
                      <Cell 
                        key={`cell-${index}`}
                        fill={mine.mine_name === selectedMine ? '#ffffff' : purpleColors[index % purpleColors.length]}
                        stroke={mine.mine_name === selectedMine ? '#7c3aed' : purpleColors[index % purpleColors.length]}
                        strokeWidth={mine.mine_name === selectedMine ? 3 : 0}
                        r={mine.mine_name === selectedMine ? 10 : 6}
                      />
                    ))}
                  </Scatter>
                </ScatterChart>
              </ResponsiveContainer>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default GapAnalysis;