import React, { useState, useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import './App.css';
import useAuth from './hooks/useAuth';
import useTheme from './hooks/useTheme';

import Auth from './components/Auth';
import Navbar from './components/Navbar';
import Dashboard from './components/Dashboard';
import BreathingExercise from './components/BreathingExercise';
import MoodTracker from './components/MoodTracker';
import Achievements from './components/Achievements';
import Journal from './components/Journal';
import Goals from './components/Goals';
import WeeklyReport from './components/WeeklyReport';
import AnimatedQuotes from './components/AnimatedQuotes';
import Reminders from './components/Reminders';

function App() {
  const { user, token, login, logout, setUser } = useAuth();
  const { theme, toggleTheme, isDark } = useTheme();
  const [isInitialized, setIsInitialized] = useState(false);

  useEffect(() => {
    // Apply theme to document
    document.documentElement.setAttribute('data-theme', theme);
    document.body.style.backgroundColor = isDark ? '#0f1419' : '#ffffff';
    document.body.style.color = isDark ? '#e0e0e0' : '#2c3e50';
  }, [theme, isDark]);

  useEffect(() => {
    // Restore user from localStorage if token exists
    const savedToken = localStorage.getItem('token');
    const savedUser = localStorage.getItem('user');
    
    if (savedToken && savedUser) {
      try {
        setUser(JSON.parse(savedUser));
      } catch (error) {
        console.error('Error restoring user:', error);
      }
    }
    
    setIsInitialized(true);
  }, [setUser]);

  const handleAuthSuccess = (userData, authToken) => {
    login(userData, authToken);
    localStorage.setItem('user', JSON.stringify(userData));
  };

  const handleLogout = () => {
    logout();
    localStorage.removeItem('user');
  };

  if (!isInitialized) {
    return <div className="app-loading">Loading...</div>;
  }

  return (
    <Router>
      <div className={`app ${theme}`}>
        {token && <Navbar user={user} onLogout={handleLogout} theme={theme} onThemeToggle={toggleTheme} />}
        
        <Routes>
          <Route 
            path="/auth" 
            element={token ? <Navigate to="/dashboard" /> : <Auth onAuthSuccess={handleAuthSuccess} />} 
          />
          
          <Route 
            path="/dashboard" 
            element={token ? <Dashboard user={user} /> : <Navigate to="/auth" />} 
          />
          
          <Route 
            path="/breathing" 
            element={token ? <BreathingExercise /> : <Navigate to="/auth" />} 
          />
          
          <Route 
            path="/mood" 
            element={token ? <MoodTracker /> : <Navigate to="/auth" />} 
          />
          
          <Route 
            path="/achievements" 
            element={token ? <Achievements /> : <Navigate to="/auth" />} 
          />
          
          <Route 
            path="/journal" 
            element={token ? <Journal /> : <Navigate to="/auth" />} 
          />
          
          <Route 
            path="/goals" 
            element={token ? <Goals /> : <Navigate to="/auth" />} 
          />
          
          <Route 
            path="/progress" 
            element={token ? <WeeklyReport /> : <Navigate to="/auth" />} 
          />
          
          <Route 
            path="/quotes" 
            element={token ? <AnimatedQuotes /> : <Navigate to="/auth" />} 
          />
          
          <Route 
            path="/reminders" 
            element={token ? <Reminders /> : <Navigate to="/auth" />} 
          />
          
          <Route 
            path="/" 
            element={token ? <Navigate to="/dashboard" /> : <Navigate to="/auth" />} 
          />
        </Routes>
      </div>
    </Router>
  );
}

export default App;
