// in client/src/features/auth/authService.js
import axios from 'axios';

const API_URL = 'http://localhost:5001/api/users/';

// Register user
const register = async (userData) => {
  const response = await axios.post(API_URL + 'register', userData);

  if (response.data) {
    localStorage.setItem('user', JSON.stringify(response.data));
  }

  return response.data;
};

// Logout user
const logout = () => {
    localStorage.removeItem('user');
}

// Login user
const login = async (userData) => {
  const response = await axios.post(API_URL + 'login', userData);

  if (response.data) {
    localStorage.setItem('user', JSON.stringify(response.data));
  }

  return response.data;
}

const authService = {
  register,
  login,
  logout,
};

export default authService;