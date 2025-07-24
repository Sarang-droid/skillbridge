const User = require('../models/user');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const { createNotification } = require('./notificationController');
const validator = require('validator');
const axios = require('axios');

// User Registration
exports.registerUser  = async (req, res) => {
    const { name, email, phone, password, confirmPassword, degree, experience, skills, interests, recaptchaToken } = req.body;
    console.log('Registration attempt with email:', email);

    const logAndSendError = (message) => {
        console.error('Validation failed:', message); // Log the specific error
        return res.status(400).json({ message });
    };

    // --- reCAPTCHA v2 verification ---
    console.log('Received reCAPTCHA token:', recaptchaToken ? 'Token received' : 'No token');
    
    if (!recaptchaToken) {
        console.error('No reCAPTCHA token provided in the request');
        return logAndSendError('Please complete the reCAPTCHA verification.');
    }
    
    try {
        // Verify reCAPTCHA with Google
        const verificationUrl = 'https://www.google.com/recaptcha/api/siteverify';
        const params = new URLSearchParams();
        
        if (!process.env.RECAPTCHA_SECRET) {
            console.error('RECAPTCHA_SECRET is not set in environment variables');
            return logAndSendError('Server configuration error. Please contact support.');
        }
        
        params.append('secret', process.env.RECAPTCHA_SECRET);
        params.append('response', recaptchaToken);
        
        // Get client IP if available
        const clientIp = req.headers['x-forwarded-for'] || req.connection.remoteAddress;
        if (clientIp) {
            params.append('remoteip', clientIp);
        }

        console.log('Sending reCAPTCHA verification request...');
        const recaptchaRes = await axios.post(verificationUrl, params, {
            headers: {
                'Content-Type': 'application/x-www-form-urlencoded',
                'Accept': 'application/json'
            },
            timeout: 5000 // 5 second timeout
        });

        console.log('reCAPTCHA API response status:', recaptchaRes.status);
        console.log('reCAPTCHA API response data:', JSON.stringify(recaptchaRes.data, null, 2));

        if (!recaptchaRes.data) {
            console.error('No data received from reCAPTCHA verification');
            return logAndSendError('Error verifying reCAPTCHA. Please try again.');
        }

        const { success, hostname, 'error-codes': errorCodes = [], challenge_ts } = recaptchaRes.data;
        
        console.log('reCAPTCHA verification result:', {
            success,
            hostname,
            challenge_ts,
            errorCodes: errorCodes || []
        });

        if (!success) {
            const errorMessage = errorCodes && errorCodes.length > 0 
                ? errorCodes.join(', ') 
                : 'Unknown error';
                
            console.error('reCAPTCHA verification failed. Error codes:', errorMessage);
            
            // Provide more specific error messages based on the error code
            if (errorCodes.includes('invalid-input-secret') || errorCodes.includes('missing-input-secret')) {
                console.error('reCAPTCHA secret key is invalid or missing');
                return logAndSendError('Server configuration error. Please contact support.');
            } else if (errorCodes.includes('invalid-input-response') || errorCodes.includes('missing-input-response')) {
                console.error('Invalid or missing reCAPTCHA response');
                return logAndSendError('Invalid reCAPTCHA verification. Please complete the verification again.');
            } else if (errorCodes.includes('timeout-or-duplicate')) {
                console.error('reCAPTCHA verification expired');
                return logAndSendError('reCAPTCHA verification expired. Please try again.');
            } else {
                console.error('reCAPTCHA verification failed with unknown error');
                return logAndSendError('reCAPTCHA verification failed. Please try again.');
            }
        }
        
        // Verify the hostname matches your domain (optional but recommended)
        const allowedHostnames = [
            'localhost',
            '127.0.0.1',
            'skillexa.in',
            'www.skillexa.in'
        ];
        
        if (hostname && !allowedHostnames.includes(hostname)) {
            console.error(`reCAPTCHA hostname verification failed. Allowed: ${allowedHostnames.join(', ')}, Got: ${hostname}`);
            return logAndSendError('Invalid request source.');
        }
        
        console.log('reCAPTCHA verification successful');
        
    } catch (err) {
        console.error('reCAPTCHA verification error:', {
            message: err.message,
            code: err.code,
            stack: err.stack
        });
        return logAndSendError('Error verifying reCAPTCHA. Please try again.');
    }

    // --- Strong Validation ---
    if (!name || !email || !phone || !password || !degree || experience === undefined) {
        return logAndSendError('All fields are required.');
    }
    if (password !== confirmPassword) {
        return logAndSendError('Passwords do not match.');
    }
    if (!validator.isLength(name, { min: 2, max: 30 }) || !/^[A-Za-z\s]+$/.test(name)) {
        return logAndSendError('Invalid full name. Use only letters, 2-30 chars.');
    }
    if (!validator.isEmail(email)) {
        return logAndSendError('Invalid email address.');
    }
    if (!/^\+?\d{10,15}$/.test(phone)) {
        return logAndSendError('Invalid phone number. Use 10-15 digits, may start with +.');
    }
    const passwordRegex = /^(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/;
    if (!passwordRegex.test(password)) {
        return logAndSendError('Password must be 8+ chars, 1 uppercase, 1 number, 1 special.');
    }
    if (!degree.trim()) {
        return logAndSendError('Degree is required.');
    }
    const parsedExperience = parseInt(experience, 10);
    if (isNaN(parsedExperience) || parsedExperience < 0) {
        return logAndSendError('Experience must be a non-negative number.');
    }
    if (!Array.isArray(skills) || skills.length === 0 || !skills.some(Boolean)) {
        return logAndSendError('Select at least one skill.');
    }
    if (!Array.isArray(interests) || interests.length === 0 || !interests.some(Boolean)) {
        return logAndSendError('Select at least one interest.');
    }

    try {
        // Check if the user already exists
        const existingUser  = await User.findOne({ email });
        if (existingUser ) {
            console.log('User  already exists');
            return logAndSendError('User  already exists.');
        }

        // Hash the password
        const hashedPassword = await bcrypt.hash(password, 10);

        // Create a new user with degree, experience, skills, and interests
        const newUser  = new User({ 
            name, 
            email, 
            phone, 
            password: hashedPassword, 
            degree, 
            experience: parsedExperience,
            skills: Array.isArray(skills) ? skills : [skills].filter(Boolean), // Process skills
            interests: Array.isArray(interests) ? interests : [interests].filter(Boolean) // Process interests

        });

        await newUser .save();
        console.log('User  registered successfully:', newUser ._id);

        // Generate JWT token upon successful registration
        const token = jwt.sign({ id: newUser._id }, process.env.JWT_SECRET, { expiresIn: '24h' }); // Increase to 24 hours
        console.log('Token generated with expiration:', new Date(Date.now() + 3600000));

        // Send welcome notification (modified to be user-specific)
        try {
            await createNotification(
                newUser._id, // Use the new user's ID
                'Welcome to Skillexa! 🎉',
                `Welcome ${name} to Skillexa - Your Personalized Path to Growth!
We're thrilled to have you on board. Get started by taking your Personality Test to unlock tailored career insights and build your Professional Profile that showcases your strengths and aspirations.
Discover skills aligned with your unique potential and explore curated learning paths designed just for you.
Need help? Our support team is just a message away. Let's grow together!`,
                [], // Empty attachments array
                [], // Empty links array
                false // Set to false for user-specific notification
            );
            console.log('Welcome notification created for user:', newUser._id);
        } catch (notificationError) {
            console.error('Error creating welcome notification:', notificationError);
        }

        res.status(201).json({
            message: 'User  registered successfully',
            token,
        });
    } catch (error) {
        console.error('Error during registration:', error.message);
        res.status(500).json({ message: 'Server error', error: error.message });
    }
};

// User Login
exports.loginUser  = async (req, res) => {
    const { email, password } = req.body;
    console.log('Login attempt with email:', email);

    if (!email || !password) {
        console.log('Validation failed: missing fields');
        return res.status(400).json({ message: 'All fields are required.' });
    }

    try {
        const user = await User.findOne({ email });
        if (!user) {
            console.log('User  not found');
            return res.status(400).json({ message: 'Invalid email or password.' });
        }
        // Email verification check removed to allow login without verification

        const isMatch = await bcrypt.compare(password, user.password);
        if (!isMatch) {
            console.log('Password does not match');
            return res.status(400).json({ message: 'Invalid email or password.' });
        }

        const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET, { expiresIn: '1h' });
        console.log('Login successful, token generated');
        const refreshToken = jwt.sign({ id: user._id }, process.env.JWT_SECRET, { expiresIn: '7d' });

        user.refreshToken = refreshToken;
        await user.save();

        res.status(200).json({
            message: 'Login successful',
            token,
            refreshToken,
            user: {
                id: user._id,
                name: user.name,
                email: user.email,
                skills: user.skills, // Include skills in the response
                interests: user.interests // Include interests in the response
            },
        });
    } catch (error) {
        console.error('Error during login:', error.message);
        res.status(500).json({ message: 'Server error', error: error.message });
    }
};

