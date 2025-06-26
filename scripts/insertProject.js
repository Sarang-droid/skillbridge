require('dotenv').config();
const mongoose = require('mongoose');
const connectDB = require('../backend/config/database');
const Project = require('../models/project');

// TODO: Replace this with the actual company _id from the company insertion script
const companyId = '685ceb9003e7831f0726b8be';

(async () => {
    await connectDB();

    const projectData = {
        companyId: companyId,
        companyType: 'Startup',
        projectId: 'PRJ-001',
        title: 'AI Chatbot Development',
        description: 'Develop a chatbot using AI for customer support.',
        industry: 'IT',
        projectType: 'Development',
        preferredSkills: ['JavaScript', 'Node.js', 'AI'],
        minExperienceRequired: 2,
        tasks: [
            { taskId: 'T1', taskName: 'Design chatbot flow', completed: false },
            { taskId: 'T2', taskName: 'Implement backend', completed: false },
        ],
        submissionDeadline: new Date('2025-11-30'),
        difficulty: 3,
        resources: [
            { name: 'Chatbot Design Guide', url: 'https://example.com/guide', description: 'A guide for chatbot design.' },
        ],
        status: 'active',
        applicants: 0,
        completedBy: [],
    };

    try {
        const project = await Project.create(projectData);
        console.log('Inserted project:', project);
        console.log('Project _id:', project._id.toString());
    } catch (err) {
        console.error('Error inserting project:', err);
    } finally {
        mongoose.connection.close();
    }
})(); 