import React from 'react';
import { FaCalendarAlt, FaUsers, FaMapMarkerAlt, FaRocket } from 'react-icons/fa';
import SafeImage from './SafeImage.jsx';

const HeroSection = () => {
  return (
    <div className="hero-section">
      <div className="hero-background">
        <div className="hero-overlay"></div>
      </div>
      <div className="hero-content">
        <div className="hero-text">
          <h1 className="hero-title">
            <FaRocket className="hero-icon" />
            DBIT Campus Events
          </h1>
          <p className="hero-subtitle">
            Discover, Connect, and Experience Amazing Campus Events
          </p>
          <div className="hero-stats">
            <div className="stat-item">
              <FaCalendarAlt className="stat-icon" />
              <div className="stat-content">
                <span className="stat-number">50+</span>
                <span className="stat-label">Events</span>
              </div>
            </div>
            <div className="stat-item">
              <FaUsers className="stat-icon" />
              <div className="stat-content">
                <span className="stat-number">1000+</span>
                <span className="stat-label">Students</span>
              </div>
            </div>
            <div className="stat-item">
              <FaMapMarkerAlt className="stat-icon" />
              <div className="stat-content">
                <span className="stat-number">10+</span>
                <span className="stat-label">Venues</span>
              </div>
            </div>
          </div>
        </div>
        <div className="hero-image">
          <SafeImage 
            src="https://picsum.photos/seed/campusevent/400/300.jpg" 
            alt="Campus Event" 
            className="hero-img"
            fallbackSrc="https://via.placeholder.com/400x300/ff6f00/ffffff?text=Campus+Event"
          />
        </div>
      </div>
    </div>
  );
};

export default HeroSection;
