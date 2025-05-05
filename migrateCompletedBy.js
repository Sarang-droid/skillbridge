const mongoose = require('mongoose');
const Project = require('./models/project');

async function migrateCompletedBy() {
    try {
        await mongoose.connect('mongodb://localhost:27017/skillbridge', {
            useNewUrlParser: true,
            useUnifiedTopology: true
        });
        console.log('Connected to MongoDB');

        const projects = await Project.find({});
        for (const project of projects) {
            if (project.completedBy && !Array.isArray(project.completedBy)) {
                project.completedBy = [project.completedBy];
                await project.save();
                console.log(`Updated project ${project._id}`);
            } else if (!project.completedBy) {
                project.completedBy = [];
                await project.save();
                console.log(`Initialized completedBy for project ${project._id}`);
            }
        }
        console.log('Migration complete');
    } catch (error) {
        console.error('Migration error:', error);
    } finally {
        mongoose.disconnect();
    }
}

migrateCompletedBy();