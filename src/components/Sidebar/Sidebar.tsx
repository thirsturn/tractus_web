import { NavLink } from 'react-router-dom';
import { Home, MessageSquare, Compass, Settings, Sun, Moon } from 'lucide-react';
import { useTheme } from '../../context/ThemeContext';
import './Sidebar.css';

export default function Sidebar() {
  const { isDark, toggleTheme } = useTheme();

  return (
    <aside className="sidebar">
      <div className="sidebar-nav">
        <h3 className="nav-heading">Menu</h3>
        <NavLink to="/" className={({ isActive }) => isActive ? "nav-item active" : "nav-item"}>
          <Home size={20} />
          <span>Home Feed</span>
        </NavLink>
        <NavLink to="/explore" className={({ isActive }) => isActive ? "nav-item active" : "nav-item"}>
          <Compass size={20} />
          <span>Explore</span>
        </NavLink>
        <NavLink to="/messages" className={({ isActive }) => isActive ? "nav-item active" : "nav-item"}>
          <MessageSquare size={20} />
          <span>Messages</span>
        </NavLink>
      </div>

      <div className="sidebar-footer">
        <button className="nav-item theme-toggle-sidebar" onClick={toggleTheme}>
          {isDark ? <Sun size={20} style={{ color: '#f59e0b' }} /> : <Moon size={20} style={{ color: 'var(--color-primary)' }} />}
          <span>{isDark ? 'Light Mode' : 'Dark Mode'}</span>
        </button>
        <NavLink to="/settings" className={({ isActive }) => isActive ? "nav-item active" : "nav-item"}>
          <Settings size={20} />
          <span>Settings</span>
        </NavLink>
      </div>
    </aside>
  );
}
