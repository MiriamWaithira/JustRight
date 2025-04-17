// middleware/authMiddleware.js (Authentication)
const jwt = require('jsonwebtoken');
const { PublicUser, Moderator, Admin } = require('../models');

/**
 * Verify JWT token and check user role
 */
const authenticateUser = (allowedRoles) => {
  return async (req, res, next) => {
    try {
      // Get token from header
      const token = req.header('Authorization')?.replace('Bearer ', '');
      if (!token) {
        return res.status(401).json({ error: 'No token provided' });
      }

      // Verify token
      const decoded = jwt.verify(token, process.env.JWT_SECRET);
      
      // Find user based on role
      let user;
      switch (decoded.role) {
        case 'public':
          user = await PublicUser.findByPk(decoded.userId);
          break;
        case 'moderator':
          user = await Moderator.findByPk(decoded.userId);
          break;
        case 'admin':
          user = await Admin.findByPk(decoded.userId);
          break;
        default:
          throw new Error('Invalid role');
      }

      // Check if user exists and role is allowed
      if (!user || (allowedRoles && !allowedRoles.includes(decoded.role))) {
        return res.status(403).json({ error: 'Access denied' });
      }

      // Attach user to request
      req.user = { userId: decoded.userId, role: decoded.role };
      next();
    } catch (error) {
      res.status(401).json({ error: 'Invalid or expired token' });
    }
  };
};

module.exports = { authenticateUser };