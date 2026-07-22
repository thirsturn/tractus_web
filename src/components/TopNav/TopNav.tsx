import { Bell, User, LogOut, Heart, MessageSquare, AtSign, Check } from 'lucide-react';
import tractusLogo from '../../assets/Tractus.svg';
import { useAuth } from '../../context/AuthContext';
import { useState, useRef, useEffect } from 'react';
import { Link } from 'react-router-dom';
import './TopNav.css';

export default function TopNav() {
  const { user, logout } = useAuth();
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const [notificationsOpen, setNotificationsOpen] = useState(false);
  
  const dropdownRef = useRef<HTMLDivElement>(null);
  const notifRef = useRef<HTMLDivElement>(null);

  // Mock Notifications Data
  const [notifications, setNotifications] = useState([
    { id: 1, type: 'upvote', user: 'Alex', action: 'upvoted your post', time: '5m ago', read: false, threadId: 1 },
    { id: 2, type: 'comment', user: 'Sarah', action: 'commented on your thread', time: '1h ago', read: false, threadId: 101 },
    { id: 3, type: 'mention', user: 'DevTeam', action: 'mentioned you in an announcement', time: '2h ago', read: true, threadId: 102 }
  ]);

  const unreadCount = notifications.filter(n => !n.read).length;

  const markAllAsRead = () => {
    setNotifications(notifications.map(n => ({ ...n, read: true })));
  };

  // Close dropdowns when clicking outside
  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setDropdownOpen(false);
      }
      if (notifRef.current && !notifRef.current.contains(event.target as Node)) {
        setNotificationsOpen(false);
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
        {/* Search removed per user request */}
      </div>
      
      <div className="topnav-actions">
        <div className="notifications-container" ref={notifRef}>
          <button 
            className="action-btn"
            onClick={() => {
              setNotificationsOpen(!notificationsOpen);
              setDropdownOpen(false);
            }}
          >
            <Bell size={20} />
            {unreadCount > 0 && <span className="notification-badge"></span>}
          </button>
          
          {notificationsOpen && (
            <div className="notifications-dropdown">
              <div className="notifications-header">
                <h3>Notifications</h3>
                {unreadCount > 0 && (
                  <button className="mark-read-btn" onClick={markAllAsRead}>
                    <Check size={14} /> Mark all read
                  </button>
                )}
              </div>
              
              <div className="notifications-list">
                {notifications.length === 0 ? (
                  <div className="no-notifications">You're all caught up!</div>
                ) : (
                  notifications.map(notif => (
                    <Link 
                      key={notif.id} 
                      to={`/thread/${notif.threadId}`}
                      onClick={() => setNotificationsOpen(false)}
                      className={`notification-item ${!notif.read ? 'unread' : ''}`}
                      style={{ textDecoration: 'none', color: 'inherit' }}
                    >
                      <div className="notification-icon">
                        {notif.type === 'upvote' && <Heart size={16} className="text-secondary" />}
                        {notif.type === 'comment' && <MessageSquare size={16} className="text-primary" />}
                        {notif.type === 'mention' && <AtSign size={16} className="text-accent" />}
                      </div>
                      <div className="notification-content">
                        <p><strong>{notif.user}</strong> {notif.action}</p>
                        <span className="notification-time">{notif.time}</span>
                      </div>
                      {!notif.read && <div className="unread-dot"></div>}
                    </Link>
                  ))
                )}
              </div>
            </div>
          )}
        </div>
        
        <div className="profile-menu-container" ref={dropdownRef}>
          <button 
            className="profile-btn" 
            onClick={() => {
              setDropdownOpen(!dropdownOpen);
              setNotificationsOpen(false);
            }}
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
