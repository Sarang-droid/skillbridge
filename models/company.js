const mongoose = require('mongoose');

const companySchema = new mongoose.Schema({
    name: {
        type: String,
        required: true,
    },
    description: {
        type: String,
        required: true,
    },
    totalApplicants: {
        type: Number,
        default: 0,
    },
    deadline: {
        type: Date,
        required: true,
    },
    industry: {
        type: String,
        required: true,
        enum: ['IT', 'Marketing', 'Finance', 'E-commerce'],
    },
    companyType: {
        type: String,
        required: true,
        enum: ['Startup', 'Private', 'Public', 'NGO', 'Government'],
    },
    preferredSkills: {
        type: [String], // Array of skills
        default: [],
    },
    minExperienceRequired: {
        type: Number,
        default: 0, // Default to 0 if no experience is required
    },
    // New Fields for Matchmaking
    culture: {
        type: String,
        enum: ['Collaborative', 'Competitive', 'Innovative', 'Traditional'],
    },
    size: {
        type: String,
        enum: ['Small', 'Medium', 'Large'],
    },
});

module.exports = mongoose.model('Company', companySchema);