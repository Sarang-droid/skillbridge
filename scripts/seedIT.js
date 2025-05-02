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
                industry: 'IT',
                question: 'Which software development methodology emphasizes short development cycles and frequent releases?',
                options: ['Waterfall', 'Agile', 'V-Model', 'RAD'],
                correctAnswer: 1,
                date: 'Fri May 02 2025'
            },
            {
                industry: 'IT',
                question: 'What is the primary function of a reverse proxy server?',
                options: [
                    'Encrypt internal database records',
                    'Redirect requests from internal clients to the internet',
                    'Distribute client requests to multiple backend servers',
                    'Scan code for bugs'
                ],
                correctAnswer: 2,
                date: 'Fri May 02 2025'
            },
            {
                industry: 'IT',
                question: 'Which of the following is NOT a NoSQL database?',
                options: ['MongoDB', 'Cassandra', 'Redis', 'MySQL'],
                correctAnswer: 3,
                date: 'Fri May 02 2025'
            },
            {
                industry: 'IT',
                question: 'What does CI/CD stand for in software deployment?',
                options: [
                    'Customer Integration / Code Design',
                    'Continuous Integration / Continuous Deployment',
                    'Cloud Infrastructure / Code Development',
                    'Containerized Interface / Code Debugging'
                ],
                correctAnswer: 1,
                date: 'Fri May 02 2025'
            },
            {
                industry: 'IT',
                question: 'Which algorithm is commonly used for route optimization in logistics IT systems?',
                options: ['Dijkstra’s Algorithm', 'A* Algorithm', 'DFS', 'Apriori'],
                correctAnswer: 0,
                date: 'Fri May 02 2025'
            },
            {
                industry: 'IT',
                question: 'What does “Infrastructure as Code (IaC)” enable in IT DevOps?',
                options: [
                    'Manual server updates',
                    'Storing data in CSV files',
                    'Automated provisioning and management of infrastructure using code',
                    'Creating user manuals for cloud systems'
                ],
                correctAnswer: 2,
                date: 'Fri May 02 2025'
            },
            {
                industry: 'IT',
                question: 'Which of the following is a container orchestration tool?',
                options: ['Docker', 'Jenkins', 'Kubernetes', 'Git'],
                correctAnswer: 2,
                date: 'Fri May 02 2025'
            },
            {
                industry: 'IT',
                question: 'What is a key purpose of load balancing in IT infrastructure?',
                options: [
                    'To prevent DNS leaks',
                    'To optimize resource utilization and prevent server overload',
                    'To speed up CSS delivery',
                    'To route emails to spam folders'
                ],
                correctAnswer: 1,
                date: 'Fri May 02 2025'
            },
            {
                industry: 'IT',
                question: 'What is the main function of an API Gateway?',
                options: [
                    'Storing data on-premise',
                    'Providing analytics dashboards',
                    'Handling requests and directing them to appropriate microservices',
                    'Encrypting REST endpoints'
                ],
                correctAnswer: 2,
                date: 'Fri May 02 2025'
            },
            {
                industry: 'IT',
                question: 'Which programming paradigm is most emphasized in functional languages like Haskell or Elixir?',
                options: [
                    'Object-Oriented Programming',
                    'Imperative Programming',
                    'Procedural Programming',
                    'Declarative and Functional Programming'
                ],
                correctAnswer: 3,
                date: 'Fri May 02 2025'
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