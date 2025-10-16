const asyncHandler = require('express-async-handler');
const Event = require('../models/eventModel');
const Feedback = require('../models/feedbackModel');
const Notification = require('../models/notificationModel');
const qrcode = require('qrcode');
const ical = require('ical-generator');

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

  // Emit notifications to RSVPd users for schedule change
  const rsvpdUsers = updatedEvent.rsvps;
  for (const userId of rsvpdUsers) {
    const notification = await Notification.create({
      userId,
      eventId: req.params.id,
      message: `Schedule changed for event: ${updatedEvent.name}`,
      type: 'schedule_change',
    });
    global.io.to(userId.toString()).emit('notification', notification);
  }
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
  const isPending = event.pendingRsvps.includes(userId);

  if (isRsvpd) {
    // User wants to cancel RSVP, so pull the user ID from the array
    event.rsvps.pull(userId);
  } else if (isPending) {
    // User wants to cancel pending RSVP
    event.pendingRsvps.pull(userId);
  } else {
    // User wants to RSVP, add to pending RSVPs for admin approval
    event.pendingRsvps.push(userId);
  }

  const updatedEvent = await event.save();
  res.status(200).json(updatedEvent);

  // Emit notification to the user for RSVP update
  let message;
  if (isRsvpd) {
    message = `You canceled RSVP for event: ${updatedEvent.name}`;
  } else if (isPending) {
    message = `You canceled your RSVP request for event: ${updatedEvent.name}`;
  } else {
    message = `Your RSVP request for event: ${updatedEvent.name} is pending admin approval`;
  }
  const notification = await Notification.create({
    userId,
    eventId: req.params.id,
    message,
    type: 'rsvp_update',
  });
  global.io.to(userId.toString()).emit('notification', notification);

  // Notify all admins about the new RSVP request
  if (!isRsvpd && !isPending) {
    const User = require('../models/userModel');
    const admins = await User.find({ role: 'admin' });
    for (const admin of admins) {
      const adminNotification = await Notification.create({
        userId: admin._id,
        eventId: req.params.id,
        message: `New RSVP request for event: ${updatedEvent.name} from ${req.user.name}`,
        type: 'rsvp_request',
      });
      global.io.to(admin._id.toString()).emit('notification', adminNotification);
    }
  }
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
// @access  Private
const generateCheckinQRCode = asyncHandler(async (req, res) => {
  const event = await Event.findById(req.params.id);
  if (!event) {
    res.status(404);
    throw new Error('Event not found');
  }

  // Check if user is RSVPd to the event
  const userId = req.user.id;
  const isRsvpd = event.rsvps.includes(userId);
  if (!isRsvpd) {
    res.status(403);
    throw new Error('You must be RSVPd to generate QR code');
  }

  const qrData = JSON.stringify({ eventId: req.params.id, userId, type: 'checkin' });
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

// @desc    Export event to ICS calendar
// @route   GET /api/events/:id/calendar/export
// @access  Private
const exportCalendar = asyncHandler(async (req, res) => {
  const event = await Event.findById(req.params.id);
  if (!event) {
    res.status(404);
    throw new Error('Event not found');
  }

  const cal = ical({ name: 'DBIT Campus Events' });
  cal.createEvent({
    start: event.date,
    end: new Date(event.date.getTime() + 2 * 60 * 60 * 1000), // Assume 2 hours duration
    summary: event.name,
    description: event.description,
    location: event.venue,
    organizer: event.organizer,
  });

  res.setHeader('Content-Type', 'text/calendar');
  res.setHeader('Content-Disposition', `attachment; filename="${event.name}.ics"`);
  res.send(cal.toString());
});

// @desc    Import events from ICS calendar
// @route   POST /api/events/calendar/import
// @access  Private (Admin only)
const importCalendar = asyncHandler(async (req, res) => {
  const { icsData } = req.body;
  if (!icsData) {
    res.status(400);
    throw new Error('ICS data is required');
  }

  const events = ical.parseICS(icsData);
  const importedEvents = [];

  for (const key in events) {
    const ev = events[key];
    if (ev.type === 'VEVENT') {
      const newEvent = await Event.create({
        name: ev.summary,
        description: ev.description,
        date: ev.start,
        venue: ev.location,
        organizer: ev.organizer || 'Imported',
      });
      importedEvents.push(newEvent);
    }
  }

  res.status(201).json({ message: `${importedEvents.length} events imported`, events: importedEvents });
});


// @desc    Approve or reject RSVP
// @route   POST /api/events/:id/rsvp/:userId/approve
// @access  Private (Admin only)
const approveOrRejectRSVP = asyncHandler(async (req, res) => {
  const { action } = req.body; // 'approve' or 'reject'
  const event = await Event.findById(req.params.id);
  if (!event) {
    res.status(404);
    throw new Error('Event not found');
  }

  const userId = req.params.userId;
  const isPending = event.pendingRsvps.includes(userId);

  if (!isPending) {
    res.status(400);
    throw new Error('User has no pending RSVP for this event');
  }

  if (action === 'approve') {
    event.pendingRsvps.pull(userId);
    event.rsvps.push(userId);

    // Notify user of approval
    const notification = await Notification.create({
      userId,
      eventId: req.params.id,
      message: `Your RSVP for event: ${event.name} has been approved!`,
      type: 'rsvp_approved',
    });
    global.io.to(userId.toString()).emit('notification', notification);
  } else if (action === 'reject') {
    event.pendingRsvps.pull(userId);

    // Notify user of rejection
    const notification = await Notification.create({
      userId,
      eventId: req.params.id,
      message: `Your RSVP for event: ${event.name} has been rejected.`,
      type: 'rsvp_rejected',
    });
    global.io.to(userId.toString()).emit('notification', notification);
  } else {
    res.status(400);
    throw new Error('Invalid action. Use "approve" or "reject"');
  }

  const updatedEvent = await event.save();
  res.status(200).json(updatedEvent);
});

// @desc    Get pending RSVPs for an event
// @route   GET /api/events/:id/pending-rsvps
// @access  Private (Admin only)
const getPendingRSVPs = asyncHandler(async (req, res) => {
  const event = await Event.findById(req.params.id).populate('pendingRsvps', 'name email');
  if (!event) {
    res.status(404);
    throw new Error('Event not found');
  }
  res.status(200).json(event.pendingRsvps);
});

module.exports = {
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
};
