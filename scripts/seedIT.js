const mongoose = require('mongoose');
const Quiz = require('../models/quiz');
require('dotenv').config();

async function seedITQuizzes() {
    try {
        await mongoose.connect(process.env.MONGO_URI, {
            useNewUrlParser: true,
            useUnifiedTopology: true
        });
        console.log('Connected to MongoDB:', mongoose.connection.name);

        const today = new Date().toDateString();

        await Quiz.deleteMany({ industry: 'it', date: today });
        console.log('Cleared existing IT quizzes for today');

        await Quiz.insertMany([
            {
                industry: 'it',
                question: 'What does HTTP stand for?',
                options: ['Hyper Text Transfer Protocol', 'High Tech Terminal Process', 'Hyperlink Text Transport', 'Host Transfer Protocol'],
                correctAnswer: 0,
                date: today
            },
            {
                industry: 'it',
                question: 'Which language is used for web development?',
                options: ['Python', 'JavaScript', 'C++', 'SQL'],
                correctAnswer: 1,
                date: today
            },
            {
                industry: 'it',
                question: 'What is a firewall used for?',
                options: ['Cooling a computer', 'Network security', 'Data storage', 'Speeding up internet'],
                correctAnswer: 1,
                date: today
            }
        ]);

        console.log('IT quiz questions seeded successfully for', today);
    } catch (error) {
        console.error('Error seeding IT quizzes:', error);
    } finally {
        await mongoose.connection.close();
        console.log('MongoDB connection closed');
    }
}

seedITQuizzes();