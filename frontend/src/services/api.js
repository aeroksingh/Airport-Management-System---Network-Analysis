import axios from 'axios';

const BASE_URL = process.env.REACT_APP_API_URL || 'http://localhost:5000/api';

// Create axios instance
const api = axios.create({
  baseURL: BASE_URL,
  headers: { 'Content-Type': 'application/json' },
  timeout: 10000,
});

// ── Request Interceptor: Attach JWT token ──────────────────────────────────
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

// ── Response Interceptor: Handle 401 globally ──────────────────────────────
api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      localStorage.removeItem('token');
      localStorage.removeItem('user');
      window.location.href = '/login';
    }
    return Promise.reject(error);
  }
);

// ─────────────────────────────────────────────────────────────────────────────
// AUTH
// ─────────────────────────────────────────────────────────────────────────────
export const authAPI = {
  setup: (data) => api.post('/auth/setup', data),
  register: (data) => api.post('/auth/register', data),
  login: (data) => api.post('/auth/login', data),
  getMe: () => api.get('/auth/me'),
};

// ─────────────────────────────────────────────────────────────────────────────
// FLIGHTS
// ─────────────────────────────────────────────────────────────────────────────
export const flightAPI = {
  getAll: (params) => api.get('/flights', { params }),
  getOne: (id) => api.get(`/flights/${id}`),
  create: (data) => api.post('/flights', data),
  update: (id, data) => api.put(`/flights/${id}`, data),
  delete: (id) => api.delete(`/flights/${id}`),
};

// ─────────────────────────────────────────────────────────────────────────────
// PASSENGERS
// ─────────────────────────────────────────────────────────────────────────────
export const passengerAPI = {
    getAll: (params) => api.get('/passengers', { params }),
    getOne: (id) => api.get(`/passengers/${id}`),
    create: (data) => api.post('/passengers', data),
    update: (id, data) => api.put(`/passengers/${id}`, data),
    checkIn: (id, data) => api.patch(`/passengers/${id}/checkin`, data),
    delete: (id) => api.delete(`/passengers/${id}`),
    };

// ─────────────────────────────────────────────────────────────────────────────
// GATES
// ─────────────────────────────────────────────────────────────────────────────
export const gateAPI = {
    getAll: (params) => api.get('/gates', { params }),
    getOne: (id) => api.get(`/gates/${id}`),
    create: (data) => api.post('/gates', data),
    update: (id, data) => api.put(`/gates/${id}`, data),
    assignFlight: (id, flightId) => api.patch(`/gates/${id}/assign`, { flightId }),
    unassignFlight: (id) => api.patch(`/gates/${id}/unassign`),
    delete: (id) => api.delete(`/gates/${id}`),
    };

export default api;