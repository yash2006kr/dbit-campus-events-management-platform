// in server/routes/userRoutes.js
const express = require('express');
const router = express.Router();
// This line now includes getMe and updateProfile
const { registerUser, loginUser, getMe, updateProfile } = require('../controllers/userController');
const { protect } = require('../middleware/authMiddleware');

router.post('/register', registerUser);
router.post('/login', loginUser);
router.get('/me', protect, getMe);
router.put('/profile', protect, updateProfile);

module.exports = router;