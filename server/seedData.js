const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
const User = require('./models/userModel');
const Admin = require('./models/adminModel');
const Event = require('./models/eventModel');

const seedData = async () => {
  try {
    // Connect to database
    await mongoose.connect('mongodb+srv://shubhashreer2439:Shree2439@cluster0.p8hbcku.mongodb.net/event_management');
    console.log('Connected to MongoDB for seeding...');

    // Clear existing data
    await User.deleteMany({});
    await Admin.deleteMany({});
    await Event.deleteMany({});
    console.log('Cleared existing data');

    // Create test admin users
    const adminPassword = await bcrypt.hash('admin123', 10);
    const testAdmins = [
      {
        name: 'DBIT Admin',
        email: 'admin@dbit.edu',
        password: adminPassword,
        department: 'ADMIN',
        permissions: ['event_management', 'user_management', 'analytics'],
        isActive: true,
      },
      {
        name: 'IT Department Head',
        email: 'ithead@dbit.edu',
        password: adminPassword,
        department: 'IT',
        permissions: ['event_management', 'analytics'],
        isActive: true,
      },
      {
        name: 'CS Department Head',
        email: 'cshead@dbit.edu',
        password: adminPassword,
        department: 'CS',
        permissions: ['event_management', 'analytics'],
        isActive: true,
      },
    ];

    const createdAdmins = await Admin.insertMany(testAdmins);
    console.log('Created admin users:', createdAdmins.length);

    // Create test student users
    const studentPassword = await bcrypt.hash('student123', 10);
    const testStudents = [
      {
        name: 'John Doe',
        email: 'john.doe@dbit.edu',
        password: studentPassword,
        role: 'student',
      },
      {
        name: 'Jane Smith',
        email: 'jane.smith@dbit.edu',
        password: studentPassword,
        role: 'student',
      },
      {
        name: 'Mike Johnson',
        email: 'mike.johnson@dbit.edu',
        password: studentPassword,
        role: 'student',
      },
      {
        name: 'Sarah Williams',
        email: 'sarah.williams@dbit.edu',
        password: studentPassword,
        role: 'student',
      },
      {
        name: 'David Brown',
        email: 'david.brown@dbit.edu',
        password: studentPassword,
        role: 'student',
      },
    ];

    const createdStudents = await User.insertMany(testStudents);
    console.log('Created student users:', createdStudents.length);

    // Create test events
    const testEvents = [
      {
        name: 'Tech Fest 2024',
        description: 'Annual technology festival featuring coding competitions, workshops, and tech talks from industry experts.',
        date: new Date('2024-12-15T09:00:00'),
        venue: 'DBIT Main Auditorium',
        organizer: 'IT Department',
        rsvps: [createdStudents[0]._id, createdStudents[1]._id],
        pendingRsvps: [createdStudents[2]._id],
        averageRating: 4.5,
      },
      {
        name: 'Cultural Night',
        description: 'Evening of cultural performances including music, dance, and drama from various student groups.',
        date: new Date('2024-12-20T18:00:00'),
        venue: 'DBIT Open Ground',
        organizer: 'Student Council',
        rsvps: [createdStudents[1]._id, createdStudents[3]._id],
        pendingRsvps: [],
        averageRating: 4.2,
      },
      {
        name: 'Hackathon 2024',
        description: '48-hour coding competition to solve real-world problems. Great prizes and networking opportunities.',
        date: new Date('2024-12-25T10:00:00'),
        venue: 'Computer Lab - Block A',
        organizer: 'Coding Club',
        rsvps: [createdStudents[0]._id, createdStudents[2]._id, createdStudents[4]._id],
        pendingRsvps: [createdStudents[3]._id],
        averageRating: 4.8,
      },
      {
        name: 'Career Fair 2024',
        description: 'Meet top companies and explore job opportunities. Resume reviews and on-the-spot interviews.',
        date: new Date('2025-01-10T09:00:00'),
        venue: 'DBIT Conference Hall',
        organizer: 'Placement Cell',
        rsvps: [createdStudents[1]._id, createdStudents[3]._id, createdStudents[4]._id],
        pendingRsvps: [],
        averageRating: 4.0,
      },
      {
        name: 'AI Workshop',
        description: 'Hands-on workshop on artificial intelligence and machine learning fundamentals.',
        date: new Date('2025-01-15T14:00:00'),
        venue: 'Computer Lab - Block B',
        organizer: 'AI Club',
        rsvps: [createdStudents[0]._id, createdStudents[2]._id],
        pendingRsvps: [createdStudents[1]._id, createdStudents[4]._id],
        averageRating: 4.6,
      },
    ];

    const createdEvents = await Event.insertMany(testEvents);
    console.log('Created events:', createdEvents.length);

    console.log('Database seeded successfully!');
    console.log('\n--- Login Credentials ---');
    console.log('Admin Login:');
    console.log('  Email: admin@dbit.edu');
    console.log('  Password: admin123');
    console.log('\nStudent Login:');
    console.log('  Email: john.doe@dbit.edu');
    console.log('  Password: student123');
    console.log('\nOther test accounts available in the database.');

    await mongoose.disconnect();
    process.exit(0);
  } catch (error) {
    console.error('Error seeding data:', error);
    process.exit(1);
  }
};

seedData();
