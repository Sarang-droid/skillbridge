const mongoose = require('mongoose');
const Quiz = require('../models/quiz');
require('dotenv').config();

async function seedEdTechQuizzes() {
    try {
        // Connect to MongoDB Atlas
        await mongoose.connect(process.env.MONGO_URI, {
            useNewUrlParser: true,
            useUnifiedTopology: true
        });
        console.log('Connected to MongoDB:', mongoose.connection.name);

        const today = new Date().toDateString();

        // Optional: Clear existing questions for EdTech for today
        await Quiz.deleteMany({ industry: 'edtech', date: today });
        console.log('Cleared existing EdTech quizzes for today');

        // Insert new EdTech questions
        await Quiz.insertMany([
            {
                industry: 'edtech',
                question: 'What does LMS stand for in education technology?',
                options: ['Learning Management System', 'Lesson Mapping Software', 'Learning Module System', 'Lecture Management Service'],
                correctAnswer: 0,
                date: today
            },
            {
                industry: 'edtech',
                question: 'Which tool is commonly used for virtual classrooms?',
                options: ['Photoshop', 'Zoom', 'Excel', 'AutoCAD'],
                correctAnswer: 1,
                date: today
            },
            {
                industry: 'edtech',
                question: 'What is the primary goal of adaptive learning?',
                options: ['Standardized testing', 'Personalized education', 'Group projects', 'Teacher training'],
                correctAnswer: 1,
                date: today
            }
        ]);

        console.log('EdTech quiz questions seeded successfully for', today);
    } catch (error) {
        console.error('Error seeding EdTech quizzes:', error);
    } finally {
        await mongoose.connection.close();
        console.log('MongoDB connection closed');
    }
}

seedEdTechQuizzes();