// src/utils/api.ts
import axios from 'axios';

// 1. Create the basic axios instance with your API base URL
const api = axios.create({
  baseURL: 'http://localhost:8000/api/', // Your Django backend URL
  timeout: 5000, // 5 second timeout
});

// 2. Simple request interceptor to add auth token if available
api.interceptors.request.use((config) => {
  // Try to get token from localStorage first, then sessionStorage
  const token = localStorage.getItem('access_token') || 
               sessionStorage.getItem('access_token');
  
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  
  return config;
});

// 3. Basic response interceptor for error handling
api.interceptors.response.use(
  (response) => response,
  (error) => {
    // Handle common errors
    if (error.response?.status === 401) {
      console.error('Unauthorized - please login again');
      // You can redirect to login here if needed
    }
    return Promise.reject(error);
  }
);

export default api;