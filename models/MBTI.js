const mongoose = require('mongoose');

const mbtiSchema = new mongoose.Schema({
    userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true, index: true },
    mbtiType: { 
        type: String, 
        required: true, 
        enum: ['INFP', 'INFJ', 'INTP', 'INTJ', 'ISFP', 'ISFJ', 'ISTP', 'ISTJ', 'ENFP', 'ENFJ', 'ENTP', 'ENTJ', 'ESFP', 'ESFJ', 'ESTP', 'ESTJ'],
        index: true 
    },
    // Full type including the Identity dimension, e.g. "INFJ-T"
    fullType: { type: String },
    // Identity axis: 'T' (Turbulent) or 'A' (Assertive)
    identity: { type: String, enum: ['T', 'A'] },
    psychologicalScore: { type: Number, required: true },
    famousMatches: [String],
    // Raw graded responses + final choice, kept for debugging/retake analysis
    answers: { type: Array, default: [] },
    finalAnswer: { type: Number },
    projectMatches: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Project' }],
    token: { type: String, unique: true },
    createdAt: { type: Date, default: Date.now },
    compatibilityScores: [{
        mbtiType: { type: String },
        score: { type: Number },
    }],
    insights: { type: String, default: '' },
    // New fields
    normalizedScores: {
        mind: { type: Number, default: 0 },    // -100 to +100 (Introvert vs Extrovert)
        energy: { type: Number, default: 0 },  // -100 to +100 (Intuitive vs Sensing)
        nature: { type: Number, default: 0 },  // -100 to +100 (Feeling vs Thinking)
        tactics: { type: Number, default: 0 }, // -100 to +100 (Prospecting vs Judging)
        identity: { type: Number, default: 0 } // -100 to +100 (Turbulent vs Assertive, optional)
    },
    confidence: { type: Number, default: 0 }   // 0 to 100, average strength of preference
});

module.exports = mongoose.model('MBTI', mbtiSchema);