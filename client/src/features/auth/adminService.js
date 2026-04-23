// in client/src/features/auth/adminService.js
import axios from 'axios';

const API_URL = 'http://localhost:5000/api/admin/';

// Register admin
const register = async (adminData) => {
  const response = await axios.post(API_URL + 'register', adminData);

  if (response.data) {
    localStorage.setItem('admin', JSON.stringify(response.data));
  }

  return response.data;
};

// Logout admin
const logout = () => {
    localStorage.removeItem('admin');
}

// Login admin
const login = async (adminData) => {
  const response = await axios.post(API_URL + 'login', adminData);

  if (response.data) {
    localStorage.setItem('admin', JSON.stringify(response.data));
  }

  return response.data;
}

const adminService = {
  register,
  login,
  logout,
};

export default adminService;
