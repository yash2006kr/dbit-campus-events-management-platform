const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');
const asyncHandler = require('express-async-handler');
const Admin = require('../models/adminModel');

// A helper function to generate JWT for admin
const generateAdminToken = (id) => {
  return jwt.sign({ id, role: 'admin' }, process.env.JWT_SECRET, {
    expiresIn: '30d',
  });
};

// @desc    Register a new admin
// @route   POST /api/admin/register
const registerAdmin = async (req, res) => {
  try {
    const { name, email, password, department } = req.body;
    if (!name || !email || !password || !department) {
      return res.status(400).json({ message: 'Please add all fields' });
    }
    const adminExists = await Admin.findOne({ email });
    if (adminExists) {
      return res.status(400).json({ message: 'Admin already exists' });
    }
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);
    const admin = await Admin.create({
      name,
      email,
      password: hashedPassword,
      department,
    });
    if (admin) {
      res.status(201).json({
        _id: admin.id,
        name: admin.name,
        email: admin.email,
        department: admin.department,
        permissions: admin.permissions,
        token: generateAdminToken(admin._id),
      });
    } else {
      res.status(400).json({ message: 'Invalid admin data' });
    }
  } catch (error) {
    res.status(500).json({ message: 'Server Error', error: error.message });
  }
};

// @desc    Authenticate an admin (login)
// @route   POST /api/admin/login
const loginAdmin = async (req, res) => {
  try {
    const { email, password } = req.body;

    // Find the admin by email
    const admin = await Admin.findOne({ email });

    // If admin exists and is active, compare the provided password with the hashed password in the DB
    if (admin && admin.isActive && (await bcrypt.compare(password, admin.password))) {
      // If they match, send back the admin data and a new token
      res.json({
        _id: admin.id,
        name: admin.name,
        email: admin.email,
        department: admin.department,
        permissions: admin.permissions,
        token: generateAdminToken(admin._id),
      });
    } else {
      // If admin not found, not active, or passwords don't match, send an error
      res.status(400).json({ message: 'Invalid admin credentials' });
    }
  } catch (error) {
    res.status(500).json({ message: 'Server Error', error: error.message });
  }
};

// @desc    Get current admin data
// @route   GET /api/admin/me
// @access  Private (Admin only)
const getAdminMe = asyncHandler(async (req, res) => {
  // protectAdmin middleware should attach the admin to req
  res.status(200).json(req.admin);
});

// @desc    Update admin profile
// @route   PUT /api/admin/profile
// @access  Private (Admin only)
const updateAdminProfile = asyncHandler(async (req, res) => {
  const { name, email, department } = req.body;
  const admin = await Admin.findById(req.admin.id);

  if (!admin) {
    res.status(404);
    throw new Error('Admin not found');
  }

  admin.name = name || admin.name;
  admin.email = email || admin.email;
  admin.department = department || admin.department;

  const updatedAdmin = await admin.save();
  res.status(200).json({
    _id: updatedAdmin._id,
    name: updatedAdmin.name,
    email: updatedAdmin.email,
    department: updatedAdmin.department,
    permissions: updatedAdmin.permissions,
    token: generateAdminToken(updatedAdmin._id),
  });
});

module.exports = {
  registerAdmin,
  loginAdmin,
  getAdminMe,
  updateAdminProfile,
};
