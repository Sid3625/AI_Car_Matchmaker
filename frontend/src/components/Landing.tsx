import { useState } from 'react';

interface LandingProps {
  onStart: () => void;
  onAISearch: (query: string) => Promise<void>;
  aiLoading: boolean;
}

export default function Landing({ onStart, onAISearch, aiLoading }: LandingProps) {
  const [query, setQuery] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (query.trim().length >= 5) {
      onAISearch(query.trim());
    }
  };

  return (
    <div className="landing-container">
      <div className="badge-glow">🌟 AI-POWERED RECOMMENDATIONS</div>
      <h1 className="hero-title">
        Find Your Perfect Car <span className="gradient-text">Without the Jargon</span>
      </h1>
      <p className="hero-subtitle">
        Skip browsing hundreds of generic listings. Answer a few lifestyle questions or search using natural language below.
      </p>

      {/* AI Query Input */}
      <form onSubmit={handleSubmit} className="ai-search-form">
        <input
          type="text"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          placeholder="e.g. Safe automatic SUV for family trips within 15 lakhs..."
          className="ai-search-input"
          disabled={aiLoading}
          required
        />
        <button 
          type="submit" 
          className="ai-search-button" 
          disabled={aiLoading || query.trim().length < 5}
        >
          {aiLoading ? 'Parsing...' : 'Analyze Prompt 🔮'}
        </button>
      </form>

      <div className="divider-row">
        <span className="divider-line"></span>
        <span className="divider-text">OR TAKE THE STEP-BY-STEP QUIZ</span>
        <span className="divider-line"></span>
      </div>

      <button className="cta-button" onClick={onStart} disabled={aiLoading}>
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
