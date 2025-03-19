const User = require('../models/user');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const nodemailer = require('nodemailer');
const crypto = require('crypto');
exports.registerUser = async (req, res) => {
    const { name, email, phone, password, confirmPassword, skills, interests, degree, experience } = req.body;

    // Log the request body for debugging
    console.log('Request Body:', req.body);
    console.log('Type of skills:', typeof skills, skills);
    console.log('Type of interests:', typeof interests, interests);
    
    // Process skills and interests
    const processedSkills = Array.isArray(skills) ? skills : (skills ? [skills] : []);
    const processedInterests = Array.isArray(interests) ? interests : (interests ? [interests] : []);



    console.log('Processed Skills:', processedSkills);
    console.log('Processed Interests:', processedInterests);

    // Check all fields
    if (!name || !email || !phone || !password || !confirmPassword || !degree || !experience) {
        return res.status(400).json({ message: 'All fields are required.' });
    }

    // Parse experience as an integer
    const parsedExperience = parseInt(experience, 10);
    if (isNaN(parsedExperience)) {
        return res.status(400).json({ message: 'Experience must be a valid number.' });
    }

    // Check password strength
    const passwordRegex = /^(?=.*[A-Za-z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/;
    if (!passwordRegex.test(password)) {
        return res.status(400).json({ message: 'Password must be at least 8 characters long, include a number, and a special character.' });
    }

    // Check if passwords match
    if (password !== confirmPassword) {
        return res.status(400).json({ message: 'Passwords do not match.' });
    }

    try {
        // Check if user exists
        const existingUser = await User.findOne({ email });
        if (existingUser) {
            return res.status(400).json({ message: 'User already exists.' });
        }

        // Hash password
        const hashedPassword = await bcrypt.hash(password, 12);

        // Create user
        const newUser = new User({
            name,
            email,
            phone,
            password: hashedPassword,
        skills: processedSkills.length ? processedSkills : [],
        interests: processedInterests.length ? processedInterests : [],

            degree,
            experience: parsedExperience,
        });

        // Log the new user object before saving
        console.log('New User Object:', newUser);

        await newUser.save();

        res.status(201).json({ message: 'User registered successfully.' });
    } catch (error) {
        console.error('Error during registration:', error);
        res.status(500).json({ message: 'Server error' });
    }
};


// Email verification endpoint
exports.verifyEmail = async (req, res) => {
    const { token } = req.query;

    try {
        const user = await User.findOne({ verificationToken: token });

        if (!user) {
            return res.status(400).json({ message: 'Invalid or expired token.' });
        }

        user.isVerified = true;
        user.verificationToken = null;
        await user.save();

        res.json({ message: 'Email verified successfully. You can now log in.' });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Server error' });
    }
};
