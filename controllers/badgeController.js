const User = require('../models/user');
const Badge = require('../models/badge');

// Unlock badge for a user if they meet the points threshold
exports.unlockBadge = async (userId) => {
    try {
        const user = await User.findById(userId);
        if (!user) {
            return { error: 'User not found' };
        }

        const badges = await Badge.find();
        let newBadges = [];

        for (const badge of badges) {
            if (user.points >= badge.pointsThreshold && !user.badges.includes(badge.name)) {
                user.badges.push(badge.name);
                badge.awardedTo.push(userId);
                newBadges.push(badge.name);
                console.log(`Awarded ${badge.name} badge to user ${userId}`);
                await badge.save();
            }
        }

        await user.save();

        return { message: 'Badges updated', newBadges, badges: user.badges };
    } catch (error) {
        console.error('Error unlocking badge:', error);
        return { error: 'Failed to unlock badge' };
    }
};