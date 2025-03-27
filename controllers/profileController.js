const User = require('../models/user');
const bcrypt = require('bcrypt');
const path = require('path');
const mongoose = require('mongoose'); // Added for ObjectId validation

// Get the authenticated user's profile
exports.getProfile = async (req, res) => {
    try {
        const user = await User.findById(req.user._id);
        if (!user) {
            return res.status(404).json({ message: 'User not found' });
        }

        const profilePicturePath = user.profilePicture 
            ? `/uploads/${path.basename(user.profilePicture)}` // Use basename to ensure clean path
            : null;

        res.status(200).json({
            _id: user._id, // Explicitly include _id for share functionality
            name: user.name,
            email: user.email,
            bio: user.bio,
            school: user.school,
            education: user.education,
            profilePicture: profilePicturePath,
            points: user.points,
            badges: user.badges,
            completedProjects: user.completedProjects
        });
    } catch (error) {
        console.error('Error fetching user profile:', error);
        res.status(500).json({ message: 'Error fetching user profile', error: error.message });
    }
};

// Update the authenticated user's profile
exports.updateProfile = async (req, res) => {
    try {
        const user = await User.findById(req.user._id);
        if (!user) {
            return res.status(404).json({ message: 'User not found' });
        }

        // Update fields if provided
        user.name = req.body.name || user.name;
        user.email = req.body.email || user.email;
        user.bio = req.body.bio || user.bio;
        user.school = req.body.school || user.school;
        user.education = req.body.education || user.education;

        // Handle profile picture upload
        if (req.file) {
            user.profilePicture = req.file.filename; // Store only the filename
        }

        // Handle password update
        if (req.body.password) {
            const hashedPassword = await bcrypt.hash(req.body.password, 10);
            user.password = hashedPassword;
        }

        await user.save();

        const profilePicturePath = user.profilePicture 
            ? `/uploads/${user.profilePicture}` // Consistent path format
            : null;

        res.status(200).json({
            _id: user._id, // Include _id in response
            name: user.name,
            email: user.email,
            bio: user.bio,
            school: user.school,
            education: user.education,
            profilePicture: profilePicturePath,
            points: user.points,
            badges: user.badges,
            completedProjects: user.completedProjects
        });
    } catch (error) {
        console.error('Error updating user profile:', error);
        res.status(500).json({ message: 'Error updating user profile', error: error.message });
    }
};

// Get a public profile by user ID (for sharing)
exports.getPublicProfile = async (req, res) => {
    try {
        const userId = req.params.userId;

        // Validate userId
        if (!mongoose.Types.ObjectId.isValid(userId)) {
            return res.status(400).json({ message: 'Invalid user ID' });
        }

        const user = await User.findById(userId).select('name bio school education profilePicture points badges completedProjects');
        if (!user) {
            return res.status(404).json({ message: 'User not found' });
        }

        const profilePicturePath = user.profilePicture 
            ? `https://skillexa.in/uploads/${path.basename(user.profilePicture)}` // Full URL for public access
            : 'https://skillexa.in/assets/default-profile.png'; // Default image URL

        const shareableUrl = `https://skillexa.in/profile/${user._id}`;

        res.status(200).json({
            name: user.name,
            bio: user.bio,
            school: user.school,
            education: user.education,
            profilePicture: profilePicturePath,
            points: user.points,
            badges: user.badges,
            completedProjects: user.completedProjects,
            shareableUrl: shareableUrl // Include shareable URL
        });
    } catch (error) {
        console.error('Error fetching public profile:', error);
        res.status(500).json({ message: 'Error fetching public profile', error: error.message });
    }
};

module.exports = {
    getProfile: exports.getProfile,
    updateProfile: exports.updateProfile,
    getPublicProfile: exports.getPublicProfile
};