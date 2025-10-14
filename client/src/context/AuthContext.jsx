// in client/src/context/AuthContext.jsx
import { createContext, useState, useEffect, useContext } from 'react';
import io from 'socket.io-client';
import authService from '../features/auth/authService';
import api from '../api/axiosInstance';

const socket = io('http://localhost:5000');

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [notifications, setNotifications] = useState([]);

  useEffect(() => {
    const storedUser = JSON.parse(localStorage.getItem('user'));
    if (storedUser) {
      setUser(storedUser);
    }
  }, []);

  useEffect(() => {
    if (user) {
      // Join user room
      socket.emit('join', user._id);

      // Listen for notifications
      socket.on('notification', (notification) => {
        setNotifications(prev => [...prev, notification]);
      });

      // Fetch existing notifications
      const fetchNotifications = async () => {
        try {
          const response = await api.get('/notifications');
          setNotifications(response.data);
        } catch (error) {
          console.error('Failed to fetch notifications:', error);
        }
      };
      fetchNotifications();
    } else {
      socket.off('notification');
    }

    return () => {
      socket.off('notification');
    };
  }, [user]);

  const register = async (userData) => {
    const registeredUser = await authService.register(userData);
    if (registeredUser) {
      setUser(registeredUser);
    }
    return registeredUser;
  };

  const login = async (credentials) => {
    const loggedInUser = await authService.login(credentials);
    if (loggedInUser) {
      setUser(loggedInUser);
    }
    return loggedInUser;
  };

  const logout = () => {
    authService.logout();
    setUser(null);
  };

  const updateUser = (updatedUser) => {
    setUser(updatedUser);
    localStorage.setItem('user', JSON.stringify(updatedUser));
  };

  const markAsRead = (id) => {
    setNotifications(prev => prev.map(n => n._id === id ? { ...n, read: true } : n));
  };

  return (
    <AuthContext.Provider value={{ user, register, login, logout, updateUser, notifications, markAsRead }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
    return useContext(AuthContext);
}

export default AuthContext;