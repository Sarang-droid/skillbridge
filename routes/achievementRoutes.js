const express = require('express');
const router = express.Router();
const achievementController = require('../controllers/achievementController');
const { protect } = require('../middleware/authMiddleware');

router.post('/quiz', protect, async (req, res) => {
  const { industry, answers } = req.body;
  const result = await achievementController.awardQuizPoints(req.user._id, industry, answers);
  res.json(result);
});

module.exports = router;