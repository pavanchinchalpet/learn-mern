import axios from 'axios';

const api = axios.create({
  baseURL: process.env.REACT_APP_API_URL || 'http://localhost:5000',
  withCredentials: true,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Request interceptor to add auth token
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('token');
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
  (response) => {
    return response;
  },
  (error) => {
    const originalRequest = error.config;

    // If unauthorized and we haven't retried yet, attempt refresh
    if (error.response?.status === 401 && !originalRequest._retry) {
      originalRequest._retry = true;
      const refreshClient = axios.create({
        baseURL: process.env.REACT_APP_API_URL || 'http://localhost:5000',
        withCredentials: true,
        headers: { 'Content-Type': 'application/json' }
      });

      return refreshClient
        .post('/api/auth/refresh')
        .then((res) => {
          const accessToken = res.data?.session?.access_token;
          if (accessToken) {
            localStorage.setItem('token', accessToken);
            api.defaults.headers.common['Authorization'] = `Bearer ${accessToken}`;
            originalRequest.headers['Authorization'] = `Bearer ${accessToken}`;
          }
          return api(originalRequest);
        })
        .catch((refreshErr) => {
          localStorage.removeItem('token');
          delete api.defaults.headers.common['Authorization'];
          window.location.href = '/login';
          return Promise.reject(refreshErr);
        });
    }

    return Promise.reject(error);
  }
);

export default api;
