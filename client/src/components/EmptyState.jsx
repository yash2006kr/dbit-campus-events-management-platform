import { FaCalendarPlus } from 'react-icons/fa';
import './EmptyState.css';

const EmptyState = () => {
  return (
    <div className="empty-state">
      <FaCalendarPlus className="empty-state-icon" />
      <h2>No Events Yet</h2>
      <p>Be the first to add a new event to the platform!</p>
    </div>
  );
};

export default EmptyState;