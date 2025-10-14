import React, { useState } from 'react';
import api from '../api/axiosInstance';
import './CalendarImport.css';

const CalendarImport = () => {
  const [file, setFile] = useState(null);

  const handleFileChange = (e) => setFile(e.target.files[0]);

  const handleImport = async () => {
    if (!file) return;
    const reader = new FileReader();
    reader.onload = async (e) => {
      const icsData = e.target.result;
      try {
        await api.post('/events/calendar/import', { icsData });
        alert('Events imported successfully');
      } catch (error) {
        console.error('Import failed:', error);
      }
    };
    reader.readAsText(file);
  };

  return (
    <div className="calendar-import">
      <input type="file" accept=".ics" onChange={handleFileChange} />
      <button onClick={handleImport}>Import Calendar</button>
    </div>
  );
};

export default CalendarImport;
