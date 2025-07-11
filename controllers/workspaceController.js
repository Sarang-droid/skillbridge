const Project = require('../models/project');
const User = require('../models/user');
const Upload = require('../models/upload');
const mongoose = require('mongoose');
const { createNotification } = require('./notificationController');

console.log('Workspace controller loaded');

// Fetch project details
const getProjectDetails = async (req, res) => {
    console.log('Fetching project details for:', req.params.projectId);

    try {
        const project = await Project.findById(req.params.projectId)
            .populate('companyId', 'name');

        if (!project) {
            console.log('Project not found');
            return res.status(404).json({ message: 'Project not found' });
        }

        console.log('Project found:', project);
        res.status(200).json(project);
    } catch (error) {
        console.error('Error fetching project details:', error.message || error);
        res.status(500).json({ message: 'Internal server error' });
    }
};

// Submit GitHub link (replacing file uploads)
const submitGithubLink = async (req, res) => {
    const { githubLink, projectId, companyId } = req.body;

    console.log('Submitting GitHub link:', { githubLink, projectId, companyId });

    try {
        if (!githubLink || !projectId || !companyId) {
            console.log('Missing required fields');
            return res.status(400).json({ message: 'GitHub link, projectId, and companyId are required' });
        }

        const githubRegex = /^https:\/\/github\.com\/[\w-]+\/[\w-]+$/;
        if (!githubRegex.test(githubLink)) {
            console.log('Invalid GitHub URL');
            return res.status(400).json({ message: 'Invalid GitHub URL' });
        }

        const project = await Project.findById(projectId);
        if (!project) {
            console.log('Project not found');
            return res.status(404).json({ message: 'Project not found' });
        }

        const newUpload = new Upload({
            projectId,
            companyId,
            userId: req.user._id,
            userName: req.user.name,
            userEmail: req.user.email,
            fileName: project.title,
            githubLink
        });

        await newUpload.save();
        console.log('GitHub link saved:', newUpload);

        res.status(200).json({ message: 'GitHub link submitted successfully', uploadId: newUpload._id });
    } catch (error) {
        console.error('Error submitting GitHub link:', error.message || error);
        res.status(500).json({ message: 'Failed to submit GitHub link' });
    }
};

// Fetch and update tasks
const getTasks = async (req, res) => {
    const projectId = req.query.projectId;

    console.log('Fetching tasks for Project ID:', projectId);

    try {
        const project = await Project.findById(projectId);
        if (!project) {
            console.log('Project not found');
            return res.status(404).json({ message: 'Project not found' });
        }

        res.status(200).json(project.tasks || []);
    } catch (error) {
        console.error('Error fetching tasks:', error.message || error);
        res.status(500).json({ message: 'Internal server error' });
    }
};

const updateTask = async (req, res) => {
    console.log('Updating task:', req.params.taskId);

    try {
        const project = await Project.findOneAndUpdate(
            { 'tasks.taskId': req.params.taskId },
            { $set: { 'tasks.$.completed': req.body.completed } },
            { new: true }
        );

        if (!project) {
            console.log('Task or project not found');
            return res.status(404).json({ message: 'Task or project not found' });
        }

        console.log('Task updated:', project);
        res.status(200).json({ message: 'Task updated successfully', project });
    } catch (error) {
        console.error('Error updating task:', error.message || error);
        res.status(500).json({ message: 'Internal server error' });
    }
};

// Save notes
const saveNotes = async (req, res) => {
    const projectId = req.params.projectId;
    const { notes } = req.body;

    console.log('Saving notes for Project ID:', projectId);

    try {
        const project = await Project.findById(projectId);
        if (!project) {
            console.log('Project not found');
            return res.status(404).json({ message: 'Project not found' });
        }

        project.notes = notes;
        await project.save();

        console.log('Notes saved successfully');
        res.status(200).json({ message: 'Notes saved successfully' });
    } catch (error) {
        console.error('Error saving notes:', error.message || error);
        res.status(500).json({ message: 'Internal server error' });
    }
};

