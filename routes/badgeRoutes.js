const express = require('express');
const router = express.Router();
const { unlockBadge } = require('../controllers/badgeController');
const User = require('../models/user');
const Badge = require('../models/badge');
const { protect } = require('../middleware/authMiddleware');

// Route to unlock badges
router.post('/unlock', protect, async (req, res) => {
    const { userId } = req.body; // Expect userId in body instead of params
    if (!userId) {
        return res.status(400).json({ error: 'userId is required' });
    }
    const result = await unlockBadge(userId);
    if (result.error) {
        return res.status(500).json(result);
    }
    res.status(200).json(result);
});

// Route to get all badges
router.get('/', async (req, res) => {
    try {
        const badges = await Badge.find();
        res.status(200).json(badges);
    } catch (error) {
        res.status(500).json({ error: 'Failed to fetch badges' });
    }
});

// Route to get a specific user's badges
router.get('/user/:userId', async (req, res) => {
    try {
        const { userId } = req.params;
        const user = await User.findById(userId);
        
        if (!user) {
            return res.status(404).json({ error: 'User not found' });
        }

        res.status(200).json({ badges: user.badges });
    } catch (error) {
        res.status(500).json({ error: 'Failed to fetch user badges' });
    }
});

module.exports = router;