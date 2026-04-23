const mongoose = require('mongoose');

const adminSchema = mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, 'Please add an admin name'],
    },
    email: {
      type: String,
      required: [true, 'Please add an admin email'],
      unique: true, // Every email must be unique
    },
    password: {
      type: String,
      required: [true, 'Please add a password'],
    },
    department: {
      type: String,
      required: [true, 'Please specify department'],
      enum: ['IT', 'CS', 'EXTC', 'MECH', 'CIVIL', 'ADMIN'],
    },
    permissions: {
      type: [String],
      default: ['event_management', 'user_management', 'analytics'],
    },
    isActive: {
      type: Boolean,
      default: true,
    },
  },
  {
    timestamps: true, // Automatically adds createdAt and updatedAt
  }
);

module.exports = mongoose.model('Admin', adminSchema);
