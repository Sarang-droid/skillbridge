const mongoose = require('mongoose');

const achievementSchema = new mongoose.Schema({
    userId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true
    },
    projectId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Project',
        required: false // Made optional to support quizzes
    },
    type: {
        type: String,
        enum: ['project', 'quiz'],
        required: true // Distinguishes between project and quiz achievements
    },
    pointsEarned: {
        type: Number,
        required: true,
        default: 0
    },
    aiFeedback: {
        type: String,
        default: 'No feedback provided'
    },
    dateAwarded: {
        type: Date,
        default: Date.now
    }
});

const Achievement = mongoose.model('Achievement', achievementSchema);

module.exports = Achievement;