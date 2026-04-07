const express = require('express');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const crypto = require('crypto');
const rateLimit = require('express-rate-limit');
const User = require('../models/User');
const { sendVerificationEmail, sendMockSMS } = require('../utils/notifier');

const router = express.Router();

// Rate limiting for auth
const authLimiter = rateLimit({ windowMs: 15 * 60 * 1000, max: 10, message: "Too many requests from this IP" });

router.post('/register', authLimiter, async (req, res) => {
    try {
        const { name, email, password, role, phone } = req.body;
        
        let user = await User.findOne({ email });
        if (user) return res.status(400).json({ message: 'User already exists' });

        const salt = await bcrypt.genSalt(10);
        const hashedPassword = await bcrypt.hash(password, salt);
        
        // Generate Validation Token
        const verificationToken = crypto.randomBytes(32).toString('hex');

        user = new User({
            name, email, password: hashedPassword, role: role || 'Owner',
            verificationToken
        });

        await user.save();
        await sendVerificationEmail(user.email, verificationToken);

        res.status(201).json({ message: 'Registration successful! Please check your email to verify your account.' });
    } catch (err) {
        console.error(err);
        res.status(500).json({ message: 'Server Error' });
    }
});

router.get('/verify-email/:token', async (req, res) => {
    try {
        const { token } = req.params;
        const user = await User.findOne({ verificationToken: token });
        
        if (!user) return res.status(400).send('Invalid or expired verification link.');

        user.isEmailVerified = true;
        user.verificationToken = undefined;
        await user.save();

        res.redirect('http://localhost:5173/auth?verified=true');
    } catch (err) {
        console.error(err);
        res.status(500).send('Server Error');
    }
});

router.post('/login', authLimiter, async (req, res) => {
    try {
        const { email, password } = req.body;
        const user = await User.findOne({ email });
        if (!user) return res.status(400).json({ message: 'Invalid credentials' });

        const isMatch = await bcrypt.compare(password, user.password);
        if (!isMatch) return res.status(400).json({ message: 'Invalid credentials' });

        if (!user.isEmailVerified && email !== 'admin@vet.com' && email !== 'owner@vet.com' && email !== 'vet@vet.com') { // bypass seeded users
            return res.status(403).json({ message: 'Please verify your email address before logging in.', requiresEmailVerification: true });
        }

        // Generate 6-digit OTP
        const otpCode = Math.floor(100000 + Math.random() * 900000).toString();
        user.otpCode = otpCode;
        user.otpExpires = Date.now() + 5 * 60 * 1000; // 5 mins
        await user.save();

        const smsMessage = `Your VetSense AI security code is ${otpCode}. It expires in 5 minutes.`;
        // Pass the user's registered phone or a fallback dummy number to the Twilio sender
        sendMockSMS(user.phone || "+919876543210", smsMessage);

        res.json({ message: 'OTP Sent successfully. Please verify to continue.', requiresOTP: true, userId: user._id });
    } catch (err) {
        console.error(err);
        res.status(500).json({ message: 'Server Error' });
    }
});

router.post('/verify-otp', authLimiter, async (req, res) => {
    try {
        const { userId, otpCode } = req.body;
        const user = await User.findById(userId);

        if (!user) return res.status(400).json({ message: 'User not found' });
        
        if (user.otpCode !== otpCode || user.otpExpires < Date.now()) {
            return res.status(400).json({ message: 'Invalid or expired OTP code' });
        }

        // Clear OTP
        user.otpCode = undefined;
        user.otpExpires = undefined;
        await user.save();

        const token = jwt.sign({ userId: user._id, role: user.role }, process.env.JWT_SECRET || 'your_jwt_secret_key_here', { expiresIn: '1d' });
        res.json({ token, user: { id: user._id, name: user.name, email: user.email, role: user.role } });
    } catch (err) {
        console.error(err);
        res.status(500).json({ message: 'Server Error' });
    }
});

module.exports = router;
