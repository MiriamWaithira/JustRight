// routes/PoliceStation.js
// Police Station Routes
const express = require('express');
const router = express.Router();

// Import controllers
const {
  getAllPoliceStations,
  createPoliceStation,
  deletePoliceStation
} = require('../controllers/policeStationController');

// Import middleware
const { authenticateUser } = require('../middleware/authMiddleware');

// Public routes
router.get('/', getAllPoliceStations);

// Admin routes
router.post('/', 
  authenticateUser('admin'), 
  createPoliceStation
);

router.delete('/:id', 
  authenticateUser('admin'), 
  deletePoliceStation
);

module.exports = router;