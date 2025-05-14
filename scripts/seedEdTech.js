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
                question: 'Which machine learning architecture is best for modeling sequential learning behavior?',
                options: ['CNN', 'SVM', 'RNN', 'Random Forest'],
                correctAnswer: 2,
                date: 'Wed May 14 2025'
            },
            {
                industry: 'edtech',
                question: 'What does the term "learning analytics" refer to in EdTech?',
                options: [
                    'Creating eBooks',
                    "Analyzing learners' data to improve outcomes", // ✅ Fixed
                    'Managing course subscriptions',
                    'Storing digital credentials'
                ],
                
                correctAnswer: 1,
                date: 'Wed May 14 2025'
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
                question: 'Which protocol is used in xAPI to track learning records?',
                options: ['HTTP', 'LRS', 'RESTful APIs', 'FTP'],
                correctAnswer: 2,
                date: 'Wed May 14 2025'
            },
            {
                industry: 'edtech',
                question: 'Which approach best supports differentiated learning in digital classrooms?',
                options: ['Fixed syllabus', 'Standardized testing', 'Adaptive learning systems', 'Long lectures'],
                correctAnswer: 2,
                date: 'Wed May 14 2025'
            },
            {
                industry: 'edtech',
                question: 'Which cloud service is most useful for EdTech platforms during peak exam seasons?',
                options: ['Static hosting', 'Load balancer with autoscaling', 'Edge computing', 'IoT hubs'],
                correctAnswer: 1,
                date: 'Wed May 14 2025'
            },
            {
                industry: 'edtech',
                question: 'Which EdTech standard enables reuse and interoperability of content modules?',
                options: ['JSON', 'XML', 'SCORM', 'HTML5'],
                correctAnswer: 2,
                date: 'Wed May 14 2025'
            },
            {
                industry: 'edtech',
                question: 'What is the role of a Learning Record Store (LRS)?',
                options: [
                    'To encrypt user data',
                    'To serve static course content',
                    'To collect and store experiential learning data',
                    'To schedule virtual exams'
                ],
                correctAnswer: 2,
                date: 'Wed May 14 2025'
            },
            {
                industry: 'edtech',
                question: 'What challenge does FERPA compliance address in EdTech?',
                options: ['Engagement', 'Content distribution', 'Student data privacy', 'UI/UX design'],
                correctAnswer: 2,
                date: 'Wed May 14 2025'
            },
            {
                industry: 'edtech',
                question: 'Which analytical technique is most suitable for evaluating course effectiveness?',
                options: ['Regression analysis', 'Image recognition', 'Encryption', 'Pathfinding algorithms'],
                correctAnswer: 0,
                date: 'Wed May 14 2025'
            }
        ])
        console.log('EdTech quiz questions seeded successfully for', today);
    } catch (error) {
        console.error('Error seeding EdTech quizzes:', error);
    } finally {
        await mongoose.connection.close();
        console.log('MongoDB connection closed');
    }
}

seedEdTechQuizzes();