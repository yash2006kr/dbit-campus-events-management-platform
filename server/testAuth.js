const mongoose = require('mongoose');
const User = require('./models/userModel');
const Admin = require('./models/adminModel');
const bcrypt = require('bcryptjs');

const testAuth = async () => {
  try {
    await mongoose.connect('mongodb+srv://shubhashreer2439:Shree2439@cluster0.p8hbcku.mongodb.net/event_management');
    console.log('Connected to MongoDB for testing...');

    // Check if users exist
    const users = await User.find({});
    console.log('Users in database:', users.length);
    
    if (users.length > 0) {
      console.log('Sample user:', {
        _id: users[0]._id,
        name: users[0].name,
        email: users[0].email,
        role: users[0].role,
        passwordHash: users[0].password.substring(0, 20) + '...'
      });

      // Test password comparison
      const isMatch = await bcrypt.compare('student123', users[0].password);
      console.log('Password comparison result:', isMatch);
    }

    // Check if admins exist
    const admins = await Admin.find({});
    console.log('Admins in database:', admins.length);
    
    if (admins.length > 0) {
      console.log('Sample admin:', {
        _id: admins[0]._id,
        name: admins[0].name,
        email: admins[0].email,
        department: admins[0].department,
        passwordHash: admins[0].password.substring(0, 20) + '...'
      });

      // Test password comparison
      const isAdminMatch = await bcrypt.compare('admin123', admins[0].password);
      console.log('Admin password comparison result:', isAdminMatch);
    }

    await mongoose.disconnect();
    process.exit(0);
  } catch (error) {
    console.error('Error testing auth:', error);
    process.exit(1);
  }
};

testAuth();
