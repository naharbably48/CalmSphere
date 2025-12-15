import React, { useState, useEffect } from 'react';
import './Achievements.css';
import useTheme from '../hooks/useTheme';

const achievements = [
  { id: 1, name: 'First Step', icon: '🌱', description: 'Complete your first meditation session', requirement: 1, type: 'sessions' },
  { id: 2, name: 'Week Warrior', icon: '⚔️', description: 'Meditate for 7 consecutive days', requirement: 7, type: 'streak' },
  { id: 3, name: 'Zen Master', icon: '🧘', description: 'Complete 50 meditation sessions', requirement: 50, type: 'sessions' },
  { id: 4, name: 'Hour Hero', icon: '⏰', description: 'Meditate for a total of 60 minutes', requirement: 60, type: 'minutes' },
  { id: 5, name: 'Mood Explorer', icon: '😊', description: 'Log your mood 10 times', requirement: 10, type: 'moods' },
  { id: 6, name: 'Breath Master', icon: '🌬️', description: 'Try all 4 breathing modes', requirement: 4, type: 'modes' },
  { id: 7, name: 'Sound Seeker', icon: '🎵', description: 'Use 5 different soundscapes', requirement: 5, type: 'sounds' },
  { id: 8, name: 'Monthly Marvel', icon: '🏆', description: 'Maintain a 30-day streak', requirement: 30, type: 'streak' },
  { id: 9, name: 'Century Club', icon: '💯', description: 'Complete 100 sessions', requirement: 100, type: 'sessions' },
  { id: 10, name: 'Marathon Meditator', icon: '🎯', description: 'Meditate for 500 total minutes', requirement: 500, type: 'minutes' },
  { id: 11, name: 'Emotional Intelligence', icon: '🧠', description: 'Log 50 mood entries', requirement: 50, type: 'moods' },
  { id: 12, name: 'Legendary', icon: '👑', description: 'Achieve a 100-day streak', requirement: 100, type: 'streak' },
];

const Achievements = () => {
  const { theme } = useTheme();
  const [unlockedAchievements, setUnlockedAchievements] = useState([]);
  const [stats, setStats] = useState({
    totalSessions: 0,
    meditationStreak: 0,
    totalMinutesMeditated: 0,
    breathingModes: {},
    soundscapes: {}
  });
  const [moodStats, setMoodStats] = useState({ totalMoods: 0 });

  useEffect(() => {
    // Load stats from localStorage
    const savedStats = localStorage.getItem('meditationStats');
    const savedMoodStats = localStorage.getItem('moodStats');
    
    if (savedStats) {
      setStats(JSON.parse(savedStats));
    }
    if (savedMoodStats) {
      setMoodStats(JSON.parse(savedMoodStats));
    }
  }, []);

  useEffect(() => {
    calculateAchievements();
  }, [stats, moodStats]);

  const calculateAchievements = () => {
    const unlocked = achievements.filter(achievement => {
      switch (achievement.type) {
        case 'sessions':
          return (stats?.totalSessions || 0) >= achievement.requirement;
        case 'streak':
          return (stats?.meditationStreak || 0) >= achievement.requirement;
        case 'minutes':
          return (stats?.totalMinutesMeditated || 0) >= achievement.requirement;
        case 'moods':
          return (moodStats?.totalMoods || 0) >= achievement.requirement;
        case 'modes':
          return Object.keys(stats?.breathingModes || {}).length >= achievement.requirement;
        case 'sounds':
          return Object.keys(stats?.soundscapes || {}).length >= achievement.requirement;
        default:
          return false;
      }
    });
    setUnlockedAchievements(unlocked.map(a => a.id));
  };

  const getProgress = (achievement) => {
    let current = 0;
    switch (achievement.type) {
      case 'sessions':
        current = stats?.totalSessions || 0;
        break;
      case 'streak':
        current = stats?.meditationStreak || 0;
        break;
      case 'minutes':
        current = stats?.totalMinutesMeditated || 0;
        break;
      case 'moods':
        current = moodStats?.totalMoods || 0;
        break;
      case 'modes':
        current = Object.keys(stats?.breathingModes || {}).length;
        break;
      case 'sounds':
        current = Object.keys(stats?.soundscapes || {}).length;
        break;
    }
    return Math.min((current / achievement.requirement) * 100, 100);
  };

  return (
    <div className={`achievements ${theme}`}>
      <div className="achievements-bg">
        <div className="achievement-blob blob-1"></div>
        <div className="achievement-blob blob-2"></div>
      </div>

      <div className="achievements-container">
        <div className="achievements-header">
          <h1>🏆 Achievements</h1>
          <p>Unlock badges by reaching milestones in your wellness journey</p>
          <div className="achievement-summary">
            <span className="unlocked-count">{unlockedAchievements.length}</span>
            <span className="total-count">/ {achievements.length} Unlocked</span>
          </div>
        </div>

        <div className="achievements-grid">
          {achievements.map((achievement) => {
            const isUnlocked = unlockedAchievements.includes(achievement.id);
            const progress = getProgress(achievement);
            
            return (
              <div
                key={achievement.id}
                className={`achievement-card ${isUnlocked ? 'unlocked' : 'locked'}`}
              >
                <div className="achievement-icon">
                  {isUnlocked ? achievement.icon : '🔒'}
                </div>
                <h3 className="achievement-name">{achievement.name}</h3>
                <p className="achievement-description">{achievement.description}</p>
                
                {!isUnlocked && (
                  <div className="achievement-progress">
                    <div className="progress-bar">
                      <div 
                        className="progress-fill" 
                        style={{ width: `${progress}%` }}
                      ></div>
                    </div>
                    <span className="progress-text">{Math.round(progress)}%</span>
                  </div>
                )}
                
                {isUnlocked && (
                  <div className="achievement-unlocked-badge">
                    ✨ Unlocked!
                  </div>
                )}
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};

export default Achievements;
