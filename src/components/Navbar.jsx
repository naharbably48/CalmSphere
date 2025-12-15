import React, { useState } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import './Navbar.css';

const Navbar = ({ user, onLogout, theme, onThemeToggle }) => {
  const [menuOpen, setMenuOpen] = useState(false);
  const [moreOpen, setMoreOpen] = useState(false);
  const navigate = useNavigate();
  const location = useLocation();

  const handleLogout = () => {
    onLogout();
    navigate('/auth');
  };

  const isActive = (path) => location.pathname === path;

  return (
    <nav className="navbar">
      <div className="navbar-container">
        <Link to="/dashboard" className="navbar-logo">
          <span className="logo-icon">🧘</span>
          CalmSphere
        </Link>

        <div className={`navbar-menu ${menuOpen ? 'active' : ''}`}>
          <Link to="/dashboard" className={`nav-link ${isActive('/dashboard') ? 'active' : ''}`}>
            <span className="nav-icon">🏠</span> Dashboard
          </Link>
          <Link to="/breathing" className={`nav-link ${isActive('/breathing') ? 'active' : ''}`}>
            <span className="nav-icon">💨</span> Breathing
          </Link>
          <Link to="/mood" className={`nav-link ${isActive('/mood') ? 'active' : ''}`}>
            <span className="nav-icon">😊</span> Mood
          </Link>
          <Link to="/journal" className={`nav-link ${isActive('/journal') ? 'active' : ''}`}>
            <span className="nav-icon">📔</span> Journal
          </Link>
          
          <div className="nav-dropdown">
            <button 
              className={`nav-link dropdown-toggle ${moreOpen ? 'open' : ''}`}
              onClick={() => setMoreOpen(!moreOpen)}
            >
              <span className="nav-icon">✨</span> More
              <span className="dropdown-arrow">▾</span>
            </button>
            <div className={`dropdown-menu ${moreOpen ? 'show' : ''}`}>
              <Link to="/goals" className="dropdown-item" onClick={() => setMoreOpen(false)}>
                <span>🎯</span> Goals
              </Link>
              <Link to="/progress" className="dropdown-item" onClick={() => setMoreOpen(false)}>
                <span>📊</span> Weekly Progress
              </Link>
              <Link to="/achievements" className="dropdown-item" onClick={() => setMoreOpen(false)}>
                <span>🏆</span> Achievements
              </Link>
              <Link to="/reminders" className="dropdown-item" onClick={() => setMoreOpen(false)}>
                <span>⏰</span> Reminders
              </Link>
              <Link to="/quotes" className="dropdown-item" onClick={() => setMoreOpen(false)}>
                <span>💭</span> Quotes
              </Link>
            </div>
          </div>
        </div>

        <div className="navbar-controls">
          <button className="theme-toggle" onClick={onThemeToggle} title="Toggle theme">
            {theme === 'dark' ? '☀️' : '🌙'}
          </button>

          <div className="user-menu">
            <span className="user-name">{user?.name}</span>
            <button className="logout-btn" onClick={handleLogout}>
              Logout
            </button>
          </div>

          <button
            className="menu-toggle"
            onClick={() => setMenuOpen(!menuOpen)}
            aria-label="Toggle menu"
          >
            <span></span>
            <span></span>
            <span></span>
          </button>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
