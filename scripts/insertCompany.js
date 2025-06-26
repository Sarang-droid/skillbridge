require('dotenv').config();
const mongoose = require('mongoose');
const connectDB = require('../backend/config/database');
const Company = require('../models/company');

(async () => {
    await connectDB();

    const companyData = {
        name: 'Acme Innovations',
        description: 'A leading company in innovative tech solutions.',
        deadline: new Date('2025-12-31'),
        industry: 'IT',
        companyType: 'Startup',
        preferredSkills: ['JavaScript', 'Node.js', 'MongoDB'],
        minExperienceRequired: 2,
        culture: 'Innovative',
        size: 'Small',
    };

    try {
        const company = await Company.create(companyData);
        console.log('Inserted company:', company);
        console.log('Company _id:', company._id.toString());
        const companyId = company._id.toString();
        return companyId;
    } catch (err) {
        console.error('Error inserting company:', err);
    } finally {
        mongoose.connection.close();
    }
})(); 