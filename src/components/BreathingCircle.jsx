import React from 'react';
import './BreathingCircle.css';

const BreathingCircle = ({ mode, isActive, phase, progress }) => {
  const getPhaseText = () => {
    if (!isActive) return 'Ready';
    switch (phase) {
      case 'inhale':
        return 'Inhale';
      case 'hold':
        return 'Hold';
      case 'exhale':
        return 'Exhale';
      case 'pause':
        return 'Pause';
      default:
        return '';
    }
  };

  const getCircleScale = () => {
    if (!isActive) return 0.7;
    if (phase === 'inhale' || phase === 'hold') {
      return 0.7 + progress * 0.3;
    } else if (phase === 'exhale' || phase === 'pause') {
      return 1 - progress * 0.3;
    }
    return 0.7;
  };

  return (
    <div className="breathing-container">
      <div
        className={`breathing-circle ${isActive ? 'active' : ''} ${phase}`}
        style={{
          transform: `scale(${getCircleScale()})`,
          '--progress': progress,
        }}
      >
        <div className="circle-inner">
          <div className="phase-text">{getPhaseText()}</div>
          {isActive && <div className="progress-indicator">{Math.round(progress * 100)}%</div>}
        </div>
      </div>

      {/* Floating particles */}
      {isActive && (
        <div className="particles">
          {Array.from({ length: 5 }).map((_, i) => (
            <div
              key={i}
              className="particle"
              style={{
                '--delay': `${i * 0.2}s`,
                '--x': `${Math.cos((i / 5) * Math.PI * 2) * 100}px`,
                '--y': `${Math.sin((i / 5) * Math.PI * 2) * 100}px`,
              }}
            />
          ))}
        </div>
      )}
    </div>
  );
};

export default BreathingCircle;
