import api from '../lib/axios';

export const authApi = {
  getCsrfToken: () => api.get('/sanctum/csrf-cookie', { baseURL: import.meta.env.VITE_API_URL ? import.meta.env.VITE_API_URL.replace('/api/v1', '') : 'http://localhost:8000' }),
  login: (data: any) => api.post('/login', data),
  register: (data: any) => api.post('/register', data),
  logout: () => api.post('/logout'),
};
