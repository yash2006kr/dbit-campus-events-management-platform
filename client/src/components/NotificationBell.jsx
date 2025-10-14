import React, { useState } from 'react';
import { FaBell } from 'react-icons/fa';
import { useAuth } from '../context/AuthContext';
import NotificationPanel from './NotificationPanel';

const NotificationBell = () => {
  const { user, notifications } = useAuth();
  const [showPanel, setShowPanel] = useState(false);

  if (!user) return null;

  const unreadCount = notifications.filter(n => !n.read).length;

  const togglePanel = () => setShowPanel(!showPanel);

  return (
    <div className="notification-bell">
      <button onClick={togglePanel} className="bell-button">
        <FaBell />
        {unreadCount > 0 && <span className="badge">{unreadCount}</span>}
      </button>
      {showPanel && <NotificationPanel onClose={() => setShowPanel(false)} />}
    </div>
  );
};

export default NotificationBell;
