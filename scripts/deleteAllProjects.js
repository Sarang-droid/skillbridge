require('dotenv').config();
const mongoose = require('mongoose');
const Project = require('../models/project');

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
        // Delete all projects
        const result = await Project.deleteMany({});
        console.log(`Successfully deleted ${result.deletedCount} projects`);
    } catch (error) {
        console.error('Error deleting projects:', error);
    } finally {
        // Close the connection
        await mongoose.connection.close();
        console.log('Database connection closed');
    }
})
.catch(err => {
    console.error('Connection error:', err);
});
