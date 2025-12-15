import React, { useState, useEffect } from 'react';
import useTheme from '../hooks/useTheme';
import './Goals.css';

const Goals = () => {
  const { theme } = useTheme();
  const [goals, setGoals] = useState([]);
  const [newGoal, setNewGoal] = useState({
    title: '',
    target: 7,
    type: 'meditation',
    deadline: ''
  });
  const [showForm, setShowForm] = useState(false);

  const goalTypes = [
    { value: 'meditation', icon: '🧘', label: 'Meditation Sessions' },
    { value: 'breathing', icon: '💨', label: 'Breathing Exercises' },
    { value: 'mindful', icon: '🌸', label: 'Mindful Minutes' },
    { value: 'journal', icon: '📝', label: 'Journal Entries' },
    { value: 'sleep', icon: '😴', label: 'Sleep Hours' }
  ];

  useEffect(() => {
    const savedGoals = localStorage.getItem('meditationGoals');
    if (savedGoals) {
      setGoals(JSON.parse(savedGoals));
    }
  }, []);

  const saveGoal = () => {
    if (!newGoal.title.trim()) return;

    const goal = {
      id: Date.now(),
      ...newGoal,
      progress: 0,
      completed: false,
      createdAt: new Date().toISOString()
    };

    const updatedGoals = [goal, ...goals];
    setGoals(updatedGoals);
    localStorage.setItem('meditationGoals', JSON.stringify(updatedGoals));
    
    setNewGoal({ title: '', target: 7, type: 'meditation', deadline: '' });
    setShowForm(false);
  };

  const updateProgress = (id, delta) => {
    const updatedGoals = goals.map(goal => {
      if (goal.id === id) {
        const newProgress = Math.max(0, Math.min(goal.target, goal.progress + delta));
        return { 
          ...goal, 
          progress: newProgress,
          completed: newProgress >= goal.target
        };
      }
      return goal;
    });
    setGoals(updatedGoals);
    localStorage.setItem('meditationGoals', JSON.stringify(updatedGoals));
  };

  const deleteGoal = (id) => {
    const updatedGoals = goals.filter(goal => goal.id !== id);
    setGoals(updatedGoals);
    localStorage.setItem('meditationGoals', JSON.stringify(updatedGoals));
  };

  const getTypeIcon = (type) => {
    const found = goalTypes.find(t => t.value === type);
    return found ? found.icon : '🎯';
  };

  const getDaysRemaining = (deadline) => {
    if (!deadline) return null;
    const days = Math.ceil((new Date(deadline) - new Date()) / (1000 * 60 * 60 * 24));
    return days;
  };

  const activeGoals = goals.filter(g => !g.completed);
  const completedGoals = goals.filter(g => g.completed);

  return (
    <div className={`goals ${theme}`}>
      <div className="goals-bg">
        <div className="goals-blob blob-1"></div>
        <div className="goals-blob blob-2"></div>
      </div>

      <div className="goals-container">
        <header className="goals-header">
          <h1>🎯 Wellness Goals</h1>
          <p>Set intentions and track your mindfulness journey</p>
        </header>

        <div className="goals-stats">
          <div className="stat-bubble">
            <span className="stat-number">{activeGoals.length}</span>
            <span className="stat-label">Active</span>
          </div>
          <div className="stat-bubble completed">
            <span className="stat-number">{completedGoals.length}</span>
            <span className="stat-label">Completed</span>
          </div>
        </div>

        {!showForm ? (
          <button className="add-goal-btn" onClick={() => setShowForm(true)}>
            <span>✨</span> Create New Goal
          </button>
        ) : (
          <div className="goal-form-card">
            <div className="form-header">
              <h3>New Wellness Goal</h3>
              <button className="close-btn" onClick={() => setShowForm(false)}>×</button>
            </div>

            <div className="form-group">
              <label>Goal Title</label>
              <input
                type="text"
                value={newGoal.title}
                onChange={(e) => setNewGoal({...newGoal, title: e.target.value})}
                placeholder="e.g., Meditate every morning"
                className="goal-input"
              />
            </div>

            <div className="form-group">
              <label>Goal Type</label>
              <div className="type-selector">
                {goalTypes.map((type) => (
                  <button
                    key={type.value}
                    className={`type-btn ${newGoal.type === type.value ? 'active' : ''}`}
                    onClick={() => setNewGoal({...newGoal, type: type.value})}
                  >
                    <span>{type.icon}</span>
                    <span>{type.label}</span>
                  </button>
                ))}
              </div>
            </div>

            <div className="form-row">
              <div className="form-group">
                <label>Target (times)</label>
                <input
                  type="number"
                  value={newGoal.target}
                  onChange={(e) => setNewGoal({...newGoal, target: parseInt(e.target.value) || 1})}
                  min="1"
                  max="100"
                  className="goal-input"
                />
              </div>
              <div className="form-group">
                <label>Deadline (optional)</label>
                <input
                  type="date"
                  value={newGoal.deadline}
                  onChange={(e) => setNewGoal({...newGoal, deadline: e.target.value})}
                  className="goal-input"
                />
              </div>
            </div>

            <button className="save-goal-btn" onClick={saveGoal}>
              <span>🚀</span> Start Goal
            </button>
          </div>
        )}

        {activeGoals.length > 0 && (
          <section className="goals-section">
            <h2>🔥 Active Goals</h2>
            <div className="goals-list">
              {activeGoals.map((goal) => {
                const daysLeft = getDaysRemaining(goal.deadline);
                const progressPercent = (goal.progress / goal.target) * 100;
                
                return (
                  <div key={goal.id} className="goal-card">
                    <div className="goal-icon">{getTypeIcon(goal.type)}</div>
                    <div className="goal-content">
                      <h4 className="goal-title">{goal.title}</h4>
                      <div className="goal-progress-info">
                        <span className="progress-text">{goal.progress} / {goal.target}</span>
                        {daysLeft !== null && (
                          <span className={`days-left ${daysLeft < 3 ? 'urgent' : ''}`}>
                            {daysLeft > 0 ? `${daysLeft} days left` : 'Due today!'}
                          </span>
                        )}
                      </div>
                      <div className="goal-progress-bar">
                        <div 
                          className="goal-progress-fill" 
                          style={{ width: `${progressPercent}%` }}
                        ></div>
                      </div>
                    </div>
                    <div className="goal-actions">
                      <button 
                        className="progress-btn minus" 
                        onClick={() => updateProgress(goal.id, -1)}
                        disabled={goal.progress <= 0}
                      >
                        −
                      </button>
                      <button 
                        className="progress-btn plus" 
                        onClick={() => updateProgress(goal.id, 1)}
                      >
                        +
                      </button>
                      <button 
                        className="delete-btn" 
                        onClick={() => deleteGoal(goal.id)}
                      >
                        🗑️
                      </button>
                    </div>
                  </div>
                );
              })}
            </div>
          </section>
        )}

        {completedGoals.length > 0 && (
          <section className="goals-section completed-section">
            <h2>🏆 Completed Goals</h2>
            <div className="goals-list">
              {completedGoals.map((goal) => (
                <div key={goal.id} className="goal-card completed">
                  <div className="goal-icon">{getTypeIcon(goal.type)}</div>
                  <div className="goal-content">
                    <h4 className="goal-title">{goal.title}</h4>
                    <div className="goal-progress-info">
                      <span className="completed-badge">✅ Completed!</span>
                    </div>
                  </div>
                  <button 
                    className="delete-btn" 
                    onClick={() => deleteGoal(goal.id)}
                  >
                    🗑️
                  </button>
                </div>
              ))}
            </div>
          </section>
        )}

        {goals.length === 0 && !showForm && (
          <div className="empty-goals">
            <span className="empty-icon">🌱</span>
            <h3>Start Your Journey</h3>
            <p>Set your first wellness goal and begin tracking your mindfulness progress.</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default Goals;
