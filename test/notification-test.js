const mongoose = require('mongoose');
const { createNotification } = require('../controllers/notificationController');

// MongoDB connection string
const MONGODB_URI = 'mongodb://localhost:27017/skillBridge';

async function testNotificationSystem() {
    try {
        // Connect to MongoDB
        await mongoose.connect(MONGODB_URI);
        console.log('Connected to MongoDB');

        // Test user ID (you can replace this with a real user ID from your database)
        const testUserId = new mongoose.Types.ObjectId();

        // Test creating a project submission notification
        const notification = await createNotification(
            testUserId,
            'Project Submitted Successfully! 🎉',
            'Your project "Test Project" has been submitted and will be evaluated shortly. You will receive a notification once the evaluation is complete. Keep an eye on your profile for updates!',
            [], // no attachments
            [], // no links
            false // user-specific notification
        );

        console.log('Test notification created successfully:', notification);
        console.log('Notification ID:', notification._id);
        console.log('Notification Title:', notification.title);
        console.log('Notification Message:', notification.message);
        console.log('Notification Date:', notification.date);
        console.log('Is Global:', notification.global);
        console.log('Is Read:', notification.isRead);

        // Clean up - delete the test notification
        await mongoose.model('Notification').findByIdAndDelete(notification._id);
        console.log('Test notification cleaned up');

    } catch (error) {
        console.error('Error testing notification system:', error);
    } finally {
        // Close the MongoDB connection
        await mongoose.connection.close();
        console.log('MongoDB connection closed');
    }
}

// Run the test
testNotificationSystem(); 