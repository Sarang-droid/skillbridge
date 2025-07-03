require('dotenv').config();
const mongoose = require('mongoose');
const connectDB = require('../backend/config/database');
const Project = require('../models/project');

(async () => {
    await connectDB();

    const projects = [
  
// 1. Prototype-based
// 1. Prototype-based
{
    companyId: '686659eb39461b902b133dd2',
    companyType: 'Private',
    projectId: 'PRJ-MP-121',
    title: 'Real-time Brand Sentiment Dashboard',
    description: 'Create a live dashboard tracking brand mentions and sentiment across social platforms.',
    industry: 'Marketing',
    projectType: 'Prototype',
    preferredSkills: ['NLP', 'API Integration', 'Data Visualization', 'Social Media APIs', 'JavaScript'],
    minExperienceRequired: 3,
    tasks: [
      { taskId: 'T1', taskName: 'Connect to social media APIs', completed: false },
      { taskId: 'T2', taskName: 'Implement sentiment analysis pipeline', completed: false },
      { taskId: 'T3', taskName: 'Build interactive dashboard UI', completed: false }
    ],
    submissionDeadline: new Date('2024-12-20'),
    difficulty: 4,
    resources: [
      {
        name: 'Sentiment Analysis Tutorial',
        url: 'https://www.youtube.com/watch?v=o_OZdbCzHUA',
        description: 'Practical NLP implementation'
      }
    ],
    status: 'active',
    applicants: 0,
    completedBy: []
  },
  
  // 2. Research-based
  {
    companyId: '686659eb39461b902b133dd2',
    companyType: 'Private',
    projectId: 'PRJ-MP-122',
    title: 'Cookie-less Future Impact Study',
    description: 'Research marketing measurement alternatives in preparation for third-party cookie deprecation.',
    industry: 'Marketing',
    projectType: 'Research',
    preferredSkills: ['Digital Marketing', 'Privacy Regulations', 'Research Methodology', 'Data Strategy', 'Technical Writing'],
    minExperienceRequired: 3,
    tasks: [
      { taskId: 'T1', taskName: 'Catalog emerging identity solutions', completed: false },
      { taskId: 'T2', taskName: 'Interview ad tech executives', completed: false },
      { taskId: 'T3', taskName: 'Develop transition roadmap', completed: false }
    ],
    submissionDeadline: new Date('2025-01-10'),
    difficulty: 3,
    resources: [
      {
        name: 'Post-Cookie Marketing',
        url: 'https://www.iab.com/guidelines/post-cookie-recommendations/',
        description: 'Industry standards for cookie-less world'
      }
    ],
    status: 'active',
    applicants: 0,
    completedBy: []
  },
  
  // 3. Hybrid
  {
    companyId: '686659eb39461b902b133dd2',
    companyType: 'Private',
    projectId: 'PRJ-MP-123',
    title: 'Predictive Campaign Modeling',
    description: 'Develop ML models to forecast campaign performance based on historical data.',
    industry: 'Marketing',
    projectType: 'Hybrid',
    preferredSkills: ['Machine Learning', 'Marketing Analytics', 'Python', 'Time Series Forecasting', 'Data Engineering'],
    minExperienceRequired: 4,
    tasks: [
      { taskId: 'T1', taskName: 'Clean and prepare historical campaign data', completed: false },
      { taskId: 'T2', taskName: 'Train and validate prediction models', completed: false },
      { taskId: 'T3', taskName: 'Create API for marketing team integration', completed: false }
    ],
    submissionDeadline: new Date('2025-03-01'),
    difficulty: 4,
    resources: [
      {
        name: 'Marketing Data Science',
        url: 'https://towardsdatascience.com/marketing-data-science-a6e0e7a4704e',
        description: 'Practical guide to marketing ML'
      }
    ],
    status: 'active',
    applicants: 0,
    completedBy: []
  }
    ];

    try {
        const insertedProjects = await Project.insertMany(projects);
        console.log('Inserted projects:', insertedProjects);
        insertedProjects.forEach(p => console.log('Project _id:', p._id.toString()));
    } catch (err) {
        console.error('Error inserting projects:', err);
    } finally {
        mongoose.connection.close();
    }
})();