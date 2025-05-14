const mongoose = require('mongoose');
const Quiz = require('../models/quiz');
require('dotenv').config({ path: '../.env' });

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
              question: 'Which consistency model in distributed systems provides the weakest guarantees but highest availability?',
              options: ['Linearizability', 'Strong consistency', 'Eventual consistency', 'Sequential consistency'],
              correctAnswer: 2,
              date: today
            },
            {
              industry: 'it',
              question: 'What is the primary role of a container orchestrator like Kubernetes?',
              options: ['Virtualization', 'Logging', 'Service discovery and scaling', 'Scheduling CPU processes'],
              correctAnswer: 2,
              date: today
            },
            {
              industry: 'it',
              question: 'Which algorithm does Git use for content hashing?',
              options: ['SHA-256', 'MD5', 'SHA-1', 'AES'],
              correctAnswer: 2,
              date: today
            },
            {
              industry: 'it',
              question: 'Which protocol ensures secure web traffic by default?',
              options: ['HTTP', 'SSL', 'HTTPS with TLS', 'IPSec'],
              correctAnswer: 2,
              date: today
            },
            {
              industry: 'it',
              question: 'What does ACID stand for in databases?',
              options: ['Access, Control, Integrity, Delivery', 'Atomicity, Consistency, Isolation, Durability', 'Analytics, Calculation, Indexing, Distribution', 'Automated, Cloud, Independent, Decentralized'],
              correctAnswer: 1,
              date: today
            },
            {
              industry: 'it',
              question: 'Which sorting algorithm has the best average time complexity?',
              options: ['Bubble Sort', 'Merge Sort', 'Selection Sort', 'Insertion Sort'],
              correctAnswer: 1,
              date: today
            },
            {
              industry: 'it',
              question: 'What is the function of the CAP theorem in system design?',
              options: ['To optimize cache speed', 'To evaluate compiler efficiency', 'To explain trade-offs between consistency, availability, and partition tolerance', 'To calculate network speed'],
              correctAnswer: 2,
              date: today
            },
            {
              industry: 'it',
              question: 'Which network model layer is responsible for reliable transmission of data?',
              options: ['Application', 'Transport', 'Session', 'Presentation'],
              correctAnswer: 1,
              date: today
            },
            {
              industry: 'it',
              question: 'Which design pattern is used for managing database connections efficiently?',
              options: ['Observer', 'Singleton', 'Decorator', 'Adapter'],
              correctAnswer: 1,
              date: today
            },
            {
              industry: 'it',
              question: 'Which of the following tools is best for Infrastructure as Code (IaC)?',
              options: ['Docker', 'Terraform', 'Nginx', 'Webpack'],
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