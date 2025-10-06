// src/services/api.js
import axios from 'axios';
import { API_URL } from '../config';

const api = axios.create({
  baseURL: API_URL,
  headers: {
    'Content-Type': 'application/json',
    'Accept': 'application/json',
  },
  withCredentials: false,
});

// Request interceptor to add auth token
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('auth_token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Response interceptor to handle errors
api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      localStorage.removeItem('auth_token');
      window.location.href = '/login';
    }
    return Promise.reject(error);
  }
);

export default api;

// API endpoints helper
export const authAPI = {
  login: (email, password) => api.post('/login', { email, password }),
  register: (data) => api.post('/register', data),
  logout: () => api.post('/logout'),
  me: () => api.get('/me'),
};

export const dashboardAPI = {
  getData: () => api.get('/dashboard'),
};

export const applicationAPI = {
  get: () => api.get('/application'),
  update: (data) => api.put('/application', data),
};

export const documentsAPI = {
  list: () => api.get('/documents'),
  upload: (formData) => api.post('/documents', formData, {
    headers: { 'Content-Type': 'multipart/form-data' }
  }),
  download: (id) => api.get(`/documents/${id}/download`, { responseType: 'blob' }),
  delete: (id) => api.delete(`/documents/${id}`),
};

export const messagesAPI = {
  list: () => api.get('/messages'),
  send: (message, recipientId = null) => api.post('/messages', { message, recipient_id: recipientId }),
  unreadCount: () => api.get('/messages/unread-count'),
  getAllConversations: () => api.get('/messages/conversations'), // Admin only
  getUserMessages: (userId) => api.get(`/messages/user/${userId}`), // Admin only
  update: (messageId, message) => api.put(`/messages/${messageId}`, { message }),
  delete: (messageId) => api.delete(`/messages/${messageId}`),
};

export const lessonsAPI = {
  list: () => api.get('/lessons'),
  get: (id) => api.get(`/lessons/${id}`),
  updateProgress: (id, data) => api.post(`/lessons/${id}/progress`, data),
};

export const paymentsAPI = {
  createCheckout: (package_type) => api.post('/payments/create-checkout', { package: package_type }),
};

export const contactAPI = {
  submit: (data) => api.post('/contact', data),
};

export const adminAPI = {
  getAllUsers: () => api.get('/admin/users'),
  getUserDetails: (userId) => api.get(`/admin/users/${userId}`),
  updateApplicationStatus: (data) => api.put('/admin/application/update', data),
  getStatistics: () => api.get('/admin/statistics'),
  addUserLabel: (data) => api.post('/admin/labels', data),
  getUserLabels: (userId) => api.get(`/admin/labels/${userId}`),
  deleteUserLabel: (labelId) => api.delete(`/admin/labels/${labelId}`),
};

