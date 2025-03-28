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
                question: 'What does SEO stand for?',
                options: ['Sales Enhancement Option', 'Search Engine Optimization', 'Social Engagement Order', 'Systematic Email Outreach'],
                correctAnswer: 1,
                date: today
            },
            {
                industry: 'marketing',
                question: 'What is the purpose of a call-to-action (CTA)?',
                options: ['To confuse customers', 'To prompt user action', 'To display ads', 'To track employees'],
                correctAnswer: 1,
                date: today
            },
            {
                industry: 'marketing',
                question: 'Which is a common social media platform for marketing?',
                options: ['Excel', 'Instagram', 'AutoCAD', 'Notepad'],
                correctAnswer: 1,
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