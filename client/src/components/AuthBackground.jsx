import React from 'react';

const AuthBackground = () => {
  return (
    <div className="auth-background">
      <div className="auth-background-overlay"></div>
      <div className="auth-particles">
        {[...Array(20)].map((_, i) => (
          <div key={i} className="particle" style={{ 
            left: `${Math.random() * 100}%`,
            animationDelay: `${Math.random() * 5}s`,
            animationDuration: `${15 + Math.random() * 10}s`
          }}></div>
        ))}
      </div>
    </div>
  );
};

export default AuthBackground;
