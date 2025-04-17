// routes/auth.js
// Authentication routes
const express = require('express');
const router = express.Router();
const {
  registerUser,
  loginUser,
  getCurrentUserProfile
} = require('../controllers/authController');

const {
  validateRegistration,
  validateLogin
} = require('../middleware/authValidation');

router.post('/register', validateRegistration, registerUser);
router.post('/login', validateLogin, loginUser);
router.get('/me', getCurrentUserProfile);

module.exports = router;