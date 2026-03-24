import axios from 'axios';

export const api = axios.create({
  baseURL: 'https://watercourse-back-production.up.railway.app/api', // 👈 https + /api
  withCredentials: true, // 👈 для refreshToken cookie
});

api.interceptors.request.use((config) => {
  const token = localStorage.getItem('accessToken'); // 👈 ключ должен совпадать с тем что сохраняем
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});