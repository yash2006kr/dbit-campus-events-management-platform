// in client/src/components/Header.jsx
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import './Header.css';

const Header = () => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  const onLogout = () => {
    logout();
    navigate('/');
  };

  return (
    <header className="app-header">
      <div className="header-brand">
        <Link to="/">DBIT CampusEvents</Link>
      </div>
      <nav className="header-nav">
        {user ? (
          <>
            <Link to="/profile">Profile</Link>
            <span className="header-username">Welcome, {user.name.split(' ')[0]}!</span>
            <button onClick={onLogout} className="btn-logout">Logout</button>
          </>
        ) : (
          <>
            <Link to="/login">Login</Link>
            <Link to="/register">Register</Link>
          </>
        )}
      </nav>
    </header>
  );
};

export default Header;