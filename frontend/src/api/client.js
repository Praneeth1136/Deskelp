import axios from 'axios';

// Base URL points to Java Servlet REST API
const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:8080/helpdesk-ticket-system/api';

const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Request interceptor: attach JWT token to every request if available
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

// Response interceptor: handle token expiration / 401
api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response && error.response.status === 401) {
      // If unauthorized and not already on login/register, clear token
      const currentPath = window.location.pathname;
      if (currentPath !== '/login' && currentPath !== '/register' && currentPath !== '/') {
        localStorage.removeItem('token');
        localStorage.removeItem('user');
        window.location.href = '/login?expired=true';
      }
    }
    return Promise.reject(error);
  }
);

// Auth API
export const authApi = {
  login: (email, password) => api.post('/auth/login', { email, password }),
  register: (fullName, email, password, confirmPassword) =>
    api.post('/auth/register', { fullName, email, password, confirmPassword }),
  logout: () => api.post('/auth/logout'),
  getProfile: () => api.get('/dashboard'),
};

// Ticket API
export const ticketApi = {
  create: (ticketData) => api.post('/tickets/create', ticketData),
  getMyTickets: () => api.get('/tickets/my'),
  getDetails: (id) => api.get(`/tickets/details?id=${id}`),
  addComment: (ticketId, message) => api.post('/tickets/comment', { ticketId, message }),
  close: (ticketId) => api.post('/tickets/close', { ticketId }),
};

// Admin API
export const adminApi = {
  getTicketsAndAgents: () => api.get('/admin/tickets'),
  assignTicket: (ticketId, agentId) => api.post('/admin/assign', { ticketId, agentId }),
};

// Agent API
export const agentApi = {
  getMyTickets: () => api.get('/agent/tickets'),
  updateStatus: (ticketId, newStatus) => api.post('/agent/update-status', { ticketId, newStatus }),
};

export default api;

