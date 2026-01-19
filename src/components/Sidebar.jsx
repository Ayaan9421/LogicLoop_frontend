import React from 'react';
import { 
  LayoutDashboard, 
  Calculator, 
  Wind, 
  Layers, 
  FileText, 
  Settings,
  AlertTriangle,
  Trees,
  LogOut,
  ChevronLeft,
  ChevronRight
} from 'lucide-react';
import './Sidebar.css';

const Sidebar = ({ isCollapsed, activePage, setActivePage, toggleSidebar }) => {
  const mainMenuItems = [
    { icon: LayoutDashboard, label: 'Dashboard', id: 'dashboard' },
    { icon: Calculator, label: 'Calculator', id: 'calculator' },
    { icon: Wind, label: 'Methane Planning', id: 'methane' },
    { icon: Layers, label: 'Scenarios', id: 'scenarios' },
    { icon: FileText, label: 'Reports', id: 'reports' }
  ];

  const systemMenuItems = [
    { icon: AlertTriangle, label: 'Risk Mgmt', id: 'risk' },
    { icon: Settings, label: 'Settings', id: 'settings' }
  ];

  return (
    <div className={`sidebar ${isCollapsed ? 'collapsed' : ''}`}>
      <div className="sidebar-header">
        <div
  className="logo-container"
  onClick={() => isCollapsed && toggleSidebar()}
>

          <div className="logo-icon">
            <Trees size={24} color="white" />
          </div>
          {!isCollapsed && (
            <div className="logo-text">
              <div className="logo-title">CarbonTrack</div>
              <div className="logo-subtitle">Safety Admin</div>
            </div>
          )}
        </div>
       {!isCollapsed && (
  <button
    className="close-btn"
    onClick={toggleSidebar}
    title="Collapse"
  >
    <ChevronLeft size={20} />
  </button>
)}

      </div>

      <div className="menu-section">
        {!isCollapsed && <div className="section-title">Main Menu</div>}
        {mainMenuItems.map((item) => (
          <div
            key={item.id}
            className={`menu-item ${activePage === item.id ? 'active' : ''}`}
            onClick={() => setActivePage(item.id)}
            title={isCollapsed ? item.label : ''}
          >
            <item.icon size={20} />
            {!isCollapsed && <span>{item.label}</span>}
          </div>
        ))}

        {!isCollapsed && <div className="section-title" style={{ marginTop: '24px' }}>System</div>}
        {systemMenuItems.map((item) => (
          <div
            key={item.id}
            className={`menu-item ${activePage === item.id ? 'active' : ''}`}
            onClick={() => setActivePage(item.id)}
            title={isCollapsed ? item.label : ''}
          >
            <item.icon size={20} />
            {!isCollapsed && <span>{item.label}</span>}
          </div>
        ))}
      </div>

      <div className="sidebar-footer">
        <div className="menu-item" title={isCollapsed ? 'Sign Out' : ''}>
          <LogOut size={20} />
          {!isCollapsed && <span>Sign Out</span>}
        </div>
      </div>
    </div>
  );
};

export default Sidebar;