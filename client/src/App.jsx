// in client/src/App.jsx
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { AuthProvider } from './context/AuthContext';

// Import Pages and Components
import HomePage from './pages/HomePage';
import LoginPage from './pages/LoginPage';
import RegisterPage from './pages/RegisterPage';
import ProfilePage from './pages/ProfilePage';
import Header from './components/Header';

// Import All CSS
import './index.css';
import './pages/HomePage.css'; // Note the new path
import './components/AddEventForm.css';
import './components/EditEventModal.css';
import './components/Header.css';
import './components/Spinner.css';
import './components/EmptyState.css';


function App() {
  return (
    <AuthProvider>
      <Router>
        <div className="App">
          <Header />
          <main className="main-content">
            <Routes>
              <Route path="/" element={<HomePage />} />
              <Route path="/login" element={<LoginPage />} />
              <Route path="/register" element={<RegisterPage />} />
              <Route path="/profile" element={<ProfilePage />} />
            </Routes>
          </main>
        </div>
      </Router>
      <ToastContainer
        position="bottom-right"
        autoClose={4000}
        theme="dark"
      />
    </AuthProvider>
  );
}

export default App;