// in client/src/pages/LoginPage.jsx
import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';
import { useAuth } from '../context/AuthContext';
import authService from '../features/auth/authService';
import adminService from '../features/auth/adminService';
import './Auth.css'; // We'll reuse the same CSS from the register page

const LoginPage = () => {
  const [formData, setFormData] = useState({ email: '', password: '' });
  const [userType, setUserType] = useState('student');
  const { email, password } = formData;
  
  const navigate = useNavigate();
  const { user, login } = useAuth();

  useEffect(() => {
    if (user) {
      navigate('/'); // If user is already logged in, redirect
    }
  }, [user, navigate]);

  const onChange = (e) => {
    if (e.target.name === 'userType') {
      setUserType(e.target.value);
    } else {
      setFormData((prevState) => ({
        ...prevState,
        [e.target.name]: e.target.value,
      }));
    }
  };

  const onSubmit = async (e) => {
    e.preventDefault();
    try {
      if (userType === 'admin') {
        await adminService.login({ email, password });
        toast.success('Admin login successful!');
      } else {
        await login({ email, password });
        toast.success('Login successful!');
      }
      navigate('/');
    } catch (error) {
      const message = error.response?.data?.message || 'Something went wrong';
      toast.error(message);
    }
  };

  return (
    <div className="auth-container">
      <h1>Account Login</h1>
      <form onSubmit={onSubmit} className="add-event-form">
        <div className="form-group">
          <label htmlFor="userType">Login As</label>
          <select id="userType" name="userType" value={userType} onChange={onChange}>
            <option value="student">Student</option>
            <option value="admin">Admin</option>
          </select>
        </div>
        <div className="form-group">
          <label htmlFor="email">Email</label>
          <input type="email" id="email" name="email" value={email} onChange={onChange} required />
        </div>
        <div className="form-group">
          <label htmlFor="password">Password</label>
          <input type="password" id="password" name="password" value={password} onChange={onChange} required />
        </div>
        <button type="submit">Login</button>
      </form>
    </div>
  );
};

export default LoginPage;