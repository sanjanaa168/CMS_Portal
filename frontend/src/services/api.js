import axios from 'axios';

const API_BASE_URL = 'http://localhost:5000/api';

// Create Axios instance
const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Request Interceptor: Automatically attach JWT token if present
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

// Response Interceptor: Handle global errors (401, 403, 404, 500)
api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response) {
      const { status } = error.response;
      if (status === 401) {
        // Clear auth data and redirect to login if session expired or unauthorized
        localStorage.removeItem('token');
        localStorage.removeItem('user');
        if (window.location.pathname !== '/login' && window.location.pathname !== '/register') {
          window.location.href = '/login?expired=true';
        }
      }
    }
    return Promise.reject(error);
  }
);

// ==========================================
// Authentication Services
// ==========================================

export const authService = {
  async login(email, password) {
    const response = await api.post('/auth/login', { email, password });
    const data = response.data;
    if (data && data.token) {
      localStorage.setItem('token', data.token);
      localStorage.setItem('user', JSON.stringify({
        id: data.id,
        name: data.name,
        email: data.email,
        role: data.role,
        expiresAt: data.expiresAt,
      }));
    }
    return data;
  },

  async register(name, email, password) {
    const response = await api.post('/auth/register', { name, email, password });
    return response.data;
  },

  logout() {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
  },

  getCurrentUser() {
    const userStr = localStorage.getItem('user');
    if (!userStr) return null;
    try {
      return JSON.parse(userStr);
    } catch {
      return null;
    }
  },

  getToken() {
    return localStorage.getItem('token');
  },

  isAuthenticated() {
    const token = localStorage.getItem('token');
    const user = this.getCurrentUser();
    return !!token && !!user;
  },

  isAdmin() {
    const user = this.getCurrentUser();
    return user?.role === 'ADMIN';
  },
};

// ==========================================
// User Complaints Services
// ==========================================

export const complaintService = {
  async getMyComplaints() {
    const response = await api.get('/complaints');
    return response.data;
  },

  async getComplaintById(id) {
    const response = await api.get(`/complaints/${id}`);
    return response.data;
  },

  async createComplaint({ title, description, category, imageUrl }) {
    const response = await api.post('/complaints', {
      title,
      description,
      category: Number(category),
      imageUrl: imageUrl && imageUrl.trim() !== '' ? imageUrl.trim() : null,
    });
    return response.data;
  },

  async deleteComplaint(id) {
    const response = await api.delete(`/complaints/${id}`);
    return response.data;
  },
};

// ==========================================
// Admin Complaints Services
// ==========================================

export const adminService = {
  async getAllComplaints() {
    const response = await api.get('/admin/complaints');
    return response.data;
  },

  async getComplaintById(id) {
    const response = await api.get(`/admin/complaints/${id}`);
    return response.data;
  },

  async updateComplaintStatus(id, status) {
    const response = await api.put(`/admin/complaints/${id}/status`, {
      status: Number(status),
    });
    return response.data;
  },

  async deleteComplaint(id) {
    const response = await api.delete(`/admin/complaints/${id}`);
    return response.data;
  },
};

// ==========================================
// Category & Status Enums Mapping
// ==========================================

export const CATEGORIES = [
  { id: 1, name: 'Electricity', icon: 'Zap', color: 'amber' },
  { id: 2, name: 'Water', icon: 'Droplets', color: 'blue' },
  { id: 3, name: 'WiFi', icon: 'Wifi', color: 'violet' },
  { id: 4, name: 'Furniture', icon: 'Armchair', color: 'rose' },
];

export const STATUSES = [
  { id: 1, name: 'Open', color: 'blue' },
  { id: 2, name: 'Assigned', color: 'amber' },
  { id: 3, name: 'InProgress', color: 'purple' },
  { id: 4, name: 'Resolved', color: 'emerald' },
];

export default api;
