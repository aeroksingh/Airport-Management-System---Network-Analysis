    import React, { useState } from 'react';
    import { Link, useNavigate } from 'react-router-dom';
    import { toast } from 'react-toastify';
    import { authAPI } from '../services/api';
    import { useAuth } from '../App';

    export default function Login() {
    const [form, setForm] = useState({ email: '', password: '' });
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');
    const { login } = useAuth();
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
        const res = await authAPI.login(form);
        login(res.data.user, res.data.token);
        toast.success(`Welcome back, ${res.data.user.name}!`);
        navigate('/dashboard');
        } catch (err) {
        const msg = err.response?.data?.message || 'Login failed. Please try again.';
        setError(msg);
        toast.error(msg);
        } finally {
        setLoading(false);
        }
    };

    return (
        <div style={styles.page}>
        <div style={styles.left}>
            <div style={styles.heroContent}>
            <div style={styles.heroIcon}>✈</div>
            <h1 style={styles.heroTitle}>AeroControl</h1>
            <p style={styles.heroSubtitle}>
                Airport Management System
            </p>
            <div style={styles.heroDivider} />
            <p style={styles.heroDesc}>
                Manage flights, passengers, and gate assignments from a unified control panel.
            </p>
            <div style={styles.stats}>
                {[
                { label: 'Flights', val: '∞' },
                { label: 'Gates', val: '∞' },
                { label: 'Passengers', val: '∞' },
                ].map((s) => (
                <div key={s.label} style={styles.statItem}>
                    <div style={styles.statVal}>{s.val}</div>
                    <div style={styles.statLabel}>{s.label}</div>
                </div>
                ))}
            </div>
            </div>
        </div>

        <div style={styles.right}>
            <div style={styles.formBox}>
            <div style={styles.formHeader}>
                <h2 style={styles.formTitle}>Sign In</h2>
                <p style={styles.formSubtitle}>Enter your credentials to access the system</p>
            </div>

            {error && <div className="alert alert-error">⚠ {error}</div>}

            <form onSubmit={handleSubmit}>
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
                    autoFocus
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
                />
                </div>

                <button
                type="submit"
                className="btn btn-primary"
                style={{ width: '100%', justifyContent: 'center', marginTop: 8, padding: '12px' }}
                disabled={loading}
                >
                {loading ? <><span className="spinner" /> Signing In...</> : 'Sign In →'}
                </button>
            </form>

            <p style={styles.switchLink}>
                Don't have an account?{' '}
                <Link to="/register" style={{ color: '#3b82f6', textDecoration: 'none', fontWeight: 600 }}>
                Register here
                </Link>
            </p>

            <div style={styles.setupLink}>
                <Link to="/setup" style={{ color: '#06b6d4', textDecoration: 'none', fontWeight: 500, fontSize: 12 }}>
                🔧 First time setup? Create admin account
                </Link>
            </div>

            <div style={styles.demoBox}>
                <div style={styles.demoTitle}>Demo Credentials</div>
                <div style={styles.demoItem}>
                <span>Email:</span>
                <span style={{ fontFamily: 'monospace', color: '#06b6d4' }}>admin@airport.com</span>
                </div>
                <div style={styles.demoItem}>
                <span>Password:</span>
                <span style={{ fontFamily: 'monospace', color: '#06b6d4' }}>admin123</span>
                </div>
            </div>
            </div>
        </div>
        </div>
    );
    }

    const styles = {
    page: {
        display: 'flex',
        minHeight: '100vh',
        background: '#0a0e1a',
    },
    left: {
        flex: 1,
        background: 'linear-gradient(160deg, #0d1628 0%, #0a0e1a 60%, #071020 100%)',
        borderRight: '1px solid #1e2d45',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        padding: 60,
    },
    heroContent: { maxWidth: 380 },
    heroIcon: {
        fontSize: 48,
        marginBottom: 20,
        background: 'linear-gradient(135deg, #3b82f6, #06b6d4)',
        WebkitBackgroundClip: 'text',
        WebkitTextFillColor: 'transparent',
    },
    heroTitle: {
        fontFamily: "'Space Mono', monospace",
        fontSize: 38,
        fontWeight: 700,
        color: '#f0f4ff',
        letterSpacing: '-2px',
        lineHeight: 1,
        marginBottom: 10,
    },
    heroSubtitle: {
        fontSize: 14,
        color: '#4a6080',
        fontWeight: 500,
        textTransform: 'uppercase',
        letterSpacing: '0.1em',
        marginBottom: 28,
    },
    heroDivider: {
        width: 40,
        height: 2,
        background: 'linear-gradient(90deg, #3b82f6, transparent)',
        marginBottom: 28,
    },
    heroDesc: {
        color: '#8899bb',
        fontSize: 14,
        lineHeight: 1.7,
        marginBottom: 40,
    },
    stats: {
        display: 'flex',
        gap: 32,
    },
    statItem: { textAlign: 'center' },
    statVal: {
        fontFamily: "'Space Mono', monospace",
        fontSize: 22,
        color: '#3b82f6',
        fontWeight: 700,
    },
    statLabel: {
        fontSize: 10,
        color: '#4a6080',
        textTransform: 'uppercase',
        letterSpacing: '0.08em',
        fontWeight: 600,
        marginTop: 4,
    },
    right: {
        width: 460,
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        padding: 48,
    },
    formBox: { width: '100%', maxWidth: 380 },
    formHeader: { marginBottom: 28 },
    formTitle: {
        fontFamily: "'Space Mono', monospace",
        fontSize: 24,
        fontWeight: 700,
        color: '#f0f4ff',
        letterSpacing: '-0.5px',
        marginBottom: 6,
    },
    formSubtitle: { fontSize: 13, color: '#4a6080' },
    switchLink: {
        textAlign: 'center',
        marginTop: 20,
        fontSize: 13,
        color: '#4a6080',
    },
    setupLink: {
        textAlign: 'center',
        marginTop: 12,
    },
    demoBox: {
        marginTop: 24,
        padding: 16,
        background: 'rgba(6, 182, 212, 0.06)',
        border: '1px solid rgba(6, 182, 212, 0.2)',
        borderRadius: 10,
    },
    demoTitle: {
        fontSize: 10,
        color: '#06b6d4',
        textTransform: 'uppercase',
        letterSpacing: '0.1em',
        fontWeight: 700,
        marginBottom: 10,
    },
    demoItem: {
        display: 'flex',
        justifyContent: 'space-between',
        fontSize: 12,
        color: '#8899bb',
        marginBottom: 4,
    },
    };