const User = require('../models/user');
const Project = require('../models/project');
const Company = require('../models/company');
const Match = require('../models/match');
const MBTI = require('../models/MBTI');

// Helper function to calculate Cosine Similarity
const calculateCosineSimilarity = (userSkills, projectSkills) => {
    const allSkills = [...new Set([...userSkills, ...projectSkills])];
    const userVector = allSkills.map(skill => userSkills.includes(skill) ? 1 : 0);
    const projectVector = allSkills.map(skill => projectSkills.includes(skill) ? 1 : 0);

    const dotProduct = userVector.reduce((sum, val, index) => sum + val * projectVector[index], 0);
    const userMagnitude = Math.sqrt(userVector.reduce((sum, val) => sum + val * val, 0));
    const projectMagnitude = Math.sqrt(projectVector.reduce((sum, val) => sum + val * val, 0));

    if (userMagnitude === 0 || projectMagnitude === 0) return 0;
    return dotProduct / (userMagnitude * projectMagnitude);
};

// Helper function to calculate Jaccard Index
const calculateJaccardIndex = (userSkills, projectSkills) => {
    const intersection = userSkills.filter(skill => projectSkills.includes(skill)).length;
    const union = [...new Set([...userSkills, ...projectSkills])].length;

    if (union === 0) return 0;
    return intersection / union;
};

// Helper function to calculate MBTI Compatibility
const calculateMBTICompatibility = (userMBTI, project) => {
    if (project.compatibleMBTITypes && project.compatibleMBTITypes.includes(userMBTI)) {
        return 1;
    }
    return 0;
};

// Function to calculate the match score
const calculateScore = (user, project, userMBTI, normalizedScores = {}) => {
    if (!user || !project) {
        console.log('Debug: User or project is undefined');
        return 0;
    }

    const userSkills = Array.isArray(user.skills) ? user.skills : [];
    const requiredSkills = Array.isArray(project.requiredSkills) ? project.requiredSkills : [];
    const preferredSkills = Array.isArray(project.preferredSkills) ? project.preferredSkills : [];

    // Calculate Cosine Similarity and Jaccard Index
    const cosineRequired = calculateCosineSimilarity(userSkills, requiredSkills);
    const cosinePreferred = calculateCosineSimilarity(userSkills, preferredSkills);
    const jaccardRequired = calculateJaccardIndex(userSkills, requiredSkills);
    const jaccardPreferred = calculateJaccardIndex(userSkills, preferredSkills);

    const cosineWeight = 0.6;
    const jaccardWeight = 0.4;

    const combinedRequiredScore = (cosineWeight * cosineRequired) + (jaccardWeight * jaccardRequired);
    const combinedPreferredScore = (cosineWeight * cosinePreferred) + (jaccardWeight * jaccardPreferred);

    // Experience Match Score
    const experienceMatch = user.experience >= (project.minExperienceRequired || 0) ? 1 : 0;

    // Average Difficulty of Completed Projects
    const completedProjects = Array.isArray(user.completedProjects) ? user.completedProjects : [];
    const avgDifficulty = completedProjects.length > 0
        ? completedProjects.reduce((sum, proj) => sum + (proj.difficulty || 0), 0) / completedProjects.length
        : 5;
    const difficultyScore = Math.exp(-Math.pow(avgDifficulty - (project.difficulty || 5), 2) / 10);

    // Engagement Score
    const engagementScore = (user.engagementScore || 0) / 100;

    // MBTI Compatibility Score
    const mbtiCompatibilityScore = calculateMBTICompatibility(userMBTI, project);

    // Personality Preference Score (based on normalizedScores)
    let personalityScore = 0;
    if (normalizedScores) {
        if (normalizedScores.mind > 50 && project.description?.toLowerCase().includes('independent')) {
            personalityScore += 0.5;
        }
        if (normalizedScores.energy > 50 && project.description?.toLowerCase().includes('innovative')) {
            personalityScore += 0.5;
        }
        if (normalizedScores.nature > 50 && project.description?.toLowerCase().includes('team')) {
            personalityScore += 0.5;
        }
        if (normalizedScores.tactics > 50 && project.description?.toLowerCase().includes('flexible')) {
            personalityScore += 0.5;
        }
    }

    // User Preferences Score
    let preferencesScore = 0;
    if (user.interests?.includes(project.industry)) {
        preferencesScore += 0.5;
    }
    if (user.preferredProjectTypes?.includes(project.projectType)) {
        preferencesScore += 0.5;
    }
    if (user.preferredIndustries?.includes(project.industry)) {
        preferencesScore += 0.5;
    }

    // Define Weights
    const weights = {
        requiredSkills: 10,
        preferredSkills: 5,
        experience: 5,
        difficulty: 5,
        engagement: 2,
        mbti: 3,
        personality: 3,
        preferences: 3
    };

    // Calculate Total Score
    const totalScore = (combinedRequiredScore * weights.requiredSkills) +
                       (combinedPreferredScore * weights.preferredSkills) +
                       (experienceMatch * weights.experience) +
                       (difficultyScore * weights.difficulty) +
                       (engagementScore * weights.engagement) +
                       (mbtiCompatibilityScore * weights.mbti) +
                       (personalityScore * weights.personality) +
                       (preferencesScore * weights.preferences);

    console.log('Debug: Calculated score for project:', project._id, totalScore, { personalityScore, preferencesScore });
    return totalScore;
};

