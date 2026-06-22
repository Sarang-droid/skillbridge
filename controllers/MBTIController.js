const mongoose = require('mongoose');
const MBTI = require('../models/MBTI');
const { findBestMatches } = require('./matchController');
const jwt = require('jsonwebtoken');
const Personality = require('../models/personalityModel');

// Hidden Psychological Influence Points
// (per-dimension weighting — tune these to make a dimension count for more/less)
const psychologicalWeights = {
    mind: 1.0,    // I (+) vs E (-)
    energy: 1.0,  // N (+) vs S (-)
    nature: 1.0,  // F (+) vs T (-)
    tactics: 1.0, // P (+) vs J (-)
    identity: 1.0 // T (+) vs A (-)
};

// Multiplier for amplifying standard question scores
const hiddenMultiplier = 1.2;

// Bonus weight for the final question (animal choice). Kept light so it only
// nudges/breaks ties rather than overpowering the 15 graded answers.
const bonusWeight = 1;

// Max signed intensity a single Likert answer can carry (-2..+2)
const maxScorePerQuestion = 2;

const clamp = (n, lo, hi) => Math.max(lo, Math.min(hi, n));

// Predefined personality traits for all 16 MBTI types
const personalityTraits = {
    "INFP": {
        type: "INFP",
        coreDesire: "To find meaning and live authentically",
        hiddenFear: "Losing their individuality or purpose",
        keyword: "Idealist",
        strengths: ["Empathetic", "Creative", "Passionate", "Open-minded"],
        weaknesses: ["Overly Idealistic", "Sensitive to Criticism", "Impractical", "Self-critical"],
        famousPersonalities: ["J.R.R. Tolkien", "Princess Diana", "Audrey Hepburn", "John Lennon", "Virginia Woolf"],
        coreMotivations: "Seeking purpose in work, relationships, and self-expression",
        workplaceRole: "Supporter",
        communicationStyle: "Expressive",
        learningStyle: "Visual",
        bestIndustries: ["Design", "Nonprofits", "Writing"],
        stressTriggers: ["Criticism", "Conflict"],
        conflictStyle: "Avoidant",
        innovationVsStability: "Innovation",
        bestCollaborationMatch: "ENFJ",
        selfImprovementTip: "Practice setting realistic goals to balance your idealism.",
        description: "The dreamy idealist who seeks meaning, connection, and creative self-expression."
    },
    "INFJ": {
        type: "INFJ",
        coreDesire: "To help others and create harmony",
        hiddenFear: "Being misunderstood or powerless",
        keyword: "Advocate",
        strengths: ["Insightful", "Compassionate", "Visionary", "Organized"],
        weaknesses: ["Perfectionistic", "Private", "Overly Sensitive", "Burnout-prone"],
        famousPersonalities: ["Martin Luther King Jr.", "Nelson Mandela", "Mother Teresa", "Carl Jung", "Emma Watson"],
        coreMotivations: "Improving lives and fostering deep connections",
        workplaceRole: "Mediator",
        communicationStyle: "Diplomatic",
        learningStyle: "Theoretical",
        bestIndustries: ["Healthcare", "Education", "Counseling"],
        stressTriggers: ["Chaos", "Overload"],
        conflictStyle: "Harmonizer",
        innovationVsStability: "Innovation",
        bestCollaborationMatch: "ENTP",
        selfImprovementTip: "Set boundaries to avoid burnout from helping others.",
        description: "The compassionate visionary driven to improve the world through empathy and long-term plans."
    },
    "INTP": {
        type: "INTP",
        coreDesire: "To understand the world logically",
        hiddenFear: "Being intellectually inadequate",
        keyword: "Thinker",
        strengths: ["Analytical", "Curious", "Independent", "Innovative"],
        weaknesses: ["Detached", "Overthinking", "Procrastinating", "Socially Reserved"],
        famousPersonalities: ["Albert Einstein", "Isaac Newton", "Marie Curie", "Socrates", "Ada Lovelace"],
        coreMotivations: "Pursuing knowledge and solving complex problems",
        workplaceRole: "Analyst",
        communicationStyle: "Reserved",
        learningStyle: "Theoretical",
        bestIndustries: ["Science", "Technology", "Philosophy"],
        stressTriggers: ["Emotional Pressure", "Routine"],
        conflictStyle: "Problem-Solver",
        innovationVsStability: "Innovation",
        bestCollaborationMatch: "ENTJ",
        selfImprovementTip: "Focus on taking action rather than overanalyzing.",
        description: "The intellectual innovator who thrives on ideas, theories, and unraveling how things work."
    },
    "INTJ": {
        type: "INTJ",
        coreDesire: "To achieve mastery and implement ideas",
        hiddenFear: "Failure or incompetence",
        keyword: "Strategist",
        strengths: ["Strategic", "Determined", "Visionary", "Logical"],
        weaknesses: ["Arrogant", "Overly Critical", "Impatient", "Emotionally Distant"],
        famousPersonalities: ["Elon Musk", "Nikola Tesla", "Ayn Rand", "Isaac Asimov", "Angela Merkel"],
        coreMotivations: "Building systems and achieving long-term goals",
        workplaceRole: "Leader",
        communicationStyle: "Direct",
        learningStyle: "Theoretical",
        bestIndustries: ["Engineering", "Finance", "Tech"],
        stressTriggers: ["Inefficiency", "Lack of Control"],
        conflictStyle: "Problem-Solver",
        innovationVsStability: "Innovation",
        bestCollaborationMatch: "INTP",
        selfImprovementTip: "Practice patience and empathy in team settings.",
        description: "The mastermind strategist with a sharp vision to bring long-term ideas to reality."
    },
    "ISFP": {
        type: "ISFP",
        coreDesire: "To express themselves and live in the moment",
        hiddenFear: "Being trapped or unappreciated",
        keyword: "Artist",
        strengths: ["Creative", "Gentle", "Adaptable", "Observant"],
        weaknesses: ["Overly Sensitive", "Indecisive", "Avoidant", "Unfocused"],
        famousPersonalities: ["Bob Dylan", "Marilyn Monroe", "Michael Jackson", "Prince", "Frida Kahlo"],
        coreMotivations: "Creating beauty and enjoying sensory experiences",
        workplaceRole: "Creator",
        communicationStyle: "Expressive",
        learningStyle: "Hands-On",
        bestIndustries: ["Arts", "Fashion", "Photography"],
        stressTriggers: ["Criticism", "Pressure"],
        conflictStyle: "Avoidant",
        innovationVsStability: "Innovation",
        bestCollaborationMatch: "ESFJ",
        selfImprovementTip: "Develop focus to turn your creativity into action.",
        description: "The artistic free spirit who expresses beauty through creativity and lives in the present."
    },
    "ISFJ": {
        type: "ISFJ",
        coreDesire: "To support and protect others",
        hiddenFear: "Letting people down",
        keyword: "Defender",
        strengths: ["Loyal", "Practical", "Warm", "Detail-oriented"],
        weaknesses: ["Overly Altruistic", "Resistant to Change", "Shy", "Overworked"],
        famousPersonalities: ["Queen Elizabeth II", "Mother Teresa", "Beyoncé", "Kate Middleton", "Rosa Parks"],
        coreMotivations: "Ensuring stability and caring for others",
        workplaceRole: "Supporter",
        communicationStyle: "Diplomatic",
        learningStyle: "Hands-On",
        bestIndustries: ["Healthcare", "Education", "Administration"],
        stressTriggers: ["Conflict", "Uncertainty"],
        conflictStyle: "Harmonizer",
        innovationVsStability: "Stability",
        bestCollaborationMatch: "ESTP",
        selfImprovementTip: "Learn to say no to avoid overcommitting.",
        description: "The nurturing protector who finds purpose in supporting others with loyalty and care."
    },
    "ISTP": {
        type: "ISTP",
        coreDesire: "To explore and master their environment",
        hiddenFear: "Being constrained or bored",
        keyword: "Craftsman",
        strengths: ["Resourceful", "Practical", "Calm", "Hands-on"],
        weaknesses: ["Detached", "Risk-prone", "Disorganized", "Impulsive"],
        famousPersonalities: ["Clint Eastwood", "Bear Grylls", "Amelia Earhart", "James Dean", "Bruce Lee"],
        coreMotivations: "Mastering skills and tackling challenges",
        workplaceRole: "Problem-Solver",
        communicationStyle: "Direct",
        learningStyle: "Hands-On",
        bestIndustries: ["Engineering", "Mechanics", "Outdoor Adventure"],
        stressTriggers: ["Monotony", "Rules"],
        conflictStyle: "Avoidant",
        innovationVsStability: "Innovation",
        bestCollaborationMatch: "ISFJ",
        selfImprovementTip: "Plan ahead to manage impulsivity.",
        description: "The logical adventurer who loves hands-on problem-solving and exploring new experiences."
    },
    "ISTJ": {
        type: "ISTJ",
        coreDesire: "To uphold duty and order",
        hiddenFear: "Chaos or unreliability",
        keyword: "Inspector",
        strengths: ["Reliable", "Organized", "Responsible", "Logical"],
        weaknesses: ["Stubborn", "Rigid", "Overly Serious", "Judgmental"],
        famousPersonalities: ["George Washington", "Angela Merkel", "Jeff Bezos", "Warren Buffett", "Queen Victoria"],
        coreMotivations: "Maintaining structure and fulfilling responsibilities",
        workplaceRole: "Organizer",
        communicationStyle: "Direct",
        learningStyle: "Hands-On",
        bestIndustries: ["Law", "Accounting", "Logistics"],
        stressTriggers: ["Disorder", "Unpredictability"],
        conflictStyle: "Problem-Solver",
        innovationVsStability: "Stability",
        bestCollaborationMatch: "ENFP",
        selfImprovementTip: "Embrace flexibility to adapt to change.",
        description: "The dedicated organizer who upholds structure, traditions, and responsibility."
    },
    "ENFP": {
        type: "ENFP",
        coreDesire: "To inspire and explore possibilities",
        hiddenFear: "Stagnation or confinement",
        keyword: "Campaigner",
        strengths: ["Enthusiastic", "Creative", "Sociable", "Imaginative"],
        weaknesses: ["Overly Optimistic", "Disorganized", "Restless", "Emotional"],
        famousPersonalities: ["Robin Williams", "Walt Disney", "Ellen DeGeneres", "Will Smith", "Quentin Tarantino"],
        coreMotivations: "Sparking ideas and connecting with people",
        workplaceRole: "Innovator",
        communicationStyle: "Expressive",
        learningStyle: "Visual",
        bestIndustries: ["Marketing", "Entertainment", "Education"],
        stressTriggers: ["Routine", "Rejection"],
        conflictStyle: "Harmonizer",
        innovationVsStability: "Innovation",
        bestCollaborationMatch: "ISTJ",
        selfImprovementTip: "Focus on follow-through to turn ideas into reality.",
        description: "The charismatic explorer who brings infectious energy and creative ideas to the world."
    },
    "ENFJ": {
        type: "ENFJ",
        coreDesire: "To uplift and connect with others",
        hiddenFear: "Rejection or disharmony",
        keyword: "Protagonist",
        strengths: ["Charismatic", "Empathetic", "Inspiring", "Organized"],
        weaknesses: ["People-pleasing", "Overly Idealistic", "Self-sacrificing", "Sensitive"],
        famousPersonalities: ["Oprah Winfrey", "Barack Obama", "Maya Angelou", "Malala Yousafzai", "Dalai Lama"],
        coreMotivations: "Leading others toward growth and harmony",
        workplaceRole: "Leader",
        communicationStyle: "Expressive",
        learningStyle: "Auditory",
        bestIndustries: ["Education", "Counseling", "Public Relations"],
        stressTriggers: ["Conflict", "Isolation"],
        conflictStyle: "Harmonizer",
        innovationVsStability: "Innovation",
        bestCollaborationMatch: "INFP",
        selfImprovementTip: "Prioritize self-care over pleasing others.",
        description: "The inspiring leader who uplifts others and creates harmony through empathy."
    },
    "ENTP": {
        type: "ENTP",
        coreDesire: "To innovate and debate ideas",
        hiddenFear: "Being unoriginal or restricted",
        keyword: "Debater",
        strengths: ["Witty", "Innovative", "Adaptable", "Curious"],
        weaknesses: ["Argumentative", "Scattered", "Insensitive", "Unreliable"],
        famousPersonalities: ["Thomas Edison", "Mark Twain", "Socrates", "Benjamin Franklin", "Steve Wozniak"],
        coreMotivations: "Exploring possibilities and challenging norms",
        workplaceRole: "Innovator",
        communicationStyle: "Direct",
        learningStyle: "Theoretical",
        bestIndustries: ["Entrepreneurship", "Tech", "Media"],
        stressTriggers: ["Boredom", "Control"],
        conflictStyle: "Confrontational",
        innovationVsStability: "Innovation",
        bestCollaborationMatch: "INFJ",
        selfImprovementTip: "Work on consistency to see projects through.",
        description: "The bold debater who challenges ideas, sparks conversations, and seeks innovation."
    },
    "ENTJ": {
        type: "ENTJ",
        coreDesire: "To lead and achieve goals",
        hiddenFear: "Losing control or influence",
        keyword: "Commander",
        strengths: ["Confident", "Strategic", "Decisive", "Driven"],
        weaknesses: ["Domineering", "Impatient", "Cold", "Workaholic"],
        famousPersonalities: ["Steve Jobs", "Margaret Thatcher", "Napoleon Bonaparte", "Sheryl Sandberg", "Gordon Ramsay"],
        coreMotivations: "Driving progress and leading teams to success",
        workplaceRole: "Leader",
        communicationStyle: "Direct",
        learningStyle: "Theoretical",
        bestIndustries: ["Business", "Management", "Politics"],
        stressTriggers: ["Inefficiency", "Failure"],
        conflictStyle: "Confrontational",
        innovationVsStability: "Innovation",
        bestCollaborationMatch: "INTP",
        selfImprovementTip: "Soften your approach to build stronger relationships.",
        description: "The natural-born leader who thrives on strategic planning, leadership, and execution."
    },
    "ESFP": {
        type: "ESFP",
        coreDesire: "To enjoy life and entertain others",
        hiddenFear: "Being ignored or unappreciated",
        keyword: "Entertainer",
        strengths: ["Fun-loving", "Spontaneous", "Sociable", "Observant"],
        weaknesses: ["Impulsive", "Unfocused", "Sensitive", "Avoidant"],
        famousPersonalities: ["Elvis Presley", "Marilyn Monroe", "Will Smith", "Adele", "Miley Cyrus"],
        coreMotivations: "Living in the moment and bringing joy",
        workplaceRole: "Entertainer",
        communicationStyle: "Expressive",
        learningStyle: "Hands-On",
        bestIndustries: ["Entertainment", "Hospitality", "Sales"],
        stressTriggers: ["Isolation", "Criticism"],
        conflictStyle: "Avoidant",
        innovationVsStability: "Innovation",
        bestCollaborationMatch: "ISTJ",
        selfImprovementTip: "Plan ahead to balance spontaneity with responsibility.",
        description: "The vibrant entertainer who lives for fun, excitement, and bringing joy to others."
    },
    "ESFJ": {
        type: "ESFJ",
        coreDesire: "To create harmony and support community",
        hiddenFear: "Disapproval or isolation",
        keyword: "Consul",
        strengths: ["Warm", "Loyal", "Practical", "Sociable"],
        weaknesses: ["Needy", "Overly Traditional", "Sensitive", "Inflexible"],
        famousPersonalities: ["Taylor Swift", "Bill Clinton", "Jennifer Garner", "Princess Diana", "Hugh Jackman"],
        coreMotivations: "Building connections and maintaining harmony",
        workplaceRole: "Supporter",
        communicationStyle: "Diplomatic",
        learningStyle: "Auditory",
        bestIndustries: ["Education", "Healthcare", "Event Planning"],
        stressTriggers: ["Conflict", "Rejection"],
        conflictStyle: "Harmonizer",
        innovationVsStability: "Stability",
        bestCollaborationMatch: "ISFP",
        selfImprovementTip: "Embrace change to grow beyond your comfort zone.",
        description: "The community builder who creates warmth, harmony, and brings people together."
    },
    "ESTP": {
        type: "ESTP",
        coreDesire: "To act and experience adventure",
        hiddenFear: "Being stuck or powerless",
        keyword: "Entrepreneur",
        strengths: ["Bold", "Practical", "Energetic", "Adaptable"],
        weaknesses: ["Impulsive", "Insensitive", "Restless", "Risky"],
        famousPersonalities: ["Ernest Hemingway", "Madonna", "Eddie Murphy", "Angelina Jolie", "Jackie Chan"],
        coreMotivations: "Taking action and seizing opportunities",
        workplaceRole: "Problem-Solver",
        communicationStyle: "Direct",
        learningStyle: "Hands-On",
        bestIndustries: ["Sales", "Sports", "Entrepreneurship"],
        stressTriggers: ["Boredom", "Restrictions"],
        conflictStyle: "Confrontational",
        innovationVsStability: "Innovation",
        bestCollaborationMatch: "ISFJ",
        selfImprovementTip: "Pause to consider long-term consequences.",
        description: "The adventurous risk-taker who thrives on action, spontaneity, and living in the moment."
    },
    "ESTJ": {
        type: "ESTJ",
        coreDesire: "To manage and enforce structure",
        hiddenFear: "Inefficiency or disorder",
        keyword: "Executive",
        strengths: ["Organized", "Confident", "Hardworking", "Decisive"],
        weaknesses: ["Stubborn", "Bossy", "Inflexible", "Overly Blunt"],
        famousPersonalities: ["Henry Ford", "Michelle Obama", "Sonia Sotomayor", "John D. Rockefeller", "Hillary Clinton"],
        coreMotivations: "Ensuring order and achieving results",
        workplaceRole: "Leader",
        communicationStyle: "Direct",
        learningStyle: "Hands-On",
        bestIndustries: ["Management", "Law", "Military"],
        stressTriggers: ["Disorganization", "Laziness"],
        conflictStyle: "Confrontational",
        innovationVsStability: "Stability",
        bestCollaborationMatch: "INFP",
        selfImprovementTip: "Listen to others to soften your authoritative style.",
        description: "The bold executor who organizes teams, takes charge, and enforces structure."
    }
};

