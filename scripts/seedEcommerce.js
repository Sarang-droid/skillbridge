console.log('Script started');

const mongoose = require('mongoose');
const Quiz = require('../models/quiz');
require('dotenv').config({ path: '../.env' });

console.log('MONGO_URI:', process.env.MONGO_URI);

async function seedEcommerceQuizzes() {
    try {
        console.log('Connecting to MongoDB...');
        await mongoose.connect(process.env.MONGO_URI, {
            useNewUrlParser: true,
            useUnifiedTopology: true
        });
        console.log('Connected to MongoDB:', mongoose.connection.name);

        const today = new Date().toDateString();
        console.log('Today:', today);

        console.log('Clearing existing E-commerce quizzes...');
        await Quiz.deleteMany({ industry: 'ecommerce', date: today });
        console.log('Cleared existing E-commerce quizzes for today');

        await Quiz.insertMany([
            {
                industry: 'ecommerce',
                question: 'Which metric is used to evaluate the average revenue per user session?',
                options: ['AOV', 'CTR', 'CPC', 'LTV'],
                correctAnswer: 0,
                date: 'Thu May 15 2025'
            },
            {
                industry: 'ecommerce',
                question: 'Which of the following best defines cart abandonment rate?',
                options: ['Customers not finding products', 'Customers leaving before purchase after adding items to cart', 'Low app ratings', 'Negative reviews'],
                correctAnswer: 1,
                date: 'Thu May 15 2025'
            },
            {
                industry: 'ecommerce',
                question: 'What is dynamic pricing?',
                options: ['Changing warehouse stock', 'Setting fixed price for every product', 'Adjusting prices based on real-time demand and competition', 'Bundling low-stock items'],
                correctAnswer: 2,
                date: 'Thu May 15 2025'
            },
            {
                industry: 'ecommerce',
                question: 'Which architecture pattern best supports scalability in large eCommerce platforms?',
                options: ['Monolithic', 'Microservices', 'Client-Server', 'Peer-to-Peer'],
                correctAnswer: 1,
                date: 'Thu May 15 2025'
            },
            {
                industry: 'ecommerce',
                question: 'What is the significance of Omnichannel strategy?',
                options: ['It focuses only on mobile apps', 'It separates online and offline strategies', 'It ensures seamless experience across multiple channels', 'It promotes international shipping only'],
                correctAnswer: 2,
                date: 'Thu May 15 2025'
            },
            {
                industry: 'ecommerce',
                question: 'What does the term "headless commerce" mean?',
                options: ['A platform without inventory', 'Separation of front-end and back-end commerce layers', 'Ecommerce without product descriptions', 'Automation without APIs'],
                correctAnswer: 1,
                date: 'Thu May 15 2025'
            },
            {
                industry: 'ecommerce',
                question: 'Which KPI directly reflects customer loyalty?',
                options: ['Conversion rate', 'Average order value', 'Repeat purchase rate', 'Click-through rate'],
                correctAnswer: 2,
                date: 'Thu May 15 2025'
            },
            {
                industry: 'ecommerce',
                question: 'Which factor most affects eCommerce checkout conversion?',
                options: ['Product reviews', 'High-quality images', 'Payment friction and shipping cost transparency', 'Blog content'],
                correctAnswer: 2,
                date: 'Thu May 15 2025'
            },
            {
                industry: 'ecommerce',
                question: 'Which legal framework impacts eCommerce data collection practices in Europe?',
                options: ['HIPAA', 'GDPR', 'FERPA', 'FATCA'],
                correctAnswer: 1,
                date: 'Thu May 15 2025'
            },
            {
                industry: 'ecommerce',
                question: 'Which technique helps in recommending products based on user behavior?',
                options: ['Rule-based logic', 'Content moderation', 'Collaborative filtering', 'Sorting by price'],
                correctAnswer: 2,
                date: 'Thu May 15 2025'
            }
        ]);

        console.log('E-commerce quiz questions seeded successfully for', today);
    } catch (error) {
        console.error('Error seeding E-commerce quizzes:', error);
    } finally {
        console.log('Closing MongoDB connection...');
        await mongoose.connection.close();
        console.log('MongoDB connection closed');
    }
}

seedEcommerceQuizzes();