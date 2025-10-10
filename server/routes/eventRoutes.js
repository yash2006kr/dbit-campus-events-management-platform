const express = require('express');
const router = express.Router();
const {
  getEvents,
  createEvent,
  updateEvent,
  deleteEvent,
  rsvpToEvent,
  addOrUpdateFeedback,
  getFeedbackForEvent,
  generateCheckinQRCode,
  checkinUser,
} = require('../controllers/eventController');
const { protect, adminOnly } = require('../middleware/authMiddleware');

router.route('/').get(getEvents).post(protect, adminOnly, createEvent);
router.route('/:id').put(protect, adminOnly, updateEvent).delete(protect, adminOnly, deleteEvent);

// RSVP route
router.route('/:id/rsvp').post(protect, rsvpToEvent);

// Feedback routes
router.route('/:eventId/feedback').post(protect, addOrUpdateFeedback).get(getFeedbackForEvent);

// QR Code routes
router.route('/:id/qr').get(protect, adminOnly, generateCheckinQRCode);
router.route('/:id/checkin').post(protect, checkinUser);

module.exports = router;
