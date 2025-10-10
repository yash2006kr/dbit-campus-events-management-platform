// in client/src/context/AuthContext.jsx
import { createContext, useState, useEffect, useContext } from 'react';
import authService from '../features/auth/authService';

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);

  useEffect(() => {
    const storedUser = JSON.parse(localStorage.getItem('user'));
    if (storedUser) {
      setUser(storedUser);
    }
  }, []);

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

  return (
    <AuthContext.Provider value={{ user, register, login, logout, updateUser }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
    return useContext(AuthContext);
}

export default AuthContext;