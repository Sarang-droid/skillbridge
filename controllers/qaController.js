const QA = require('../models/qa');
const Project = require('../models/project');

/**
 * Submit a question for a project
 */
exports.submitQuestion = async (req, res) => {
    try {
        const { projectId, question } = req.body;
        console.log('Submitting question for project:', projectId);

        // Validate input
        if (!projectId || !question) {
            return res.status(400).json({ message: 'Project ID and question are required' });
        }

        // Verify project exists
        const project = await Project.findById(projectId);
        if (!project) {
            return res.status(404).json({ message: 'Project not found' });
        }

        // Create a new question entry
        const newQuestion = new QA({
            projectId,
            userId: req.user._id,
            question,
            createdAt: new Date()
        });

        // Save the question to the database
        await newQuestion.save();
        console.log('Question saved successfully:', newQuestion);

        res.status(201).json({
            message: 'Question submitted successfully',
            questionId: newQuestion._id
        });
    } catch (error) {
        console.error('Error submitting question:', error);
        res.status(500).json({
            message: 'Error submitting question',
            error: error.message
        });
    }
};

/**
 * Get all Q&A for a project
 */
exports.getProjectQA = async (req, res) => {
    try {
        const { projectId } = req.params;
        console.log('Fetching Q&A for project:', projectId);

        // Validate input
        if (!projectId) {
            return res.status(400).json({ message: 'Project ID is required' });
        }

        // Verify project exists
        const project = await Project.findById(projectId);
        if (!project) {
            return res.status(404).json({ message: 'Project not found' });
        }

        // Fetch all questions and answers for the project
        const qaEntries = await QA.find({ projectId })
            .populate('userId', 'name email')
            .sort({ createdAt: -1 }); // Sort by newest first

        console.log('Found Q&A entries:', qaEntries.length);
        res.status(200).json({ qa: qaEntries });
    } catch (error) {
        console.error('Error fetching Q&A:', error);
        res.status(500).json({
            message: 'Error fetching Q&A for the project',
            error: error.message,
        });
    }
};

/**
 * Answer a question
 */
exports.answerQuestion = async (req, res) => {
    try {
        const { questionId } = req.params;
        const { answer } = req.body;
        console.log('Answering question:', questionId);

        // Validate input
        if (!answer) {
            return res.status(400).json({ message: 'Answer is required' });
        }

        // Find and update the question
        const qaEntry = await QA.findByIdAndUpdate(
            questionId,
            {
                answer,
                answeredAt: new Date(),
                answeredBy: req.user._id // Save the user ID who answered
            },
            { new: true }
        ).populate('userId', 'name email').populate('answeredBy', 'name');

        if (!qaEntry) {
            return res.status(404).json({ message: 'Question not found' });
        }

        console.log('Answer saved successfully:', qaEntry);
        res.status(200).json({
            message: 'Answer added successfully',
            qa: qaEntry
        });
    } catch (error) {
        console.error('Error answering question:', error);
        res.status(500).json({
            message: 'Error answering the question',
            error: error.message
        });
    }
};

/**
 * Generate an answer for a question
 */
exports.generateAnswer = async (req, res) => {
    try {
        const { questionId } = req.params;
        console.log('Generating answer for question:', questionId);

        // Find the question
        const question = await QA.findById(questionId);
        if (!question) {
            return res.status(404).json({ message: 'Question not found' });
        }

        // Here you would typically integrate with an AI service to generate the answer
        // For now, we'll use a placeholder
        const answer = `Auto-generated answer for: ${question.question}`;

        // Update the question with the generated answer
        question.answer = answer;
        question.answeredAt = new Date();
        await question.save();

        console.log('Answer generated successfully');
        res.status(200).json({
            message: 'Answer generated successfully',
            qa: question
        });
    } catch (error) {
        console.error('Error generating answer:', error);
        res.status(500).json({
            message: 'Error generating the answer',
            error: error.message
        });
    }
};
