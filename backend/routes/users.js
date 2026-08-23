const express = require('express');
const { getProfile, updateProfile, changePassword } = require('../controllers/userController');
const { protect } = require('../middleware/auth');

const router = express.Router();

router.route('/profile')
  .get(protect, getProfile)
  .put(protect, updateProfile);

router.put('/change-password', protect, changePassword);

module.exports = router;
