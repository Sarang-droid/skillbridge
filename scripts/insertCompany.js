require('dotenv').config();
const mongoose = require('mongoose');
const connectDB = require('../backend/config/database');
const Company = require('../models/company');

(async () => {
    await connectDB();

    const companies = [
        {
            name: 'ByteForge',
            description: 'A dynamic IT firm specializing in cloud-based solutions and DevOps automation.',
            deadline: new Date('2025-12-31'),
            industry: 'IT',
            companyType: 'Startup',
            preferredSkills: ['Python', 'AWS', 'Docker', 'CI/CD'],
            minExperienceRequired: 3,
            culture: 'Innovative',
            size: 'Medium'
        },
        {
            name: 'Quantum Stack',
            description: 'An IT company focused on quantum computing and advanced algorithms.',
            deadline: new Date('2026-01-15'),
            industry: 'IT',
            companyType: 'Private',
            preferredSkills: ['Quantum Computing', 'C++', 'Python', 'Machine Learning'],
            minExperienceRequired: 4,
            culture: 'Innovative',
            size: 'Large'
        },
        {
            name: 'Finova Capital',
            description: 'A finance company offering innovative investment management solutions.',
            deadline: new Date('2025-11-30'),
            industry: 'Finance',
            companyType: 'Private',
            preferredSkills: ['Financial Analysis', 'Risk Management', 'Python', 'SQL'],
            minExperienceRequired: 3,
            culture: 'Traditional',
            size: 'Large'
        },
        {
            name: 'LedgerLogic',
            description: 'A fintech startup revolutionizing blockchain-based financial tracking.',
            deadline: new Date('2025-10-31'),
            industry: 'Finance',
            companyType: 'Startup',
            preferredSkills: ['Blockchain', 'Solidity', 'JavaScript', 'Data Security'],
            minExperienceRequired: 2,
            culture: 'Innovative',
            size: 'Small'
        },
        {
            name: 'WealthBridge',
            description: 'A finance firm providing wealth management and advisory services.',
            deadline: new Date('2025-12-15'),
            industry: 'Finance',
            companyType: 'Private',
            preferredSkills: ['Investment Banking', 'Data Analysis', 'Excel', 'Communication'],
            minExperienceRequired: 4,
            culture: 'Collaborative',
            size: 'Medium'
        },
        {
            name: 'Shopnetic',
            description: 'An ecommerce platform specializing in personalized shopping experiences.',
            deadline: new Date('2025-09-30'),
            industry: 'E-commerce',
            companyType: 'Startup',
            preferredSkills: ['React', 'Node.js', 'MongoDB', 'UI/UX Design'],
            minExperienceRequired: 2,
            culture: 'Innovative',
            size: 'Small'
        },
        {
            name: 'CartVerse',
            description: 'A global ecommerce company focused on sustainable retail solutions.',
            deadline: new Date('2025-11-15'),
            industry: 'E-commerce',
            companyType: 'Private',
            preferredSkills: ['JavaScript', 'Shopify', 'Data Analytics', 'SEO'],
            minExperienceRequired: 3,
            culture: 'Traditional',
            size: 'Large'
        },
        {
            name: 'BrandNest',
            description: 'A marketing agency specializing in digital branding and social media strategy.',
            deadline: new Date('2025-10-01'),
            industry: 'Marketing',
            companyType: 'Startup',
            preferredSkills: ['Digital Marketing', 'Content Creation', 'SEO', 'Social Media'],
            minExperienceRequired: 2,
            culture: 'Collaborative',
            size: 'Small'
        },
        {
            name: 'Marqly',
            description: 'A marketing firm delivering data-driven advertising campaigns.',
            deadline: new Date('2025-12-01'),
            industry: 'Marketing',
            companyType: 'Private',
            preferredSkills: ['Data Analysis', 'Google Ads', 'Branding', 'Project Management'],
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