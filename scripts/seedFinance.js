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
              industry: 'finance',
              question: 'Which model is used to determine the theoretical value of options?',
              options: ['CAPM', 'Black-Scholes Model', 'Monte Carlo Tree Search', 'Arbitrage Pricing Theory'],
              correctAnswer: 1,
              date: today
            },
            {
              industry: 'finance',
              question: 'What is a key assumption of the Efficient Market Hypothesis?',
              options: ['All investors have insider information', 'Stock prices follow trends', 'Markets instantly reflect all available information', 'Only institutions influence prices'],
              correctAnswer: 2,
              date: today
            },
            {
              industry: 'finance',
              question: 'What does Basel III primarily aim to improve?',
              options: ['Cryptocurrency adoption', 'Loan issuance speed', 'Bank capital adequacy and risk management', 'Digital payment systems'],
              correctAnswer: 2,
              date: today
            },
            {
              industry: 'finance',
              question: 'Which of the following is considered a leading indicator of economic performance?',
              options: ['GDP', 'Unemployment rate', 'Stock market returns', 'Inflation'],
              correctAnswer: 1,
              date: today
            },
            {
              industry: 'finance',
              question: 'What is the Sharpe Ratio used for?',
              options: ['Predicting inflation', 'Measuring investment return adjusted for risk', 'Calculating tax liability', 'Tracking liquidity'],
              correctAnswer: 1,
              date: today
            },
            {
              industry: 'finance',
              question: 'Which technique is most suitable for stress testing a financial portfolio?',
              options: ['Backtesting', 'Monte Carlo simulation', 'Time-series decomposition', 'Linear regression'],
              correctAnswer: 1,
              date: today
            },
            {
              industry: 'finance',
              question: 'Which financial statement shows a company’s liquidity position?',
              options: ['Income Statement', 'Balance Sheet', 'Statement of Retained Earnings', 'Cash Flow from Financing'],
              correctAnswer: 1,
              date: today
            },
            {
              industry: 'finance',
              question: 'In bond valuation, what does “duration” measure?',
              options: ['Interest payment amount', 'Default probability', 'Price volatility relative to interest rates', 'Maturity date'],
              correctAnswer: 2,
              date: today
            },
            {
              industry: 'finance',
              question: 'What does a negative beta imply about a stock?',
              options: ['It is highly volatile', 'It moves opposite to the market', 'It is illiquid', 'It is undervalued'],
              correctAnswer: 1,
              date: today
            },
            {
              industry: 'finance',
              question: 'Which type of risk does diversification help reduce?',
              options: ['Systematic Risk', 'Liquidity Risk', 'Unsystematic Risk', 'Credit Risk'],
              correctAnswer: 2,
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