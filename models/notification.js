const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const notificationSchema = new Schema({
    userId: {
        type: Schema.Types.ObjectId,
        ref: 'User',
        required: function () {
            return !this.global; // `userId` is required if not global
        },
    },
    global: {
        type: Boolean,
        default: false, // Default is a user-specific notification
    },
    title: {
        type: String,
        required: true,
    },
    message: {
        type: String,
        required: true,
    },
    attachments: [{
        fileName: String,
        fileUrl: String,
        fileType: String
    }],
    links: [{
        title: String,
        url: String
    }],
    date: {
        type: Date,
        default: Date.now,
    },
    isRead: {
        type: Boolean,
        default: false
    }
});

module.exports = mongoose.model('Notification', notificationSchema);
