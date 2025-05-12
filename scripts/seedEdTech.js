const mongoose = require('mongoose');
const Quiz = require('../models/quiz');
require('dotenv').config({ path: '../.env' });

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
                question: 'What is the primary benefit of using Learning Management Systems (LMS) like Moodle or Canvas in EdTech?',
                options: [
                    'Posting on social media',
                    'Streaming live videos',
                    'Managing, delivering, and tracking learning content efficiently',
                    'Blocking distractions on student devices'
                ],
                correctAnswer: 2,
                date: 'Mon May 12 2025'
            },
            {
                industry: 'edtech',
                question: 'What does SCORM stand for in digital learning standards?',
                options: [
                    'Standardized Curriculum for Online Resource Management',
                    'Sharable Content Object Reference Model',
                    'Simple Content Organization & Retrieval Mechanism',
                    'Structured Course Outline Reporting Method'
                ],
                correctAnswer: 1,
                date: 'Mon May 12 2025'
            },
            {
                industry: 'edtech',
                question: 'Which of the following best defines adaptive learning in EdTech?',
                options: [
                    'A fixed module system for learning',
                    'Real-time social learning',
                    'Learning that adjusts content based on learner performance and behavior',
                    'One-on-one manual tutoring'
                ],
                correctAnswer: 2,
                date: 'Mon May 12 2025'
            },
            {
                industry: 'edtech',
                question: 'Which algorithm is commonly used to personalize content in EdTech platforms?',
                options: [
                    'PageRank',
                    'Apriori Algorithm',
                    'Collaborative Filtering',
                    'Kruskal’s Algorithm'
                ],
                correctAnswer: 2,
                date: 'Mon May 12 2025'
            },
            {
                industry: 'edtech',
                question: 'What is a key challenge of gamification in EdTech systems?',
                options: [
                    'Lack of internet speed',
                    'Over-reliance on rote memorization',
                    'Balancing engagement with meaningful learning outcomes',
                    'Installing software updates'
                ],
                correctAnswer: 2,
                date: 'Mon May 12 2025'
            },
            {
                industry: 'edtech',
                question: 'Which metric best tracks the effectiveness of an EdTech course?',
                options: [
                    'Number of downloads',
                    'Student completion and assessment performance',
                    'Course length',
                    'Login frequency'
                ],
                correctAnswer: 1,
                date: 'Mon May 12 2025'
            },
            {
                industry: 'edtech',
                question: 'What is microlearning in the context of EdTech?',
                options: [
                    'Learning using microscopic images',
                    'Short, focused learning units or activities',
                    'Learning through virtual labs',
                    'Group-based collaborative learning'
                ],
                correctAnswer: 1,
                date: 'Mon May 12 2025'
            },
            {
                industry: 'edtech',
                question: 'Which programming language is most commonly used in building interactive EdTech tools?',
                options: ['Ruby', 'Python', 'C++', 'Assembly'],
                correctAnswer: 1,
                date: 'Mon May 12 2025'
            },
            {
                industry: 'edtech',
                question: 'What does xAPI (Experience API) enable in EdTech?',
                options: [
                    'Creating animated videos',
                    'Tracking learning experiences across platforms and contexts',
                    'Blocking unproductive sites',
                    'Video compression'
                ],
                correctAnswer: 1,
                date: 'Mon May 12 2025'
            },
            {
                industry: 'edtech',
                question: 'What is the main drawback of a purely MOOC-based education system?',
                options: [
                    'Cost of content creation',
                    'Limited scalability',
                    'Low student retention and course completion rates',
                    'Too much instructor involvement'
                ],
                correctAnswer: 2,
                date: 'Mon May 12 2025'
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