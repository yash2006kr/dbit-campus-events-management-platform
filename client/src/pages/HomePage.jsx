import { useState, useEffect } from 'react';
import { toast } from 'react-toastify';
import { FaMapMarkerAlt, FaCalendarAlt, FaUsers, FaQrcode, FaClock } from 'react-icons/fa';
import { useAuth } from '../context/AuthContext';
import api from '../api/axiosInstance';

import AddEventForm from '../components/AddEventForm.jsx';
import EditEventModal from '../components/EditEventModal.jsx';
import SearchBar from '../components/SearchBar.jsx';
import Spinner from '../components/Spinner.jsx';
import EmptyState from '../components/EmptyState.jsx';
import CalendarExport from '../components/CalendarExport.jsx';
import CalendarImport from '../components/CalendarImport.jsx';
import QRCodeDisplay from '../components/QRCodeDisplay.jsx';
import AdminEventRSVPManagement from '../components/AdminEventRSVPManagement.jsx';

const HomePage = () => {
  const { user } = useAuth();
  const [events, setEvents] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [currentEvent, setCurrentEvent] = useState(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [qrCodeImageUrl, setQrCodeImageUrl] = useState(null);
  const [showQRCode, setShowQRCode] = useState(null);
  const [showRSVPModal, setShowRSVPModal] = useState(null);

  const fetchEvents = async (query = '') => {
    try {
      const response = await api.get('/events', { params: { search: query } });
      setEvents(response.data);
    } catch (error) {
      toast.error('Failed to fetch events.');
      console.error('Error fetching events:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleSearch = (query) => {
    setSearchQuery(query);
    fetchEvents(query);
  };
  useEffect(() => { fetchEvents(); }, []);
  const handleDelete = async (eventId) => {
    if (window.confirm('Are you sure you want to delete this event?')) {
      try {
        await api.delete(`/events/${eventId}`);
        toast.success('Event deleted successfully!');
        fetchEvents(); // Refresh the list
      } catch (error) {
        toast.error('Failed to delete event.');
        console.error('Error deleting event:', error);
      }
    }
  };

  const handleOpenEditModal = (event) => {
    setCurrentEvent(event);
    setIsModalOpen(true);
  };

  const handleCloseEditModal = () => {
    setIsModalOpen(false);
    setCurrentEvent(null);
  };

  const handleEventUpdated = () => {
    fetchEvents(); // Refresh the list
    handleCloseEditModal();
  };

  // --- NEW RSVP HANDLER FUNCTION ---
  const handleRsvp = async (eventId) => {
    try {
      const response = await api.post(`/events/${eventId}/rsvp`);
      // Update the state for just the one event that changed
      setEvents((prevEvents) =>
        prevEvents.map((event) =>
          event._id === eventId ? response.data : event
        )
      );
      toast.success('Your RSVP has been updated!');
    } catch (error) {
      toast.error(error.response?.data?.message || 'Failed to update RSVP.');
    }
  };

  // Handle QR Code generation for admins
  const handleGenerateQR = async (eventId) => {
    try {
      const response = await api.get(`/events/${eventId}/qr`);
      setQrCodeImageUrl(response.data.qrCode);
      setShowQRCode(eventId);
    } catch (error) {
      toast.error('Failed to generate QR code');
    }
  };

  // Handle RSVP management modal for admins
  const handleManageRSVP = (eventId) => {
    setShowRSVPModal(eventId);
  };

  const closeQRCode = () => {
    setShowQRCode(null);
    setQrCodeImageUrl(null);
  };

  const closeRSVPModal = () => {
    setShowRSVPModal(null);
  };

  return (
    <div className="event-list-container">
      {user && user.role === 'admin' && <AddEventForm onEventAdded={fetchEvents} />}

      <h1>Upcoming Campus Events</h1>
      <SearchBar onSearch={handleSearch} />
      {user && user.role === 'admin' && <CalendarImport />}
      {isLoading ? ( <Spinner /> ) : (
        <>
          {events.length > 0 ? (
            <div className="events-grid">
              {events.map((event) => {
                const isRsvpd = user && event.rsvps.includes(user._id);
                return (
                  <div key={event._id} className="event-card">
                    {user && user.role === 'admin' && (
                      <div className="card-buttons">
                        <button onClick={() => handleOpenEditModal(event)} className="edit-btn">Edit</button>
                        <button onClick={() => handleDelete(event._id)} className="delete-btn">&times;</button>
                      </div>
                    )}
                    <h2>{event.name}</h2>
                    <p className="event-organizer">By: {event.organizer}</p>
                    <p>{event.description}</p>
                    <div className="event-details">
                      <span><FaMapMarkerAlt /> {event.venue}</span>
                      <span><FaCalendarAlt /> {new Date(event.date).toLocaleString('en-IN', { dateStyle: 'medium', timeStyle: 'short' })}</span>
                    </div>

                    {/* --- NEW RSVP SECTION --- */}
                    <div className="event-footer">
                      <div className="rsvp-count">
                        <FaUsers /> {event.rsvps.length} going
                        {user && user.role === 'admin' && event.pendingRsvps && event.pendingRsvps.length > 0 && (
                          <span className="pending-count">
                            <FaClock /> {event.pendingRsvps.length} pending
                          </span>
                        )}
                      </div>
                      {user && user.role === 'student' && (
                        <div className="student-buttons">
                          <button onClick={() => handleRsvp(event._id)} className={`btn-rsvp ${isRsvpd ? 'registered' : ''}`}>
                            {isRsvpd ? 'Cancel RSVP' : 'RSVP Now'}
                          </button>
                          {isRsvpd && (
                            <>
                              <button onClick={() => handleGenerateQR(event._id)} className="btn-qr">
                                <FaQrcode /> QR Code
                              </button>
                              <CalendarExport eventId={event._id} />
                            </>
                          )}
                        </div>
                      )}
                      {user && user.role === 'admin' && (
                        <div className="admin-buttons">
                          <button onClick={() => handleGenerateQR(event._id)} className="btn-qr">
                            <FaQrcode /> QR Code
                          </button>
                          <button onClick={() => handleManageRSVP(event._id)} className="btn-manage-rsvp">
                            <FaClock /> Manage RSVPs
                          </button>
                          <CalendarExport eventId={event._id} />
                        </div>
                      )}
                    </div>
                  </div>
                );
              })}
            </div>
          ) : ( <EmptyState /> )}
        </>
      )}

      {isModalOpen && (
        <EditEventModal
          event={currentEvent}
          onClose={handleCloseEditModal}
          onEventUpdated={handleEventUpdated}
        />
      )}

      {showQRCode && qrCodeImageUrl && (
        <QRCodeDisplay
          qrCodeUrl={qrCodeImageUrl}
          eventId={showQRCode}
          onClose={closeQRCode}
        />
      )}

      {showRSVPModal && (
        <AdminEventRSVPManagement
          eventId={showRSVPModal}
          onClose={closeRSVPModal}
        />
      )}
    </div>
  );
};

export default HomePage;