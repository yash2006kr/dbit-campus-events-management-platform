const asyncHandler = require('express-async-handler');
const Event = require('../models/eventModel');
const Feedback = require('../models/feedbackModel');
const qrcode = require('qrcode');

// @desc    Get all events
const getEvents = asyncHandler(async (req, res) => {
  const { search } = req.query;
  let query = {};

  if (search) {
    query = {
      $or: [
        { name: { $regex: search, $options: 'i' } },
        { organizer: { $regex: search, $options: 'i' } },
        { venue: { $regex: search, $options: 'i' } },
      ],
    };
  }

  const events = await Event.find(query).sort({ date: 1 }); // Sort by date ascending
  res.status(200).json(events);
});

// @desc    Create a new event
const createEvent = asyncHandler(async (req, res) => {
  const { name, description, date, venue, organizer } = req.body;
  if (!name || !description || !date || !venue || !organizer) {
    res.status(400);
    throw new Error('Please include all fields');
  }
  const newEvent = await Event.create({ name, description, date, venue, organizer });
  res.status(201).json(newEvent);
});

// @desc    Update an event
const updateEvent = asyncHandler(async (req, res) => {
  const event = await Event.findById(req.params.id);
  if (!event) {
    res.status(404);
    throw new Error('Event not found');
  }
  const updatedEvent = await Event.findByIdAndUpdate(req.params.id, req.body, { new: true });
  res.status(200).json(updatedEvent);
});

// @desc    Delete an event
const deleteEvent = asyncHandler(async (req, res) => {
  const event = await Event.findById(req.params.id);
  if (!event) {
    res.status(404);
    throw new Error('Event not found');
  }
  await Event.findByIdAndDelete(req.params.id);
  res.status(200).json({ id: req.params.id, message: 'Event removed' });
});

// --- NEW RSVP FUNCTION ---
// @desc    RSVP to an event / Cancel RSVP
// @route   POST /api/events/:id/rsvp
// @access  Private
const rsvpToEvent = asyncHandler(async (req, res) => {
  const event = await Event.findById(req.params.id);
  if (!event) {
    res.status(404);
    throw new Error('Event not found');
  }

  const userId = req.user.id;
  const isRsvpd = event.rsvps.includes(userId);

  if (isRsvpd) {
    // User wants to cancel RSVP, so pull the user ID from the array
    event.rsvps.pull(userId);
  } else {
    // User wants to RSVP, so add the user ID to the array
    event.rsvps.push(userId);
  }

  const updatedEvent = await event.save();
  res.status(200).json(updatedEvent);
});

// @desc    Add or update feedback for an event
// @route   POST /api/events/:eventId/feedback
// @access  Private
const addOrUpdateFeedback = asyncHandler(async (req, res) => {
  const { rating, comment, isAnonymous } = req.body;

  if (!rating || rating < 1 || rating > 5) {
    res.status(400);
    throw new Error('Rating must be between 1 and 5');
  }

  const feedback = await Feedback.findOneAndUpdate(
    { user: req.user.id, event: req.params.eventId },
    { rating, comment, isAnonymous },
    { new: true, upsert: true }
  );

  // Update average rating for the event
  const feedbacks = await Feedback.find({ event: req.params.eventId });
  const avgRating = feedbacks.length > 0 ? feedbacks.reduce((sum, f) => sum + f.rating, 0) / feedbacks.length : 0;
  await Event.findByIdAndUpdate(req.params.eventId, { averageRating: avgRating });

  res.status(200).json(feedback);
});

// @desc    Get feedback for an event
// @route   GET /api/events/:eventId/feedback
// @access  Public
const getFeedbackForEvent = asyncHandler(async (req, res) => {
  const feedbacks = await Feedback.find({ event: req.params.eventId }).populate('user', 'name');
  res.status(200).json(feedbacks);
});

// @desc    Generate QR code for check-in
// @route   GET /api/events/:id/qr
// @access  Private (Admin only)
const generateCheckinQRCode = asyncHandler(async (req, res) => {
  const event = await Event.findById(req.params.id);
  if (!event) {
    res.status(404);
    throw new Error('Event not found');
  }

  const qrData = JSON.stringify({ eventId: req.params.id, type: 'checkin' });
  const qrCode = await qrcode.toDataURL(qrData);
  res.status(200).json({ qrCode });
});

// @desc    Check-in user to event
// @route   POST /api/events/:id/checkin
// @access  Private
const checkinUser = asyncHandler(async (req, res) => {
  const { qrData } = req.body;

  if (!qrData) {
    res.status(400);
    throw new Error('QR data is required');
  }

  const { eventId } = JSON.parse(qrData);

  if (eventId !== req.params.id) {
    res.status(400);
    throw new Error('Invalid QR code for this event');
  }

  const event = await Event.findById(eventId);
  if (!event) {
    res.status(404);
    throw new Error('Event not found');
  }

  const userId = req.user.id;
  const alreadyCheckedIn = event.attendees.some(att => att.user.toString() === userId);

  if (alreadyCheckedIn) {
    res.status(400);
    throw new Error('User already checked in');
  }

  event.attendees.push({ user: userId });
  await event.save();

  res.status(200).json({ message: 'Checked in successfully' });
});


module.exports = {
  getEvents,
  createEvent,
  updateEvent,
  deleteEvent,
  rsvpToEvent,
  addOrUpdateFeedback,
  getFeedbackForEvent,
  generateCheckinQRCode,
  checkinUser,
};
