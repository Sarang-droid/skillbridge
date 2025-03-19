const mongoose = require('mongoose');

const projectSchema = new mongoose.Schema({
    companyId: {
        type: mongoose.Schema.Types.ObjectId,
        required: true,
        ref: 'Company'  // Reference to the Company model
    },
    companyType: {
        type: String,
        required: true,
        enum: ['Startup', 'Private', 'Public', 'NGO', 'Government'], // Aligns with Company model
    },
    projectId: {
        type: String,
        unique: true,
        required: true
    },
    title: {
        type: String,
        required: true
    },
    description: {
        type: String,
        required: true
    },
    industry: {
        type: String,
        enum: ['Technology', 'Healthcare', 'Finance', 'Education', 'IT Services', 'Fintech'],
        required: true
    },
    projectType: {
        type: String,
        required: true,
        enum: ['Research', 'Internship', 'Freelance', 'Contract', 'Full-time'], // Defines the type of project
    },
    preferredSkills: {
        type: [String], // Matches users with relevant skills
        default: [],
    },
    minExperienceRequired: {
        type: Number,
        default: 0, // Default to 0 if no experience is required
    },
    tasks: [{
        taskId: {
            type: String,
            required: true
        },
        taskName: {
            type: String,
            required: true
        },
        completed: {
            type: Boolean,
            default: false
        }
    }],
    codeQuality: {
        type: Number,
        default: 0,
        min: 0,
        max: 100
    },
    unitTests: {
        type: Number,
        default: 0,
        min: 0,
        max: 100
    },
    securityStandardsMet: {
        type: Boolean,
        default: false
    },
    regulatoryCompliance: {
        type: Boolean,
        default: false
    },
    modelAccuracy: {
        type: Number,
        default: 0,
        min: 0,
        max: 100
    },
    datasetSize: {
        type: Number,
        default: 0
    },
    status: {
        type: String,
        enum: ['active', 'completed', 'pending', 'submitted'],
        default: 'active'
    },
    pointsAwarded: {
        type: Number,
        default: 0
    },
    qualityScore: {
        type: Number,
        default: 0
    },
    completedBy: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User'
    }],
    submissionDeadline: {
        type: Date,
        required: true
    },
    applicants: {
        type: Number,
        default: 0
    },
    createdAt: {
        type: Date,
        default: Date.now
    },
    updatedAt: {
        type: Date,
        default: Date.now
    },
    difficulty: {
        type: Number,
        min: 1,
        max: 10
    },
    expectedCompletionTime: {
        type: Number,
    },
    // New Fields for Matchmaking
    compatibleMBTITypes: [{
        type: String,
    }],
    engagementScore: {
        type: Number,
        default: 0,
    },
    popularity: {
        type: Number,
        default: 0,
    },
    resources: [{
        name: {
            type: String,
            required: true,
            trim: true
        },
        url: {
            type: String,
            required: true,
            trim: true,
            match: [/^https?:\/\/[^\s$.?#].[^\s]*$/, 'Please provide a valid URL'] // Basic URL validation
        },
        description: {
            type: String,
            trim: true,
            default: ''
        }
    }],
});

// Middleware to update the updatedAt field
projectSchema.pre('save', function(next) {
    this.updatedAt = Date.now();
    next();
});

module.exports = mongoose.model('Project', projectSchema);