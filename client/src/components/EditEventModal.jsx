import { useState, useEffect } from 'react';
import api from '../api/axiosInstance';
import { toast } from 'react-toastify';

const EditEventModal = ({ event, onClose, onEventUpdated }) => {
  const [formData, setFormData] = useState({ name: '', description: '', date: '', venue: '', organizer: '' });
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    if (event) {
      setFormData({
        name: event.name, description: event.description,
        date: new Date(event.date).toISOString().split('T')[0],
        venue: event.venue, organizer: event.organizer,
      });
    }
  }, [event]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);
    try {
      await api.put(`/events/${event._id}`, formData);
      toast.success(`Event "${formData.name}" updated!`);
      onEventUpdated();
    } catch (error) {
      console.error('Error updating event:', error);
      toast.error('Failed to update event.');
    } finally {
      setIsSubmitting(false);
    }
  };

  if (!event) return null;

// In EditEventModal.jsx, replace the entire return (...) with this:
  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal-content" onClick={(e) => e.stopPropagation()}>
        <form onSubmit={handleSubmit} className="add-event-form">
          <h3>Edit Event</h3>

          <div className="form-group">
            <label htmlFor="edit-name">Event Name</label>
            <input id="edit-name" type="text" name="name" value={formData.name} onChange={handleChange} required autoFocus/>
          </div>

          <div className="form-group">
            <label htmlFor="edit-description">Description</label>
            <textarea id="edit-description" name="description" value={formData.description} onChange={handleChange} />
          </div>

          <div className="form-group">
            <label htmlFor="edit-organizer">Organizer</label>
            <input id="edit-organizer" type="text" name="organizer" value={formData.organizer} onChange={handleChange} required />
          </div>

          <div className="form-row">
            <div className="form-group" style={{flex: 1}}>
              <label htmlFor="edit-date">Date</label>
              <input id="edit-date" type="date" name="date" value={formData.date} onChange={handleChange} required />
            </div>
            <div className="form-group" style={{flex: 1}}>
              <label htmlFor="edit-venue">Venue</label>
              <input id="edit-venue" type="text" name="venue" value={formData.venue} onChange={handleChange} required />
            </div>
          </div>
          
          <div className="form-buttons">
            <button type="button" onClick={onClose} className="btn-cancel" disabled={isSubmitting}>Cancel</button>
            <button type="submit" className="btn-save" disabled={isSubmitting}>
              {isSubmitting ? 'Saving...' : 'Save Changes'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default EditEventModal;