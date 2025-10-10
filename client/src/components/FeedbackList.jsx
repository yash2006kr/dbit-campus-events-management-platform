import React, { useState, useEffect } from 'react';
import { FaStar, FaUser } from 'react-icons/fa';
import { toast } from 'react-toastify';
import api from '../api/axiosInstance';

const FeedbackList = ({ eventId }) => {
  const [feedbacks, setFeedbacks] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchFeedbacks();
  }, [eventId]);

  const fetchFeedbacks = async () => {
    try {
      const response = await api.get(`/events/${eventId}/feedback`);
      setFeedbacks(response.data);
    } catch (error) {
      toast.error('Failed to load feedback');
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return <div className="text-center text-gray-400 py-4">Loading feedback...</div>;
  }

  if (feedbacks.length === 0) {
    return (
      <div className="text-center text-gray-400 py-8">
        <FaStar className="mx-auto text-3xl mb-2 opacity-50" />
        <p>No reviews yet. Be the first to rate this event!</p>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      <h3 className="text-lg font-semibold text-orange-400 mb-4">
        Reviews ({feedbacks.length})
      </h3>

      {feedbacks.map((feedback) => (
        <div
          key={feedback._id}
          className="bg-gray-800 border border-gray-700 rounded-lg p-4"
        >
          <div className="flex items-center gap-3 mb-3">
            <div className="w-8 h-8 bg-orange-500 rounded-full flex items-center justify-center">
              <FaUser className="text-white text-sm" />
            </div>
            <div>
              <p className="font-medium text-white">
                {feedback.isAnonymous ? 'Anonymous' : feedback.user.name}
              </p>
              <div className="flex items-center gap-1">
                {[1, 2, 3, 4, 5].map((star) => (
                  <FaStar
                    key={star}
                    className={`text-sm ${
                      star <= feedback.rating
                        ? 'text-yellow-400'
                        : 'text-gray-400'
                    }`}
                  />
                ))}
                <span className="text-gray-400 text-xs ml-2">
                  {new Date(feedback.createdAt).toLocaleDateString()}
                </span>
              </div>
            </div>
          </div>

          {feedback.comment && (
            <p className="text-gray-300 leading-relaxed">{feedback.comment}</p>
          )}
        </div>
      ))}
    </div>
  );
};

export default FeedbackList;
