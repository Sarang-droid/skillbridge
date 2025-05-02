const mongoose = require('mongoose');
const Quiz = require('../models/quiz');
require('dotenv').config();

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
                question: 'What is the main purpose of A/B testing in digital marketing?',
                options: [
                    'To build customer loyalty programs',
                    'To compare two versions of a campaign or webpage for performance',
                    'To remove bots from email lists',
                    'To automate PPC bidding'
                ],
                correctAnswer: 1,
                date: 'Fri May 02 2025'
            },
            {
                industry: 'marketing',
                question: 'What does CAC stand for in marketing analytics?',
                options: [
                    'Customer Acquisition Cost',
                    'Content Analytics Console',
                    'Channel Advertising Campaign',
                    'Conversion Attribution Calculator'
                ],
                correctAnswer: 0,
                date: 'Fri May 02 2025'
            },
            {
                industry: 'marketing',
                question: 'Which metric directly indicates the percentage of users who completed a desired action?',
                options: ['Impression Share', 'Click-Through Rate', 'Engagement Rate', 'Conversion Rate'],
                correctAnswer: 3,
                date: 'Fri May 02 2025'
            },
            {
                industry: 'marketing',
                question: 'What is programmatic advertising?',
                options: [
                    'Advertising that runs only on TV',
                    'Manual bidding for keywords',
                    'Automated buying and placement of ads using software and data algorithms',
                    'Sponsored social media posts'
                ],
                correctAnswer: 2,
                date: 'Fri May 02 2025'
            },
            {
                industry: 'marketing',
                question: 'Which digital marketing model focuses on earning links and shares without paying for exposure?',
                options: ['Owned Media', 'Earned Media', 'Paid Media', 'Shared Media'],
                correctAnswer: 1,
                date: 'Fri May 02 2025'
            },
            {
                industry: 'marketing',
                question: 'Which term describes tailoring content or offers based on user behavior or data?',
                options: ['Segmentation', 'Personalization', 'Branding', 'Retargeting'],
                correctAnswer: 1,
                date: 'Fri May 02 2025'
            },
            {
                industry: 'marketing',
                question: 'What is the key difference between SEO and SEM?',
                options: [
                    'SEM uses organic traffic while SEO is paid',
                    'SEO involves both paid and unpaid search',
                    'SEO focuses on unpaid search results while SEM includes paid strategies',
                    'There is no difference'
                ],
                correctAnswer: 2,
                date: 'Fri May 02 2025'
            },
            {
                industry: 'marketing',
                question: 'Which analytics model gives 100% credit to the last interaction before a conversion?',
                options: ['First-Touch Attribution', 'Time Decay Model', 'Last-Touch Attribution', 'Linear Attribution'],
                correctAnswer: 2,
                date: 'Fri May 02 2025'
            },
            {
                industry: 'marketing',
                question: 'What is a "lookalike audience" in digital advertising?',
                options: [
                    'A group of people who viewed your profile',
                    'An audience that has unsubscribed',
                    'New users similar to your existing customers based on behavioral patterns',
                    'Anonymous users on a website'
                ],
                correctAnswer: 2,
                date: 'Fri May 02 2025'
            },
            {
                industry: 'marketing',
                question: 'In marketing automation, what does a lead scoring system do?',
                options: [
                    'Tracks leads’ location data',
                    'Assigns values to leads based on behavior and potential to convert',
                    'Estimates ad spend',
                    'Creates social media posts'
                ],
                correctAnswer: 1,
                date: 'Fri May 02 2025'
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