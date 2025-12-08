import React, { useState, useEffect } from 'react';
import './Dashboard.css';
import { sessionService, moodService, affirmationService } from '../services/api';
import useTheme from '../hooks/useTheme';
import { moods } from '../utils/constants';

const Dashboard = ({ user }) => {
  const [stats, setStats] = useState(null);
  const [moodStats, setMoodStats] = useState(null);
  const [affirmation, setAffirmation] = useState(null);
  const [loading, setLoading] = useState(true);
  const { theme } = useTheme();

  useEffect(() => {
    fetchDashboardData();
  }, []);

  const fetchDashboardData = async () => {
    try {
      setLoading(true);
      const [statsRes, moodStatsRes, affirmationRes] = await Promise.all([
        sessionService.getStats(),
        moodService.getStats(),
        affirmationService.getDailyAffirmation(),
      ]);
      setStats(statsRes.data.stats);
      setMoodStats(moodStatsRes.data.stats);
      setAffirmation(affirmationRes.data.affirmation);
    } catch (error) {
      console.error('Error fetching dashboard data:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleSaveAffirmation = async () => {
    try {
      await affirmationService.saveAffirmation(affirmation._id);
      setAffirmation({ ...affirmation, isSaved: true });
    } catch (error) {
      console.error('Error saving affirmation:', error);
    }
  };

  const getStreakMessage = (days) => {
    if (days === 0) return '🚀 Start your journey today!';
    if (days === 1) return '🌟 Great start!';
    if (days < 7) return '💪 Keep it up!';
    if (days < 14) return '🔥 Amazing consistency!';
    if (days < 30) return '🎯 Incredible dedication!';
    return '👑 You\'re a meditation master!';
  };

  const calculateAverageStress = () => {
    if (!moodStats?.averageStressLevel) return 0;
    return Math.round(moodStats.averageStressLevel);
  };

  if (loading) {
    return <div className="dashboard loading">Loading your wellness data...</div>;
  }

  return (
    <div className={`dashboard ${theme}`}>
      {/* Animated Background */}
      <div className="dashboard-bg">
        <div className="blob-1"></div>
        <div className="blob-2"></div>
      </div>

      <div className="dashboard-container">
        <div className="dashboard-header">
          <h1>Welcome back, {user?.name}! 👋</h1>
          <p>Your personalized wellness overview</p>
        </div>

        {/* Daily Affirmation */}
        <div className="affirmation-card">
          <div className="affirmation-icon">✨</div>
          <p className="affirmation-text">{affirmation?.text}</p>
          <button
            className={`save-affirmation-btn ${affirmation?.isSaved ? 'saved' : ''}`}
            onClick={handleSaveAffirmation}
            disabled={affirmation?.isSaved}
          >
            {affirmation?.isSaved ? '❤️ Saved' : '🤍 Save'}
          </button>
        </div>

        {/* Stats Grid */}
        {stats && (
          <div className="stats-section">
            <h2>📊 Your Progress</h2>
            <div className="stats-grid">
              <div className="stat-card">
                <div className="stat-icon">🧘</div>
                <h3>Total Sessions</h3>
                <p className="stat-number">{stats.totalSessions || 0}</p>
                <p style={{ fontSize: '12px', color: '#aaa', marginTop: '8px' }}>
                  Meditation sessions completed
                </p>
              </div>
              <div className="stat-card">
                <div className="stat-icon">⏱️</div>
                <h3>Minutes Meditated</h3>
                <p className="stat-number">{stats.totalMinutesMeditated || 0}</p>
                <p style={{ fontSize: '12px', color: '#aaa', marginTop: '8px' }}>
                  {stats.totalMinutesMeditated > 0 
                    ? `${Math.round(stats.totalMinutesMeditated / 60)} hours total` 
                    : 'Start meditating today'}
                </p>
              </div>
              <div className="stat-card">
                <div className="stat-icon">🔥</div>
                <h3>Current Streak</h3>
                <p className="stat-number">{stats.meditationStreak || 0}</p>
                <p style={{ fontSize: '12px', color: '#aaa', marginTop: '8px' }}>
                  {getStreakMessage(stats.meditationStreak || 0)}
                </p>
              </div>
              <div className="stat-card">
                <div className="stat-icon">📅</div>
                <h3>Last Session</h3>
                <p className="stat-date">
                  {stats.lastMeditationDate
                    ? new Date(stats.lastMeditationDate).toLocaleDateString('en-US', { 
                        month: 'short', 
                        day: 'numeric' 
                      })
                    : 'Never'}
                </p>
                <p style={{ fontSize: '12px', color: '#aaa', marginTop: '8px' }}>
                  {stats.lastMeditationDate 
                    ? `${Math.floor((new Date() - new Date(stats.lastMeditationDate)) / (1000 * 60 * 60))} hours ago`
                    : 'No sessions yet'}
                </p>
              </div>
            </div>
          </div>
        )}

        {/* Mood Stats */}
        {moodStats && (
          <div className="stats-section">
            <h2>😊 Your Mood Insights</h2>
            <div className="stats-grid">
              <div className="stat-card">
                <div className="stat-icon">📈</div>
                <h3>Total Mood Entries</h3>
                <p className="stat-number">{moodStats.totalMoods || 0}</p>
                <p style={{ fontSize: '12px', color: '#aaa', marginTop: '8px' }}>
                  Emotional check-ins recorded
                </p>
              </div>
              <div className="stat-card">
                <div className="stat-icon">😌</div>
                <h3>Most Common Mood</h3>
                <p className="stat-number" style={{ fontSize: '28px' }}>
                  {moodStats.mostCommonMood || '—'}
                </p>
                <p style={{ fontSize: '12px', color: '#aaa', marginTop: '8px' }}>
                  Your emotional baseline
                </p>
              </div>
              <div className="stat-card">
                <div className="stat-icon">📊</div>
                <h3>Avg Stress Level</h3>
                <p className="stat-number">{calculateAverageStress()}/10</p>
                <p style={{ fontSize: '12px', color: '#aaa', marginTop: '8px' }}>
                  {calculateAverageStress() > 7 ? '⚠️ Time to relax' : calculateAverageStress() > 4 ? '⚖️ Balanced' : '✅ Low stress'}
                </p>
              </div>
              <div className="stat-card">
                <div className="stat-icon">🎯</div>
                <h3>Wellness Score</h3>
                <p className="stat-number">{Math.round((stats?.totalMinutesMeditated || 0) / 10)}%</p>
                <p style={{ fontSize: '12px', color: '#aaa', marginTop: '8px' }}>
                  Based on meditation time
                </p>
              </div>
            </div>
          </div>
        )}

        {/* Breathing Modes Breakdown */}
        {stats && Object.keys(stats.breathingModes || {}).length > 0 && (
          <div className="modes-breakdown">
            <h2>🌬️ Breathing Mode Preferences</h2>
            <div className="modes-list">
              {Object.entries(stats.breathingModes).map(([mode, count]) => (
                <div key={mode} className="mode-item">
                  <span className="mode-name">{mode}</span>
                  <div className="mode-bar">
                    <div
                      className="mode-fill"
                      style={{
                        width: `${(count / Math.max(...Object.values(stats.breathingModes), 1)) * 100}%`,
                      }}
                    ></div>
                  </div>
                  <span className="mode-count">{count}x</span>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Soundscapes Used */}
        {stats && Object.keys(stats.soundscapes || {}).length > 0 && (
          <div className="soundscapes-section">
            <h2>🎵 Soundscapes You Love</h2>
            <div className="soundscapes-list">
              {Object.entries(stats.soundscapes).map(([sound, count]) => (
                <div key={sound} className="soundscape-item">
                  <span className="sound-name">{sound}</span>
                  <span className="sound-count">{count}x</span>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default Dashboard;
