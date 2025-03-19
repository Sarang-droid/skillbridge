const express = require('express');
const router = express.Router();
const workspaceController = require('../controllers/workspaceController');
const { protect } = require('../middleware/authMiddleware');

// Fetch project details
router.get('/project/:projectId', protect, workspaceController.getProjectDetails);

// Submit GitHub link
router.post('/submit-github', protect, workspaceController.submitGithubLink);

// Fetch and update tasks
router.get('/tasks', protect, workspaceController.getTasks);
router.patch('/tasks/:taskId', protect, workspaceController.updateTask);

// Save notes
router.post('/project/:projectId/notes', protect, workspaceController.saveNotes);

// Submit project
router.post('/project/:projectId/submit', protect, workspaceController.submitProject);

// Fetch project resources
router.get('/project/:projectId/resources', protect, workspaceController.getProjectResources);

// Check if GitHub link has been submitted
router.get('/submit-github/check', protect, workspaceController.checkGithubLinkSubmitted);

module.exports = router;