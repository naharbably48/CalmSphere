import React, { useState, useEffect } from 'react';
import useTheme from '../hooks/useTheme';
import { Line, Doughnut } from 'react-chartjs-2';
import './WeeklyReport.css';

const WeeklyReport = ({ stats = {} }) => {
  const { theme } = useTheme();
  const [weekData, setWeekData] = useState({
    meditation: [15, 20, 0, 30, 25, 10, 20],
    breathing: [3, 2, 4, 3, 5, 2, 4],
    moods: [3, 4, 3, 5, 4, 4, 5]
  });

  const days = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'];

  const getTotalMinutes = () => weekData.meditation.reduce((a, b) => a + b, 0);
  const getTotalSessions = () => weekData.breathing.reduce((a, b) => a + b, 0);
  const getAvgMood = () => (weekData.moods.reduce((a, b) => a + b, 0) / 7).toFixed(1);
  
  const getWeeklyGoalProgress = () => {
    const goal = 150; // 150 minutes weekly goal
    return Math.min(100, Math.round((getTotalMinutes() / goal) * 100));
  };

  const lineChartData = {
    labels: days,
    datasets: [
      {
        label: 'Meditation (min)',
        data: weekData.meditation,
        borderColor: '#667eea',
        backgroundColor: 'rgba(102, 126, 234, 0.1)',
        fill: true,
        tension: 0.4,
        pointBackgroundColor: '#667eea',
        pointBorderColor: '#fff',
        pointBorderWidth: 2,
        pointRadius: 6,
      },
      {
        label: 'Breathing Sessions',
        data: weekData.breathing.map(v => v * 5),
        borderColor: '#f093fb',
        backgroundColor: 'rgba(240, 147, 251, 0.1)',
        fill: true,
        tension: 0.4,
        pointBackgroundColor: '#f093fb',
        pointBorderColor: '#fff',
        pointBorderWidth: 2,
        pointRadius: 6,
      }
    ]
  };

  const lineChartOptions = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        position: 'top',
        labels: {
          usePointStyle: true,
          padding: 20,
          font: { size: 13, weight: '600' }
        }
      }
    },
    scales: {
      y: {
        beginAtZero: true,
        grid: { color: 'rgba(0,0,0,0.05)' },
        ticks: { font: { size: 12 } }
      },
      x: {
        grid: { display: false },
        ticks: { font: { size: 12, weight: '600' } }
      }
    }
  };

  const doughnutData = {
    labels: ['Completed', 'Remaining'],
    datasets: [{
      data: [getWeeklyGoalProgress(), 100 - getWeeklyGoalProgress()],
      backgroundColor: ['#667eea', 'rgba(0,0,0,0.1)'],
      borderWidth: 0,
      cutout: '75%'
    }]
  };

  const moodEmojis = ['😢', '😕', '😐', '🙂', '😊'];
  const getMoodTrend = () => {
    const firstHalf = weekData.moods.slice(0, 3).reduce((a, b) => a + b, 0) / 3;
    const secondHalf = weekData.moods.slice(4).reduce((a, b) => a + b, 0) / 3;
    if (secondHalf > firstHalf + 0.5) return { trend: 'up', text: 'Improving! 📈' };
    if (secondHalf < firstHalf - 0.5) return { trend: 'down', text: 'Keep going 💪' };
    return { trend: 'stable', text: 'Steady 🌟' };
  };

  const insights = [
    { icon: '🏆', title: 'Best Day', value: days[weekData.meditation.indexOf(Math.max(...weekData.meditation))] },
    { icon: '🔥', title: 'Active Days', value: `${weekData.meditation.filter(m => m > 0).length}/7` },
    { icon: '⚡', title: 'Avg Session', value: `${Math.round(getTotalMinutes() / weekData.meditation.filter(m => m > 0).length || 0)} min` },
    { icon: '💫', title: 'Mood Trend', value: getMoodTrend().text }
  ];

  return (
    <div className={`weekly-report ${theme}`}>
      <div className="report-bg">
        <div className="report-blob blob-1"></div>
        <div className="report-blob blob-2"></div>
      </div>

      <div className="report-container">
        <header className="report-header">
          <h1>📊 Weekly Progress</h1>
          <p>Your mindfulness journey this week</p>
        </header>

        <div className="summary-cards">
          <div className="summary-card">
            <div className="summary-icon">🧘</div>
            <div className="summary-content">
              <span className="summary-value">{getTotalMinutes()}</span>
              <span className="summary-label">Minutes Meditated</span>
            </div>
          </div>
          <div className="summary-card">
            <div className="summary-icon">💨</div>
            <div className="summary-content">
              <span className="summary-value">{getTotalSessions()}</span>
              <span className="summary-label">Breathing Sessions</span>
            </div>
          </div>
          <div className="summary-card">
            <div className="summary-icon">{moodEmojis[Math.round(getAvgMood()) - 1]}</div>
            <div className="summary-content">
              <span className="summary-value">{getAvgMood()}</span>
              <span className="summary-label">Avg Mood Score</span>
            </div>
          </div>
        </div>

        <div className="report-grid">
          <div className="chart-card main-chart">
            <h3>Activity Overview</h3>
            <div className="chart-container">
              <Line data={lineChartData} options={lineChartOptions} />
            </div>
          </div>

          <div className="chart-card goal-card">
            <h3>Weekly Goal</h3>
            <div className="goal-chart-container">
              <Doughnut data={doughnutData} options={{ 
                responsive: true, 
                maintainAspectRatio: false,
                plugins: { legend: { display: false } }
              }} />
              <div className="goal-center">
                <span className="goal-percentage">{getWeeklyGoalProgress()}%</span>
                <span className="goal-text">of 150 min</span>
              </div>
            </div>
          </div>
        </div>

        <div className="insights-grid">
          {insights.map((insight, idx) => (
            <div key={idx} className="insight-card">
              <span className="insight-icon">{insight.icon}</span>
              <span className="insight-title">{insight.title}</span>
              <span className="insight-value">{insight.value}</span>
            </div>
          ))}
        </div>

        <div className="mood-timeline">
          <h3>😊 Mood Timeline</h3>
          <div className="mood-days">
            {days.map((day, idx) => (
              <div key={day} className="mood-day">
                <span className="mood-emoji">{moodEmojis[weekData.moods[idx] - 1]}</span>
                <span className="day-label">{day}</span>
              </div>
            ))}
          </div>
        </div>

        <div className="motivation-card">
          <span className="motivation-icon">🌟</span>
          <div className="motivation-content">
            <h4>Keep It Up!</h4>
            <p>You've made great progress this week. Consistency is key to building lasting mindfulness habits.</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default WeeklyReport;
