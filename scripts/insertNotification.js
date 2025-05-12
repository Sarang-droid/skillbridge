const mongoose = require('mongoose');
const Notification = require('../models/notification');
const path = require('path');

// MongoDB connection string
const MONGODB_URI = 'mongodb://localhost:27017/skillBridge';

async function insertNotificationWithHTML() {
    try {
        // Connect to MongoDB
        await mongoose.connect(MONGODB_URI);
        console.log('Connected to MongoDB');

        // Get the HTML file name from the path
        const filePath = 'C:/Users/saran/Downloads/RTJI System Analysis Report - April 2025 (1).html';
        const fileName = path.basename(filePath);

        // Create a new notification with HTML file
        const notification = new Notification({
            global: true, // set to true if you want all users to see it
            title: 'RTJI System Analysis Report',
            message: 'Please review the System Analysis Report for April 2025',
            attachments: [{
                fileName: fileName,
                fileUrl: filePath, // local file path
                fileType: 'text/html'
            }],
            date: new Date(),
            isRead: false
        });

        // Save the notification
        const savedNotification = await notification.save();
        console.log('Notification inserted successfully:', savedNotification);

        console.log('\nIMPORTANT NOTE:');
        console.log('The file is currently referenced with a local file path.');
        console.log('To make this accessible to users, you should:');
        console.log('1. Move the HTML file to your project\'s public directory');
        console.log('2. Update the fileUrl to be a web-accessible URL');
        console.log('3. Or set up a route to serve this file from your server');

    } catch (error) {
        console.error('Error inserting notification:', error);
    } finally {
        // Close the MongoDB connection
        await mongoose.connection.close();
        console.log('MongoDB connection closed');
    }
}

// Run the function
insertNotificationWithHTML();
