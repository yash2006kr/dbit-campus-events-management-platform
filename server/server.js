const express = require('express');
const dotenv = require('dotenv');
const cors = require('cors'); // <--- 1. ADD THIS LINE
const connectDB = require('./config/db');

// --- Main Application Logic ---
const startServer = async () => {
  dotenv.config();
  await connectDB();

  const app = express();
  
  // Middleware
  app.use(cors()); // <--- 2. ADD THIS LINE
  app.use(express.json());
  app.use(express.urlencoded({ extended: false }));

  // API Routes
  app.use('/api/events', require('./routes/eventRoutes'));
  app.use('/api/users', require('./routes/userRoutes')); // <-- ADD THIS LINE

  const PORT = process.env.PORT || 5000;
  app.listen(PORT, () => console.log(`Server is running on port ${PORT}`));
};
// --- Start the server ---
startServer();