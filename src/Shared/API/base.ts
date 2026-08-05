import axios from 'axios';

export const api = axios.create({
  baseURL: 'https://watercourse-back.onrender.com/api', // 👈 https + /api
  withCredentials: true, // 👈 для refreshToken cookie
});

api.interceptors.request.use((config) => {
  const token = localStorage.getItem('accessToken'); // 👈 ключ должен совпадать с тем что сохраняем
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});
api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      const isAuthPage = window.location.pathname.includes('/auth');
      if (!isAuthPage) {
        localStorage.removeItem('accessToken');
        localStorage.removeItem('user');
        window.location.href = '/auth?mode=login';
      }
    }
    return Promise.reject(error);
  }
);