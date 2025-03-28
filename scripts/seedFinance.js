const mongoose = require('mongoose');
const Quiz = require('../models/quiz');
require('dotenv').config();

async function seedFinanceQuizzes() {
    try {
        await mongoose.connect(process.env.MONGO_URI, {
            useNewUrlParser: true,
            useUnifiedTopology: true
        });
        console.log('Connected to MongoDB:', mongoose.connection.name);

        const today = new Date().toDateString();

        await Quiz.deleteMany({ industry: 'finance', date: today });
        console.log('Cleared existing Finance quizzes for today');

        await Quiz.insertMany([
            {
                industry: 'finance',
                question: 'What is compound interest?',
                options: ['Interest on a loan', 'Interest earned on interest', 'A type of tax', 'A stock dividend'],
                correctAnswer: 1,
                date: today
            },
            {
                industry: 'finance',
                question: 'What does ROI stand for?',
                options: ['Return on Investment', 'Risk of Inflation', 'Rate of Interest', 'Revenue on Income'],
                correctAnswer: 0,
                date: today
            },
            {
                industry: 'finance',
                question: 'Which is a common type of investment?',
                options: ['Mutual Fund', 'Grocery Store', 'Car Loan', 'Credit Card'],
                correctAnswer: 0,
                date: today
            }
        ]);

        console.log('Finance quiz questions seeded successfully for', today);
    } catch (error) {
        console.error('Error seeding Finance quizzes:', error);
    } finally {
        await mongoose.connection.close();
        console.log('MongoDB connection closed');
    }
}

seedFinanceQuizzes();