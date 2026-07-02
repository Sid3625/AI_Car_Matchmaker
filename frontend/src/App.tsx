import { useState, useEffect } from 'react';
import Landing from './components/Landing';
import Questionnaire from './components/Questionnaire';
import ShortlistDashboard from './components/ShortlistDashboard';
import { UserPreferences, RecommendationResult } from './types';
import { fetchRecommendations } from './services/api';

type AppState = 'landing' | 'questionnaire' | 'loading' | 'results' | 'error';

function App() {
  const [state, setState] = useState<AppState>('landing');
  const [prefs, setPrefs] = useState<UserPreferences | null>(null);
  const [results, setResults] = useState<RecommendationResult[]>([]);
  const [errorMsg, setErrorMsg] = useState<string>('');
  const [backendOnline, setBackendOnline] = useState<boolean | null>(null);

  // Check backend health status on mount
  useEffect(() => {
    fetch('/api/health')
      .then(res => {
        if (res.ok) setBackendOnline(true);
        else setBackendOnline(false);
      })
      .catch(() => setBackendOnline(false));
  }, []);

  const handleStartQuiz = () => {
    setState('questionnaire');
  };

  const handleQuizSubmit = async (selectedPrefs: UserPreferences) => {
    setPrefs(selectedPrefs);
    setState('loading');
    try {
      const data = await fetchRecommendations(selectedPrefs);
      setResults(data);
      setState('results');
    } catch (err: any) {
      console.error(err);
      setErrorMsg(err.message || 'Failed to generate recommendations. Please try again.');
      setState('error');
    }
  };

  const handleReset = () => {
    setPrefs(null);
    setResults([]);
    setState('landing');
  };

  return (
    <div className="main-viewport">
      {/* Global Brand Header */}
      <header className="global-header">
        <div className="header-brand" onClick={handleReset}>
          <span className="brand-logo">🚗</span>
          <span className="brand-name">AI Car Matchmaker</span>
        </div>
        <div className="connection-status">
          {backendOnline === null && <span className="conn-dot loading"></span>}
          {backendOnline === true && <span className="conn-dot online" title="Backend Connected"></span>}
          {backendOnline === false && <span className="conn-dot offline" title="Backend Disconnected"></span>}
          <span className="conn-text">
            {backendOnline === true ? 'API Active' : 'Connecting...'}
          </span>
        </div>
      </header>

      {/* Main Page Area */}
      <main className="content-area">
        {state === 'landing' && <Landing onStart={handleStartQuiz} />}

        {state === 'questionnaire' && (
          <Questionnaire onSubmit={handleQuizSubmit} onBackToLanding={handleReset} />
        )}

        {state === 'loading' && (
          <div className="loader-container">
            <div className="spinner"></div>
            <h3>Analyzing Vehicle Specifications...</h3>
            <p>Matching parameters and compiling your shortlist.</p>
          </div>
        )}

        {state === 'results' && prefs && (
          <ShortlistDashboard results={results} prefs={prefs} onReset={handleReset} />
        )}

        {state === 'error' && (
          <div className="error-screen">
            <span className="error-icon">⚠️</span>
            <h2>Matchmaking Error</h2>
            <p>{errorMsg}</p>
            <button className="btn-primary" onClick={handleReset}>
              Return to Home
            </button>
          </div>
        )}
      </main>
    </div>
  );
}

export default App;
