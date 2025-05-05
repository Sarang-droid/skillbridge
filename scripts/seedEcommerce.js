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
                question: 'Which algorithm is most commonly used in recommendation systems for E-commerce platforms like Amazon?',
                options: ['K-Means Clustering', 'Collaborative Filtering', 'Naive Bayes', 'Linear Regression'],
                correctAnswer: 1,
                date: 'Fri May 02 2025'
            },
            {
                industry: 'ecommerce',
                question: 'In E-commerce analytics, what does the term "Customer Lifetime Value (CLTV)" measure?',
                options: [
                    'The average number of purchases per year',
                    'The predicted net profit from the entire future relationship with a customer',
                    'The current balance in the customer account',
                    'The total ad spend on acquiring a customer'
                ],
                correctAnswer: 1,
                date: 'Fri May 02 2025'
            },
            {
                industry: 'ecommerce',
                question: 'What is "omnichannel retailing" in E-commerce?',
                options: [
                    'Selling through one exclusive channel',
                    'Integrating multiple sales channels to provide a seamless customer experience',
                    'Marketing only via mobile applications',
                    'Retailing only through physical stores'
                ],
                correctAnswer: 1,
                date: 'Fri May 02 2025'
            },
            {
                industry: 'ecommerce',
                question: 'Which of the following best describes “drop shipping”?',
                options: [
                    'Storing goods in a centralized warehouse',
                    'Outsourcing deliveries to third-party logistics',
                    'Selling goods without holding inventory and shipping directly from the supplier',
                    'Using drones to deliver products'
                ],
                correctAnswer: 2,
                date: 'Fri May 02 2025'
            },
            {
                industry: 'ecommerce',
                question: 'How does Dynamic Pricing benefit an E-commerce platform?',
                options: [
                    'By allowing prices to remain stable over time',
                    'By offering a fixed markup on all products',
                    'By adjusting prices based on demand, competitor pricing, or customer data',
                    'By displaying fake discounts'
                ],
                correctAnswer: 2,
                date: 'Fri May 02 2025'
            },
            {
                industry: 'ecommerce',
                question: 'What role does A/B testing play in optimizing E-commerce websites?',
                options: [
                    'It compares website speed with and without ads',
                    'It helps choose the best domain name',
                    'It measures the impact of design or content changes on user behavior',
                    'It replaces traditional market research'
                ],
                correctAnswer: 2,
                date: 'Fri May 02 2025'
            },
            {
                industry: 'ecommerce',
                question: 'Which of the following payment systems is most secure for online E-commerce transactions?',
                options: ['Cash on Delivery', 'Magnetic Stripe Cards', 'Two-Factor Authentication with Tokenization', 'Bank Cheque'],
                correctAnswer: 2,
                date: 'Fri May 02 2025'
            },
            {
                industry: 'ecommerce',
                question: 'What is a “conversion funnel” in an E-commerce context?',
                options: [
                    'A tool for measuring SEO performance',
                    'A representation of the journey customers take from landing to purchase',
                    'A method of tax calculation',
                    'A strategy for upselling premium products'
                ],
                correctAnswer: 1,
                date: 'Fri May 02 2025'
            },
            {
                industry: 'ecommerce',
                question: 'What is “headless commerce”?',
                options: [
                    'An E-commerce model that uses drones',
                    'An architecture where the front-end is decoupled from the back-end commerce functionality',
                    'A strategy that avoids customer-facing interfaces',
                    'A database-free online store model'
                ],
                correctAnswer: 1,
                date: 'Fri May 02 2025'
            },
            {
                industry: 'ecommerce',
                question: 'In terms of SEO for E-commerce, what does a canonical URL help with?',
                options: [
                    'Displaying product images',
                    'Preventing duplicate content issues by specifying the preferred version of a page',
                    'Linking to social media',
                    'Encrypting URLs for security'
                ],
                correctAnswer: 1,
                date: 'Fri May 02 2025'
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