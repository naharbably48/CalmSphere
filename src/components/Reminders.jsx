import React, { useState, useEffect } from 'react';
import useTheme from '../hooks/useTheme';
import './Reminders.css';

const Reminders = () => {
  const { theme } = useTheme();
  const [reminders, setReminders] = useState([]);
  const [newReminder, setNewReminder] = useState({
    title: '',
    time: '09:00',
    days: [],
    type: 'meditation',
    enabled: true
  });
  const [showForm, setShowForm] = useState(false);

  const reminderTypes = [
    { value: 'meditation', icon: '🧘', label: 'Meditation' },
    { value: 'breathing', icon: '💨', label: 'Breathing' },
    { value: 'journal', icon: '📝', label: 'Journal' },
    { value: 'hydrate', icon: '💧', label: 'Hydrate' },
    { value: 'stretch', icon: '🤸', label: 'Stretch' },
    { value: 'gratitude', icon: '🙏', label: 'Gratitude' }
  ];

  const weekDays = [
    { value: 'sun', label: 'S' },
    { value: 'mon', label: 'M' },
    { value: 'tue', label: 'T' },
    { value: 'wed', label: 'W' },
    { value: 'thu', label: 'T' },
    { value: 'fri', label: 'F' },
    { value: 'sat', label: 'S' }
  ];

  useEffect(() => {
    const savedReminders = localStorage.getItem('mindfulReminders');
    if (savedReminders) {
      setReminders(JSON.parse(savedReminders));
    }
  }, []);

  const toggleDay = (day) => {
    setNewReminder(prev => ({
      ...prev,
      days: prev.days.includes(day) 
        ? prev.days.filter(d => d !== day)
        : [...prev.days, day]
    }));
  };

  const saveReminder = () => {
    if (!newReminder.title.trim() || newReminder.days.length === 0) return;

    const reminder = {
      id: Date.now(),
      ...newReminder,
      createdAt: new Date().toISOString()
    };

    const updatedReminders = [reminder, ...reminders];
    setReminders(updatedReminders);
    localStorage.setItem('mindfulReminders', JSON.stringify(updatedReminders));
    
    setNewReminder({
      title: '',
      time: '09:00',
      days: [],
      type: 'meditation',
      enabled: true
    });
    setShowForm(false);
  };

  const toggleReminder = (id) => {
    const updatedReminders = reminders.map(r => 
      r.id === id ? { ...r, enabled: !r.enabled } : r
    );
    setReminders(updatedReminders);
    localStorage.setItem('mindfulReminders', JSON.stringify(updatedReminders));
  };

  const deleteReminder = (id) => {
    const updatedReminders = reminders.filter(r => r.id !== id);
    setReminders(updatedReminders);
    localStorage.setItem('mindfulReminders', JSON.stringify(updatedReminders));
  };

  const getTypeIcon = (type) => {
    const found = reminderTypes.find(t => t.value === type);
    return found ? found.icon : '🔔';
  };

  const formatTime = (time) => {
    const [hours, minutes] = time.split(':');
    const h = parseInt(hours);
    const ampm = h >= 12 ? 'PM' : 'AM';
    const hour = h % 12 || 12;
    return `${hour}:${minutes} ${ampm}`;
  };

  const getDaysString = (days) => {
    if (days.length === 7) return 'Every day';
    if (days.length === 5 && !days.includes('sat') && !days.includes('sun')) return 'Weekdays';
    if (days.length === 2 && days.includes('sat') && days.includes('sun')) return 'Weekends';
    return days.map(d => d.charAt(0).toUpperCase() + d.slice(1, 3)).join(', ');
  };

  return (
    <div className={`reminders ${theme}`}>
      <div className="reminders-bg">
        <div className="reminder-blob blob-1"></div>
        <div className="reminder-blob blob-2"></div>
      </div>

      <div className="reminders-container">
        <header className="reminders-header">
          <h1>⏰ Mindful Reminders</h1>
          <p>Build healthy habits with gentle nudges</p>
        </header>

        {!showForm ? (
          <button className="add-reminder-btn" onClick={() => setShowForm(true)}>
            <span>🔔</span> Create New Reminder
          </button>
        ) : (
          <div className="reminder-form-card">
            <div className="form-header">
              <h3>New Reminder</h3>
              <button className="close-btn" onClick={() => setShowForm(false)}>×</button>
            </div>

            <div className="form-group">
              <label>Reminder Name</label>
              <input
                type="text"
                value={newReminder.title}
                onChange={(e) => setNewReminder({...newReminder, title: e.target.value})}
                placeholder="e.g., Morning meditation"
                className="reminder-input"
              />
            </div>

            <div className="form-group">
              <label>Type</label>
              <div className="type-grid">
                {reminderTypes.map((type) => (
                  <button
                    key={type.value}
                    className={`type-option ${newReminder.type === type.value ? 'active' : ''}`}
                    onClick={() => setNewReminder({...newReminder, type: type.value})}
                  >
                    <span className="type-icon">{type.icon}</span>
                    <span className="type-label">{type.label}</span>
                  </button>
                ))}
              </div>
            </div>

            <div className="form-row">
              <div className="form-group">
                <label>Time</label>
                <input
                  type="time"
                  value={newReminder.time}
                  onChange={(e) => setNewReminder({...newReminder, time: e.target.value})}
                  className="reminder-input time-input"
                />
              </div>
            </div>

            <div className="form-group">
              <label>Repeat On</label>
              <div className="days-selector">
                {weekDays.map((day) => (
                  <button
                    key={day.value}
                    className={`day-btn ${newReminder.days.includes(day.value) ? 'active' : ''}`}
                    onClick={() => toggleDay(day.value)}
                  >
                    {day.label}
                  </button>
                ))}
              </div>
              <div className="quick-select">
                <button onClick={() => setNewReminder({...newReminder, days: weekDays.map(d => d.value)})}>
                  Every day
                </button>
                <button onClick={() => setNewReminder({...newReminder, days: ['mon', 'tue', 'wed', 'thu', 'fri']})}>
                  Weekdays
                </button>
                <button onClick={() => setNewReminder({...newReminder, days: ['sat', 'sun']})}>
                  Weekends
                </button>
              </div>
            </div>

            <button className="save-reminder-btn" onClick={saveReminder}>
              <span>✨</span> Save Reminder
            </button>
          </div>
        )}

        {reminders.length > 0 && (
          <section className="reminders-list-section">
            <h2>Your Reminders</h2>
            <div className="reminders-list">
              {reminders.map((reminder) => (
                <div key={reminder.id} className={`reminder-card ${!reminder.enabled ? 'disabled' : ''}`}>
                  <div className="reminder-icon">{getTypeIcon(reminder.type)}</div>
                  <div className="reminder-content">
                    <h4 className="reminder-title">{reminder.title}</h4>
                    <div className="reminder-details">
                      <span className="reminder-time">🕐 {formatTime(reminder.time)}</span>
                      <span className="reminder-days">📅 {getDaysString(reminder.days)}</span>
                    </div>
                  </div>
                  <div className="reminder-actions">
                    <label className="toggle-switch">
                      <input
                        type="checkbox"
                        checked={reminder.enabled}
                        onChange={() => toggleReminder(reminder.id)}
                      />
                      <span className="toggle-slider"></span>
                    </label>
                    <button className="delete-btn" onClick={() => deleteReminder(reminder.id)}>
                      🗑️
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </section>
        )}

        {reminders.length === 0 && !showForm && (
          <div className="empty-reminders">
            <span className="empty-icon">🔔</span>
            <h3>No Reminders Yet</h3>
            <p>Create reminders to help build your mindfulness routine and never miss a session.</p>
          </div>
        )}

        <div className="reminder-tip">
          <span className="tip-icon">💡</span>
          <div className="tip-content">
            <strong>Pro Tip:</strong> Start with just one daily reminder and gradually add more as the habit becomes natural.
          </div>
        </div>
      </div>
    </div>
  );
};

export default Reminders;
