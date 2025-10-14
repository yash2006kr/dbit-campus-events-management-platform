const express = require('express');
const http = require('http');
const socketIo = require('socket.io');
const dotenv = require('dotenv');
const cors = require('cors');
const connectDB = require('./config/db');

// --- Main Application Logic ---
const startServer = async () => {
  dotenv.config();
  await connectDB();

  const app = express();

  // Middleware
  app.use(cors());
  app.use(express.json());
  app.use(express.urlencoded({ extended: false }));

  // API Routes
  app.use('/api/events', require('./routes/eventRoutes'));
  app.use('/api/users', require('./routes/userRoutes'));

  const server = http.createServer(app);
  const io = socketIo(server, {
    cors: {
      origin: '*', // Allow all origins for now; adjust for production
      methods: ['GET', 'POST'],
    },
  });

  // Socket.io connection handling
  io.on('connection', (socket) => {
    console.log('New client connected:', socket.id);

    socket.on('join', (userId) => {
      socket.join(userId);
      console.log(`User ${userId} joined room`);
    });

    socket.on('disconnect', () => {
      console.log('Client disconnected:', socket.id);
    });
  });

  // Make io globally available for controllers
  global.io = io;

  const PORT = process.env.PORT || 5000;
  server.listen(PORT, () => console.log(`Server is running on port ${PORT}`));
};
// --- Start the server ---
startServer();
