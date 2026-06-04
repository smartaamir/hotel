import React, { useState, useEffect, useRef } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { useTheme } from '../context/ThemeContext';
import { Sun, Moon, LogOut, User, Menu, X, ShieldAlert, Settings, ChevronDown } from 'lucide-react';
import '../styles/navbar.css';

const Navbar = () => {
  const { user, logout } = useAuth();
  const { theme, toggleTheme } = useTheme();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const dropdownRef = useRef(null);
  const navigate = useNavigate();
  const location = useLocation();

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setDropdownOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);

  const handleLogout = () => {
    logout();
    setDropdownOpen(false);
    setMobileMenuOpen(false);
    navigate('/');
  };

  const isActive = (path) => location.pathname === path;

  return (
    <nav className="navbar glass-panel">
      <div className="nav-container">
        <Link to="/" className="nav-logo" onClick={() => setMobileMenuOpen(false)}>
          <span className="logo-icon">🏰</span>
          <span className="logo-text">AURA<span>STAY</span></span>
        </Link>

        {/* Desktop Navigation */}
        <div className="nav-links">
          <Link to="/" className={`nav-item ${isActive('/') ? 'active' : ''}`}>
            Home
          </Link>
          {(!user || user.role !== 'admin') && (
            <Link to="/rooms" className={`nav-item ${isActive('/rooms') ? 'active' : ''}`}>
              Suites & Rooms
            </Link>
          )}
          {(!user || user.role !== 'admin') && (
            <Link to="/dining" className={`nav-item ${isActive('/dining') ? 'active' : ''}`}>
              Dining
            </Link>
          )}
          {user && user.role === 'admin' && (
            <Link to="/admin" className={`nav-item ${isActive('/admin') ? 'active' : ''}`}>
              Admin Panel
            </Link>
          )}

          {user ? (
            <div className="user-profile-dropdown" ref={dropdownRef}>
              <button 
                onClick={() => setDropdownOpen(!dropdownOpen)} 
                className={`user-greeting-trigger ${dropdownOpen ? 'active' : ''}`}
                aria-haspopup="true"
                aria-expanded={dropdownOpen}
              >
                <div className="avatar-circle">
                  {user.name.charAt(0).toUpperCase()}
                </div>
                <span className="user-greeting-text">
                  Welcome, <strong>{user.name.split(' ')[0]}</strong>
                </span>
                <ChevronDown size={14} className={`chevron-icon ${dropdownOpen ? 'rotate' : ''}`} />
              </button>

              {dropdownOpen && (
                <div className="dropdown-menu-panel glass-panel fade-in">
                  <div className="dropdown-header">
                    <div className="avatar-large">
                      {user.name.charAt(0).toUpperCase()}
                    </div>
                    <div className="dropdown-user-details">
                      <div className="user-full-name">{user.name}</div>
                      <div className="user-email">{user.email}</div>
                      <span className={`user-role-badge ${user.role}`}>
                        {user.role === 'admin' ? '🛡️ Administrator' : '✨ Valued Guest'}
                      </span>
                    </div>
                  </div>
                  
                  <div className="dropdown-divider"></div>
                  
                  <div className="dropdown-items">
                    {user.role === 'admin' ? (
                      <>
                        <Link 
                          to="/admin" 
                          className={`dropdown-link-item ${isActive('/admin') && location.search !== '?tab=settings' ? 'active' : ''}`}
                          onClick={() => setDropdownOpen(false)}
                        >
                          <ShieldAlert size={16} />
                          <span>Admin Dashboard</span>
                        </Link>
                        <Link 
                          to="/admin?tab=settings" 
                          className={`dropdown-link-item ${isActive('/admin') && location.search === '?tab=settings' ? 'active' : ''}`}
                          onClick={() => setDropdownOpen(false)}
                        >
                          <Settings size={16} />
                          <span>Admin Settings</span>
                        </Link>
                      </>
                    ) : (
                      <>
                        <Link 
                          to="/dashboard" 
                          className={`dropdown-link-item ${isActive('/dashboard') && location.search !== '?tab=settings' ? 'active' : ''}`}
                          onClick={() => setDropdownOpen(false)}
                        >
                          <User size={16} />
                          <span>Guest Dashboard</span>
                        </Link>
                        <Link 
                          to="/dashboard?tab=settings" 
                          className={`dropdown-link-item ${isActive('/dashboard') && location.search === '?tab=settings' ? 'active' : ''}`}
                          onClick={() => setDropdownOpen(false)}
                        >
                          <Settings size={16} />
                          <span>Profile Settings</span>
                        </Link>
                      </>
                    )}
                  </div>
                  
                  <div className="dropdown-divider"></div>
                  
                  <button onClick={handleLogout} className="dropdown-logout-btn">
                    <LogOut size={16} />
                    <span>Log Out</span>
                  </button>
                </div>
              )}
            </div>
          ) : (
            <div className="nav-auth-buttons">
              <Link to="/login" className="btn-login-link">Sign In</Link>
              <Link to="/register" className="btn-gold btn-nav-register">Reserve Now</Link>
            </div>
          )}

          <button onClick={toggleTheme} className="theme-toggle" aria-label="Toggle theme">
            {theme === 'dark' ? <Sun size={20} className="sun-icon" /> : <Moon size={20} className="moon-icon" />}
          </button>
        </div>

        {/* Mobile Action Controls */}
        <div className="nav-mobile-controls">
          <button onClick={toggleTheme} className="theme-toggle mobile-toggle" aria-label="Toggle theme">
            {theme === 'dark' ? <Sun size={18} /> : <Moon size={18} />}
          </button>
          <button onClick={() => setMobileMenuOpen(!mobileMenuOpen)} className="mobile-menu-btn" aria-label="Toggle menu">
            {mobileMenuOpen ? <X size={24} /> : <Menu size={24} />}
          </button>
        </div>
      </div>

      {/* Mobile Navigation Drawer */}
      {mobileMenuOpen && (
        <div className="mobile-drawer glass-panel">
          <div className="mobile-drawer-links">
            <Link to="/" className={`mobile-item ${isActive('/') ? 'active' : ''}`} onClick={() => setMobileMenuOpen(false)}>
              Home
            </Link>
            {(!user || user.role !== 'admin') && (
              <Link to="/rooms" className={`mobile-item ${isActive('/rooms') ? 'active' : ''}`} onClick={() => setMobileMenuOpen(false)}>
                Suites & Rooms
              </Link>
            )}
            {(!user || user.role !== 'admin') && (
              <Link to="/dining" className={`mobile-item ${isActive('/dining') ? 'active' : ''}`} onClick={() => setMobileMenuOpen(false)}>
                Dining
              </Link>
            )}

            {user ? (
              <>
                {user.role === 'admin' ? (
                  <>
                    <Link to="/admin" className={`mobile-item admin-badge ${isActive('/admin') && location.search !== '?tab=settings' ? 'active' : ''}`} onClick={() => setMobileMenuOpen(false)}>
                      <ShieldAlert size={16} /> Admin panel
                    </Link>
                    <Link to="/admin?tab=settings" className={`mobile-item ${isActive('/admin') && location.search === '?tab=settings' ? 'active' : ''}`} onClick={() => setMobileMenuOpen(false)}>
                      <Settings size={16} /> Settings
                    </Link>
                  </>
                ) : (
                  <>
                    <Link to="/dashboard" className={`mobile-item ${isActive('/dashboard') && location.search !== '?tab=settings' ? 'active' : ''}`} onClick={() => setMobileMenuOpen(false)}>
                      <User size={16} /> Guest Dashboard
                    </Link>
                    <Link to="/dashboard?tab=settings" className={`mobile-item ${isActive('/dashboard') && location.search === '?tab=settings' ? 'active' : ''}`} onClick={() => setMobileMenuOpen(false)}>
                      <Settings size={16} /> Profile Settings
                    </Link>
                  </>
                )}
                <div className="mobile-user-info">
                  <div className="mobile-avatar">
                    {user.name.charAt(0).toUpperCase()}
                  </div>
                  <div className="mobile-user-details">
                    <div className="mobile-user-greet">
                      Welcome, <strong>{user.name.split(' ')[0]}</strong>!
                    </div>
                    <div className="mobile-user-email">{user.email}</div>
                  </div>
                </div>
                <button onClick={handleLogout} className="btn-gold mobile-logout-btn">
                  <LogOut size={16} /> Log Out
                </button>
              </>
            ) : (
              <div className="mobile-auth-stack">
                <Link to="/login" className="btn-outline mobile-btn" onClick={() => setMobileMenuOpen(false)}>Sign In</Link>
                <Link to="/register" className="btn-gold mobile-btn" onClick={() => setMobileMenuOpen(false)}>Register Account</Link>
              </div>
            )}
          </div>
        </div>
      )}
    </nav>
  );
};

export default Navbar;
