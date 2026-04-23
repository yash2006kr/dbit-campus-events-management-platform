const express = require('express');
const router = express.Router();
const { registerAdmin, loginAdmin, getAdminMe, updateAdminProfile } = require('../controllers/adminController');
const { protectAdmin } = require('../middleware/authMiddleware');

router.post('/register', registerAdmin);
router.post('/login', loginAdmin);
router.get('/me', protectAdmin, getAdminMe);
router.put('/profile', protectAdmin, updateAdminProfile);

module.exports = router;
