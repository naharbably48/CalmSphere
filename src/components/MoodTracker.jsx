import React, { useState, useEffect } from 'react';
import './MoodTracker.css';
import { moods } from '../utils/constants';
import { moodService } from '../services/api';
import useTheme from '../hooks/useTheme';
import MoodChart from './MoodChart';

const MoodTracker = () => {
  const { theme } = useTheme();
  const [selectedMood, setSelectedMood] = useState(null);
  const [stressLevel, setStressLevel] = useState(5);
  const [notes, setNotes] = useState('');
  const [moodHistory, setMoodHistory] = useState([]);
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState('');

  useEffect(() => {
    fetchMoodData();
  }, []);

  const fetchMoodData = async () => {
    try {
      setLoading(true);
      const [historyRes, statsRes] = await Promise.all([
        moodService.getHistory(),
        moodService.getStats(),
      ]);
      setMoodHistory(historyRes.data.moods);
      setStats(statsRes.data.stats);
    } catch (error) {
      console.error('Error fetching mood data:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!selectedMood) {
      setMessage('Please select a mood');
      return;
    }

    try {
      setLoading(true);
      await moodService.createMood(selectedMood, stressLevel, notes);
      setMessage('✓ Mood recorded successfully!');
      setSelectedMood(null);
      setStressLevel(5);
      setNotes('');
      await fetchMoodData();
      setTimeout(() => setMessage(''), 3000);
    } catch (error) {
      setMessage('Failed to record mood');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className={`mood-tracker ${theme}`}>
      {/* Animated Background */}
      <div className="mood-bg">
        <div className="mood-blob blob-1"></div>
        <div className="mood-blob blob-2"></div>
      </div>

      <div className="mood-container">
        <div className="mood-header">
          <h1>Mood & Stress Tracker</h1>
          <p>Track your daily emotional state and stress levels</p>
        </div>

        <div className="mood-content">
          {/* Mood Selection */}
          <div className="mood-selection">
            <h3>How are you feeling today?</h3>
            <div className="moods-grid">
              {moods.map((mood) => (
                <button
                  key={mood.name}
                  className={`mood-card ${selectedMood === mood.name ? 'active' : ''}`}
                  onClick={() => setSelectedMood(mood.name)}
                >
                  <span className="mood-emoji">{mood.emoji}</span>
                  <span className="mood-label">{mood.name}</span>
                </button>
              ))}
            </div>
          </div>

          {/* Stress Level Slider */}
          <div className="stress-section">
            <label className="stress-label">
              Stress Level: <span className="stress-value">{stressLevel}/10</span>
            </label>
            <input
              type="range"
              min="1"
              max="10"
              value={stressLevel}
              onChange={(e) => setStressLevel(parseInt(e.target.value))}
              className="stress-slider"
            />
            <div className="stress-markers">
              <span>Low</span>
              <span>High</span>
            </div>
          </div>

          {/* Notes */}
          <div className="notes-section">
            <label>Additional Notes (Optional)</label>
            <textarea
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
              placeholder="What triggered this mood? What would help?"
              className="notes-input"
              rows="3"
            />
          </div>

          {/* Submit Button */}
          <button
            className="submit-btn"
            onClick={handleSubmit}
            disabled={loading || !selectedMood}
          >
            {loading ? 'Recording...' : 'Record Mood'}
          </button>

          {message && <div className="message">{message}</div>}
        </div>

        {/* Stats Section */}
        {stats && (
          <div className="mood-stats">
            <h2>Your Mood Insights</h2>
            <div className="stats-grid">
              <div className="stat-card">
                <span className="stat-label">Total Entries</span>
                <span className="stat-value">{stats.totalMoodEntries}</span>
              </div>
              <div className="stat-card">
                <span className="stat-label">This Week</span>
                <span className="stat-value">{stats.weeklyMoods}</span>
              </div>
              <div className="stat-card">
                <span className="stat-label">Avg Stress</span>
                <span className="stat-value">{stats.averageStressLevel}</span>
              </div>
            </div>

            {/* Mood Chart */}
            <div className="chart-container">
              <MoodChart data={stats.weeklyMoods} />
            </div>

            {/* Recent History */}
            <div className="recent-moods">
              <h3>Recent Moods</h3>
              <div className="history-list">
                {moodHistory.slice(0, 10).map((entry, idx) => (
                  <div key={idx} className="history-item">
                    <div className="history-mood">
                      <span className="mood-icon">
                        {moods.find((m) => m.name === entry.mood)?.emoji}
                      </span>
                      <div className="mood-details">
                        <span className="mood-name">{entry.mood}</span>
                        <span className="mood-date">
                          {new Date(entry.date).toLocaleDateString()}
                        </span>
                      </div>
                    </div>
                    <span className="stress-badge" style={{ '--stress': entry.stressLevel / 10 }}>
                      {entry.stressLevel}/10
                    </span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default MoodTracker;
