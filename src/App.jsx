import React, { useState } from 'react';
import { Search, Bell, MessageSquare } from 'lucide-react';
import Sidebar from './components/Sidebar';
import Dashboard from './components/Dashboard';
import Reports from "./components/Report";

import './App.css';

const App = () => {
  const [isCollapsed, setIsCollapsed] = useState(true); // Start collapsed
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
          <div className="search-bar">
            <Search size={18} color="#94a3b8" />
            <input type="text" placeholder="Search reports..." />
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
        {activePage === 'reports' && <Reports />}
        {activePage !== 'dashboard' && activePage !== 'reports' && (
          <div className="dashboard-content">
            <div className="page-header">
              <h1>{activePage.charAt(0).toUpperCase() + activePage.slice(1)}</h1>
              <p>This page is under construction.</p>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default App;