// services/emailService.js
const nodemailer = require('nodemailer');
require('dotenv').config();

const transporter = nodemailer.createTransport({
    host: 'smtp.mailtrap.io',
    port: 2525,
    auth: {
        user: process.env.MAIL_USER,
        pass: process.env.MAIL_PASS
    }
});

module.exports = async (email, token) => {
    const link = `${process.env.BASE_URL}/auth/verify/${token}`;
    await transporter.sendMail({
        from: '"Verify Email" <no-reply@example.com>',
        to: email,
        subject: 'Email Verification',
        html: `<p>Click <a href="${link}">here</a> to verify your email.</p>`
    });
};