// User Logout
exports.logoutUser  = async (req, res) => {
    const { userId } = req;
    console.log('User  logged out:', userId);

    await User.findByIdAndUpdate(userId, { refreshToken: null });

    res.status(200).json({ message: 'Logout successful' });
};

// Refresh Token Logic
exports.refreshToken = async (req, res) => {
    const { refreshToken } = req.body;
    console.log('Refresh token attempt');

    if (!refreshToken) {
        console.log('Validation failed: refresh token missing');
        return res.status(401).json({ message: 'Refresh Token is required' });
    }

    try {
        const decoded = jwt.verify(refreshToken, process.env.JWT_SECRET);
        console.log('Decoded refresh token:', decoded);

        const user = await User.findById(decoded.id);
        if (!user || user.refreshToken !== refreshToken) {
            console.log('Invalid refresh token');
            return res.status(403).json({ message: 'Invalid refresh token' });
        }

        // Generate new access token
        const newToken = jwt.sign({ id: user._id }, process.env.JWT_SECRET, { expiresIn: '1h' });
        console.log('New access token generated with expiration:', new Date(Date.now() + 3600000));

        res.status(200).json({
            message: 'Token refreshed successfully',
            token: newToken,
        });
    } catch (error) {
        if (error.name === 'TokenExpiredError') {
            console.log('Refresh token has expired:', error);
            return res.status(401).json({ message: 'Refresh token has expired. Please log in again.' });
        }
        console.error('Error during refresh token:', error.message);
        res.status(500).json({ message: 'Server error', error: error.message });
    }
};

// Google OAuth callback controller
exports.googleCallback = (req, res) => {
    if (req.user) {
        const token = jwt.sign({ id: req.user._id }, process.env.JWT_SECRET, { expiresIn: '1h' });
        res.cookie('token', token, {
            httpOnly: true,
            secure: process.env.NODE_ENV === 'production',
            sameSite: 'lax',
            maxAge: 3600000 // 1 hour
        });
        return res.redirect('/homepage');
    } else {
        return res.redirect('/login?error=GoogleAuthFailed');
    }
};
