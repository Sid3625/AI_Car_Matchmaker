import { useEffect, useState } from 'react';

interface HealthData {
  status: string;
  timestamp: string;
}

function App() {
  const [health, setHealth] = useState<HealthData | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  const checkHealth = async () => {
    setLoading(true);
    setError(null);
    try {
      const response = await fetch('/api/health');
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      const data = await response.json();
      setHealth(data);
    } catch (err: any) {
      console.error('Error fetching health status:', err);
      setError(err.message || 'Failed to connect to backend server');
      setHealth(null);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    checkHealth();
  }, []);

  return (
    <div className="app-container">
      <div className="card">
        <div className="logo-icon">🚗</div>
        <h1 className="title">AI Car Matchmaker</h1>
        <p className="subtitle">MVP Workspace Verification</p>

        {loading && (
          <div className="status-badge loading">
            <span className="pulse-dot"></span>
            Connecting to Backend...
          </div>
        )}

        {!loading && health && (
          <div>
            <div className="status-badge online">
              <span className="pulse-dot"></span>
              Backend Online
            </div>
            <div className="info-box">
              <div>Status: {health.status}</div>
              <div>Timestamp: {health.timestamp}</div>
              <div>Endpoint: /api/health</div>
            </div>
          </div>
        )}

        {!loading && error && (
          <div>
            <div className="status-badge offline">
              <span className="pulse-dot"></span>
              Connection Failed
            </div>
            <div className="info-box" style={{ color: 'var(--accent-error)' }}>
              Error: {error}
            </div>
            <button className="btn-retry" onClick={checkHealth}>
              Retry Connection
            </button>
          </div>
        )}
      </div>
    </div>
  );
}

export default App;
