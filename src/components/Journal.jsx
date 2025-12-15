import React, { useState, useEffect } from 'react';
import useTheme from '../hooks/useTheme';
import './Journal.css';

const Journal = () => {
  const { theme } = useTheme();
  const [entries, setEntries] = useState([]);
  const [newEntry, setNewEntry] = useState('');
  const [mood, setMood] = useState('neutral');
  const [gratitude, setGratitude] = useState('');
  const [selectedDate, setSelectedDate] = useState(new Date().toISOString().split('T')[0]);
  const [showForm, setShowForm] = useState(false);

  const moods = [
    { value: 'amazing', emoji: '🌟', label: 'Amazing' },
    { value: 'happy', emoji: '😊', label: 'Happy' },
    { value: 'neutral', emoji: '😐', label: 'Neutral' },
    { value: 'sad', emoji: '😢', label: 'Sad' },
    { value: 'stressed', emoji: '😰', label: 'Stressed' }
  ];

  const prompts = [
    "What made you smile today?",
    "What are you grateful for?",
    "What's one thing you learned today?",
    "How did you practice self-care?",
    "What's something you're looking forward to?",
    "Describe a moment of peace you experienced.",
    "What challenges did you overcome?",
    "How did you show kindness to yourself or others?"
  ];

  const [currentPrompt, setCurrentPrompt] = useState(prompts[0]);

  useEffect(() => {
    // Load entries from localStorage
    const savedEntries = localStorage.getItem('journalEntries');
    if (savedEntries) {
      setEntries(JSON.parse(savedEntries));
    }
    // Random prompt
    setCurrentPrompt(prompts[Math.floor(Math.random() * prompts.length)]);
  }, []);

  const saveEntry = () => {
    if (!newEntry.trim()) return;

    const entry = {
      id: Date.now(),
      date: selectedDate,
      content: newEntry,
      mood: mood,
      gratitude: gratitude,
      createdAt: new Date().toISOString()
    };

    const updatedEntries = [entry, ...entries];
    setEntries(updatedEntries);
    localStorage.setItem('journalEntries', JSON.stringify(updatedEntries));
    
    setNewEntry('');
    setGratitude('');
    setMood('neutral');
    setShowForm(false);
  };

  const deleteEntry = (id) => {
    const updatedEntries = entries.filter(entry => entry.id !== id);
    setEntries(updatedEntries);
    localStorage.setItem('journalEntries', JSON.stringify(updatedEntries));
  };

  const formatDate = (dateStr) => {
    const date = new Date(dateStr);
    return date.toLocaleDateString('en-US', { 
      weekday: 'long', 
      year: 'numeric', 
      month: 'long', 
      day: 'numeric' 
    });
  };

  const getMoodEmoji = (moodValue) => {
    const found = moods.find(m => m.value === moodValue);
    return found ? found.emoji : '😐';
  };

  return (
    <div className={`journal ${theme}`}>
      <div className="journal-bg">
        <div className="journal-blob blob-1"></div>
        <div className="journal-blob blob-2"></div>
      </div>

      <div className="journal-container">
        <header className="journal-header">
          <h1>📔 Mindful Journal</h1>
          <p>Reflect on your thoughts and feelings</p>
        </header>

        {!showForm ? (
          <div className="journal-prompt-card">
            <div className="prompt-icon">💭</div>
            <h3>Today's Reflection Prompt</h3>
            <p className="prompt-text">{currentPrompt}</p>
            <button className="start-writing-btn" onClick={() => setShowForm(true)}>
              <span>✍️</span> Start Writing
            </button>
          </div>
        ) : (
          <div className="journal-form-card">
            <div className="form-header">
              <h3>New Entry</h3>
              <button className="close-form-btn" onClick={() => setShowForm(false)}>×</button>
            </div>

            <div className="form-group">
              <label>📅 Date</label>
              <input 
                type="date" 
                value={selectedDate}
                onChange={(e) => setSelectedDate(e.target.value)}
                className="date-input"
              />
            </div>

            <div className="form-group">
              <label>How are you feeling?</label>
              <div className="mood-selector">
                {moods.map((m) => (
                  <button
                    key={m.value}
                    className={`mood-btn ${mood === m.value ? 'active' : ''}`}
                    onClick={() => setMood(m.value)}
                  >
                    <span className="mood-emoji">{m.emoji}</span>
                    <span className="mood-label">{m.label}</span>
                  </button>
                ))}
              </div>
            </div>

            <div className="form-group">
              <label>🙏 What are you grateful for?</label>
              <input
                type="text"
                value={gratitude}
                onChange={(e) => setGratitude(e.target.value)}
                placeholder="I'm grateful for..."
                className="gratitude-input"
              />
            </div>

            <div className="form-group">
              <label>📝 Your Thoughts</label>
              <textarea
                value={newEntry}
                onChange={(e) => setNewEntry(e.target.value)}
                placeholder={currentPrompt}
                className="journal-textarea"
                rows="6"
              />
            </div>

            <button className="save-entry-btn" onClick={saveEntry}>
              <span>💾</span> Save Entry
            </button>
          </div>
        )}

        <section className="entries-section">
          <h2>📚 Past Entries</h2>
          
          {entries.length === 0 ? (
            <div className="no-entries">
              <span className="no-entries-icon">📖</span>
              <p>Your journal is empty. Start writing your first entry!</p>
            </div>
          ) : (
            <div className="entries-list">
              {entries.map((entry) => (
                <div key={entry.id} className="entry-card">
                  <div className="entry-header">
                    <div className="entry-date-mood">
                      <span className="entry-mood">{getMoodEmoji(entry.mood)}</span>
                      <span className="entry-date">{formatDate(entry.date)}</span>
                    </div>
                    <button className="delete-entry-btn" onClick={() => deleteEntry(entry.id)}>
                      🗑️
                    </button>
                  </div>
                  
                  {entry.gratitude && (
                    <div className="entry-gratitude">
                      <span>🙏</span> {entry.gratitude}
                    </div>
                  )}
                  
                  <p className="entry-content">{entry.content}</p>
                </div>
              ))}
            </div>
          )}
        </section>
      </div>
    </div>
  );
};

export default Journal;
