import { NavLink } from 'react-router-dom';
import { Home, MessageSquare, Compass, Settings } from 'lucide-react';
import './Sidebar.css';

export default function Sidebar() {

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
        <button className="nav-item">
          <Settings size={20} />
          <span>Settings</span>
        </button>
      </div>
    </aside>
  );
}
