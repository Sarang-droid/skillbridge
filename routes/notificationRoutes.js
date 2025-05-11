const express = require('express');
const router = express.Router();
const {
    getNotifications,
    notifyAllUsersIndividually,
    notifyAllUsersGlobally,
    sendPDFToAllUsers,
    sendLinksToAllUsers,
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

// Route to send PDF to all users (admin-only)
router.post('/send-pdf', protect, isAdmin, async (req, res) => {
    const { title, message, pdfUrl, fileName } = req.body;
    try {
        const notification = await sendPDFToAllUsers(title, message, pdfUrl, fileName);
        res.status(200).json({ message: 'PDF notification sent to all users', notification });
    } catch (error) {
        console.error('Error sending PDF to users:', error);
        res.status(500).json({ error: 'Failed to send PDF notification' });
    }
});

// Route to send links to all users (admin-only)
router.post('/send-links', protect, isAdmin, async (req, res) => {
    const { title, message, links } = req.body;
    try {
        const notification = await sendLinksToAllUsers(title, message, links);
        res.status(200).json({ message: 'Links notification sent to all users', notification });
    } catch (error) {
        console.error('Error sending links to users:', error);
        res.status(500).json({ error: 'Failed to send links notification' });
    }
});

// Route to mark notifications as read
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
