import axios from 'axios';

export const api = axios.create({
  baseURL: 'https://watercourse-back.onrender.com/api',
  withCredentials: true, // cookie (refreshToken) yuborish uchun
});

// Request Interceptor: Access Tokenni har bir so'rovga qo'shish
api.interceptors.request.use((config) => {
  const token = localStorage.getItem('accessToken');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

// Response Interceptor: 401 xatoni ushlash va Refresh qilish
api.interceptors.response.use(
  (response) => response,
  async (error) => {
    const originalRequest = error.config;

    // 🔴 FIX: 401 bo'lganda birdan o'chirmasdan, avval Refresh qilamiz
    if (error.response?.status === 401 && !originalRequest._retry) {
      originalRequest._retry = true; // Takroriy cheksiz so'rov ketib qolmasligi uchun

      const isAuthPage = window.location.pathname.includes('/auth');
      
      // Login/Register sahifasidagi 401 bo'lsa (parol xato bo'lsa), auth page'da qoladi
      if (isAuthPage) {
        return Promise.reject(error);
      }

      try {
        // Backend'dan cookie'dagi refreshToken orqali yangi accessToken so'raymiz
        const res = await axios.post(
          'https://watercourse-back.onrender.com/api/auth/refresh',
          {},
          { withCredentials: true }
        );

        const newAccessToken = res.data.accessToken;

        if (newAccessToken) {
          localStorage.setItem('accessToken', newAccessToken);

          // Eski (amalga oshmay qolgan) so'rovni yangi token bilan qayta yuboramiz
          originalRequest.headers.Authorization = `Bearer ${newAccessToken}`;
          return api(originalRequest);
        }
      } catch (refreshError) {
        // Refresh ham o'xshamasa yoki cookie muddati o'tgan bo'lsa, shundagina Login'ga otamiz
        localStorage.removeItem('accessToken');
        localStorage.removeItem('user');
        window.location.href = '/auth?mode=login';
        return Promise.reject(refreshError);
      }
    }

    return Promise.reject(error);
  }
);