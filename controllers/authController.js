// controllers/authController.js (Authentication)
// controllers/authController.js
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const { PublicUser, Moderator, Admin } = require('../models');

exports.registerUser = async (req, res) => {
  try {
    // Registration logic here
    const { username, email, password, role } = req.body;
    
    // Check if user exists
    const existingUser = await PublicUser.findOne({ where: { email } }) || 
                         await Moderator.findOne({ where: { email } }) || 
                         await Admin.findOne({ where: { email } });
    
    if (existingUser) {
      return res.status(400).json({ error: 'Email already exists' });
    }

    // Hash password
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);

    // Create user
    let user;
    if (role === 'public') {
      user = await PublicUser.create({ username, email, password: hashedPassword });
    } else if (role === 'moderator') {
      user = await Moderator.create({ username, email, password: hashedPassword });
    } else if (role === 'admin') {
      user = await Admin.create({ username, email, password: hashedPassword });
    }

    // Create token
    const token = jwt.sign({ userId: user.id, role }, process.env.JWT_SECRET, { expiresIn: '1h' });

    res.status(201).json({ token, user: { id: user.id, username, email, role } });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

exports.loginUser = async (req, res) => {
  try {
    // Login logic here
    const { email, password, role } = req.body;
    
    let user;
    if (role === 'public') {
      user = await PublicUser.findOne({ where: { email } });
    } else if (role === 'moderator') {
      user = await Moderator.findOne({ where: { email } });
    } else if (role === 'admin') {
      user = await Admin.findOne({ where: { email } });
    }

    if (!user) {
      return res.status(401).json({ error: 'Invalid credentials' });
    }

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.status(401).json({ error: 'Invalid credentials' });
    }

    const token = jwt.sign({ userId: user.id, role }, process.env.JWT_SECRET, { expiresIn: '1h' });
    res.json({ token, user: { id: user.id, username: user.username, email: user.email, role } });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

exports.getCurrentUserProfile = async (req, res) => {
  try {
    res.json(req.user);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};