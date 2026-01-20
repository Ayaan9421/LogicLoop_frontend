import React, { useState, useEffect } from 'react';
import { Bar, Scatter } from 'react-chartjs-2';
import { TrendingDown, Leaf, Activity } from 'lucide-react';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  PointElement,
  Title,
  Tooltip,
  Legend,
} from 'chart.js';
import ChartDataLabels from 'chartjs-plugin-datalabels';
import './GapAnalysis.css';

ChartJS.register(
  CategoryScale,
  LinearScale,
  BarElement,
  PointElement,
  Title,
  Tooltip,
  Legend,
  ChartDataLabels
);

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

  const emissionsData = {
    labels: ['Fuel Emission', 'Electricity Emission', 'Methane Emission'],
    datasets: [
      {
        label: 'Emissions (Million Tons)',
        data: [5717.48, 44.37, 3760.86],
        backgroundColor: ['#059669', '#10b981', '#34d399'],
        borderColor: ['#047857', '#059669', '#10b981'],
        borderWidth: 2,
        borderRadius: 8,
      },
    ],
  };

  const emissionsOptions = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: { display: false },
      title: { display: false },
      datalabels: {
        anchor: 'end',
        align: 'top',
        color: '#000000',
        font: { weight: 'bold', size: 13 },
        formatter: (value) => `${value} MT`,
      },
    },
    scales: {
      y: {
        beginAtZero: true,
        grid: { color: '#e5e7eb' },
        ticks: { color: '#111827', font: { size: 12, weight: '600' } },
      },
      x: {
        grid: { display: false },
        ticks: { color: '#111827', font: { size: 12, weight: '600' } },
      },
    },
  };

  const sinkData = {
    labels: filteredMinesData.map((mine) => mine.mine_name),
    datasets: [
      {
        label: 'Mixed',
        data: filteredMinesData.map((mine) => (mine.mine_type === 'Mixed' ? mine.sinkarea : 0)),
        backgroundColor: filteredMinesData.map((mine) =>
          mine.mine_name === selectedMine ? '#ffffff' : '#10b981'
        ),
        borderColor: filteredMinesData.map((mine) =>
          mine.mine_name === selectedMine ? '#059669' : '#10b981'
        ),
        borderWidth: filteredMinesData.map((mine) =>
          mine.mine_name === selectedMine ? 3 : 0
        ),
      },
      {
        label: 'OC',
        data: filteredMinesData.map((mine) => (mine.mine_type === 'OC' ? mine.sinkarea : 0)),
        backgroundColor: filteredMinesData.map((mine) =>
          mine.mine_name === selectedMine ? '#ffffff' : '#059669'
        ),
        borderColor: filteredMinesData.map((mine) =>
          mine.mine_name === selectedMine ? '#059669' : '#059669'
        ),
        borderWidth: filteredMinesData.map((mine) =>
          mine.mine_name === selectedMine ? 3 : 0
        ),
      },
      {
        label: 'UG',
        data: filteredMinesData.map((mine) => (mine.mine_type === 'UG' ? mine.sinkarea : 0)),
        backgroundColor: filteredMinesData.map((mine) =>
          mine.mine_name === selectedMine ? '#ffffff' : '#16a34a'
        ),
        borderColor: filteredMinesData.map((mine) =>
          mine.mine_name === selectedMine ? '#059669' : '#16a34a'
        ),
        borderWidth: filteredMinesData.map((mine) =>
          mine.mine_name === selectedMine ? 3 : 0
        ),
      },
    ],
  };

  const sinkOptions = {
    indexAxis: 'y',
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: { 
        position: 'top', 
        labels: { 
          font: { size: 12, weight: '600' }, 
          color: '#111827' 
        } 
      },
      title: { display: false },
      datalabels: { display: false },
    },
    scales: {
      x: {
        grid: { color: '#e5e7eb' },
        ticks: { color: '#111827', font: { size: 11, weight: '600' } },
      },
      y: {
        grid: { display: false },
        ticks: { color: '#111827', font: { size: 11, weight: '600' } },
      },
    },
  };

  const scatterData = {
    datasets: [
      {
        label: 'Mine Emissions',
        data: filteredMinesData.map((mine) => ({
          x: mine.sinkarea,
          y: mine.total_emission,
          label: mine.mine_name,
        })),
        backgroundColor: filteredMinesData.map((mine) =>
          mine.mine_name === selectedMine ? '#ffffff' : '#10b981'
        ),
        borderColor: filteredMinesData.map((mine) =>
          mine.mine_name === selectedMine ? '#059669' : '#10b981'
        ),
        borderWidth: filteredMinesData.map((mine) =>
          mine.mine_name === selectedMine ? 3 : 0
        ),
        pointRadius: filteredMinesData.map((mine) =>
          mine.mine_name === selectedMine ? 10 : 6
        ),
      },
    ],
  };

  const scatterOptions = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: { display: false },
      title: { display: false },
      datalabels: { display: false },
      tooltip: {
        callbacks: {
          label: (context) => {
            const label = context.raw.label || '';
            return `${label}: (${context.raw.x}ha, ${context.raw.y.toLocaleString()} tons)`;
          },
        },
      },
    },
    scales: {
      x: {
        grid: { color: '#e5e7eb' },
        ticks: { color: '#111827', font: { size: 12, weight: '600' } },
      },
      y: {
        grid: { color: '#e5e7eb' },
        ticks: { color: '#111827', font: { size: 12, weight: '600' } },
      },
    },
  };

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
            <p className="stat-label">Total Carbon Emissions (2023)</p>
            <h2 className="stat-value">
              <CountUp end={5761.84} decimals={2} duration={2.5} />
            </h2>
            <p className="stat-unit">Million tons of CO₂e</p>
          </div>
        </div>

        <div className="stat-card gradient-green-light">
          <div className="stat-icon">
            <Activity size={26} color="white" />
          </div>
          <div>
            <p className="stat-label">Total Methane Emissions (2023)</p>
            <h2 className="stat-value">
              <CountUp end={3760.86} decimals={2} duration={2.5} />
            </h2>
            <p className="stat-unit">Million tons of CH₄</p>
          </div>
        </div>
      </div>

      <div className="section">
        <h3 className="section-title">BREAKDOWN BY ACTIVITY</h3>
        <div className="chart-container">
          <Bar data={emissionsData} options={emissionsOptions} />
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
              <Leaf size={20} color="#059669" />
              <h4 className="metric-title">Sink Area</h4>
            </div>
            <p className="metric-value green">
              <CountUp end={selectedMineData.sinkarea} duration={2} />
            </p>
            <p className="metric-unit">hectares</p>
          </div>

          <div className="metric-card green-light">
            <div className="metric-header">
              <TrendingDown size={20} color="#10b981" />
              <h4 className="metric-title">Current Offsets</h4>
            </div>
            <p className="metric-value green-light">
              <CountUp end={selectedMineData.sinkoffset} duration={2} />
            </p>
            <p className="metric-unit">tons CO₂e</p>
          </div>

          <div className="metric-card green-dark">
            <div className="metric-header">
              <Activity size={20} color="#047857" />
              <h4 className="metric-title">Net Emissions Gap</h4>
            </div>
            <p className="metric-value green-dark">
              <CountUp end={selectedMineData.gap} duration={2} />
            </p>
            <p className="metric-unit">tons CO₂e</p>
          </div>
        </div>

        <div className="charts-grid">
          <div className="chart-section">
            <h4 className="chart-title">Sink Distribution by Mine Type</h4>
            <div className="chart-container-tall">
              <Bar data={sinkData} options={sinkOptions} />
            </div>
          </div>

          <div className="chart-section">
            <h4 className="chart-title">Sink Area vs Total Emissions</h4>
            <div className="chart-container-tall">
              <Scatter data={scatterData} options={scatterOptions} />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default GapAnalysis;