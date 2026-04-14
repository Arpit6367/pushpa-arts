'use client';
import { useState } from 'react';
import { useRouter } from 'next/navigation';

export default function AdminLoginPage() {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      const res = await fetch('/api/admin/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ username, password }),
      });

      const data = await res.json();

      if (res.ok) {
        router.push('/admin');
      } else {
        setError(data.error || 'Login failed');
      }
    } catch {
      setError('Something went wrong');
    }
    setLoading(false);
  };

  return (
    <div className="admin-login">
      <div className="admin-login-card">
        <img src="/images/Pushpa-Exports.svg" alt="Pushpa Arts" style={{ height: '140px', width: 'auto', marginBottom: '1.5rem', display: 'block', margin: '0 auto 1.5rem' }} />
        <p className="subtitle">Administration Access</p>
        
        {error && <div className="error">{error}</div>}
        
        <form onSubmit={handleSubmit}>
          <div className="form-group" style={{ textAlign: 'left' }}>
            <label htmlFor="admin-username">Username</label>
            <input
              id="admin-username"
              type="text"
              className="form-input"
              value={username}
              onChange={e => setUsername(e.target.value)}
              required
              autoFocus
            />
          </div>
          <div className="form-group" style={{ textAlign: 'left' }}>
            <label htmlFor="admin-password">Password</label>
            <input
              id="admin-password"
              type="password"
              className="form-input"
              value={password}
              onChange={e => setPassword(e.target.value)}
              required
            />
          </div>
          <button 
            type="submit" 
            className="btn btn-primary" 
            style={{ width: '100%', justifyContent: 'center' }}
            disabled={loading}
          >
            {loading ? 'Logging in...' : 'Login'}
          </button>
        </form>
      </div>
    </div>
  );
}
