import React, { useState, useEffect } from 'react';
import useTheme from '../hooks/useTheme';
import './AnimatedQuotes.css';

const AnimatedQuotes = () => {
  const { theme } = useTheme();
  const [currentQuote, setCurrentQuote] = useState(0);
  const [isAnimating, setIsAnimating] = useState(false);

  const quotes = [
    { text: "Breathe in peace, breathe out stress.", author: "Anonymous", emoji: "🌬️" },
    { text: "The present moment is filled with joy and happiness. If you are attentive, you will see it.", author: "Thich Nhat Hanh", emoji: "🌸" },
    { text: "Within you, there is a stillness and a sanctuary to which you can retreat at any time.", author: "Hermann Hesse", emoji: "🏔️" },
    { text: "Mindfulness is a way of befriending ourselves and our experience.", author: "Jon Kabat-Zinn", emoji: "💫" },
    { text: "The mind is everything. What you think you become.", author: "Buddha", emoji: "🧠" },
    { text: "Feelings come and go like clouds in a windy sky. Conscious breathing is my anchor.", author: "Thich Nhat Hanh", emoji: "☁️" },
    { text: "Peace comes from within. Do not seek it without.", author: "Buddha", emoji: "☮️" },
    { text: "In today's rush, we all think too much, seek too much, want too much. Give yourself a break.", author: "Unknown", emoji: "🌿" },
    { text: "You are the sky. Everything else is just the weather.", author: "Pema Chödrön", emoji: "🌤️" },
    { text: "Almost everything will work again if you unplug it for a few minutes, including you.", author: "Anne Lamott", emoji: "🔌" },
    { text: "Quiet the mind, and the soul will speak.", author: "Ma Jaya Sati Bhagavati", emoji: "🕊️" },
    { text: "Each morning we are born again. What we do today matters most.", author: "Buddha", emoji: "🌅" }
  ];

  useEffect(() => {
    const interval = setInterval(() => {
      nextQuote();
    }, 8000);
    return () => clearInterval(interval);
  }, [currentQuote]);

  const nextQuote = () => {
    setIsAnimating(true);
    setTimeout(() => {
      setCurrentQuote((prev) => (prev + 1) % quotes.length);
      setIsAnimating(false);
    }, 500);
  };

  const prevQuote = () => {
    setIsAnimating(true);
    setTimeout(() => {
      setCurrentQuote((prev) => (prev - 1 + quotes.length) % quotes.length);
      setIsAnimating(false);
    }, 500);
  };

  const goToQuote = (index) => {
    if (index !== currentQuote) {
      setIsAnimating(true);
      setTimeout(() => {
        setCurrentQuote(index);
        setIsAnimating(false);
      }, 500);
    }
  };

  return (
    <div className={`animated-quotes ${theme}`}>
      <div className="quotes-bg">
        <div className="quote-blob blob-1"></div>
        <div className="quote-blob blob-2"></div>
        <div className="quote-blob blob-3"></div>
        <div className="floating-elements">
          <span className="float-element">✨</span>
          <span className="float-element">🌟</span>
          <span className="float-element">💫</span>
          <span className="float-element">⭐</span>
        </div>
      </div>

      <div className="quotes-container">
        <header className="quotes-header">
          <h1>💭 Daily Inspiration</h1>
          <p>Words of wisdom for your mindfulness journey</p>
        </header>

        <div className="quote-card-wrapper">
          <button className="nav-btn prev" onClick={prevQuote}>
            <span>‹</span>
          </button>

          <div className={`quote-card ${isAnimating ? 'fade-out' : 'fade-in'}`}>
            <div className="quote-emoji">{quotes[currentQuote].emoji}</div>
            <blockquote className="quote-text">
              "{quotes[currentQuote].text}"
            </blockquote>
            <cite className="quote-author">— {quotes[currentQuote].author}</cite>
          </div>

          <button className="nav-btn next" onClick={nextQuote}>
            <span>›</span>
          </button>
        </div>

        <div className="quote-dots">
          {quotes.map((_, idx) => (
            <button
              key={idx}
              className={`dot ${idx === currentQuote ? 'active' : ''}`}
              onClick={() => goToQuote(idx)}
            />
          ))}
        </div>

        <div className="quote-actions">
          <button className="action-btn share">
            <span>📤</span> Share
          </button>
          <button className="action-btn save">
            <span>💾</span> Save
          </button>
          <button className="action-btn copy" onClick={() => {
            navigator.clipboard.writeText(`"${quotes[currentQuote].text}" — ${quotes[currentQuote].author}`);
          }}>
            <span>📋</span> Copy
          </button>
        </div>

        <div className="quote-tip">
          <span className="tip-icon">💡</span>
          <p>Take a moment to reflect on this quote. How does it relate to your journey today?</p>
        </div>
      </div>
    </div>
  );
};

export default AnimatedQuotes;
