// routes/message.js
// Messages Routes
const express = require('express');
const router = express.Router();

// Import controllers
const {
  createSupportMessage,
  getAllMessages,
  markMessageAsRead
} = require('../controllers/messageController');

// Import middleware
const { authenticateUser } = require('../middleware/authMiddleware');

// Public route
router.post('/', createSupportMessage);

// Admin routes
router.get('/', 
  authenticateUser('admin'), 
  getAllMessages
);

router.patch('/:id/read', 
  authenticateUser('admin'), 
  markMessageAsRead
);

module.exports = router;