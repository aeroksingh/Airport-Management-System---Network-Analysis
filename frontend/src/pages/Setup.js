import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';
import { authAPI } from '../services/api';

export default function Setup() {
  const [form, setForm] = useState({ name: '', email: '', password: '' });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [done, setDone] = useState(false);
  const navigate = useNavigate();

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
    setError('');
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    try {
      await authAPI.setup(form);
      toast.success('Admin account created! Redirecting to login...');
      setDone(true);
      setTimeout(() => navigate('/login'), 2000);
    } catch (err) {
      const msg = err.response?.data?.message || 'Setup failed. Please try again.';
      setError(msg);
      toast.error(msg);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={styles.page}>
      <div style={styles.container}>
        <div style={styles.iconWrap}>
          <span style={styles.icon}>🛫</span>
        </div>
        <h1 style={styles.title}>First-Time Setup</h1>
        <p style={styles.subtitle}>
          Create the initial administrator account for AeroControl.
          This can only be done once.
        </p>

        {done ? (
          <div style={styles.successBox}>
            <div style={{ fontSize: 32, marginBottom: 12 }}>✅</div>
            <p style={{ color: '#10b981', fontWeight: 600, fontSize: 15 }}>
              Admin account created successfully!
            </p>
            <p style={{ color: '#4a6080', fontSize: 13, marginTop: 8 }}>
              Redirecting to login page...
            </p>
          </div>
        ) : (
          <>
            {error && <div className="alert alert-error">⚠ {error}</div>}

            <form onSubmit={handleSubmit}>
              <div className="form-group">
                <label className="form-label">Admin Name</label>
                <input
                  type="text"
                  name="name"
                  className="form-control"
                  placeholder="Airport Admin"
                  value={form.name}
                  onChange={handleChange}
                  required
                  autoFocus
                />
              </div>

              <div className="form-group">
                <label className="form-label">Email Address</label>
                <input
                  type="email"
                  name="email"
                  className="form-control"
                  placeholder="admin@airport.com"
                  value={form.email}
                  onChange={handleChange}
                  required
                />
              </div>

              <div className="form-group">
                <label className="form-label">Password</label>
                <input
                  type="password"
                  name="password"
                  className="form-control"
                  placeholder="••••••••"
                  value={form.password}
                  onChange={handleChange}
                  required
                  minLength={6}
                />
              </div>

              <button
                type="submit"
                className="btn btn-primary"
                style={{ width: '100%', justifyContent: 'center', marginTop: 8, padding: '12px' }}
                disabled={loading}
              >
                {loading ? <><span className="spinner" /> Setting Up...</> : '🔧 Create Admin Account'}
              </button>
            </form>

            <p style={styles.switchLink}>
              Already set up?{' '}
              <Link to="/login" style={{ color: '#3b82f6', textDecoration: 'none', fontWeight: 600 }}>
                Go to Login
              </Link>
            </p>
          </>
        )}
      </div>
    </div>
  );
}

const styles = {
  page: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    minHeight: '100vh',
    background: '#0a0e1a',
  },
  container: {
    width: '100%',
    maxWidth: 420,
    padding: 40,
  },
  iconWrap: {
    textAlign: 'center',
    marginBottom: 20,
  },
  icon: {
    fontSize: 48,
    background: 'linear-gradient(135deg, #3b82f6, #06b6d4)',
    WebkitBackgroundClip: 'text',
    WebkitTextFillColor: 'transparent',
  },
  title: {
    fontFamily: "'Space Mono', monospace",
    fontSize: 26,
    fontWeight: 700,
    color: '#f0f4ff',
    textAlign: 'center',
    letterSpacing: '-1px',
    marginBottom: 8,
  },
  subtitle: {
    fontSize: 13,
    color: '#4a6080',
    textAlign: 'center',
    lineHeight: 1.6,
    marginBottom: 28,
  },
  successBox: {
    textAlign: 'center',
    padding: 40,
    background: 'rgba(16, 185, 129, 0.06)',
    border: '1px solid rgba(16, 185, 129, 0.2)',
    borderRadius: 12,
  },
  switchLink: {
    textAlign: 'center',
    marginTop: 20,
    fontSize: 13,
    color: '#4a6080',
  },
};
