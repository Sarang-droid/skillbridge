require('dotenv').config();
const mongoose = require('mongoose');
const Quiz = require('../models/quiz');

// Connect to MongoDB
mongoose.connect(process.env.MONGO_URI, {
    serverSelectionTimeoutMS: 10000,
    socketTimeoutMS: 45000,
    family: 4,
    maxPoolSize: 10,
    minPoolSize: 5,
    connectTimeoutMS: 10000,
    heartbeatFrequencyMS: 10000
})
.then(async () => {
    try {
        // Delete all quizzes
        const result = await Quiz.deleteMany({});
        console.log(`Successfully deleted ${result.deletedCount} quizzes`);
    } catch (error) {
        console.error('Error deleting quizzes:', error);
    } finally {
        // Close the connection
        await mongoose.connection.close();
        console.log('Database connection closed');
    }
})
.catch(err => {
    console.error('Connection error:', err);
});
