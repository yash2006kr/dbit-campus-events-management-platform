// in client/src/pages/RegisterPage.jsx
import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';
import { useAuth } from '../context/AuthContext';
import './Auth.css';

const RegisterPage = () => {
  const [formData, setFormData] = useState({
    name: '', email: '', password: '', password2: '',
  });
  const { name, email, password, password2 } = formData;

  const navigate = useNavigate();
  const { user, register } = useAuth();

  useEffect(() => {
    if (user) {
      navigate('/'); // If user is already logged in, redirect to home
    }
  }, [user, navigate]);

  const onChange = (e) => {
    setFormData((prevState) => ({
      ...prevState,
      [e.target.name]: e.target.value,
    }));
  };

  const onSubmit = async (e) => {
    e.preventDefault();
    if (password !== password2) {
      toast.error('Passwords do not match');
    } else {
      try {
        await register({ name, email, password });
        toast.success('Registration successful! Welcome.');
        navigate('/');
      } catch (error) {
        const message = error.response?.data?.message || 'Something went wrong';
        toast.error(message);
      }
    }
  };

  return (
    <div className="auth-container">
      <h1>Create Account</h1>
      <form onSubmit={onSubmit} className="add-event-form">
        <div className="form-group">
          <label htmlFor="name">Full Name</label>
          <input type="text" id="name" name="name" value={name} onChange={onChange} required />
        </div>
        <div className="form-group">
          <label htmlFor="email">Email</label>
          <input type="email" id="email" name="email" value={email} onChange={onChange} required />
        </div>
        <div className="form-group">
          <label htmlFor="password">Password</label>
          <input type="password" id="password" name="password" value={password} onChange={onChange} required />
        </div>
        <div className="form-group">
          <label htmlFor="password2">Confirm Password</label>
          <input type="password" id="password2" name="password2" value={password2} onChange={onChange} required />
        </div>
        <button type="submit">Register</button>
      </form>
    </div>
  );
};

export default RegisterPage;