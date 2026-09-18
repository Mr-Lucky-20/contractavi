import axios from 'axios';

const api = axios.create({
  baseURL: '/api',
  headers: {
    'Content-Type': 'application/json',
  },
});

// Interceptor to attach JWT token to authenticated requests
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('struct_auth_token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

// Response interceptor to handle session expiration
api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response && error.response.status === 401) {
      // Clear token if expired or unauthorized
      if (localStorage.getItem('struct_auth_token')) {
        localStorage.removeItem('struct_auth_token');
        localStorage.removeItem('struct_auth_owner');
        window.dispatchEvent(new Event('auth_state_changed'));
      }
    }
    return Promise.reject(error);
  }
);

export default api;
