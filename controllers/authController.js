const User = require('../models/user');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const { createNotification } = require('./notificationController');

// User Registration
exports.registerUser  = async (req, res) => {
    const { name, email, phone, password, degree, experience, skills, interests } = req.body;
    console.log('Registration attempt with email:', email);

    // Basic validation
    if (!name || !email || !phone || !password || !degree || !experience) {
        console.log('Validation failed: missing fields');
        return res.status(400).json({ message: 'All fields are required.' });
    }

    // Validate experience is a valid number
    const parsedExperience = parseInt(experience, 10);
    if (isNaN(parsedExperience)) {
        console.log('Validation failed: experience must be a valid number');
        return res.status(400).json({ message: 'Experience must be a valid number.' });
    }

    try {
        // Check if the user already exists
        const existingUser  = await User.findOne({ email });
        if (existingUser ) {
            console.log('User  already exists');
            return res.status(400).json({ message: 'User  already exists.' });
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
        // You can issue a JWT here if needed
        return res.redirect('/homepage');
    } else {
        return res.redirect('/login?error=GoogleAuthFailed');
    }
};
