import React, { useState, useEffect } from 'react';
import { FaCheck, FaTimes, FaClock } from 'react-icons/fa';
import { toast } from 'react-toastify';
import api from '../api/axiosInstance';

const AdminEventRSVPManagement = ({ eventId, onClose }) => {
  const [pendingRSVPs, setPendingRSVPs] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchPendingRSVPs();
  }, [eventId]);

  const fetchPendingRSVPs = async () => {
    try {
      const response = await api.get(`/events/${eventId}/pending-rsvps`);
      setPendingRSVPs(response.data);
    } catch (error) {
      toast.error('Failed to load pending RSVPs');
    } finally {
      setLoading(false);
    }
  };

  const handleApproveReject = async (userId, action) => {
    try {
      await api.post(`/events/${eventId}/rsvp/${userId}/approve`, { action });
      toast.success(`RSVP ${action}d successfully`);
      // Remove from pending list
      setPendingRSVPs(prev => prev.filter(user => user._id !== userId));
    } catch (error) {
      toast.error(`Failed to ${action} RSVP`);
    }
  };

  if (loading) {
    return (
      <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
        <div className="bg-gray-900 border border-orange-500 rounded-lg p-6 w-full max-w-md mx-4">
          <div className="text-center text-gray-400">Loading pending RSVPs...</div>
        </div>
      </div>
    );
  }

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-gray-900 border border-orange-500 rounded-lg p-6 w-full max-w-lg mx-4 max-h-[80vh] overflow-y-auto">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-xl font-bold text-orange-400">Manage RSVPs</h2>
          <button onClick={onClose} className="text-gray-400 hover:text-white">
            <FaTimes />
          </button>
        </div>

        {pendingRSVPs.length === 0 ? (
          <div className="text-center text-gray-400 py-8">
            <FaClock className="mx-auto text-3xl mb-2 opacity-50" />
            <p>No pending RSVPs</p>
          </div>
        ) : (
          <div className="space-y-3">
            {pendingRSVPs.map((user) => (
              <div key={user._id} className="bg-gray-800 border border-gray-700 rounded-lg p-4">
                <div className="flex justify-between items-center">
                  <div>
                    <p className="font-medium text-white">{user.name}</p>
                    <p className="text-gray-400 text-sm">{user.email}</p>
                  </div>
                  <div className="flex gap-2">
                    <button
                      onClick={() => handleApproveReject(user._id, 'approve')}
                      className="bg-green-600 hover:bg-green-500 text-white px-3 py-1 rounded text-sm flex items-center gap-1"
                    >
                      <FaCheck />
                      Approve
                    </button>
                    <button
                      onClick={() => handleApproveReject(user._id, 'reject')}
                      className="bg-red-600 hover:bg-red-500 text-white px-3 py-1 rounded text-sm flex items-center gap-1"
                    >
                      <FaTimes />
                      Reject
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default AdminEventRSVPManagement;
