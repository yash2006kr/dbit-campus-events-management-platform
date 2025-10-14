import React from 'react';
import { useAuth } from '../context/AuthContext';

const NotificationPanel = ({ onClose }) => {
  const { notifications, markAsRead } = useAuth();

  return (
    <div className="notification-panel">
      <div className="panel-header">
        <h3>Notifications</h3>
        <button onClick={onClose}>×</button>
      </div>
      <div className="notifications-list">
        {notifications.length === 0 ? (
          <p>No notifications</p>
        ) : (
          notifications.map(n => (
            <div key={n._id} className={`notification ${n.read ? 'read' : 'unread'}`} onClick={() => markAsRead(n._id)}>
              <p>{n.message}</p>
              <small>{new Date(n.createdAt).toLocaleString()}</small>
            </div>
          ))
        )}
      </div>
    </div>
  );
};

export default NotificationPanel;
