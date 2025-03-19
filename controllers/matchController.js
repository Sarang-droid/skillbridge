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

    if (userMagnitude === 0 || projectMagnitude === 0) return 0; // Avoid division by zero
    return dotProduct / (userMagnitude * projectMagnitude);
};

// Helper function to calculate Jaccard Index
const calculateJaccardIndex = (userSkills, projectSkills) => {
    const intersection = userSkills.filter(skill => projectSkills.includes(skill)).length;
    const union = [...new Set([...userSkills, ...projectSkills])].length;

    if (union === 0) return 0; // Avoid division by zero
    return intersection / union;
};

// Helper function to calculate MBTI Compatibility
const calculateMBTICompatibility = (userMBTI, project) => {
    if (project.compatibleMBTITypes && project.compatibleMBTITypes.includes(userMBTI)) {
        return 1; // Full score if compatible
    }
    return 0; // No score if not compatible
};

// Function to calculate the match score
const calculateScore = (user, project, userMBTI) => {
    if (!user || !project) {
        console.log('Debug: User or project is undefined');
        return 0;
    }

    const userSkills = Array.isArray(user.skills) ? user.skills : [];
    const requiredSkills = Array.isArray(project.requiredSkills) ? project.requiredSkills : [];
    const preferredSkills = Array.isArray(project.preferredSkills) ? project.preferredSkills : [];

    // Calculate Cosine Similarity for required and preferred skills
    const cosineRequired = calculateCosineSimilarity(userSkills, requiredSkills);
    const cosinePreferred = calculateCosineSimilarity(userSkills, preferredSkills);

    // Calculate Jaccard Index for required and preferred skills
    const jaccardRequired = calculateJaccardIndex(userSkills, requiredSkills);
    const jaccardPreferred = calculateJaccardIndex(userSkills, preferredSkills);

    // Define weights for Cosine Similarity and Jaccard Index
    const cosineWeight = 0.6; // Weight for Cosine Similarity
    const jaccardWeight = 0.4; // Weight for Jaccard Index

    // Combine Cosine Similarity and Jaccard Index for required and preferred skills
    const combinedRequiredScore = (cosineWeight * cosineRequired) + (jaccardWeight * jaccardRequired);
    const combinedPreferredScore = (cosineWeight * cosinePreferred) + (jaccardWeight * jaccardPreferred);

    // Experience Match Score
    const experienceMatch = user.experience >= (project.minExperienceRequired || 0) ? 1 : 0;

    // Average Difficulty of Completed Projects
    const completedProjects = Array.isArray(user.completedProjects) ? user.completedProjects : [];
    const avgDifficulty = completedProjects.length > 0
        ? completedProjects.reduce((sum, proj) => sum + (proj.difficulty || 0), 0) / completedProjects.length
        : 5;

    // Difficulty Score (Gaussian Function)
    const difficultyScore = Math.exp(-Math.pow(avgDifficulty - (project.difficulty || 5), 2) / 10);

    // Engagement Score (Normalized)
    const engagementScore = (user.engagementScore || 0) / 100;

    // MBTI Compatibility Score
    const mbtiCompatibilityScore = calculateMBTICompatibility(userMBTI, project);

    // Define Weights for Final Score Calculation
    const weights = {
        requiredSkills: 10,
        preferredSkills: 5,
        experience: 5,
        difficulty: 5,
        engagement: 2,
        mbti: 3 // Weight for MBTI compatibility
    };

    // Calculate Total Score
    const totalScore = (combinedRequiredScore * weights.requiredSkills) +
                       (combinedPreferredScore * weights.preferredSkills) +
                       (experienceMatch * weights.experience) +
                       (difficultyScore * weights.difficulty) +
                       (engagementScore * weights.engagement) +
                       (mbtiCompatibilityScore * weights.mbti);

    console.log('Debug: Calculated score for project:', project._id, totalScore);
    return totalScore;
};

// Function to find the best matches for a user, accepting mbtiType as an optional parameter
const findBestMatches = async (userId, mbtiType = null) => {
    try {
        console.log('Debug: Finding best matches for userId:', userId);

        const user = await User.findById(userId);
        if (!user) {
            console.log('Debug: User not found:', userId);
            return [];
        }

        // Use provided mbtiType if available, otherwise fetch from database
        let userMBTIType = mbtiType;
        if (!userMBTIType) {
            const userMBTI = await MBTI.findOne({ userId }).select('mbtiType');
            if (!userMBTI) {
                console.log('Debug: MBTI not found for user:', userId);
                return [];
            }
            userMBTIType = userMBTI.mbtiType;
        }

        console.log('Debug: Found user:', user._id, 'with MBTI:', userMBTIType);

        // Fetch Active Projects
        const projects = await Project.find({ status: 'active' }).populate('companyId');
        console.log('Debug: Found active projects:', projects.length);

        const matches = projects
            .map((project) => {
                if (user.completedProjects.some(proj => proj.projectId && proj.projectId.equals(project._id))) {
                    console.log('Debug: User has already completed project:', project._id);
                    return null;
                }

                // Calculate Match Score
                const score = calculateScore(user, project, userMBTIType);
                console.log('Debug: Calculated score for project:', project._id, score);

                return { projectId: project._id, companyId: project.companyId._id, score };
            })
            .filter(match => match && match.score > 0) // Filter out null and low-score matches
            .sort((a, b) => b.score - a.score) // Sort by score in descending order
            .slice(0, 5); // Limit to top 5 matches

        console.log('Debug: Final matches:', matches);
        return matches;
    } catch (error) {
        console.error('Error in findBestMatches:', error);
        return []; // Return an empty array in case of an error
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

        // Delete old matches
        const deleteResult = await Match.deleteMany({ userId });
        console.log('Debug: Deleted old matches:', deleteResult);

        // Create new match documents
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