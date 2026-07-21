import { useState, useEffect } from 'react';
import { User, Palette, Shield, Save } from 'lucide-react';
import './SettingsPage.css';

export default function SettingsPage() {
  const [activeTab, setActiveTab] = useState('profile');
  const [isDarkMode, setIsDarkMode] = useState(false);

  // Load initial theme state
  useEffect(() => {
    const isDark = document.body.classList.contains('dark-theme');
    setIsDarkMode(isDark);
  }, []);

  const toggleDarkMode = () => {
    if (isDarkMode) {
      document.body.classList.remove('dark-theme');
      setIsDarkMode(false);
    } else {
      document.body.classList.add('dark-theme');
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
            className={`settings-tab ${activeTab === 'profile' ? 'active' : ''}`}
            onClick={() => setActiveTab('profile')}
          >
            <User size={18} /> Profile
          </button>
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
          {activeTab === 'profile' && (
            <div className="settings-section">
              <h2>Profile Customization</h2>
              <p className="section-description">Update your public profile information.</p>
              
              <div className="form-group">
                <label>Bio</label>
                <textarea className="form-input textarea" placeholder="Tell the community about yourself..." rows={4}></textarea>
              </div>
              
              <div className="form-group">
                <label>Website / Portfolio URL</label>
                <input type="text" className="form-input" placeholder="https://" />
              </div>

              <div className="form-group">
                <label>Twitter / X Username</label>
                <input type="text" className="form-input" placeholder="@username" />
              </div>

              <button className="btn-save">
                <Save size={16} /> Save Changes
              </button>
            </div>
          )}

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
