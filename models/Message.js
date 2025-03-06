// routes/message.js
const express = require('express');
const { verifyToken } = require('../middleware/authMiddleware');
const Message = require('../models/Message');

const router = express.Router();

// Send Message
router.post('/send', verifyToken, async (req, res) => {
    try {
        const { content } = req.body;
        const { id: senderId } = req.user;

        const message = await Message.create({ senderId, content });

        res.status(201).json({ message });
    } catch (error) {
        res.status(500).json({ error: 'Failed to send message' });
    }
});

// Get Messages (for user)
router.get('/receive', verifyToken, async (req, res) => {
    try {
        const messages = await Message.findAll({ where: { senderId: req.user.id } });

        res.status(200).json({ messages });
    } catch (error) {
        res.status(500).json({ error: 'Failed to retrieve messages' });
    }
});

module.exports = router;
