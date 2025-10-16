const mongoose = require('mongoose');

const eventSchema = mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, 'Please add an event name'],
    },
    description: {
      type: String,
      required: [true, 'Please add a description'],
    },
    date: {
      type: Date,
      required: [true, 'Please add an event date'],
    },
    venue: {
      type: String,
      required: [true, 'Please add a venue'],
    },
    organizer: {
      type: String,
      required: [true, 'Please add an organizer (e.g., club, department)'],
    },
    // --- ADDED THIS FIELD ---
    rsvps: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User', // This links to our User model
      },
    ],
    // Pending RSVPs awaiting admin approval
    pendingRsvps: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
      },
    ],
    // Attendance tracking
    attendees: [
      {
        user: {
          type: mongoose.Schema.Types.ObjectId,
          ref: 'User',
        },
        checkinTime: {
          type: Date,
          default: Date.now,
        },
      },
    ],
    // Average rating from feedback
    averageRating: {
      type: Number,
      default: 0,
    },
    // Change history for notifications
    changeHistory: [
      {
        changeType: {
          type: String,
          enum: ['created', 'updated', 'deleted'],
        },
        changedBy: {
          type: mongoose.Schema.Types.ObjectId,
          ref: 'User',
        },
        timestamp: {
          type: Date,
          default: Date.now,
        },
        details: {
          type: Object,
        },
      },
    ],
  },
  {
    timestamps: true,
  }
);

module.exports = mongoose.model('Event', eventSchema);