// Animal bonus: each choice nudges a coherent set of dimensions (sign follows the
// per-dimension convention below — positive pole listed in the comment).
const animalBias = {
    0: { mind: +bonusWeight, energy: +bonusWeight, tactics: -bonusWeight }, // Wolf:    I, N, J
    1: { mind: -bonusWeight, nature: +bonusWeight, tactics: +bonusWeight }, // Dolphin: E, F, P
    2: { mind: +bonusWeight, energy: -bonusWeight },                        // Owl:     I, S
    3: { nature: -bonusWeight, tactics: -bonusWeight, identity: -bonusWeight } // Tiger: T, J, Assertive
};

const dimensionOrder = ['mind', 'energy', 'nature', 'tactics'];

/**
 * Calculate the MBTI type from graded (Likert) responses.
 *
 * @param {Array<{dimension: string, value: number}>} responses
 *        One entry per question. `value` is a signed intensity in [-2, +2] where a
 *        POSITIVE value leans toward that dimension's positive pole:
 *          mind:    + = Introvert (I)   | - = Extrovert (E)
 *          energy:  + = Intuitive (N)   | - = Sensing   (S)
 *          nature:  + = Feeling   (F)   | - = Thinking  (T)
 *          tactics: + = Prospecting (P) | - = Judging   (J)
 *          identity:+ = Turbulent  (T)  | - = Assertive (A)
 * @param {number} [finalAnswer] Index (0-3) of the animal choice (optional bonus).
 */
