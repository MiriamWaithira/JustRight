// middleware/reportValidation.js
const { body, validationResult } = require('express-validator');

const validateReport = [
  body('incidentType')
    .notEmpty()
    .withMessage('Incident type is required')
    .isIn(['theft', 'assault', 'vandalism', 'harassment', 'other'])
    .withMessage('Invalid incident type'),

  body('status')
    .notEmpty()
    .withMessage('Status is required')
    .isIn(['pending', 'in_progress', 'resolved'])
    .withMessage('Invalid status'),

  body('description')
    .notEmpty()
    .withMessage('Description is required')
    .isLength({ min: 10 })
    .withMessage('Description must be at least 10 characters'),

  body('location')
    .notEmpty()
    .withMessage('Location is required'),

  body('exactLocation')
    .optional()
    .isString(),

  (req, res, next) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }
    next();
  }
];

module.exports = {
  validateReport
};