import axios from 'axios';

const API_URL = 'http://localhost:5000/api';

const api = axios.create({
  baseURL: API_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Add token to requests
api.interceptors.request.use((config) => {
  const token = localStorage.getItem('token');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

// Auth Services
export const authService = {
  register: (name, email, password) =>
    api.post('/auth/register', { name, email, password }),
  login: (email, password) => api.post('/auth/login', { email, password }),
  getProfile: () => api.get('/auth/profile'),
  updateProfile: (name, theme) => api.put('/auth/profile', { name, theme }),
};

// Session Services
export const sessionService = {
  createSession: (breathingMode, duration, soundscape, notes) =>
    api.post('/sessions/create', { breathingMode, duration, soundscape, notes }),
  getHistory: () => api.get('/sessions/history'),
  getStats: () => api.get('/sessions/stats'),
};

// Mood Services
export const moodService = {
  createMood: (mood, stressLevel, notes) =>
    api.post('/moods/create', { mood, stressLevel, notes }),
  getHistory: () => api.get('/moods/history'),
  getStats: () => api.get('/moods/stats'),
};

// Affirmation Services
export const affirmationService = {
  getDailyAffirmation: () => api.get('/affirmations/daily'),
  saveAffirmation: (affirmationId) =>
    api.post('/affirmations/save', { affirmationId }),
  getSavedAffirmations: () => api.get('/affirmations/saved'),
};

export default api;
