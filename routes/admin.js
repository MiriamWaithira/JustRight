// routes/Admin.js
// Admin Routes
const express = require('express');
const router = express.Router();

// Import controllers
const {
  getDashboardStatistics,
  getAllSystemUsers
} = require('../controllers/adminController');

// Import middleware
const { authenticateUser } = require('../middleware/authMiddleware');

// Admin routes
router.get('/stats', 
  authenticateUser('admin'), 
  getDashboardStatistics
);

router.get('/users', 
  authenticateUser('admin'), 
  getAllSystemUsers
);

module.exports = router;