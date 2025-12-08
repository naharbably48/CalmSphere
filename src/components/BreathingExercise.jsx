import React, { useState, useEffect } from 'react';
import './BreathingExercise.css';
import BreathingCircle from './BreathingCircle';
import { breathingModes, soundscapes } from '../utils/constants';
import { sessionService } from '../services/api';
import useTheme from '../hooks/useTheme';

const BreathingExercise = () => {
  const { theme } = useTheme();
  const [selectedMode, setSelectedMode] = useState('Relax');
  const [duration, setDuration] = useState(1);
  const [selectedSound, setSelectedSound] = useState('None');
  const [isActive, setIsActive] = useState(false);
  const [timeRemaining, setTimeRemaining] = useState(0);
  const [phase, setPhase] = useState('inhale');
  const [progress, setProgress] = useState(0);
  const [showAnimation, setShowAnimation] = useState(true);
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState('');

  const mode = breathingModes[selectedMode];
  const totalCycleDuration = mode.inhale + mode.hold + mode.exhale + mode.pause;

  // Breathing cycle effect
  useEffect(() => {
    if (!isActive || timeRemaining === 0) return;

    const timer = setInterval(() => {
      setTimeRemaining((prev) => {
        if (prev <= 0.1) {
          setIsActive(false);
          saveSession();
          return 0;
        }
        return prev - 0.1;
      });
    }, 100);

    return () => clearInterval(timer);
  }, [isActive, timeRemaining]);

  // Phase cycle effect
  useEffect(() => {
    if (!isActive) {
      setPhase('inhale');
      setProgress(0);
      return;
    }

    const elapsedSeconds = duration * 60 - timeRemaining;
    const cyclePosition = elapsedSeconds % totalCycleDuration;
    let currentPhase = 'inhale';
    let phaseProgress = 0;

    if (cyclePosition < mode.inhale) {
      currentPhase = 'inhale';
      phaseProgress = cyclePosition / mode.inhale;
    } else if (cyclePosition < mode.inhale + mode.hold) {
      currentPhase = 'hold';
      phaseProgress = (cyclePosition - mode.inhale) / mode.hold;
    } else if (cyclePosition < mode.inhale + mode.hold + mode.exhale) {
      currentPhase = 'exhale';
      phaseProgress = (cyclePosition - mode.inhale - mode.hold) / mode.exhale;
    } else {
      currentPhase = 'pause';
      phaseProgress = (cyclePosition - mode.inhale - mode.hold - mode.exhale) / mode.pause;
    }

    setPhase(currentPhase);
    setProgress(phaseProgress);
  }, [isActive, timeRemaining, duration, mode, totalCycleDuration]);

  const handleStart = () => {
    setTimeRemaining(duration * 60);
    setIsActive(true);
    setMessage('');
  };

  const handleStop = () => {
    setIsActive(false);
    setTimeRemaining(0);
  };

  const saveSession = async () => {
    try {
      setLoading(true);
      await sessionService.createSession(
        selectedMode,
        duration,
        selectedSound,
        `${selectedMode} breathing for ${duration} minutes`
      );
      setMessage('✓ Session saved successfully!');
    } catch (error) {
      setMessage('Failed to save session');
    } finally {
      setLoading(false);
    }
  };

  const formatTime = (seconds) => {
    const mins = Math.floor(seconds / 60);
    const secs = Math.floor(seconds % 60);
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };

  return (
    <div className={`breathing-exercise ${theme}`}>
      <div className="breathing-header">
        <h1>Guided Breathing Exercise</h1>
        <p>Choose your breathing mode and relax</p>
      </div>

      {/* Animated Background */}
      <div className={`breathing-bg ${showAnimation ? 'active' : ''}`}>
        <div className="gradient-blob blob-1"></div>
        <div className="gradient-blob blob-2"></div>
        <div className="gradient-blob blob-3"></div>
      </div>

      <div className="breathing-content">
        <BreathingCircle
          mode={selectedMode}
          isActive={isActive}
          phase={phase}
          progress={progress}
        />

        {isActive && (
          <div className="timer-display">
            <h2>{formatTime(timeRemaining)}</h2>
          </div>
        )}

        {/* Mode Selection */}
        <div className="modes-section">
          <h3>Breathing Modes</h3>
          <div className="modes-grid">
            {Object.entries(breathingModes).map(([key, modeData]) => (
              <button
                key={key}
                className={`mode-btn ${selectedMode === key ? 'active' : ''} ${
                  isActive ? 'disabled' : ''
                }`}
                onClick={() => setSelectedMode(key)}
                disabled={isActive}
                title={modeData.description}
              >
                <span className="mode-name">{modeData.name}</span>
                <span className="mode-info">
                  {modeData.inhale}-{modeData.hold}-{modeData.exhale}
                </span>
              </button>
            ))}
          </div>
        </div>

        {/* Duration Selection */}
        <div className="duration-section">
          <h3>Duration</h3>
          <div className="duration-grid">
            {[1, 3, 5, 10].map((min) => (
              <button
                key={min}
                className={`duration-btn ${duration === min ? 'active' : ''} ${
                  isActive ? 'disabled' : ''
                }`}
                onClick={() => setDuration(min)}
                disabled={isActive}
              >
                {min} min
              </button>
            ))}
          </div>
        </div>

        {/* Soundscape Selection */}
        <div className="soundscape-section">
          <h3>Soundscape</h3>
          <div className="soundscape-grid">
            {soundscapes.map((sound) => (
              <button
                key={sound.name}
                className={`sound-btn ${selectedSound === sound.name ? 'active' : ''} ${
                  isActive ? 'disabled' : ''
                }`}
                onClick={() => setSelectedSound(sound.name)}
                disabled={isActive}
                title={sound.name}
              >
                <span className="sound-icon">{sound.icon}</span>
                <span className="sound-name">{sound.name}</span>
              </button>
            ))}
          </div>
        </div>

        {/* Animation Toggle */}
        <div className="animation-toggle">
          <label>
            <input
              type="checkbox"
              checked={showAnimation}
              onChange={(e) => setShowAnimation(e.target.checked)}
              disabled={isActive}
            />
            <span>Show animations</span>
          </label>
        </div>

        {/* Control Buttons */}
        <div className="control-buttons">
          {!isActive ? (
            <button
              className="btn btn-start"
              onClick={handleStart}
              disabled={loading || timeRemaining > 0}
            >
              {timeRemaining > 0 ? 'Session Complete' : 'Start'}
            </button>
          ) : (
            <button className="btn btn-stop" onClick={handleStop}>
              Stop
            </button>
          )}
        </div>

        {message && <div className="message">{message}</div>}
      </div>
    </div>
  );
};

export default BreathingExercise;
