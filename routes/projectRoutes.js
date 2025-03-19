const express = require('express');
const router = express.Router();
const projectController = require('../controllers/projectController');
const { protect } = require('../middleware/authMiddleware');
const Project = require('../models/project'); // Import the Project model

// Route for completing a project
router.post('/complete/:userId/:projectId', protect, async (req, res) => {
    const { userId, projectId } = req.params;

    try {
        await projectController.completeProject(userId, projectId);
        res.status(200).json({ message: `Project ${projectId} completed by user ${userId} and points awarded.` });
    } catch (error) {
        console.error('Error completing project:', error);
        res.status(500).json({ message: 'Failed to complete project.' });
    }
});

// Route for fetching projects
router.get('/', protect, async (req, res) => {
    const companyId = req.query.companyId; // Get companyId from query parameters
    try {
        const projects = await Project.find({ companyId }); // Fetch projects for the given companyId
        res.status(200).json(projects);
    } catch (error) {
        console.error('Error fetching projects:', error);
        res.status(500).json({ message: 'Failed to fetch projects.' });
    }
});

module.exports = router;