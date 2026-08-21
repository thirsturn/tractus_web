import { useState } from 'react';
import { Palette, Shield } from 'lucide-react';
import './SettingsPage.css';

export default function SettingsPage() {
  const [activeTab, setActiveTab] = useState('appearance');
  const [isDarkMode, setIsDarkMode] = useState(() => document.body.classList.contains('dark-theme'));

  const toggleDarkMode = () => {
    if (isDarkMode) {
      document.body.classList.remove('dark-theme');
      localStorage.setItem('darkMode', 'false');
      setIsDarkMode(false);
    } else {
      document.body.classList.add('dark-theme');
      localStorage.setItem('darkMode', 'true');
      setIsDarkMode(true);
    }
  };

  return (
    <div className="settings-container">
      <div className="settings-header">
        <h1>Settings</h1>
        <p>Manage your account settings and preferences.</p>
      </div>

      <div className="settings-layout">
        <aside className="settings-sidebar">

          <button 
            className={`settings-tab ${activeTab === 'appearance' ? 'active' : ''}`}
            onClick={() => setActiveTab('appearance')}
          >
            <Palette size={18} /> Appearance
          </button>
          <button 
            className={`settings-tab ${activeTab === 'privacy' ? 'active' : ''}`}
            onClick={() => setActiveTab('privacy')}
          >
            <Shield size={18} /> Privacy
          </button>
        </aside>

        <main className="settings-content">


          {activeTab === 'appearance' && (
            <div className="settings-section">
              <h2>Appearance</h2>
              <p className="section-description">Customize how Tractus looks on your device.</p>
              
              <div className="setting-card">
                <div className="setting-info">
                  <h3>Dark Mode</h3>
                  <p>Toggle the dark theme across the entire application.</p>
                </div>
                <div className="setting-action">
                  <label className="toggle-switch">
                    <input 
                      type="checkbox" 
                      checked={isDarkMode}
                      onChange={toggleDarkMode}
                    />
                    <span className="slider round"></span>
                  </label>
                </div>
              </div>
            </div>
          )}

          {activeTab === 'privacy' && (
            <div className="settings-section">
              <h2>Privacy Settings</h2>
              <p className="section-description">Manage your data and visibility.</p>
              
              <div className="setting-card">
                <div className="setting-info">
                  <h3>Online Status</h3>
                  <p>Let others see when you are active on Tractus.</p>
                </div>
                <div className="setting-action">
                  <label className="toggle-switch">
                    <input type="checkbox" defaultChecked />
                    <span className="slider round"></span>
                  </label>
                </div>
              </div>
            </div>
          )}
        </main>
      </div>
    </div>
  );
}