function calculateMBTI(responses, finalAnswer) {
    const scores = { mind: 0, energy: 0, nature: 0, tactics: 0, identity: 0 };
    const counts = { mind: 0, energy: 0, nature: 0, tactics: 0, identity: 0 };

    // Score each graded response against the dimension it explicitly declares,
    // so the question order on the client can never desync from the scoring here.
    (Array.isArray(responses) ? responses : []).forEach((r) => {
        if (!r || !(r.dimension in scores)) return;
        const value = clamp(Number(r.value) || 0, -maxScorePerQuestion, maxScorePerQuestion);
        scores[r.dimension] += value * psychologicalWeights[r.dimension] * hiddenMultiplier;
        counts[r.dimension] += 1;
    });

    // Final question (animal choice) — light nudge across coherent dimensions.
    const bias = animalBias[finalAnswer];
    if (bias) {
        Object.keys(bias).forEach((dim) => { scores[dim] += bias[dim]; });
    } else if (finalAnswer !== undefined && finalAnswer !== null) {
        console.warn('Invalid final answer:', finalAnswer);
    }

    // Normalize each dimension against how many questions it actually had, so a
    // dimension answered with fewer/more questions still maps cleanly to -100..100.
    const normalizedScores = {};
    Object.keys(scores).forEach((key) => {
        scores[key] = isNaN(scores[key]) ? 0 : scores[key];
        const questionCount = counts[key] || 3;
        const maxPossible = questionCount * maxScorePerQuestion * psychologicalWeights[key] * hiddenMultiplier;
        const pct = maxPossible ? (scores[key] / maxPossible) * 100 : 0;
        normalizedScores[key] = clamp(Math.round(pct), -100, 100);
    });

    const type =
        `${normalizedScores.mind    >= 0 ? 'I' : 'E'}` +
        `${normalizedScores.energy  >= 0 ? 'N' : 'S'}` +
        `${normalizedScores.nature  >= 0 ? 'F' : 'T'}` +
        `${normalizedScores.tactics >= 0 ? 'P' : 'J'}`;

    const identity = normalizedScores.identity >= 0 ? 'T' : 'A'; // Turbulent / Assertive
    const fullType = `${type}-${identity}`;

    // Confidence = how strongly the four core letters lean, on average (0-100).
    const confidence = Math.round(
        dimensionOrder.reduce((sum, k) => sum + Math.abs(normalizedScores[k]), 0) / dimensionOrder.length
    );

    const psychologicalScore = Math.round(
        dimensionOrder.reduce((sum, k) => sum + Math.abs(scores[k]), 0)
    );

    console.log('Debug:', { type, fullType, normalizedScores, confidence, psychologicalScore });
    return { type, fullType, identity, psychologicalScore, confidence, normalizedScores };
}

