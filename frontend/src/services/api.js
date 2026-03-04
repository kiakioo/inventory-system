import axios from 'axios';

const api = axios.create({
  baseURL: 'http://192.168.100.91:5000/api',
});

// Otomatis tempelkan token JWT di setiap request jika sudah login
api.interceptors.request.use((config) => {
  const token = localStorage.getItem('token');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

export default api;