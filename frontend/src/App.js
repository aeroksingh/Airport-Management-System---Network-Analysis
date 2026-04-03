    import React, { createContext, useContext, useState } from 'react';
    import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
    import { ToastContainer } from 'react-toastify';

    import Login from './pages/Login';
    import Register from './pages/Register';
    import Setup from './pages/Setup';
    import Dashboard from './pages/Dashboard';
    import Flights from './pages/Flights';
    import Passengers from './pages/Passengers';
    import Gates from './pages/Gates';
    import Layout from './components/Layout';

    // ─── Auth Context ──────────────────────────────────────────────────────────
    const AuthContext = createContext(null);

    export const useAuth = () => useContext(AuthContext);

    const AuthProvider = ({ children }) => {
    const [user, setUser] = useState(() => {
        try {
        const stored = localStorage.getItem('user');
        return stored ? JSON.parse(stored) : null;
        } catch {
        return null;
        }
    });

    const [token, setToken] = useState(() => localStorage.getItem('token') || null);

    const login = (userData, tokenData) => {
        setUser(userData);
        setToken(tokenData);
        localStorage.setItem('user', JSON.stringify(userData));
        localStorage.setItem('token', tokenData);
    };

    const logout = () => {
        setUser(null);
        setToken(null);
        localStorage.removeItem('user');
        localStorage.removeItem('token');
    };

    return (
        <AuthContext.Provider value={{ user, token, login, logout, isAuthenticated: !!token }}>
        {children}
        </AuthContext.Provider>
    );
    };

    // ─── Protected Route ───────────────────────────────────────────────────────
    const ProtectedRoute = ({ children }) => {
    const { isAuthenticated } = useAuth();
    return isAuthenticated ? children : <Navigate to="/login" replace />;
    };

    // ─── Public Route (redirect if logged in) ─────────────────────────────────
    const PublicRoute = ({ children }) => {
    const { isAuthenticated } = useAuth();
    return isAuthenticated ? <Navigate to="/dashboard" replace /> : children;
    };

    // ─── App ───────────────────────────────────────────────────────────────────
    export default function App() {
    return (
        <AuthProvider>
        <BrowserRouter>
            <ToastContainer
            position="top-right"
            autoClose={3000}
            hideProgressBar={false}
            theme="dark"
            toastStyle={{
                background: '#161d2e',
                border: '1px solid #1e2d45',
                color: '#f0f4ff',
                fontFamily: 'DM Sans, sans-serif',
            }}
            />
            <Routes>
            {/* Public */}
            <Route path="/login" element={<PublicRoute><Login /></PublicRoute>} />
            <Route path="/register" element={<PublicRoute><Register /></PublicRoute>} />
            <Route path="/setup" element={<PublicRoute><Setup /></PublicRoute>} />

            {/* Protected */}
            <Route path="/" element={<ProtectedRoute><Layout /></ProtectedRoute>}>
                <Route index element={<Navigate to="/dashboard" replace />} />
                <Route path="dashboard" element={<Dashboard />} />
                <Route path="flights" element={<Flights />} />
                <Route path="passengers" element={<Passengers />} />
                <Route path="gates" element={<Gates />} />
            </Route>

            {/* 404 */}
            <Route path="*" element={<Navigate to="/dashboard" replace />} />
            </Routes>
        </BrowserRouter>
        </AuthProvider>
    );
    }