const express = require('express');
const router = express.Router();
const {
  getEvents,
  createEvent,
  updateEvent,
  deleteEvent,
  rsvpToEvent,
  approveOrRejectRSVP,
  getPendingRSVPs,
  addOrUpdateFeedback,
  getFeedbackForEvent,
  generateCheckinQRCode,
  checkinUser,
  exportCalendar,
  importCalendar,
} = require('../controllers/eventController');
const { protect, adminOnly } = require('../middleware/authMiddleware');

router.route('/').get(getEvents).post(protect, adminOnly, createEvent);
router.route('/:id').put(protect, adminOnly, updateEvent).delete(protect, adminOnly, deleteEvent);

// RSVP route
router.route('/:id/rsvp').post(protect, rsvpToEvent);
router.route('/:id/rsvp/:userId/approve').post(protect, adminOnly, approveOrRejectRSVP);
router.route('/:id/pending-rsvps').get(protect, adminOnly, getPendingRSVPs);

// Feedback routes
router.route('/:eventId/feedback').post(protect, addOrUpdateFeedback).get(getFeedbackForEvent);

// QR Code routes
router.route('/:id/qr').get(protect, generateCheckinQRCode);
router.route('/:id/checkin').post(protect, checkinUser);

// Calendar routes
router.route('/:id/calendar/export').get(protect, exportCalendar);
router.route('/calendar/import').post(protect, adminOnly, importCalendar);

module.exports = router;
