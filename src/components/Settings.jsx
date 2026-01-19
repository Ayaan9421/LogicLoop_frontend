import React, { useState } from 'react';
import { Settings as SettingsIcon, User, Lock, Bell, Globe, Database, Shield, Palette, Save } from 'lucide-react';
import './Settings.css';

const Settings = () => {
  const [activeTab, setActiveTab] = useState('profile');
  const [notifications, setNotifications] = useState({
    email: true,
    critical: true,
    reports: false,
    weekly: true
  });
  const [autoSave, setAutoSave] = useState(true);
  const [darkMode, setDarkMode] = useState(false);

  const tabs = [
    { id: 'profile', label: 'Profile', icon: User },
    { id: 'security', label: 'Security', icon: Lock },
    { id: 'notifications', label: 'Notifications', icon: Bell },
    { id: 'preferences', label: 'Preferences', icon: Palette },
    { id: 'data', label: 'Data & Storage', icon: Database }
  ];

  return (
    <div className="settings-page">
      <div className="page-header-section">
        <div>
          <div className="breadcrumb-small">
            <span>Home</span>
            <span>/</span>
            <span>Settings</span>
          </div>
          <h1>Settings</h1>
          <p>Manage your account, preferences, and system configuration</p>
        </div>
      </div>

      <div className="settings-container">
        <div className="settings-sidebar">
          {tabs.map((tab) => {
            const Icon = tab.icon;
            return (
              <button
                key={tab.id}
                className={`settings-tab ${activeTab === tab.id ? 'active' : ''}`}
                onClick={() => setActiveTab(tab.id)}
              >
                <Icon size={20} />
                <span>{tab.label}</span>
              </button>
            );
          })}
        </div>

        <div className="settings-content">
          {activeTab === 'profile' && (
            <div className="settings-section">
              <div className="section-header">
                <h3>Profile Information</h3>
                <p>Update your personal details and profile picture</p>
              </div>

              <div className="profile-card">
                <div className="profile-avatar-section">
                  <div className="profile-avatar-large">RK</div>
                  <button className="btn-change-photo">Change Photo</button>
                </div>

                <div className="form-grid">
                  <div className="form-group">
                    <label>Full Name</label>
                    <input type="text" defaultValue="Rajesh Kumar" />
                  </div>
                  <div className="form-group">
                    <label>Email Address</label>
                    <input type="email" defaultValue="rajesh.kumar@gevra.in" />
                  </div>
                  <div className="form-group">
                    <label>Job Title</label>
                    <input type="text" defaultValue="Sustainability Manager" />
                  </div>
                  <div className="form-group">
                    <label>Department</label>
                    <input type="text" defaultValue="Environmental Compliance" />
                  </div>
                  <div className="form-group full-width">
                    <label>Site Location</label>
                    <input type="text" defaultValue="Gevra Open Cast Project, Jharia Coalfield" />
                  </div>
                </div>

                <button className="btn-save">
                  <Save size={18} />
                  Save Changes
                </button>
              </div>
            </div>
          )}

          {activeTab === 'security' && (
            <div className="settings-section">
              <div className="section-header">
                <h3>Security Settings</h3>
                <p>Manage your password and authentication preferences</p>
              </div>

              <div className="security-card">
                <div className="security-item">
                  <div className="security-item-header">
                    <Shield size={24} color="#10b981" />
                    <div>
                      <h4>Password</h4>
                      <p>Last changed 45 days ago</p>
                    </div>
                  </div>
                  <button className="btn-secondary">Change Password</button>
                </div>

                <div className="security-item">
                  <div className="security-item-header">
                    <Lock size={24} color="#10b981" />
                    <div>
                      <h4>Two-Factor Authentication</h4>
                      <p>Add an extra layer of security</p>
                    </div>
                  </div>
                  <button className="btn-secondary">Enable 2FA</button>
                </div>

                <div className="security-item">
                  <div className="security-item-header">
                    <Globe size={24} color="#10b981" />
                    <div>
                      <h4>Active Sessions</h4>
                      <p>2 active sessions across devices</p>
                    </div>
                  </div>
                  <button className="btn-secondary">Manage Sessions</button>
                </div>
              </div>

              <div className="activity-log">
                <h4>Recent Activity</h4>
                <div className="activity-item">
                  <div className="activity-time">Today, 09:34 AM</div>
                  <div className="activity-desc">Signed in from Mumbai, IN</div>
                </div>
                <div className="activity-item">
                  <div className="activity-time">Yesterday, 03:21 PM</div>
                  <div className="activity-desc">Generated Q3 Compliance Report</div>
                </div>
                <div className="activity-item">
                  <div className="activity-time">2 days ago</div>
                  <div className="activity-desc">Updated mitigation scenario parameters</div>
                </div>
              </div>
            </div>
          )}

          {activeTab === 'notifications' && (
            <div className="settings-section">
              <div className="section-header">
                <h3>Notification Preferences</h3>
                <p>Choose what updates you want to receive</p>
              </div>

              <div className="notifications-card">
                <div className="notification-item">
                  <div className="notification-info">
                    <h4>Email Notifications</h4>
                    <p>Receive important updates via email</p>
                  </div>
                  <label className="toggle-switch">
                    <input 
                      type="checkbox" 
                      checked={notifications.email}
                      onChange={(e) => setNotifications({...notifications, email: e.target.checked})}
                    />
                    <span className="toggle-slider"></span>
                  </label>
                </div>

                <div className="notification-item">
                  <div className="notification-info">
                    <h4>Critical Safety Alerts</h4>
                    <p>Immediate notifications for high-risk incidents</p>
                  </div>
                  <label className="toggle-switch">
                    <input 
                      type="checkbox" 
                      checked={notifications.critical}
                      onChange={(e) => setNotifications({...notifications, critical: e.target.checked})}
                    />
                    <span className="toggle-slider"></span>
                  </label>
                </div>

                <div className="notification-item">
                  <div className="notification-info">
                    <h4>Report Generation Complete</h4>
                    <p>Get notified when reports finish processing</p>
                  </div>
                  <label className="toggle-switch">
                    <input 
                      type="checkbox" 
                      checked={notifications.reports}
                      onChange={(e) => setNotifications({...notifications, reports: e.target.checked})}
                    />
                    <span className="toggle-slider"></span>
                  </label>
                </div>

                <div className="notification-item">
                  <div className="notification-info">
                    <h4>Weekly Summary</h4>
                    <p>Receive weekly performance summaries</p>
                  </div>
                  <label className="toggle-switch">
                    <input 
                      type="checkbox" 
                      checked={notifications.weekly}
                      onChange={(e) => setNotifications({...notifications, weekly: e.target.checked})}
                    />
                    <span className="toggle-slider"></span>
                  </label>
                </div>
              </div>
            </div>
          )}

          {activeTab === 'preferences' && (
            <div className="settings-section">
              <div className="section-header">
                <h3>Application Preferences</h3>
                <p>Customize your application experience</p>
              </div>

              <div className="preferences-card">
                <div className="preference-item">
                  <div className="preference-info">
                    <h4>Auto-Save Data</h4>
                    <p>Automatically save changes as you work</p>
                  </div>
                  <label className="toggle-switch">
                    <input 
                      type="checkbox" 
                      checked={autoSave}
                      onChange={(e) => setAutoSave(e.target.checked)}
                    />
                    <span className="toggle-slider"></span>
                  </label>
                </div>

                <div className="preference-item">
                  <div className="preference-info">
                    <h4>Dark Mode</h4>
                    <p>Use dark theme for reduced eye strain</p>
                  </div>
                  <label className="toggle-switch">
                    <input 
                      type="checkbox" 
                      checked={darkMode}
                      onChange={(e) => setDarkMode(e.target.checked)}
                    />
                    <span className="toggle-slider"></span>
                  </label>
                </div>

                <div className="preference-item-select">
                  <label>Default Date Range</label>
                  <select className="select-input">
                    <option>Last 30 Days</option>
                    <option>Last Quarter</option>
                    <option>Last 6 Months</option>
                    <option>Last Year</option>
                  </select>
                </div>

                <div className="preference-item-select">
                  <label>Measurement Units</label>
                  <select className="select-input">
                    <option>Metric (tonnes, kg)</option>
                    <option>Imperial (tons, lbs)</option>
                  </select>
                </div>

                <div className="preference-item-select">
                  <label>Time Zone</label>
                  <select className="select-input">
                    <option>Asia/Kolkata (IST)</option>
                    <option>UTC</option>
                    <option>America/New_York (EST)</option>
                  </select>
                </div>
              </div>
            </div>
          )}

          {activeTab === 'data' && (
            <div className="settings-section">
              <div className="section-header">
                <h3>Data & Storage Management</h3>
                <p>Manage your data exports and storage usage</p>
              </div>

              <div className="storage-overview">
                <div className="storage-stat">
                  <div className="stat-label">Storage Used</div>
                  <div className="stat-value-large">2.4 GB</div>
                  <div className="stat-detail">of 10 GB allocated</div>
                </div>
                <div className="storage-bar-large">
                  <div className="storage-fill" style={{ width: '24%' }}></div>
                </div>
              </div>

              <div className="data-actions">
                <div className="data-action-item">
                  <div className="data-action-info">
                    <h4>Export All Data</h4>
                    <p>Download a copy of all your reports and calculations</p>
                  </div>
                  <button className="btn-secondary">Export Data</button>
                </div>

                <div className="data-action-item">
                  <div className="data-action-info">
                    <h4>Clear Cache</h4>
                    <p>Remove temporary files to free up space</p>
                  </div>
                  <button className="btn-secondary">Clear Cache</button>
                </div>

                <div className="data-action-item danger">
                  <div className="data-action-info">
                    <h4>Delete Account</h4>
                    <p>Permanently delete your account and all associated data</p>
                  </div>
                  <button className="btn-danger">Delete Account</button>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default Settings;