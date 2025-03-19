const User = require('../models/user');
const Badge = require('../models/badge');

// Unlock badge for a user if they meet the points threshold
exports.unlockBadge = async (req, res) => {
    try {
        const { userId } = req.params;
        const user = await User.findById(userId);

        if (!user) {
            return res.status(404).json({ error: 'User not found' });
        }

        // Define badge thresholds (points required for each badge)
        const badgeThresholds = [
            { name: 'Bronze', pointsRequired: 500 },
            { name: 'Silver', pointsRequired: 1000 },
            { name: 'Gold', pointsRequired: 2000 },
        ];

        // Check which badges the user has earned
        let newBadges = [];
        for (const badge of badgeThresholds) {
            if (user.points >= badge.pointsRequired && !user.badges.includes(badge.name)) {
                user.badges.push(badge.name);
                newBadges.push(badge.name);
                console.log(`Awarded ${badge.name} badge to user ${userId}`);
            }
        }

        await user.save();

        return res.status(200).json({ message: 'Badges updated', newBadges, badges: user.badges });
    } catch (error) {
        console.error('Error unlocking badge:', error);
        return res.status(500).json({ error: 'Failed to unlock badge' });
    }
};
