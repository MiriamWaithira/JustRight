// controllers/messageController.js (Support Messages)
const { Message } = require('../models');

/**
 * Create a new support message
 */
exports.createMessage = async (req, res) => {
  try {
    const { fullName, email, phoneNumber, message } = req.body;

    const newMessage = await Message.create({
      fullName,
      email,
      phoneNumber,
      message,
      isRead: false
    });

    res.status(201).json(newMessage);
  } catch (error) {
    console.error('Create message error:', error);
    res.status(500).json({ error: 'Failed to send message' });
  }
};

/**
 * Get all messages (admin only)
 */
exports.getMessages = async (req, res) => {
  try {
    const { isRead } = req.query;
    const where = {};

    if (isRead === 'true' || isRead === 'false') {
      where.isRead = isRead === 'true';
    }

    const messages = await Message.findAll({
      where,
      order: [['createdAt', 'DESC']]
    });

    res.json(messages);
  } catch (error) {
    console.error('Get messages error:', error);
    res.status(500).json({ error: 'Failed to fetch messages' });
  }
};

/**
 * Mark message as read
 */
exports.markAsRead = async (req, res) => {
  try {
    const { id } = req.params;
    const message = await Message.findByPk(id);

    if (!message) {
      return res.status(404).json({ error: 'Message not found' });
    }

    message.isRead = true;
    await message.save();

    res.json(message);
  } catch (error) {
    console.error('Mark as read error:', error);
    res.status(500).json({ error: 'Failed to update message' });
  }
};