// Function to find the best matches for a user
const findBestMatches = async (userId, mbtiType = null, normalizedScores = null) => {
    try {
        console.log('Debug: Finding best matches for userId:', userId);

        const user = await User.findById(userId);
        if (!user) {
            console.log('Debug: User not found:', userId);
            return [];
        }

        let userMBTIType = mbtiType;
        if (!userMBTIType) {
            const userMBTI = await MBTI.findOne({ userId }).select('mbtiType normalizedScores');
            if (!userMBTI) {
                console.log('Debug: MBTI not found for user:', userId);
                return [];
            }
            userMBTIType = userMBTI.mbtiType;
            if (!normalizedScores) {
                normalizedScores = userMBTI.normalizedScores;
            }
        }

        console.log('Debug: Found user:', user._id, 'with MBTI:', userMBTIType);

        const projects = await Project.find({ status: 'active' }).populate('companyId');
        console.log('Debug: Found active projects:', projects.length);

        const matches = projects
            .map((project) => {
                if (user.completedProjects.some(proj => proj.projectId && proj.projectId.equals(project._id))) {
                    console.log('Debug: User has already completed project:', project._id);
                    return null;
                }

                const score = calculateScore(user, project, userMBTIType, normalizedScores);
                console.log('Debug: Calculated score for project:', project._id, score);

                return { projectId: project._id, companyId: project.companyId._id, score };
            })
            .filter(match => match && match.score > 0)
            .sort((a, b) => b.score - a.score)
            .slice(0, 10) // Take top 10 for randomization
            .sort(() => Math.random() - 0.5) // Shuffle top 10
            .slice(0, 5); // Select 5 randomized matches

        console.log('Debug: Final matches:', matches);
        return matches;
    } catch (error) {
        console.error('Error in findBestMatches:', error);
        return [];
    }
};

// Function to save matches in MongoDB
const matchCandidates = async (req, res) => {
    try {
        const userId = req.query.userId?.trim();
        console.log('Debug: Received request for userId:', userId);

        if (!userId) {
            console.log('Debug: Missing userId in request');
            return res.status(400).json({ error: 'User ID is required' });
        }

        const matches = await findBestMatches(userId);
        console.log('Debug: Got matches from findBestMatches:', matches);

        if (!Array.isArray(matches)) {
            console.log('Debug: matches is not an array:', matches);
            return res.status(500).json({ error: 'Internal server error: Invalid matches format' });
        }

        const deleteResult = await Match.deleteMany({ userId });
        console.log('Debug: Deleted old matches:', deleteResult);

        const matchDocuments = matches.map(match => ({
            userId,
            projectId: match.projectId,
            companyId: match.companyId,
            score: match.score
        }));
        console.log('Debug: Preparing to save matches:', matchDocuments);

        const savedMatches = await Match.insertMany(matchDocuments);
        console.log('Debug: Saved matches:', savedMatches);

        res.status(200).json({ success: true, matches: savedMatches });
    } catch (error) {
        console.error('Error in matchCandidates:', error);
        res.status(500).json({ error: 'Internal server error' });
    }
};

module.exports = { matchCandidates, findBestMatches };