import React, { useState } from 'react';
import { login } from '../api/api';

const Login: React.FC = () => {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setSuccess('');
    setLoading(true);
    try {
      const res = await login({ username, password });
      setSuccess(res.message || 'Logged in successfully');
      // TODO: Store token or user info if backend returns it
    } catch (err: any) {
      const msg = err?.message || 'Login failed';
      setError(msg);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', minHeight: '80vh' }}>
      <form onSubmit={handleSubmit} style={{ width: 320, padding: 24, border: '1px solid #ddd', borderRadius: 8, background: '#fff' }}>
        <h2 style={{ marginTop: 0, marginBottom: 16 }}>Login</h2>
        {error && (
          <div style={{ background: '#fde8e8', color: '#c0392b', padding: '8px 12px', borderRadius: 4, marginBottom: 12 }}>
            {error}
          </div>
        )}
        {success && (
          <div style={{ background: '#e8f5e9', color: '#2e7d32', padding: '8px 12px', borderRadius: 4, marginBottom: 12 }}>
            {success}
          </div>
        )}
        <div style={{ marginBottom: 12 }}>
          <label htmlFor="username" style={{ display: 'block', marginBottom: 6 }}>Username</label>
          <input
            id="username"
            type="text"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            required
            style={{ width: '100%', padding: 10, borderRadius: 4, border: '1px solid #ccc' }}
          />
        </div>
        <div style={{ marginBottom: 16 }}>
          <label htmlFor="password" style={{ display: 'block', marginBottom: 6 }}>Password</label>
          <input
            id="password"
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
            style={{ width: '100%', padding: 10, borderRadius: 4, border: '1px solid #ccc' }}
          />
        </div>
        <button type="submit" disabled={loading} style={{ width: '100%', padding: 10, borderRadius: 4, border: 'none', background: '#4a90e2', color: '#fff', cursor: 'pointer' }}>
          {loading ? 'Logging in...' : 'Login'}
        </button>
      </form>
    </div>
  );
};

export default Login;
