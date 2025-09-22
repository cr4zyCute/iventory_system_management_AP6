import { useState, useEffect } from 'react';
import { testConnection } from './api/api';
import './App.css';

function App() {
  const [backendMessage, setBackendMessage] = useState('');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    const checkBackend = async () => {
      try {
        const data = await testConnection();
        setBackendMessage(data.message);
        setError('');
      } catch (err) {
        setError('Failed to connect to the backend. Make sure your backend server is running.');
        console.error('Backend connection error:', err);
      } finally {
        setLoading(false);
      }
    };

    checkBackend();
  }, []);

  return (
    <div className="app">
      <h1>Inventory System</h1>
      
      <div className="status">
        <h2>Connection Status</h2>
        {loading ? (
          <p>Connecting to backend...</p>
        ) : error ? (
          <p className="error">{error}</p>
        ) : (
          <p className="success">✅ {backendMessage}</p>
        )}
      </div>

      <div className="content">
        <h2>Welcome to the Inventory System</h2>
        <p>Your frontend is now connected to the backend!</p>
      </div>
    </div>
  );
}

export default App;
