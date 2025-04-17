// routes/report.js
// Report Routes
const express = require('express');
const router = express.Router();
const reportController = require('../controllers/reportController');
const { authenticateUser } = require('../middleware/authMiddleware');
const { validateReport } = require('../middleware/reportValidation');
const upload = require('../middleware/multerMiddleware');

// Public user routes
router.post(
  '/',
  authenticateUser('public'),
  upload.single('file'),
  validateReport,
  reportController.createReport
);

router.get(
  '/my-reports',
  authenticateUser('public'),
  reportController.getUserReports
);

// Moderator/Admin routes
router.get(
  '/all',
  authenticateUser(['moderator', 'admin']),
  reportController.getAllReports
);

router.patch(
  '/:id/assign',
  authenticateUser('admin'),
  reportController.assignReportToModerator
);

module.exports = router;