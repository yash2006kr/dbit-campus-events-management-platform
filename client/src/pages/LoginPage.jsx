// in client/src/pages/LoginPage.jsx
import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';
import { useAuth } from '../context/AuthContext';
import authService from '../features/auth/authService';
import adminService from '../features/auth/adminService';
import AuthBackground from '../components/AuthBackground.jsx';
import SafeImage from '../components/SafeImage.jsx';
import '../components/AuthBackground.css';
import './AuthEnhanced.css'; // Import enhanced auth CSS for the login page

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
    <>
      <AuthBackground />
      <div className="auth-container-enhanced">
        <div className="auth-card">
          <div className="auth-header">
            <SafeImage 
              src="https://picsum.photos/seed/dbitlogo/200/200.jpg" 
              alt="DBIT Campus Events" 
              className="auth-logo"
              fallbackSrc="https://via.placeholder.com/200x200/ff6f00/ffffff?text=DBIT"
            />
            <h1>Welcome Back</h1>
            <p>Sign in to access your campus events</p>
          </div>
          
          <form onSubmit={onSubmit} className="auth-form">
            <div className="form-group-enhanced">
              <label htmlFor="userType">Login As</label>
              <div className="user-type-selector">
                <button 
                  type="button" 
                  className={`user-type-btn ${userType === 'student' ? 'active' : ''}`}
                  onClick={() => setUserType('student')}
                >
                  Student
                </button>
                <button 
                  type="button" 
                  className={`user-type-btn ${userType === 'admin' ? 'active' : ''}`}
                  onClick={() => setUserType('admin')}
                >
                  Admin
                </button>
              </div>
            </div>
            
            <div className="form-group-enhanced">
              <label htmlFor="email">Email Address</label>
              <input 
                type="email" 
                id="email" 
                name="email" 
                value={email} 
                onChange={onChange} 
                required 
                placeholder="Enter your email"
              />
            </div>
            
            <div className="form-group-enhanced">
              <label htmlFor="password">Password</label>
              <input 
                type="password" 
                id="password" 
                name="password" 
                value={password} 
                onChange={onChange} 
                required 
                placeholder="Enter your password"
              />
            </div>
            
            <button type="submit" className="auth-submit-btn">
              {userType === 'admin' ? 'Admin Login' : 'Student Login'}
            </button>
          </form>
          
          <div className="auth-footer">
            <p>Don't have an account? <a href="/register">Sign up</a></p>
            <p>
              {userType === 'admin' ? (
                <>Test: admin@dbit.edu / admin123</>
              ) : (
                <>Test: john.doe@dbit.edu / student123</>
              )}
            </p>
          </div>
        </div>
      </div>
    </>
  );
};

export default LoginPage;