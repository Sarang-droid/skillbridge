const Notification = require('../models/notification');
const User = require('../models/user'); // To fetch all users

// Get notifications for a user (including global notifications)
exports.getNotifications = async (req, res) => {
    try {
        console.log('Fetching notifications for user:', req.user);

        if (!req.user || !req.user._id) {
            console.error('User ID not found in request object.');
            return res.status(401).json({ error: 'Unauthorized: User not authenticated.' });
        }

        // Fetch user-specific and global notifications
        const notifications = await Notification.find({
            $or: [{ userId: req.user._id }, { global: true }],
        }).sort({ date: -1 });

        console.log('Notifications fetched successfully:', notifications);
        res.status(200).json({ notifications });
    } catch (error) {
        console.error('Error fetching notifications:', error);
        res.status(500).json({ error: 'Server error while fetching notifications.' });
    }
};

// Create a new notification (user-specific or global)
exports.createNotification = async (userId, title, message, attachments = [], links = [], global = false) => {
    try {
        const notification = new Notification({
            userId: global ? undefined : userId, // `userId` is only set if not global
            global,
            title,
            message,
            attachments,
            links,
            date: new Date(),
            isRead: false
        });
        await notification.save();
        return notification;
    } catch (error) {
        console.error('Error creating notification:', error);
        throw error;
    }
};

// Notify all users by creating individual notifications
exports.notifyAllUsersIndividually = async (title, message, attachments = [], links = []) => {
    try {
        const users = await User.find({});
        const notifications = [];
        for (const user of users) {
            const notification = await exports.createNotification(user._id, title, message, attachments, links);
            notifications.push(notification);
        }
        return notifications;
    } catch (error) {
        console.error('Error notifying all users individually:', error);
    }
};

// Notify all users using a global notification
exports.notifyAllUsersGlobally = async (title, message, attachments = [], links = []) => {
    try {
        const notification = await exports.createNotification(null, title, message, attachments, links, true);
        return notification;
    } catch (error) {
        console.error('Error sending global notification:', error);
        throw error;
    }
};

// Send PDF or links to all users
exports.sendPDFToAllUsers = async (title, message, pdfUrl, fileName) => {
    try {
        const attachment = {
            fileName,
            fileUrl: pdfUrl,
            fileType: 'application/pdf'
        };
        return await exports.notifyAllUsersGlobally(title, message, [attachment], []);
    } catch (error) {
        console.error('Error sending PDF to all users:', error);
        throw error;
    }
};

// Send links to all users
exports.sendLinksToAllUsers = async (title, message, links) => {
    try {
        return await exports.notifyAllUsersGlobally(title, message, [], links);
    } catch (error) {
        console.error('Error sending links to all users:', error);
        throw error;
    }
};

// Add a function to mark notifications as read
exports.markAsRead = async (req, res) => {
    try {
        const { notificationIds } = req.body;
        await Notification.updateMany(
            { _id: { $in: notificationIds } },
            { $set: { isRead: true } }
        );
        res.status(200).json({ message: 'Notifications marked as read' });
    } catch (error) {
        console.error('Error marking notifications as read:', error);
        res.status(500).json({ error: 'Server error while marking notifications as read' });
    }
};
