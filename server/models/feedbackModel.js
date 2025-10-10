const mongoose = require('mongoose');

const feedbackSchema = mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
    },
    event: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Event',
      required: true,
    },
    rating: {
      type: Number,
      required: true,
      min: 1,
      max: 5,
    },
    comment: {
      type: String,
      maxlength: 500, // Limit comment length
    },
    isAnonymous: {
      type: Boolean,
      default: false,
    },
  },
  {
    timestamps: true,
  }
);

// Ensure one feedback per user per event
feedbackSchema.index({ user: 1, event: 1 }, { unique: true });

// Index for efficient queries
feedbackSchema.index({ event: 1, createdAt: -1 });

module.exports = mongoose.model('Feedback', feedbackSchema);
