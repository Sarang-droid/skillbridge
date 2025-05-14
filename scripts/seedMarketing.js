const mongoose = require('mongoose');
const Quiz = require('../models/quiz');
require('dotenv').config({ path: '../.env' });

async function seedMarketingQuizzes() {
    try {
        await mongoose.connect(process.env.MONGO_URI, {
            useNewUrlParser: true,
            useUnifiedTopology: true
        });
        console.log('Connected to MongoDB:', mongoose.connection.name);

        const today = new Date().toDateString();

        await Quiz.deleteMany({ industry: 'marketing', date: today });
        console.log('Cleared existing Marketing quizzes for today');

        await Quiz.insertMany([
            {
              industry: 'marketing',
              question: 'What is a key purpose of sentiment analysis in digital marketing?',
              options: ['Design logos', 'Monitor website performance', 'Analyze consumer emotion in brand mentions', 'Calculate ROI'],
              correctAnswer: 2,
              date: today
            },
            {
              industry: 'marketing',
              question: 'Which model breaks down marketing attribution across the customer journey?',
              options: ['Funnel Model', 'STP Model', 'Multi-Touch Attribution Model', 'Flywheel Model'],
              correctAnswer: 2,
              date: today
            },
            {
              industry: 'marketing',
              question: 'Which metric best measures content virality?',
              options: ['Conversion Rate', 'Impression Count', 'Share Ratio', 'Click-Through Rate'],
              correctAnswer: 2,
              date: today
            },
            {
              industry: 'marketing',
              question: 'What is "retargeting" in digital advertising?',
              options: ['Advertising via influencers', 'Showing ads to previous site visitors', 'Running YouTube ads', 'Tracking bounce rate'],
              correctAnswer: 1,
              date: today
            },
            {
              industry: 'marketing',
              question: 'What does A/B testing evaluate in marketing?',
              options: ['Server load', 'Campaign performance differences between two versions', 'SEO effectiveness', 'App response times'],
              correctAnswer: 1,
              date: today
            },
            {
              industry: 'marketing',
              question: 'Which platform is best for B2B content marketing?',
              options: ['Instagram', 'LinkedIn', 'TikTok', 'Pinterest'],
              correctAnswer: 1,
              date: today
            },
            {
              industry: 'marketing',
              question: 'What is the main function of a Customer Data Platform (CDP)?',
              options: ['Content hosting', 'User interface design', 'Collect and unify customer data from multiple sources', 'Heatmap generation'],
              correctAnswer: 2,
              date: today
            },
            {
              industry: 'marketing',
              question: 'Which strategy involves creating valuable content to attract customers?',
              options: ['Outbound Marketing', 'Cold Calling', 'Inbound Marketing', 'Sponsorship'],
              correctAnswer: 2,
              date: today
            },
            {
              industry: 'marketing',
              question: 'What does CLTV stand for?',
              options: ['Click-Level Tracking Validation', 'Customer Lifetime Value', 'Consumer Lead Tracking Variable', 'Content Listing Time Variation'],
              correctAnswer: 1,
              date: today
            },
            {
              industry: 'marketing',
              question: 'Which digital metric best indicates ad relevance to the audience?',
              options: ['Bounce Rate', 'Conversion Rate', 'CTR (Click-Through Rate)', 'Page Load Speed'],
              correctAnswer: 2,
              date: today
            }
        ]);

        console.log('Marketing quiz questions seeded successfully for', today);
    } catch (error) {
        console.error('Error seeding Marketing quizzes:', error);
    } finally {
        await mongoose.connection.close();
        console.log('MongoDB connection closed');
    }
}

seedMarketingQuizzes();