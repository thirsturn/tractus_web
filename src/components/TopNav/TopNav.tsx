import { Search, Bell, User, LogOut } from 'lucide-react';
import tractusLogo from '../../assets/Tractus.svg';
import { useAuth } from '../../context/AuthContext';
import { useState, useRef, useEffect } from 'react';
import { Link } from 'react-router-dom';
import './TopNav.css';

export default function TopNav() {
  const { user, logout } = useAuth();
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  // Close dropdown when clicking outside
  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setDropdownOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, [dropdownRef]);

  return (
    <header className="topnav">
      <div className="topnav-brand">
        <Link to="/">
          <img src={tractusLogo} alt="Tractus" className="topnav-logo" />
        </Link>
      </div>
      
      <div className="topnav-search">
        <div className="search-input-wrapper">
          <Search size={18} className="search-icon" />
          <input type="text" placeholder="Search discussions..." className="search-input" />
        </div>
      </div>
      
      <div className="topnav-actions">
        <button className="action-btn">
          <Bell size={20} />
        </button>
        
        <div className="profile-menu-container" ref={dropdownRef}>
          <button 
            className="profile-btn" 
            onClick={() => setDropdownOpen(!dropdownOpen)}
          >
            <div className="avatar">
              {user?.username?.charAt(0).toUpperCase() || 'U'}
            </div>
            <span className="username">{user?.username || 'Guest'}</span>
          </button>
          
          {dropdownOpen && (
            <div className="dropdown-menu">
              <div className="dropdown-header">
                <strong>{user?.username}</strong>
                <span>{user?.email}</span>
              </div>
              <div className="dropdown-divider"></div>
              <Link to={`/profile/${user?.username}`} className="dropdown-item" onClick={() => setDropdownOpen(false)}>
                <User size={16} /> My Profile
              </Link>
              <button className="dropdown-item logout-text" onClick={logout}>
                <LogOut size={16} /> Log Out
              </button>
            </div>
          )}
        </div>
      </div>
    </header>
  );
}
