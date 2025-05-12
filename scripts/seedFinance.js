const mongoose = require('mongoose');
const Quiz = require('../models/quiz');
require('dotenv').config({ path: '../.env' });

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
                industry: 'Finance',
                question: 'What does KYC stand for in financial regulation?',
                options: [
                    'Keep Your Cash',
                    'Know Your Customer',
                    'Key Yield Certificate',
                    'Knowledge of Yearly Capital'
                ],
                correctAnswer: 1,
                date: 'Mon May 12 2025'
            },
            {
                industry: 'Finanace',
                question: 'Which technology is most commonly used for ensuring secure, transparent, and tamper-proof financial transactions?',
                options: ['Cloud Computing', 'Blockchain', 'AI/ML', 'Big Data'],
                correctAnswer: 1,
                date: 'Mon May 12 2025'
            },
            {
                industry: 'Finance',
                question: 'What is the primary function of a Robo-Advisor in FinTech?',
                options: [
                    'Handling customer complaints',
                    'Automatically managing investment portfolios using algorithms',
                    'Creating tax returns',
                    'Auditing banking transactions manually'
                ],
                correctAnswer: 1,
                date: 'Mon May 12 2025'
            },
            {
                industry: 'Finance',
                question: 'Which regulation in Europe governs data protection and impacts FinTech firms significantly?',
                options: ['MiFID II', 'SEPA', 'GDPR', 'PSD2'],
                correctAnswer: 2,
                date: 'Mon May 12 2025'
            },
            {
                industry: 'Finance',
                question: 'What is the role of APIs in Open Banking?',
                options: [
                    'Encrypting databases',
                    'Allowing third-party apps to access banking data securely with user consent',
                    'Displaying interest rates',
                    'Handling offline ATM transactions'
                ],
                correctAnswer: 1,
                date: 'Mon May 12 2025'
            },
            {
                industry: 'Finance',
                question: 'Which FinTech model facilitates peer-to-peer (P2P) lending without involving traditional banks?',
                options: ['Robo-Advisory', 'NeoBanking', 'Crowdfunding Platforms', 'P2P Lending Platforms'],
                correctAnswer: 3,
                date: 'Mon May 12 2025'
            },
            {
                industry: 'Finance',
                question: 'Which of the following is a key risk in algorithmic trading systems?',
                options: ['Manual error', 'Lack of market data', 'Latency and flash crashes', 'Excessive compliance'],
                correctAnswer: 2,
                date: 'Mon May 12 2025'
            },
            {
                industry: 'Finance',
                question: 'What is "tokenization" in digital payments?',
                options: [
                    'Breaking payments into monthly installments',
                    'Replacing sensitive card data with a non-sensitive equivalent token',
                    'Translating credit reports into visual graphs',
                    'Assigning unique codes to banking employees'
                ],
                correctAnswer: 1,
                date: 'Mon May 12 2025'
            },
            {
                industry: 'Finance',
                question: 'Which cryptocurrency introduced the concept of smart contracts?',
                options: ['Bitcoin', 'Litecoin', 'Ripple', 'Ethereum'],
                correctAnswer: 3,
                date: 'Mon May 12 2025'
            },
            {
                industry: 'Finance',
                question: 'Which metric best represents a FinTech app’s user monetization efficiency?',
                options: ['Monthly Active Users', 'Churn Rate', 'Average Revenue Per User (ARPU)', 'Retention Rate'],
                correctAnswer: 2,
                date: 'Mon May 12 2025'
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