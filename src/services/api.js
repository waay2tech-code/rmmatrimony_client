// src/api/axios.js
import axios from 'axios';

const apiUrl = import.meta.env.VITE_API_URL || 'http://localhost:5000/api';

if (!apiUrl) {
  throw new Error("VITE_API_URL is not defined in environment variables.");
}

const api = axios.create({
  baseURL: apiUrl,
  withCredentials: true, // This enables cookie-based authentication
  headers: {
    'Content-Type': 'application/json',
    'Accept': 'application/json',
  },
  timeout: 10000,
  // Additional configuration to prevent CORB issues
  responseType: 'json',
  validateStatus: function (status) {
    return status >= 200 && status < 300; // default
  }
});

// Response interceptor for error handling
api.interceptors.response.use(
  (response) => response,
  (error) => {
    // Only log non-401 errors to avoid console spam
    if (error.response?.status !== 401) {
      console.error('API Error:', error.response?.data || error.message);
    }
    return Promise.reject(error);
  }
);

export default api;
