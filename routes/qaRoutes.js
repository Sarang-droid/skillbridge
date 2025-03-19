const express = require('express');
const router = express.Router();
const qaController = require('../controllers/qaController');
const { protect } = require('../middleware/authMiddleware'); // Destructure the protect function

// Route to submit a question (POST)
router.post('/submit', protect, qaController.submitQuestion);

// Route to generate an answer (GET)
router.get('/generate/:questionId', protect, qaController.generateAnswer);

// Route to get all Q&A for a project (GET)
router.get('/:projectId', protect, qaController.getProjectQA);

// Answer a question
router.post('/:questionId/answer', protect, qaController.answerQuestion);

module.exports = router;

