import React from 'react';

interface LandingProps {
  onStart: () => void;
}

export default function Landing({ onStart }: LandingProps) {
  return (
    <div className="landing-container">
      <div className="badge-glow">🌟 AI-POWERED RECOMMENDATIONS</div>
      <h1 className="hero-title">
        Find Your Perfect Car <span className="gradient-text">Without the Jargon</span>
      </h1>
      <p className="hero-subtitle">
        Skip browsing hundreds of generic listings. Answer a few lifestyle questions to discover your personalized, mathematically-ranked shortlist of top 3 cars.
      </p>

      <button className="cta-button" onClick={onStart}>
        Start Matchmaking Quiz
        <span className="arrow">→</span>
      </button>

      <div className="stats-row">
        <div className="stat-card">
          <span className="stat-num">50+</span>
          <span className="stat-label">Indian Market Cars</span>
        </div>
        <div className="stat-card">
          <span className="stat-num">5</span>
          <span className="stat-label">Lifestyle Dimensions</span>
        </div>
        <div className="stat-card">
          <span className="stat-num">100%</span>
          <span className="stat-label">Jargon-Free Scoring</span>
        </div>
      </div>
    </div>
  );
}
