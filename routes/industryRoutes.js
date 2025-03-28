const express = require('express');
const router = express.Router();
const achievementController = require('../controllers/achievementController');
const badgeController = require('../controllers/badgeController');
const { protect } = require('../middleware/authMiddleware');
const Quiz = require('../models/quiz');

router.get('/:industry', protect, async (req, res) => {
  try {
    const questions = await Quiz.find({ industry: req.params.industry, date: new Date().toDateString() });
    res.json(questions);
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch quiz' });
  }
});

router.post('/submit', protect, async (req, res) => {
  const { industry, answers } = req.body;
  const userId = req.user._id;

  const pointsResult = await achievementController.awardQuizPoints(userId, industry, answers);
  if (pointsResult.error) return res.status(500).json(pointsResult);

  const badgeResult = await badgeController.unlockBadge(userId);
  if (badgeResult.error) return res.status(500).json(badgeResult);

  res.json({ points: pointsResult.points, newBadges: badgeResult.newBadges });
});

module.exports = router;