// Submit project
const submitProject = async (req, res) => {
    const projectId = req.params.projectId;
    const { forceSubmit } = req.body;

    console.log('Submitting project:', projectId, 'Force submit:', forceSubmit, 'User:', req.user);

    try {
        // Validate projectId
        if (!mongoose.Types.ObjectId.isValid(projectId)) {
            console.log('Invalid project ID:', projectId);
            return res.status(400).json({ message: 'Invalid project ID' });
        }

        // Fetch project
        const project = await Project.findById(projectId);
        if (!project) {
            console.log('Project not found:', projectId);
            return res.status(404).json({ message: 'Project not found' });
        }

        // Check if project is already submitted
        if (project.status === 'submitted' && !forceSubmit) {
            console.log('Project already submitted:', projectId);
            return res.status(400).json({ message: 'Project already submitted' });
        }

        // --- GITHUB LINK CHECK ---
        // Prevent submission if user has not submitted a GitHub link for this project
        const githubUpload = await Upload.findOne({ projectId, userId: req.user._id, githubLink: { $exists: true, $ne: null } });
        if (!githubUpload) {
            return res.status(400).json({ message: 'You must submit your GitHub repository link before submitting the project.' });
        }
        // --- END GITHUB LINK CHECK ---

        // Update project status
        project.status = 'submitted';

        // Add user to completedBy if not already present
        if (!project.completedBy) {
            project.completedBy = [];
        }
        if (!project.completedBy.includes(req.user._id)) {
            project.completedBy.push(req.user._id);
            console.log('Added user to completedBy:', req.user._id);
        }

        // Save project
        await project.save();
        console.log('Project saved:', project);

        // Update user's completed projects
        const user = await User.findById(req.user._id);
        if (!user) {
            console.log('User not found:', req.user._id);
            return res.status(404).json({ message: 'User not found' });
        }

        const projectExists = user.completedProjects.some(p => p.projectId && p.projectId.equals(projectId));

        if (!projectExists) {
            user.completedProjects.push({
                projectId: project._id,
                projectName: project.title,
                submissionDate: new Date(),
                difficulty: project.difficulty || 1,
                completionTime: project.expectedCompletionTime || 0
            });
            await user.save();
            console.log('User updated with completed project:', user);
        }

        // Send notification to user about project submission
        try {
            await createNotification(
                req.user._id,
                'Project Submitted Successfully! 🎉',
                `Your project "${project.title}" has been submitted and will be evaluated shortly. You will receive a notification once the evaluation is complete. Keep an eye on your profile for updates!`,
                [], // no attachments
                [], // no links
                false // user-specific notification
            );
            console.log('Project submission notification created for user:', req.user._id);
        } catch (notificationError) {
            console.error('Error creating project submission notification:', notificationError);
            // Don't fail the submission if notification fails
        }

        console.log('Project submitted successfully:', projectId);
        res.status(200).json({ message: 'Project submitted successfully' });
    } catch (error) {
        console.error('Error submitting project:', error.stack);
        res.status(500).json({ message: 'Internal server error', error: error.message });
    }
};

// Fetch project resources
const getProjectResources = async (req, res) => {
    console.log('Fetching resources for Project ID:', req.params.projectId);

    try {
        const project = await Project.findById(req.params.projectId, 'resources');
        if (!project) {
            console.log('Project not found');
            return res.status(404).json({ message: 'Project not found' });
        }

        console.log('Resources found:', project.resources);
        res.status(200).json(project.resources || []);
    } catch (error) {
        console.error('Error fetching resources:', error.message || error);
        res.status(500).json({ message: 'Internal server error' });
    }
};

// Check if GitHub link has been submitted for a project
const checkGithubLinkSubmitted = async (req, res) => {
    const { projectId } = req.query;

    console.log('Checking GitHub link submission for Project ID:', projectId);

    try {
        if (!projectId) {
            console.log('Project ID is required');
            return res.status(400).json({ message: 'Project ID is required', submitted: false });
        }

        const upload = await Upload.findOne({ projectId, userId: req.user._id });
        const submitted = !!upload && !!upload.githubLink; // True if an upload with a GitHub link exists for this user
        console.log('GitHub link submission status:', submitted);

        res.status(200).json({ submitted });
    } catch (error) {
        console.error('Error checking GitHub link submission:', error.message || error);
        res.status(500).json({ message: 'Internal server error', submitted: false });
    }
};

// Export all functions
module.exports = {
    getProjectDetails,
    submitGithubLink,
    getTasks,
    updateTask,
    saveNotes,
    submitProject,
    getProjectResources,
    checkGithubLinkSubmitted
};