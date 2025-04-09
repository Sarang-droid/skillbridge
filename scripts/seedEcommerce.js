const mongoose = require('mongoose');
const Quiz = require('../models/quiz');
require('dotenv').config({ path: '../.env' }); // Load .env from parent directory

console.log('MONGO_URI:', process.env.MONGO_URI); // Debug the URI

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
                question: 'What is the primary purpose of a shopping cart abandonment email?',
                options: ['To upsell new products', 'To remind customers to complete their purchase', 'To announce a sale', 'To collect customer feedback'],
                correctAnswer: 1,
                date: today
            },
            {
                industry: 'ecommerce',
                question: 'Which metric measures the percentage of visitors who leave a site after viewing only one page?',
                options: ['Conversion Rate', 'Bounce Rate', 'Click-Through Rate', 'Average Order Value'],
                correctAnswer: 1,
                date: today
            },
            {
                industry: 'ecommerce',
                question: 'What does B2C stand for in the context of E-commerce?',
                options: ['Business to Consumer', 'Business to Commerce', 'Buyer to Customer', 'Brand to Channel'],
                correctAnswer: 0,
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