const User = require('../models/user');
const Project = require('../models/project');
const Achievement = require('../models/achievement');
const Quiz = require('../models/quiz');

// Award points after project completion (manual evaluation)
exports.awardPoints = async (userId, projectId) => {
    try {
        const user = await User.findById(userId);
        const project = await Project.findById(projectId);

        if (!user || !project) {
            throw new Error('User or Project not found');
        }

        if (project.completedBy.includes(userId)) {
            return { message: 'Project already completed by this user.' };
        }

        // Mark the project as completed
        project.completedBy.push(userId);
        await project.save();

        // Base points for completing the project (manual evaluation)
        let pointsToAward = 100; // Adjust based on your manual scoring

        // Update user points
        user.points += pointsToAward;
        await user.save();

        // Store project achievement
        const achievement = new Achievement({
            userId,
            projectId,
            type: 'project',
            pointsEarned: pointsToAward,
            aiFeedback: 'Project completed (manually evaluated)'
        });
        await achievement.save();

        return { message: `Points awarded: ${pointsToAward}`, points: user.points };
    } catch (error) {
        console.error('Error awarding points:', error);
        return { error: 'Failed to award points' };
    }
};

// Award points for quiz completion
exports.awardQuizPoints = async (userId, industry, answers) => {
    try {
        const user = await User.findById(userId);
        if (!user) throw new Error('User not found');

        const questions = await Quiz.find({ industry, date: new Date().toDateString() });
        if (!questions.length) throw new Error('No quiz available for today');

        // Calculate score
        let pointsToAward = 0;
        answers.forEach((answer, i) => {
            if (answer === questions[i].correctAnswer) pointsToAward += 10;
        });
        // Bonus for perfect score
        if (pointsToAward === questions.length * 10) pointsToAward += 20;

        // Update user points
        user.points += pointsToAward;
        await user.save();

        // Store quiz achievement
        const achievement = new Achievement({
            userId,
            type: 'quiz',
            pointsEarned: pointsToAward,
            aiFeedback: `Completed ${industry} quiz`
        });
        await achievement.save();

        return { message: `Points awarded: ${pointsToAward}`, points: user.points };
    } catch (error) {
        console.error('Error awarding quiz points:', error);
        return { error: 'Failed to award quiz points' };
    }
};
