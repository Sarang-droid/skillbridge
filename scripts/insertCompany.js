require('dotenv').config();
const mongoose = require('mongoose');
const connectDB = require('../backend/config/database');
const Company = require('../models/company');

(async () => {
    await connectDB();

    const companies = [
        {
            name: 'CloudNova Systems',
            description: 'An IT startup innovating cloud-based infrastructure for scalable applications.',
            deadline: new Date('2026-02-28'),
            industry: 'IT',
            companyType: 'Startup',
            preferredSkills: ['AWS', 'Kubernetes', 'Node.js', 'DevOps'],
            minExperienceRequired: 2,
            culture: 'Innovative',
            size: 'Small'
        },
        {
            name: 'DevSynergy Labs',
            description: 'A technology firm specializing in AI-driven software development tools.',
            deadline: new Date('2025-12-31'),
            industry: 'IT',
            companyType: 'Startup',
            preferredSkills: ['Python', 'AI/ML', 'JavaScript', 'Agile Development'],
            minExperienceRequired: 3,
            culture: 'Collaborative',
            size: 'Medium'
        },
        {
            name: 'NeuralQuotient',
            description: 'An IT corporation advancing neural network applications for enterprise solutions.',
            deadline: new Date('2026-01-15'),
            industry: 'IT',
                companyType: 'Private',
            preferredSkills: ['TensorFlow', 'Python', 'Big Data', 'Cloud Computing'],
            minExperienceRequired: 4,
            culture: 'Innovative',
            size: 'Large'
        },
        {
            name: 'AegisLedger',
            description: 'A fintech company providing secure blockchain-based financial services.',
            deadline: new Date('2025-11-30'),
            industry: 'Finance',
            companyType: 'Startup',
            preferredSkills: ['Blockchain', 'Solidity', 'Data Security', 'Python'],
            minExperienceRequired: 2,
            culture: 'Innovative',
            size: 'Small'
        },
        {
            name: 'Quantivest Partners',
            description: 'A finance firm offering quantitative investment strategies and analytics.',
            deadline: new Date('2025-12-15'),
            industry: 'Finance',
            companyType: 'Private',
            preferredSkills: ['Financial Modeling', 'Python', 'SQL', 'Risk Management'],
            minExperienceRequired: 4,
            culture: 'Competitive',
            size: 'Large'
        },
        {
            name: 'SecureFunds Global',
            description: 'A finance company specializing in wealth management and advisory services.',
            deadline: new Date('2025-10-31'),
            industry: 'Finance',
            companyType: 'Private',
            preferredSkills: ['Investment Banking', 'Data Analysis', 'Excel', 'Communication'],
            minExperienceRequired: 3,
            culture: 'Collaborative',
            size: 'Medium'
        },
        {
            name: 'Trendora',
            description: 'An ecommerce startup delivering personalized online shopping experiences.',
            deadline: new Date('2025-10-15'),
            industry: 'E-commerce',
            companyType: 'Startup',
            preferredSkills: ['React', 'Node.js', 'MongoDB', 'UI/UX Design'],
            minExperienceRequired: 2,
            culture: 'Traditional',
            size: 'Small'
        },
        {
            name: 'BuyHive',
            description: 'A global ecommerce platform focused on sustainable and ethical retail.',
            deadline: new Date('2025-12-01'),
            industry: 'E-commerce',
            companyType: 'Private',
            preferredSkills: ['JavaScript', 'Shopify', 'SEO', 'Data Analytics'],
            minExperienceRequired: 3,
            culture: 'Innovative',
            size: 'Large'
        },
        {
            name: 'Advolve Creative',
            description: 'A marketing agency specializing in innovative digital branding campaigns.',
            deadline: new Date('2025-11-10'),
            industry: 'Marketing',
            companyType: 'Startup',
            preferredSkills: ['Digital Marketing', 'Content Creation', 'SEO', 'Social Media'],
            minExperienceRequired: 2,
            culture: 'Collaborative',
            size: 'Small'
        },
        {
            name: 'MarketPulse',
            description: 'A marketing firm delivering data-driven advertising and analytics solutions.',
            deadline: new Date('2025-12-20'),
            industry: 'Marketing',
            companyType: 'Private',
            preferredSkills: ['Google Ads', 'Data Analysis', 'Branding', 'Project Management'],
            minExperienceRequired: 3,
            culture: 'Competitive',
            size: 'Medium'
        }
    ];

    try {
        const insertedCompanies = await Company.insertMany(companies);
        console.log('Inserted companies:', insertedCompanies);
        insertedCompanies.forEach(company => console.log('Company _id:', company._id.toString()));
    } catch (err) {
        console.error('Error inserting companies:', err);
    } finally {
        mongoose.connection.close();
    }
})();