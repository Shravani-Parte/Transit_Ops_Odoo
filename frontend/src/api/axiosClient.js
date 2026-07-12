<<<<<<< HEAD
/**
 * Axios client for TransitOps API
 */
import axios from 'axios';
import { getAuth, clearAuth } from '../store/authStore';

const axiosClient = axios.create({
  baseURL: 'http://localhost:8000/api/v1',
  headers: {
    'Content-Type': 'application/json',
  },
});

// Request interceptor to add auth token
axiosClient.interceptors.request.use(
  (config) => {
    const auth = getAuth();
    if (auth && auth.token) {
      config.headers.Authorization = `Bearer ${auth.token}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

// Response interceptor to handle 401 Unauthorized
axiosClient.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response && error.response.status === 401) {
      clearAuth();
      window.location.href = '/login';
    }
    console.error('API Error:', error);
    return Promise.reject(error);
=======
import axios from 'axios';
import { API_BASE } from '../config/constants';

const axiosClient = axios.create({
  baseURL: API_BASE,
  headers: { 'Content-Type': 'application/json' },
});

axiosClient.interceptors.request.use((config) => {
  const token = localStorage.getItem('transitops_token');
  if (token) config.headers.Authorization = `Bearer ${token}`;
  return config;
});

axiosClient.interceptors.response.use(
  (res) => res,
  (err) => {
    if (err.response?.status === 401) {
      localStorage.removeItem('transitops_token');
      localStorage.removeItem('transitops_user');
      if (!window.location.pathname.includes('/login')) {
        window.location.href = '/login';
      }
    }
    return Promise.reject(err);
>>>>>>> e21946685e62ae18c3f3933d86dd20bdbac55cd8
  }
);

export default axiosClient;
