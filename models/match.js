const mongoose = require('mongoose');

const MatchSchema = new mongoose.Schema({
    userId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true
    },
    projectId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Project',
        required: true
    },
    companyId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Company',
        required: true // Now tracks the company the project belongs to
    },
    score: {
        type: Number,
        required: true
    },
    matchedAt: {
        type: Date,
        default: Date.now
    },
    // New Fields for Matchmaking
    mbtiCompatibilityScore: {
        type: Number,
    },
    skillCompatibilityScore: {
        type: Number,
    },
    status: {
        type: String,
        enum: ['Pending', 'Accepted', 'Rejected'],
        default: 'Pending',
    },
});

module.exports = mongoose.model('Match', MatchSchema);