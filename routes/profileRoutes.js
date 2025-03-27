const express = require('express');
const router = express.Router();
const profileController = require('../controllers/profileController');
const authMiddleware = require('../middleware/authMiddleware');
const { profilePictureUpload, handleMulterErrors } = require('../middleware/fileUploadMiddleware');

// Route to get the user's profile
router.get('/me', authMiddleware.protect, profileController.getProfile);

// Route to update the user's profile with profile picture upload
router.put('/update', authMiddleware.protect, profilePictureUpload.single('profilePicture'), handleMulterErrors, profileController.updateProfile);

// In your router file
router.get('/:userId', profileController.getPublicProfile); // Public profile route, no auth required
module.exports = router;