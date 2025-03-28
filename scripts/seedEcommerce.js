const mongoose = require('mongoose');
const Quiz = require('../models/quiz');
require('dotenv').config();

async function seedEcommerceQuizzes() {
    try {
        await mongoose.connect(process.env.MONGO_URI, {
            useNewUrlParser: true,
            useUnifiedTopology: true
        });
        console.log('Connected to MongoDB:', mongoose.connection.name);

        const today = new Date().toDateString();

        await Quiz.deleteMany({ industry: 'ecommerce', date: today });
        console.log('Cleared existing E-commerce quizzes for today');

        await Quiz.insertMany([
            {
                industry: 'ecommerce',
                question: 'What is a common payment gateway?',
                options: ['Excel', 'PayPal', 'WordPress', 'Google Drive'],
                correctAnswer: 1,
                date: today
            },
            {
                industry: 'ecommerce',
                question: 'What does SKU stand for?',
                options: ['Stock Keeping Unit', 'Sales Key Utility', 'Store Knowledge Update', 'Standard Kit Usage'],
                correctAnswer: 0,
                date: today
            },
            {
                industry: 'ecommerce',
                question: 'What is dropshipping?',
                options: ['Shipping by drone', 'Selling without holding inventory', 'Fast delivery service', 'Bulk shipping'],
                correctAnswer: 1,
                date: today
            }
        ]);

        console.log('E-commerce quiz questions seeded successfully for', today);
    } catch (error) {
        console.error('Error seeding E-commerce quizzes:', error);
    } finally {
        await mongoose.connection.close();
        console.log('MongoDB connection closed');
    }
}

seedEcommerceQuizzes();