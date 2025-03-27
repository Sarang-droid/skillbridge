const User = require('../models/user');
const bcrypt = require('bcrypt');
const path = require('path');
const fs = require('fs');

// In profileController.js
exports.getProfile = async (req, res) => {
    try {
        const user = await User.findById(req.user._id);
        if (!user) {
            return res.status(404).json({ message: 'User not found' });
        }

        const profilePicturePath = user.profilePicture 
            ? `/uploads/${path.relative(path.join(__dirname, '../uploads'), user.profilePicture)}`
            : null; // Relative path starting with /uploads

        res.status(200).json({
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

exports.updateProfile = async (req, res) => {
    try {
        const user = await User.findById(req.user._id);
        if (!user) {
            return res.status(404).json({ message: 'User not found' });
        }

        user.name = req.body.name || user.name;
        user.email = req.body.email || user.email;
        user.bio = req.body.bio || user.bio;
        user.school = req.body.school || user.school;
        user.education = req.body.education || user.education;

        if (req.file) {
            user.profilePicture = req.file.path;
        }

        if (req.body.password) {
            const hashedPassword = await bcrypt.hash(req.body.password, 10);
            user.password = hashedPassword;
        }

        await user.save();

        const profilePicturePath = user.profilePicture 
            ? `/uploads/${path.relative(path.join(__dirname, '../uploads'), user.profilePicture)}`
            : null;

        res.status(200).json({
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
// In profileController.js
exports.getPublicProfile = async (req, res) => {
    try {
        const userId = req.params.userId;
        const user = await User.findById(userId).select('name bio school education profilePicture points badges completedProjects');
        if (!user) {
            return res.status(404).json({ message: 'User not found' });
        }

        const profilePicturePath = user.profilePicture 
            ? `http://localhost:5000/uploads/${path.relative(path.join(__dirname, '../uploads'), user.profilePicture)}`
            : 'http://localhost:5000/assets/default-profile.png';

        const shareableUrl = `http://localhost:5000/profile/${user._id}`;

        res.status(200).json({
            name: user.name,
            bio: user.bio,
            school: user.school,
            education: user.education,
            profilePicture: profilePicturePath,
            points: user.points,
            badges: user.badges,
            completedProjects: user.completedProjects,
            shareableUrl: shareableUrl
        });
    } catch (error) {
        console.error('Error fetching public profile:', error);
        res.status(500).json({ message: 'Error fetching public profile', error: error.message });
    }
};