const express = require('express');
const router = express.Router();
const {
    getNotifications,
    notifyAllUsersIndividually,
    notifyAllUsersGlobally,
} = require('../controllers/notificationController');
const { protect } = require('../middleware/authMiddleware'); // Auth middleware
const { isAdmin } = require('../middleware/authMiddleware'); // Add an admin middleware
const Notification = require('../models/notification');

// Route to get all notifications for the logged-in user
router.get('/', protect, getNotifications);

// Route to notify all users individually (admin-only)
router.post('/notify-individual', protect, isAdmin, async (req, res) => {
    const { title, message } = req.body;
    try {
        await notifyAllUsersIndividually(title, message);
        res.status(200).json({ message: 'Notifications sent to all users individually.' });
    } catch (error) {
        console.error('Error notifying users individually:', error);
        res.status(500).json({ error: 'Failed to notify users.' });
    }
});

// Route to notify all users globally (admin-only)
router.post('/notify-global', protect, isAdmin, async (req, res) => {
    const { title, message } = req.body;
    try {
        await notifyAllUsersGlobally(title, message);
        res.status(200).json({ message: 'Global notification created successfully.' });
    } catch (error) {
        console.error('Error creating global notification:', error);
        res.status(500).json({ error: 'Failed to create global notification.' });
    }
});

// Add this new route
router.post('/mark-read', protect, async (req, res) => {
    const { notificationIds } = req.body;
    try {
        await Notification.updateMany(
            { _id: { $in: notificationIds } },
            { $set: { isRead: true } }
        );
        res.status(200).json({ message: 'Notifications marked as read' });
    } catch (error) {
        console.error('Error marking notifications as read:', error);
        res.status(500).json({ error: 'Failed to mark notifications as read' });
    }
});

module.exports = router;
