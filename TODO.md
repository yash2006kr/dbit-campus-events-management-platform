# DBIT Campus Event Management Platform - Feature Implementation TODO

## Completed Features
- [x] RSVP System (backend and frontend fully implemented)

## Pending Features

### 1. Real-time Notifications for Schedule Changes
- [x] Backend: Create server/models/notificationModel.js
- [x] Backend: Add notification fields to server/models/eventModel.js (change history, timestamps)
- [x] Backend: Add notification endpoints in server/controllers/eventController.js
- [ ] Backend: Implement WebSocket server in server/server.js
- [x] Backend: Add notification routes in server/routes/eventRoutes.js
- [ ] Frontend: Create client/src/components/NotificationBell.jsx
- [ ] Frontend: Create client/src/components/NotificationPanel.jsx
- [ ] Frontend: Integrate WebSocket client in client/src/context/AuthContext.jsx or new context
- [ ] Frontend: Add notification display in Header.jsx
- [ ] Install socket.io and socket.io-client packages

### 2. Calendar Integration (Import/Export)
- [ ] Backend: Add calendar export endpoint (ICS format) in eventController.js
- [ ] Backend: Add calendar import endpoint (parse ICS) in eventController.js
- [ ] Backend: Add calendar routes in eventRoutes.js
- [ ] Frontend: Create client/src/components/CalendarExport.jsx
- [ ] Frontend: Create client/src/components/CalendarImport.jsx
- [ ] Frontend: Add calendar buttons to HomePage.jsx
- [ ] Install ical-generator and ical packages

### 3. Feedback and Rating System
- [x] Backend: Create server/models/feedbackModel.js
- [x] Backend: Add average rating field to server/models/eventModel.js
- [x] Backend: Add feedback endpoints in eventController.js
- [x] Backend: Add feedback routes in eventRoutes.js
- [x] Frontend: Create client/src/components/EventRating.jsx (star rating component)
- [x] Frontend: Create client/src/components/FeedbackForm.jsx
- [x] Frontend: Create client/src/components/FeedbackList.jsx
- [ ] Frontend: Integrate rating display in event cards (HomePage.jsx)
- [ ] Frontend: Add feedback modal/page for detailed feedback

### 4. QR Code Check-ins for Attendance Tracking
- [x] Backend: Add attendance fields to server/models/eventModel.js (attendees array, check-in timestamps)
- [x] Backend: Add QR generation endpoint in eventController.js
- [x] Backend: Add check-in endpoint in eventController.js
- [x] Backend: Add QR/check-in routes in eventRoutes.js
- [x] Frontend: Create client/src/components/QRCodeDisplay.jsx
- [x] Frontend: Create client/src/components/QRScanner.jsx
- [ ] Frontend: Add QR code display in event details/admin view
- [ ] Frontend: Add attendance tracking display
- [x] Install qrcode and @zxing/library packages

## General Tasks
- [ ] Update all new components with futuristic UI styling (neon colors, glassmorphism)
- [ ] Ensure responsive design for all new components
- [ ] Test all features with existing authentication and UI
- [ ] Update API documentation if needed
