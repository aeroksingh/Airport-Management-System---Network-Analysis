    import React from 'react';
    import { Outlet, NavLink, useNavigate } from 'react-router-dom';
    import { useAuth } from '../App';
    import { toast } from 'react-toastify';

    const navItems = [
    { path: '/dashboard',  label: 'Dashboard',   icon: '⬡' },
    { path: '/flights',    label: 'Flights',      icon: '✈' },
    { path: '/passengers', label: 'Passengers',   icon: '◈' },
    { path: '/gates',      label: 'Gates',        icon: '▣' },
    ];

    export default function Layout() {
    const { user, logout } = useAuth();
    const navigate = useNavigate();

    const handleLogout = () => {
        logout();
        toast.success('Logged out successfully');
        navigate('/login');
    };

    return (
        <div className="layout">
        {/* ── Sidebar ── */}
        <aside style={styles.sidebar}>
            {/* Brand */}
            <div style={styles.brand}>
            <div style={styles.brandIcon}>✈</div>
            <div>
                <div style={styles.brandName}>AeroControl</div>
                <div style={styles.brandSub}>Airport Management</div>
            </div>
            </div>

            {/* Nav */}
            <nav style={styles.nav}>
            {navItems.map((item) => (
                <NavLink
                key={item.path}
                to={item.path}
                style={({ isActive }) => ({
                    ...styles.navLink,
                    ...(isActive ? styles.navLinkActive : {}),
                })}
                >
                <span style={styles.navIcon}>{item.icon}</span>
                {item.label}
                </NavLink>
            ))}
            </nav>

            {/* User Info */}
            <div style={styles.userSection}>
            <div style={styles.userAvatar}>
                {user?.name?.charAt(0).toUpperCase() || 'U'}
            </div>
            <div style={styles.userInfo}>
                <div style={styles.userName}>{user?.name || 'User'}</div>
                <div style={styles.userRole}>{user?.role || 'staff'}</div>
            </div>
            <button onClick={handleLogout} style={styles.logoutBtn} title="Logout">
                ⏻
            </button>
            </div>
        </aside>

        {/* ── Main Content ── */}
        <main className="main-content">
            <Outlet />
        </main>
        </div>
    );
    }

    const styles = {
    sidebar: {
        width: 240,
        height: '100vh',
        background: '#0d1220',
        borderRight: '1px solid #1e2d45',
        position: 'fixed',
        left: 0,
        top: 0,
        display: 'flex',
        flexDirection: 'column',
        zIndex: 100,
    },
    brand: {
        display: 'flex',
        alignItems: 'center',
        gap: 12,
        padding: '24px 20px',
        borderBottom: '1px solid #1e2d45',
    },
    brandIcon: {
        width: 36,
        height: 36,
        background: 'linear-gradient(135deg, #3b82f6, #06b6d4)',
        borderRadius: 8,
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        fontSize: 18,
        flexShrink: 0,
    },
    brandName: {
        fontFamily: "'Space Mono', monospace",
        fontSize: 14,
        fontWeight: 700,
        color: '#f0f4ff',
        letterSpacing: '-0.5px',
    },
    brandSub: {
        fontSize: 10,
        color: '#4a6080',
        fontWeight: 500,
        textTransform: 'uppercase',
        letterSpacing: '0.06em',
    },
    nav: {
        flex: 1,
        padding: '16px 12px',
        display: 'flex',
        flexDirection: 'column',
        gap: 4,
    },
    navLink: {
        display: 'flex',
        alignItems: 'center',
        gap: 10,
        padding: '10px 12px',
        borderRadius: 8,
        textDecoration: 'none',
        color: '#8899bb',
        fontSize: 14,
        fontWeight: 500,
        transition: 'all 0.15s',
        fontFamily: "'DM Sans', sans-serif",
    },
    navLinkActive: {
        background: 'rgba(59, 130, 246, 0.12)',
        color: '#60a5fa',
        borderLeft: '2px solid #3b82f6',
        paddingLeft: 10,
    },
    navIcon: {
        fontSize: 16,
        width: 20,
        textAlign: 'center',
        flexShrink: 0,
    },
    userSection: {
        display: 'flex',
        alignItems: 'center',
        gap: 10,
        padding: '16px 16px',
        borderTop: '1px solid #1e2d45',
    },
    userAvatar: {
        width: 32,
        height: 32,
        background: 'linear-gradient(135deg, #3b82f6, #8b5cf6)',
        borderRadius: '50%',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        fontSize: 13,
        fontWeight: 700,
        color: '#fff',
        flexShrink: 0,
    },
    userInfo: { flex: 1, minWidth: 0 },
    userName: {
        fontSize: 13,
        fontWeight: 600,
        color: '#f0f4ff',
        overflow: 'hidden',
        textOverflow: 'ellipsis',
        whiteSpace: 'nowrap',
    },
    userRole: {
        fontSize: 10,
        color: '#4a6080',
        textTransform: 'uppercase',
        letterSpacing: '0.06em',
        fontWeight: 600,
    },
    logoutBtn: {
        background: 'none',
        border: 'none',
        color: '#4a6080',
        cursor: 'pointer',
        fontSize: 16,
        padding: 4,
        borderRadius: 6,
        transition: 'color 0.15s',
        flexShrink: 0,
    },
    };