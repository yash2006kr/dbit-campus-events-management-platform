// in client/src/api/axiosInstance.js
import axios from 'axios';

const api = axios.create({
  baseURL: 'http://localhost:5001/api',
});

// This is an interceptor. It runs BEFORE each request is sent.
api.interceptors.request.use(
  (config) => {
    // Get the user object from localStorage
    const user = JSON.parse(localStorage.getItem('user'));

    if (user && user.token) {
      // If the user and token exist, add the 'Bearer Token' to the headers
      config.headers['Authorization'] = `Bearer ${user.token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

export default api;