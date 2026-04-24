import React from 'react';
import { FaMapMarkerAlt, FaCalendarAlt, FaUsers, FaQrcode, FaClock, FaEdit, FaTrash, FaStar } from 'react-icons/fa';
import SafeImage from './SafeImage.jsx';

const EventCard = ({ 
  event, 
  user, 
  onRSVP, 
  onDelete, 
  onEdit, 
  onGenerateQR, 
  onManageRSVP, 
  onCalendarExport 
}) => {
  const isRsvpd = user && event.rsvps.includes(user._id);
  
  // Get realistic event images based on event type
  const getEventImage = (eventName, organizer) => {
    const imageMap = {
      'tech': 'https://picsum.photos/seed/techevent/800/600.jpg',
      'cultural': 'https://picsum.photos/seed/culturalevent/800/600.jpg',
      'hackathon': 'https://picsum.photos/seed/hackathon/800/600.jpg',
      'career': 'https://picsum.photos/seed/careerfair/800/600.jpg',
      'workshop': 'https://picsum.photos/seed/workshop/800/600.jpg',
      'concert': 'https://picsum.photos/seed/concert/800/600.jpg'
    };

    const lowerName = eventName.toLowerCase();
    const lowerOrganizer = organizer.toLowerCase();
    
    if (lowerName.includes('tech') || lowerName.includes('coding') || lowerOrganizer.includes('it')) {
      return imageMap.tech;
    } else if (lowerName.includes('cultural') || lowerName.includes('music') || lowerName.includes('dance')) {
      return imageMap.cultural;
    } else if (lowerName.includes('hackathon') || lowerName.includes('coding')) {
      return imageMap.hackathon;
    } else if (lowerName.includes('career') || lowerName.includes('placement')) {
      return imageMap.career;
    } else if (lowerName.includes('workshop') || lowerName.includes('ai') || lowerName.includes('machine')) {
      return imageMap.workshop;
    } else {
      return imageMap.concert; // Default
    }
  };

  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', { 
      month: 'short', 
      day: 'numeric', 
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  return (
    <div className="event-card-enhanced">
      {user && user.role === 'admin' && (
        <div className="card-buttons">
          <button onClick={() => onEdit(event)} className="edit-btn">
            <FaEdit />
          </button>
          <button onClick={() => onDelete(event._id)} className="delete-btn">
            <FaTrash />
          </button>
        </div>
      )}
      
      <div className="event-image-container">
        <SafeImage 
          src={getEventImage(event.name, event.organizer)} 
          alt={event.name}
          className="event-image"
          fallbackSrc="https://via.placeholder.com/800x600/ff6f00/ffffff?text=Event"
        />
        <div className="event-date-badge">
          <FaCalendarAlt className="badge-icon" />
          {new Date(event.date).getDate()}
        </div>
        {event.averageRating > 0 && (
          <div className="event-rating">
            <FaStar className="rating-star" />
            {event.averageRating.toFixed(1)}
          </div>
        )}
      </div>
      
      <div className="event-content">
        <div className="event-header">
          <h2 className="event-title">{event.name}</h2>
          <p className="event-organizer">By {event.organizer}</p>
        </div>
        
        <p className="event-description">{event.description}</p>
        
        <div className="event-details">
          <div className="detail-item">
            <FaMapMarkerAlt className="detail-icon" />
            <span>{event.venue}</span>
          </div>
          <div className="detail-item">
            <FaCalendarAlt className="detail-icon" />
            <span>{formatDate(event.date)}</span>
          </div>
        </div>
        
        <div className="event-footer">
          <div className="rsvp-section">
            <div className="rsvp-count">
              <FaUsers className="rsvp-icon" />
              <span>{event.rsvps.length} going</span>
              {user && user.role === 'admin' && event.pendingRsvps && event.pendingRsvps.length > 0 && (
                <span className="pending-count">
                  <FaClock className="pending-icon" />
                  {event.pendingRsvps.length} pending
                </span>
              )}
            </div>
          </div>
          
          <div className="event-actions">
            {user && user.role === 'student' && (
              <div className="student-actions">
                <button 
                  onClick={() => onRSVP(event._id)} 
                  className={`btn-rsvp ${isRsvpd ? 'registered' : ''}`}
                >
                  {isRsvpd ? 'Cancel RSVP' : 'RSVP Now'}
                </button>
                {isRsvpd && (
                  <div className="secondary-actions">
                    <button onClick={() => onGenerateQR(event._id)} className="btn-qr">
                      <FaQrcode />
                    </button>
                    {onCalendarExport && <CalendarExport eventId={event._id} />}
                  </div>
                )}
              </div>
            )}
            
            {user && user.role === 'admin' && (
              <div className="admin-actions">
                <button onClick={() => onGenerateQR(event._id)} className="btn-qr">
                  <FaQrcode />
                </button>
                <button onClick={() => onManageRSVP(event._id)} className="btn-manage">
                  <FaClock />
                </button>
                {onCalendarExport && <CalendarExport eventId={event._id} />}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default EventCard;