// Store MBTI Result
const storeResult = async (req, res) => {
    try {
        const token = req.headers.authorization?.split(' ')[1];
        if (!token) {
            return res.status(401).json({ message: 'No token provided' });
        }

        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        const userId = decoded.id;
        const { responses, finalAnswer, answers } = req.body;

        // Prefer the new graded payload; fall back to a legacy `answers` array of
        // {dimension, value} objects if that's what was sent.
        const gradedResponses = Array.isArray(responses)
            ? responses
            : (Array.isArray(answers) ? answers : null);
        console.log('Received responses:', gradedResponses, 'finalAnswer:', finalAnswer);

        const isValid = gradedResponses
            && gradedResponses.length >= 15
            && gradedResponses.every((r) => r && typeof r === 'object' && 'dimension' in r);

        if (!isValid) {
            return res.status(400).json({
                message: 'Invalid or incomplete answers. Expected at least 15 graded responses.'
            });
        }

        const { type, fullType, identity, psychologicalScore, confidence, normalizedScores } =
            calculateMBTI(gradedResponses, finalAnswer);
        const newToken = jwt.sign({ userId, type }, process.env.JWT_SECRET, { expiresIn: '1h' });

        let personalityDetails = await Personality.findOne({ type });
        if (!personalityDetails) {
            const traits = personalityTraits[type];
            if (!traits) {
                return res.status(500).json({ message: `Personality traits for type ${type} not found` });
            }
            // Randomly select 3 famous personalities from an expanded pool
            const famousPool = traits.famousPersonalities;
            const selectedFamous = famousPool.sort(() => Math.random() - 0.5).slice(0, 3);
            personalityDetails = new Personality({ ...traits, famousPersonalities: selectedFamous });
            await personalityDetails.save();
        }

        const topProjects = await findBestMatches(userId, type, normalizedScores);
        console.log('Top Projects from findBestMatches:', topProjects);

        const mbti = new MBTI({
            userId,
            mbtiType: type,
            fullType,
            identity,
            psychologicalScore,
            famousMatches: personalityDetails.famousPersonalities,
            token: newToken,
            normalizedScores,
            confidence,
            projectMatches: topProjects.slice(0, 3).map(project => project.projectId),
            answers: gradedResponses, // Save graded responses for debugging
            finalAnswer
        });

        await mbti.save();
        console.log('Saved MBTI with projectMatches:', mbti);

        const projectNames = topProjects.slice(0, 3).map(project => project.projectId.title || 'Unnamed Project');
        res.json({
            success: true,
            type,
            fullType,
            identity,
            psychologicalScore,
            confidence,
            normalizedScores,
            projectNames,
            token: newToken
        });
    } catch (err) {
        console.error('Error in storeResult:', {
            message: err.message,
            stack: err.stack,
            requestBody: req.body,
            token: req.headers.authorization ? 'Token present' : 'No token provided',
            env: {
                NODE_ENV: process.env.NODE_ENV,
                JWT_SECRET: process.env.JWT_SECRET ? 'Set' : 'Missing',
                DB_CONNECTED: mongoose.connection.readyState === 1 ? 'Connected' : 'Disconnected'
            }
        });
        
        res.status(500).json({ 
            success: false,
            message: 'Server Error',
            error: process.env.NODE_ENV === 'development' ? err.message : 'Internal server error',
            requestId: req.id || Date.now()
        });
    }
};

// Retrieve MBTI Result
const getResult = async (req, res) => {
    try {
        const token = req.params.token;
        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        const mbti = await MBTI.findOne({ userId: decoded.userId }).populate('projectMatches');

        if (!mbti) {
            return res.status(404).json({ message: 'Result not found' });
        }
        console.log('Fetched MBTI:', mbti);

        const personalityDetails = await Personality.findOne({ type: mbti.mbtiType });
        if (!personalityDetails) {
            return res.status(404).json({ message: 'Personality details not found' });
        }

        const projectNames = mbti.projectMatches.map(project => project.title || 'Unnamed Project');
        console.log('Project Names for Response:', projectNames);

        res.json({
            success: true,
            type: mbti.mbtiType,
            fullType: mbti.fullType || mbti.mbtiType,
            identity: mbti.identity,
            psychologicalScore: mbti.psychologicalScore,
            confidence: mbti.confidence,
            normalizedScores: mbti.normalizedScores,
            projectNames,
            personalityDetails: { ...personalityDetails.toObject() }
        });
    } catch (err) {
        console.error('Error in getResult:', err);
        res.status(500).json({ message: 'Server Error', error: err.message });
    }
};

module.exports = {
    storeResult,
    getResult
};