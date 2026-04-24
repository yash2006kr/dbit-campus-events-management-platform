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
import HeroSection from '../components/HeroSection.jsx';
import '../components/HeroSection.css';
import EventCard from '../components/EventCard.jsx';
import '../components/EventCard.css';

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
    <div className="home-page">
      <HeroSection />
      
      <div className="events-section">
        <div className="events-header">
          <h1>Upcoming Campus Events</h1>
          <SearchBar onSearch={handleSearch} />
          {user && user.role === 'admin' && <CalendarImport />}
        </div>

        {user && user.role === 'admin' && <AddEventForm onEventAdded={fetchEvents} />}
        
        {isLoading ? ( <Spinner /> ) : (
          <>
            {events.length > 0 ? (
              <div className="events-grid-enhanced">
                {events.map((event) => (
                  <EventCard
                    key={event._id}
                    event={event}
                    user={user}
                    onRSVP={handleRsvp}
                    onDelete={handleDelete}
                    onEdit={handleOpenEditModal}
                    onGenerateQR={handleGenerateQR}
                    onManageRSVP={handleManageRSVP}
                    onCalendarExport={CalendarExport}
                  />
                ))}
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
    </div>
  );
};

export default HomePage;