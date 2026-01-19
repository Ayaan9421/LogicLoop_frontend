/* ============================================
   FILE 3: App.jsx (UPDATED)
   ============================================ */

import React, { useState } from 'react';
import { Bell, MessageSquare } from 'lucide-react';
import Sidebar from './components/Sidebar';
import Dashboard from './components/Dashboard';
import Reports from './components/Report';
import Calculator from './components/Calculator';
import MethanePlanning from './components/MethanPlanning'; // CORRECTED IMPORT
import Scenarios from './components/Scenarios';
import RiskManagement from './components/RiskManagement';
import Settings from './components/Settings';
import GapAnalysis from './components/GapAnalysis';
import MineLocation from './components/MineLocation';
import AfforestationEstimator from './components/AfforestationEstimator';
import CarbonSinkRegistry from './components/CarbonRegistry';

import './App.css';

const App = () => {
  const [isCollapsed, setIsCollapsed] = useState(true);
  const [activePage, setActivePage] = useState('dashboard');

  const toggleSidebar = () => {
    setIsCollapsed(!isCollapsed);
  };

  return (
    <div className="app-container">
      <Sidebar 
        isCollapsed={isCollapsed} 
        activePage={activePage}
        setActivePage={setActivePage}
        toggleSidebar={toggleSidebar}
      />
      
      <div className="main-content">
        <div className="topbar">
          <div className="page-title">
            {activePage.replace('-', ' ').toUpperCase()}
          </div>

          <div className="topbar-right">
            <button className="icon-btn">
              <Bell size={20} />
            </button>
            <button className="icon-btn">
              <MessageSquare size={20} />
            </button>
            <div className="user-avatar-top">RK</div>
          </div>
        </div>

        {activePage === 'dashboard' && <Dashboard />}
        {activePage === 'mines' && <MineLocation />}
        {activePage === 'reports' && <Reports />}
        {activePage === 'calculator' && <Calculator />}
        {activePage === 'methane' && <MethanePlanning />}
        {activePage === 'scenarios' && <Scenarios />}
        {activePage === 'risk' && <RiskManagement />}
        {activePage === 'settings' && <Settings />}
        {activePage === 'gap-analysis' && <GapAnalysis onBack={() => setActivePage('dashboard')} />}
        {activePage === 'afforestation' && <AfforestationEstimator />}
        {activePage === 'carbon-sink' && <CarbonSinkRegistry />}
      </div>
    </div>
  );
};

export default App;