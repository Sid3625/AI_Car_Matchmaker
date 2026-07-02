import { useState, useEffect } from 'react';
import Landing from './components/Landing';
import Questionnaire from './components/Questionnaire';
import ShortlistDashboard from './components/ShortlistDashboard';
import { UserPreferences, RecommendationResult } from './types';
import { fetchRecommendations, parseQueryToPrefs } from './services/api';

type AppState = 'landing' | 'questionnaire' | 'loading' | 'results' | 'error';

function App() {
  const [state, setState] = useState<AppState>('landing');
  const [prefs, setPrefs] = useState<UserPreferences | null>(null);
  const [aiParsedPrefs, setAiParsedPrefs] = useState<UserPreferences | null>(null);
  const [aiLoading, setAiLoading] = useState<boolean>(false);
  const [results, setResults] = useState<RecommendationResult[]>([]);
  const [errorMsg, setErrorMsg] = useState<string>('');
  const [backendOnline, setBackendOnline] = useState<boolean | null>(null);
  const [aiNotification, setAiNotification] = useState<string | null>(null);

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
    setAiParsedPrefs(null);
    setState('questionnaire');
  };

  const handleAISearch = async (query: string) => {
    setAiLoading(true);
    setAiNotification(null);
    try {
      const parsed = await parseQueryToPrefs(query);
      setAiParsedPrefs(parsed);
      setState('questionnaire');
    } catch (err: any) {
      console.error('AI Parsing failed:', err);
      setAiNotification('⚠️ AI search failed or API key missing. Let\'s do it manually instead!');
      setAiParsedPrefs(null);
      setState('questionnaire');
    } finally {
      setAiLoading(false);
    }
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
    setAiParsedPrefs(null);
    setResults([]);
    setAiNotification(null);
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

      {/* Dynamic Notifications */}
      {aiNotification && (
        <div className="global-notification" onClick={() => setAiNotification(null)}>
          {aiNotification}
          <span className="close-notif">×</span>
        </div>
      )}

      {/* Main Page Area */}
      <main className="content-area">
        {state === 'landing' && (
          <Landing 
            onStart={handleStartQuiz} 
            onAISearch={handleAISearch} 
            aiLoading={aiLoading} 
          />
        )}

        {state === 'questionnaire' && (
          <Questionnaire 
            onSubmit={handleQuizSubmit} 
            onBackToLanding={handleReset} 
            initialPrefs={aiParsedPrefs}
          />
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
