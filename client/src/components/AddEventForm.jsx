import { useState } from 'react';
import api from '../api/axiosInstance';
import { toast } from 'react-toastify';

const AddEventForm = ({ onEventAdded }) => {
  const [name, setName] = useState('');
  const [description, setDescription] = useState('');
  const [date, setDate] = useState('');
  const [venue, setVenue] = useState('');
  const [organizer, setOrganizer] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!name || !date || !venue) {
      return toast.warn('Name, Date, and Venue are required fields.');
    }
    setIsSubmitting(true);
    const newEvent = { name, description, date, venue, organizer };

    try {
      await api.post('/events', newEvent);
      toast.success(`Event "${name}" created successfully!`);
      onEventAdded();
      setName(''); setDescription(''); setDate(''); setVenue(''); setOrganizer('');
    } catch (error) {
      console.error('Error creating event:', error);
      toast.error('Failed to create event. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

// In AddEventForm.jsx, replace the entire return (...) with this:
  return (
    <form onSubmit={handleSubmit} className="add-event-form">
      <h3>Add a New Event</h3>

      <div className="form-group">
        <label htmlFor="add-name">Event Name</label>
        <input id="add-name" type="text" value={name} onChange={(e) => setName(e.target.value)} required autoFocus />
      </div>

      <div className="form-group">
        <label htmlFor="add-description">Description</label>
        <textarea id="add-description" value={description} onChange={(e) => setDescription(e.target.value)} />
      </div>

      <div className="form-group">
        <label htmlFor="add-organizer">Organizer (e.g., Club, Dept)</label>
        <input id="add-organizer" type="text" value={organizer} onChange={(e) => setOrganizer(e.target.value)} required />
      </div>

      <div className="form-row">
        <div className="form-group" style={{flex: 1}}>
          <label htmlFor="add-date">Date</label>
          <input id="add-date" type="date" value={date} onChange={(e) => setDate(e.target.value)} required />
        </div>
        <div className="form-group" style={{flex: 1}}>
          <label htmlFor="add-venue">Venue</label>
          <input id="add-venue" type="text" value={venue} onChange={(e) => setVenue(e.target.value)} required />
        </div>
      </div>
      
      <button type="submit" disabled={isSubmitting}>
        {isSubmitting ? 'Adding...' : 'Add Event'}
      </button>
    </form>
  );
};

export default AddEventForm;