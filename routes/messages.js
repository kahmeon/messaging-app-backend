const express = require('express');
const jwt = require('jsonwebtoken');
const pool = require('../config/db');

const router = express.Router();

const authenticate = (req, res, next) => {
    const token = req.header('Authorization');
    if (!token) return res.status(401).json({ error: "Access denied" });

    try {
        req.user = jwt.verify(token.split(" ")[1], process.env.JWT_SECRET);
        next();
    } catch (err) {
        res.status(400).json({ error: "Invalid token" });
    }
};

router.post('/send', authenticate, async (req, res) => {
    const { content } = req.body;
    await pool.query('INSERT INTO messages (sender_id, content) VALUES ($1, $2)', [req.user.id, content]);
    res.status(201).json({ message: "Message sent!" });
});

router.get('/receive', authenticate, async (req, res) => {
    const messages = await pool.query('SELECT * FROM messages ORDER BY timestamp DESC');
    res.json(messages.rows);
});

module.exports = router;
