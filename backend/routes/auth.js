const express = require('express');
const { register, login, getMe, logout, clerkSync } = require('../controllers/authController');
const { protect } = require('../middleware/auth');

const router = express.Router();

router.post('/register', register);
router.post('/login', login);
router.get('/me', protect, getMe);
router.post('/logout', protect, logout);
router.post('/clerk-sync', clerkSync);

module.exports = router;
