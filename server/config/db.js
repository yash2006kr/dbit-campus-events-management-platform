const mongoose = require('mongoose');

const connectDB = async () => {
  try {
    // Set default JWT_SECRET if not provided
    if (!process.env.JWT_SECRET) {
      process.env.JWT_SECRET = 'your-secret-key-change-in-production';
      console.log('JWT_SECRET set to default value (change in production)');
    }
    
    const mongoUri = process.env.MONGO_URI || 'mongodb+srv://shubhashreer2439:Shree2439@cluster0.p8hbcku.mongodb.net/event_management';
    const conn = await mongoose.connect(mongoUri);
    console.log(`MongoDB Connected: ${conn.connection.host}`);
    console.log(`Database: event_management`);
  } catch (error) {
    console.error(`Error: ${error.message}`);
    console.log('Failed to connect to MongoDB Atlas - event_management database');
    process.exit(1); // Exit process with failure
  }
};

module.exports = connectDB;