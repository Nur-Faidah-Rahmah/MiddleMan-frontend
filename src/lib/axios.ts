import axios from 'axios';

// Gunakan URL yang diberikan oleh env atau default ke localhost:8000
const baseURL = import.meta.env.VITE_API_URL || 'http://localhost:8000/api/v1';

const api = axios.create({
  baseURL,
  withCredentials: true, // Penting untuk mengirimkan cookie Sanctum di setiap request
  headers: {
    'Content-Type': 'application/json',
    'Accept': 'application/json',
  },
});

// Request interceptor to add token if available
api.interceptors.request.use((config) => {
  const token = localStorage.getItem('auth_token');
  if (token) {
    config.headers = config.headers || {};
    config.headers['Authorization'] = `Bearer ${token}`;
  }
  return config;
}, (error) => Promise.reject(error));

// Response interceptor for global error handling (e.g., redirect on 401)
api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      // Optionally clear auth and redirect to login page
      // localStorage.removeItem('auth_token');
      // window.location.href = '/';
    }
    return Promise.reject(error);
  }
);

export default api;
