import { Bell, User, LogOut, Heart, MessageSquare, UserPlus, Mail, Check, Sun, Moon } from 'lucide-react';
import tractusLogo from '../../assets/Tractus.svg';
import { useAuth } from '../../context/AuthContext';
import { useTheme } from '../../context/ThemeContext';
import { useState, useRef, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import notificationService from '../../services/notification.service';
import type { NotificationResponse } from '../../types/notification.types';
import './TopNav.css';

export default function TopNav() {
  const { user, logout } = useAuth();
  const { isDark, toggleTheme } = useTheme();
  const navigate = useNavigate();
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const [notificationsOpen, setNotificationsOpen] = useState(false);
  
  const dropdownRef = useRef<HTMLDivElement>(null);
  const notifRef = useRef<HTMLDivElement>(null);

  const [notifications, setNotifications] = useState<NotificationResponse[]>([]);

  const fetchNotifications = async () => {
    if (!user) return;
    try {
      const data = await notificationService.getUserNotifications();
      setNotifications(data);
    } catch (err) {
      console.error('Failed to fetch notifications:', err);
    }
  };

  useEffect(() => {
    fetchNotifications();
    const interval = setInterval(fetchNotifications, 4000);
    return () => clearInterval(interval);
  }, [user]);

  const unreadCount = notifications.filter(n => !n.read).length;

  const markAllAsRead = async () => {
    try {
      await notificationService.markAllAsRead();
      setNotifications(notifications.map(n => ({ ...n, read: true })));
    } catch (err) {
      console.error('Failed to mark all as read:', err);
    }
  };

  const handleNotificationClick = async (notif: NotificationResponse) => {
    if (!notif.read) {
      try {
        await notificationService.markAsRead(notif.id);
        setNotifications(notifications.map(n => n.id === notif.id ? { ...n, read: true } : n));
      } catch (err) {
        console.error('Failed to mark notification as read:', err);
      }
    }
    setNotificationsOpen(false);

    if (notif.targetThreadId) {
      navigate(`/thread/${notif.targetThreadId}`);
    } else if (notif.type === 'MESSAGE') {
      navigate(`/messages/${notif.actor.username}`);
    } else if (notif.type === 'FOLLOW') {
      navigate(`/profile/${notif.actor.username}`);
    }
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
        {/* Theme Toggle Button */}
        <button
          className="action-btn theme-toggle-btn"
          onClick={toggleTheme}
          title={isDark ? "Switch to Light Mode" : "Switch to Dark Mode"}
          aria-label="Toggle theme"
        >
          {isDark ? <Sun size={20} className="theme-icon sun" /> : <Moon size={20} className="theme-icon moon" />}
        </button>

        <div className="notifications-container" ref={notifRef}>
          <button 
            className="action-btn"
            onClick={() => {
              setNotificationsOpen(!notificationsOpen);
              setDropdownOpen(false);
            }}
          >
            <Bell size={20} />
            {unreadCount > 0 && <span className="notification-badge">{unreadCount}</span>}
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
                    <div 
                      key={notif.id} 
                      onClick={() => handleNotificationClick(notif)}
                      className={`notification-item ${!notif.read ? 'unread' : ''}`}
                      style={{ cursor: 'pointer' }}
                    >
                      <div className="notification-icon">
                        {notif.type === 'UPVOTE' && <Heart size={16} className="text-secondary" />}
                        {notif.type === 'COMMENT' && <MessageSquare size={16} className="text-primary" />}
                        {notif.type === 'FOLLOW' && <UserPlus size={16} className="text-accent" />}
                        {notif.type === 'MESSAGE' && <Mail size={16} className="text-primary" />}
                      </div>
                      <div className="notification-content">
                        <p>{notif.message}</p>
                        <span className="notification-time">
                          {notif.createdAt ? new Date(notif.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }) : 'Recently'}
                        </span>
                      </div>
                      {!notif.read && <div className="unread-dot"></div>}
                    </div>
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
              {user?.profileImageUrl ? (
                <img src={user.profileImageUrl} alt="avatar" style={{ width: '100%', height: '100%', borderRadius: '50%', objectFit: 'cover' }} />
              ) : (
                user?.username?.charAt(0).toUpperCase() || 'U'
              )}
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
              <button className="dropdown-item" onClick={toggleTheme}>
                {isDark ? <Sun size={16} /> : <Moon size={16} />} {isDark ? "Light Mode" : "Dark Mode"}
              </button>
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
