// routes/auth.js
const express = require('express');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const User = require('../models/User');
const sendVerificationEmail = require('../services/emailService');

const router = express.Router();

// Register
router.post('/register', async (req, res) => {
    const { username, email, password } = req.body;
    const hashedPassword = await bcrypt.hash(password, 10);

    const user = await User.create({ username, email, password: hashedPassword });

    const token = jwt.sign({ email }, process.env.JWT_SECRET, { expiresIn: '1d' });
    sendVerificationEmail(email, token);

    res.status(201).json({ message: 'User registered. Verify email before login.' });
});

// Email Verification
router.get('/verify/:token', async (req, res) => {
    try {
        const { email } = jwt.verify(req.params.token, process.env.JWT_SECRET);
        await User.update({ emailVerified: true }, { where: { email } });

        res.json({ message: 'Email verified successfully!' });
    } catch {
        res.status(400).json({ error: 'Invalid or expired token' });
    }
});

// Login
router.post('/login', async (req, res) => {
    const { username, password } = req.body;
    const user = await User.findOne({ where: { username } });

    if (!user || !await bcrypt.compare(password, user.password)) {
        return res.status(401).json({ error: 'Invalid credentials' });
    }
    if (!user.emailVerified) {
        return res.status(403).json({ error: 'Email not verified' });
    }

    const token = jwt.sign(
        { id: user.id, role: user.role, emailVerified: user.emailVerified },
        process.env.JWT_SECRET,
        { expiresIn: '1h' }
    );

    res.json({ token });
});

module.exports = router;
