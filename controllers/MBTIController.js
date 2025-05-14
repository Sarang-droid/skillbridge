const MBTI = require('../models/MBTI');
const { findBestMatches } = require('./matchController');
const jwt = require('jsonwebtoken');
const Personality = require('../models/personalityModel');

// Hidden Psychological Influence Points
const psychologicalWeights = {
    mind: 1.0,    // I vs E
    energy: 1.0,  // N vs S
    nature: 1.0,  // F vs T
    tactics: 1.0, // P vs J
    identity: 1.0 // T vs A (optional)
};

// Multiplier for amplifying standard question scores
const hiddenMultiplier = 1.2;

// Bonus weight for the final question (animal choice)
const bonusWeight = 1;

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

// Calculate MBTI Type
function calculateMBTI(answers) {
    let scores = {
        mind: 0,      // Positive = Introvert, Negative = Extrovert
        energy: 0,    // Positive = Intuitive, Negative = Sensing
        nature: 0,    // Positive = Feeling, Negative = Thinking
        tactics: 0,   // Positive = Prospecting, Negative = Judging
        identity: 0   // Positive = Turbulent, Negative = Assertive
    };

    const sections = ['mind', 'energy', 'nature', 'tactics', 'identity'];
    const questionsPerSection = 3;
    const maxScorePerQuestion = 2;

    // Calculate scores for the first 15 questions
    for (let index = 0; index < Math.min(15, answers.length); index++) {
        const section = sections[Math.floor(index / questionsPerSection)];
        const baseScore = answers[index] === 0 ? -1 : 1;
        const mappedScore = baseScore * psychologicalWeights[section] * hiddenMultiplier;
        scores[section] += mappedScore;
        console.log(`Question ${index}, Answer: ${answers[index]}, Section: ${section}, Mapped Score: ${mappedScore}, Running Score: ${scores[section]}`);
    }

    // Handle the final question (animal choice)
    if (answers.length > 15) {
        const finalAnswer = answers[15];
        console.log('Final Answer:', finalAnswer);
        switch (finalAnswer) {
            case 0: // Introvert
                scores.mind += bonusWeight;
                break;
            case 1: // Extrovert
                scores.mind -= bonusWeight;
                break;
            case 2: // Intuitive
                scores.energy += bonusWeight;
                break;
            case 3: // Judging
                scores.tactics -= bonusWeight;
                break;
            default:
                console.warn('Invalid final answer:', finalAnswer);
        }
        console.log('Scores after final adjustment:', scores);
    }

    const maxPossibleScore = questionsPerSection * maxScorePerQuestion * hiddenMultiplier;
    const normalizedScores = {};
    Object.keys(scores).forEach((key) => {
        scores[key] = isNaN(scores[key]) ? 0 : scores[key];
        normalizedScores[key] = (scores[key] / maxPossibleScore) * 100;
    });

    const type = `${normalizedScores.mind >= 0 ? 'I' : 'E'}${normalizedScores.energy >= 0 ? 'N' : 'S'}${normalizedScores.nature >= 0 ? 'F' : 'T'}${normalizedScores.tactics >= 0 ? 'P' : 'J'}`;

    const confidence = Math.floor(
        Object.values(normalizedScores)
            .slice(0, 4)
            .reduce((sum, score) => sum + Math.abs(score), 0) / 4
    );

    const psychologicalScore = Math.floor(
        Object.values(scores).slice(0, 4).reduce((sum, score) => sum + Math.abs(score), 0)
    );

    console.log('Debug: Normalized Scores:', normalizedScores, 'Type:', type, 'Confidence:', confidence, 'Score:', psychologicalScore);
    return { type, psychologicalScore, confidence, normalizedScores };
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
        const { answers } = req.body;
        console.log('Received answers:', answers);

        if (!answers || !Array.isArray(answers) || answers.length < 15) {
            return res.status(400).json({ message: 'Invalid or incomplete answers' });
        }

        const { type, psychologicalScore, confidence, normalizedScores } = calculateMBTI(answers);
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
            psychologicalScore,
            famousMatches: personalityDetails.famousPersonalities,
            token: newToken,
            normalizedScores,
            confidence,
            projectMatches: topProjects.slice(0, 3).map(project => project.projectId),
            answers // Save answers for debugging
        });

        await mbti.save();
        console.log('Saved MBTI with projectMatches:', mbti);

        const projectNames = topProjects.slice(0, 3).map(project => project.projectId.title || 'Unnamed Project');
        res.json({
            success: true,
            type,
            psychologicalScore,
            confidence,
            normalizedScores,
            projectNames,
            token: newToken
        });
    } catch (err) {
        console.error('Error in storeResult:', err);
        res.status(500).json({ message: 'Server Error', error: err.message });
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