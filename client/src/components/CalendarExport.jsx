import React from 'react';
import api from '../api/axiosInstance';
import './CalendarExport.css';

const CalendarExport = ({ eventId }) => {
  const handleExport = async () => {
    try {
      const response = await api.get(`/events/${eventId}/calendar/export`, { responseType: 'blob' });
      const url = window.URL.createObjectURL(new Blob([response.data]));
      const link = document.createElement('a');
      link.href = url;
      link.setAttribute('download', 'event.ics');
      document.body.appendChild(link);
      link.click();
      link.remove();
    } catch (error) {
      console.error('Export failed:', error);
    }
  };

  return <button className="calendar-export-btn" onClick={handleExport}>Export to Calendar</button>;
};

export default CalendarExport;
