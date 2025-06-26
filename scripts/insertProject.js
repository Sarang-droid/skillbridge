require('dotenv').config();
const mongoose = require('mongoose');
const connectDB = require('../backend/config/database');
const Project = require('../models/project');

(async () => {
    await connectDB();

    const projects = [
        // ByteForge (IT, Startup)
        {
            companyId: '685cf74c5d6860e9e1b7bd08',
            companyType: 'Startup',
            projectId: 'PRJ-BF-001',
            title: 'CloudSync Dashboard Prototype',
            description: 'Develop a prototype for a cloud dashboard to monitor real-time server metrics.',
            industry: 'IT',
            projectType: 'Prototype',
            preferredSkills: ['React', 'Node.js', 'AWS', 'D3.js'],
            minExperienceRequired: 2,
            tasks: [
                { taskId: 'T1', taskName: 'Design UI for dashboard layout', completed: false },
                { taskId: 'T2', taskName: 'Set up AWS SDK for data retrieval', completed: false },
                { taskId: 'T3', taskName: 'Implement real-time charts with D3.js', completed: false },
                { taskId: 'T4', taskName: 'Test prototype with mock data', completed: false }
            ],
            submissionDeadline: new Date('2025-11-15'),
            difficulty: 3,
            resources: [
                {
                    name: 'Building Dashboards with React',
                    url: 'https://www.youtube.com/watch?v=5yJ7e4v8W8M',
                    description: 'Tutorial on creating interactive dashboards with React.'
                },
                {
                    name: 'AWS SDK for JavaScript',
                    url: 'https://docs.aws.amazon.com/sdk-for-javascript/v3/developer-guide/welcome.html',
                    description: 'Official AWS SDK documentation for JavaScript.'
                }
            ],
            status: 'active',
            applicants: 0,
            completedBy: []
        },
        {
            companyId: '685cf74c5d6860e9e1b7bd08',
            companyType: 'Startup',
            projectId: 'PRJ-BF-002',
            title: 'CI/CD Pipeline Optimization Study',
            description: 'Research best practices for optimizing CI/CD pipelines in cloud environments.',
            industry: 'IT',
            projectType: 'Research',
            preferredSkills: ['CI/CD', 'DevOps', 'Jenkins', 'Data Analysis'],
            minExperienceRequired: 3,
            tasks: [
                { taskId: 'T1', taskName: 'Review existing CI/CD tools and frameworks', completed: false },
                { taskId: 'T2', taskName: 'Analyze pipeline performance metrics', completed: false },
                { taskId: 'T3', taskName: 'Interview DevOps engineers for insights', completed: false },
                { taskId: 'T4', taskName: 'Compile a report with optimization recommendations', completed: false }
            ],
            submissionDeadline: new Date('2025-12-01'),
            difficulty: 4,
            resources: [
                {
                    name: 'CI/CD Best Practices',
                    url: 'https://www.cloudbees.com/blog/ci-cd-best-practices',
                    description: 'Blog on effective CI/CD pipeline strategies.'
                },
                {
                    name: 'Jenkins Pipeline Tutorial',
                    url: 'https://www.youtube.com/watch?v=7KCS70sCoK0',
                    description: 'Video tutorial on setting up Jenkins pipelines.'
                }
            ],
            status: 'active',
            applicants: 0,
            completedBy: []
        },
        {
            companyId: '685cf74c5d6860e9e1b7bd08',
            companyType: 'Startup',
            projectId: 'PRJ-BF-003',
            title: 'Hybrid DevOps Monitoring Tool',
            description: 'Design and prototype a tool combining real-time monitoring with automated alerts.',
            industry: 'IT',
            projectType: 'Hybrid',
            preferredSkills: ['Node.js', 'Docker', 'Prometheus', 'UI/UX Design'],
            minExperienceRequired: 3,
            tasks: [
                { taskId: 'T1', taskName: 'Research monitoring tools like Prometheus', completed: false },
                { taskId: 'T2', taskName: 'Design UI for alert dashboard', completed: false },
                { taskId: 'T3', taskName: 'Build prototype with Node.js and Docker', completed: false },
                { taskId: 'T4', taskName: 'Test alert system with simulated data', completed: false }
            ],
            submissionDeadline: new Date('2025-12-15'),
            difficulty: 4,
            resources: [
                {
                    name: 'Prometheus Monitoring Guide',
                    url: 'https://prometheus.io/docs/introduction/overview/',
                    description: 'Official documentation for Prometheus monitoring.'
                },
                {
                    name: 'Docker for Beginners',
                    url: 'https://www.youtube.com/watch?v=3c-iBn73dDE',
                    description: 'Tutorial on using Docker for app deployment.'
                }
            ],
            status: 'active',
            applicants: 0,
            completedBy: []
        },
        // Quantum Stack (IT, Corporation)
        {
            companyId: '685cf74c5d6860e9e1b7bd09',
            companyType: 'Private',
            projectId: 'PRJ-QS-001',
            title: 'Quantum Algorithm Simulator Prototype',
            description: 'Create a prototype for a quantum algorithm simulation tool for educational use.',
            industry: 'IT',
            projectType: 'Prototype',
            preferredSkills: ['Python', 'Qiskit', 'JavaScript', 'UI Design'],
            minExperienceRequired: 3,
            tasks: [
                { taskId: 'T1', taskName: 'Design UI for algorithm visualization', completed: false },
                { taskId: 'T2', taskName: 'Implement quantum circuit logic with Qiskit', completed: false },
                { taskId: 'T3', taskName: 'Integrate frontend with simulation backend', completed: false },
                { taskId: 'T4', taskName: 'Test with sample quantum algorithms', completed: false }
            ],
            submissionDeadline: new Date('2025-11-30'),
            difficulty: 4,
            resources: [
                {
                    name: 'Qiskit Tutorials',
                    url: 'https://qiskit.org/learn',
                    description: 'Official Qiskit tutorials for quantum programming.'
                },
                {
                    name: 'Building Interactive UIs',
                    url: 'https://www.youtube.com/watch?v=7r4xVDI2vho',
                    description: 'Tutorial on creating interactive web UIs.'
                }
            ],
            status: 'active',
            applicants: 0,
            completedBy: []
        },
        {
            companyId: '685cf74c5d6860e9e1b7bd09',
            companyType: 'Private',
            projectId: 'PRJ-QS-002',
            title: 'Quantum Computing Scalability Study',
            description: 'Research scalability challenges in quantum computing for enterprise applications.',
            industry: 'IT',
            projectType: 'Research',
            preferredSkills: ['Quantum Computing', 'Data Analysis', 'Technical Writing'],
            minExperienceRequired: 4,
            tasks: [
                { taskId: 'T1', taskName: 'Review quantum computing hardware limitations', completed: false },
                { taskId: 'T2', taskName: 'Analyze enterprise use cases for quantum scalability', completed: false },
                { taskId: 'T3', taskName: 'Interview quantum computing experts', completed: false },
                { taskId: 'T4', taskName: 'Write a comprehensive scalability report', completed: false }
            ],
            submissionDeadline: new Date('2026-01-10'),
            difficulty: 5,
            resources: [
                {
                    name: 'Quantum Computing Challenges',
                    url: 'https://www.ibm.com/quantum/blog/quantum-computing-challenges',
                    description: 'Article on current quantum computing limitations.'
                },
                {
                    name: 'Introduction to Quantum Computing',
                    url: 'https://www.youtube.com/watch?v=F_Riqjdh2oM',
                    description: 'Video introduction to quantum computing concepts.'
                }
            ],
            status: 'active',
            applicants: 0,
            completedBy: []
        },
        {
            companyId: '685cf74c5d6860e9e1b7bd09',
            companyType: 'Private',
            projectId: 'PRJ-QS-003',
            title: 'Hybrid Quantum-Classical ML Model',
            description: 'Develop a hybrid quantum-classical machine learning model for optimization tasks.',
            industry: 'IT',
            projectType: 'Hybrid',
            preferredSkills: ['Python', 'Qiskit', 'TensorFlow', 'Machine Learning'],
            minExperienceRequired: 4,
            tasks: [
                { taskId: 'T1', taskName: 'Research quantum ML algorithms', completed: false },
                { taskId: 'T2', taskName: 'Design a hybrid model architecture', completed: false },
                { taskId: 'T3', taskName: 'Implement model with Qiskit and TensorFlow', completed: false },
                { taskId: 'T4', taskName: 'Test model on optimization datasets', completed: false }
            ],
            submissionDeadline: new Date('2026-01-20'),
            difficulty: 5,
            resources: [
                {
                    name: 'Quantum Machine Learning',
                    url: 'https://pennylane.ai/qml/whatisqml.html',
                    description: 'Guide to quantum machine learning concepts.'
                },
                {
                    name: 'TensorFlow Quantum Tutorial',
                    url: 'https://www.youtube.com/watch?v=5rHzk24v3kQ',
                    description: 'Tutorial on quantum ML with TensorFlow.'
                }
            ],
            status: 'active',
            applicants: 0,
            completedBy: []
        },
        // Finova Capital (Finance, Corporation)
        {
            companyId: '685cf74c5d6860e9e1b7bd0a',
            companyType: 'Private',
            projectId: 'PRJ-FC-001',
            title: 'Investment Portfolio Tracker Prototype',
            description: 'Build a prototype for a web-based portfolio tracker with real-time analytics.',
            industry: 'Finance',
            projectType: 'Prototype',
            preferredSkills: ['React', 'Node.js', 'MongoDB', 'Data Visualization'],
            minExperienceRequired: 3,
            tasks: [
                { taskId: 'T1', taskName: 'Design UI for portfolio dashboard', completed: false },
                { taskId: 'T2', taskName: 'Set up backend with Node.js', completed: false },
                { taskId: 'T3', taskName: 'Integrate real-time data feeds', completed: false },
                { taskId: 'T4', taskName: 'Test with sample investment data', completed: false }
            ],
            submissionDeadline: new Date('2025-11-20'),
            difficulty: 3,
            resources: [
                {
                    name: 'Building Financial Dashboards',
                    url: 'https://www.youtube.com/watch?v=6Y3Tq69oM4o',
                    description: 'Tutorial on creating financial dashboards with React.'
                },
                {
                    name: 'Node.js Backend for Finance Apps',
                    url: 'https://www.mongodb.com/developer/languages/javascript/building-financial-applications-nodejs/',
                    description: 'Guide to building finance apps with Node.js.'
                }
            ],
            status: 'active',
            applicants: 0,
            completedBy: []
        },
        {
            companyId: '685cf74c5d6860e9e1b7bd0a',
            companyType: 'Private',
            projectId: 'PRJ-FC-002',
            title: 'Market Risk Analysis Study',
            description: 'Conduct research on market risk factors affecting investment portfolios.',
            industry: 'Finance',
            projectType: 'Research',
            preferredSkills: ['Financial Analysis', 'Statistics', 'Python', 'Technical Writing'],
            minExperienceRequired: 4,
            tasks: [
                { taskId: 'T1', taskName: 'Review historical market data', completed: false },
                { taskId: 'T2', taskName: 'Analyze risk factors using Python', completed: false },
                { taskId: 'T3', taskName: 'Interview financial analysts for insights', completed: false },
                { taskId: 'T4', taskName: 'Compile a risk analysis report', completed: false }
            ],
            submissionDeadline: new Date('2025-12-10'),
            difficulty: 4,
            resources: [
                {
                    name: 'Financial Risk Management',
                    url: 'https://www.investopedia.com/articles/investing/101013/basics-financial-risk-management.asp',
                    description: 'Article on financial risk management techniques.'
                },
                {
                    name: 'Python for Financial Analysis',
                    url: 'https://www.youtube.com/watch?v=5rE6F8q3rI4',
                    description: 'Tutorial on using Python for financial analysis.'
                }
            ],
            status: 'active',
            applicants: 0,
            completedBy: []
        },
        {
            companyId: '685cf74c5d6860e9e1b7bd0a',
            companyType: 'Private',
            projectId: 'PRJ-FC-003',
            title: 'Hybrid Robo-Advisor Platform',
            description: 'Design and prototype a robo-advisor with automated and manual investment options.',
            industry: 'Finance',
            projectType: 'Hybrid',
            preferredSkills: ['Python', 'React', 'Machine Learning', 'UI Design'],
            minExperienceRequired: 3,
            tasks: [
                { taskId: 'T1', taskName: 'Research robo-advisor algorithms', completed: false },
                { taskId: 'T2', taskName: 'Design UI for investment options', completed: false },
                { taskId: 'T3', taskName: 'Implement basic ML model for recommendations', completed: false },
                { taskId: 'T4', taskName: 'Test prototype with sample portfolios', completed: false }
            ],
            submissionDeadline: new Date('2025-12-20'),
            difficulty: 4,
            resources: [
                {
                    name: 'Building a Robo-Advisor',
                    url: 'https://www.youtube.com/watch?v=9vM4kD1vDJo',
                    description: 'Tutorial on creating robo-advisors with Python.'
                },
                {
                    name: 'UI Design for Financial Apps',
                    url: 'https://uxdesign.cc/designing-financial-apps-8f6a6a3f7e3a',
                    description: 'Guide to designing user-friendly financial apps.'
                }
            ],
            status: 'active',
            applicants: 0,
            completedBy: []
        },
        // LedgerLogic (Finance, Startup)
        {
            companyId: '685cf74c5d6860e9e1b7bd0b',
            companyType: 'Startup',
            projectId: 'PRJ-LL-001',
            title: 'Blockchain Transaction Tracker Prototype',
            description: 'Create a prototype for a blockchain transaction monitoring tool.',
            industry: 'Finance',
            projectType: 'Prototype',
            preferredSkills: ['Solidity', 'React', 'Node.js', 'Web3.js'],
            minExperienceRequired: 2,
            tasks: [
                { taskId: 'T1', taskName: 'Design UI for transaction dashboard', completed: false },
                { taskId: 'T2', taskName: 'Set up Web3.js for blockchain integration', completed: false },
                { taskId: 'T3', taskName: 'Implement transaction tracking logic', completed: false },
                { taskId: 'T4', taskName: 'Test with sample blockchain data', completed: false }
            ],
            submissionDeadline: new Date('2025-11-10'),
            difficulty: 3,
            resources: [
                {
                    name: 'Web3.js Tutorial',
                    url: 'https://www.youtube.com/watch?v=2VqJ9vXh2cY',
                    description: 'Tutorial on using Web3.js for blockchain apps.'
                },
                {
                    name: 'Building Blockchain Apps',
                    url: 'https://www.dappuniversity.com/articles/web3-js',
                    description: 'Guide to building blockchain apps with Web3.js.'
                }
            ],
            status: 'active',
            applicants: 0,
            completedBy: []
        },
        {
            companyId: '685cf74c5d6860e9e1b7bd0b',
            companyType: 'Startup',
            projectId: 'PRJ-LL-002',
            title: 'Blockchain Security Research',
            description: 'Study security vulnerabilities in blockchain-based financial systems.',
            industry: 'Finance',
            projectType: 'Research',
            preferredSkills: ['Blockchain', 'Cybersecurity', 'Data Analysis'],
            minExperienceRequired: 3,
            tasks: [
                { taskId: 'T1', taskName: 'Review common blockchain vulnerabilities', completed: false },
                { taskId: 'T2', taskName: 'Analyze recent blockchain security breaches', completed: false },
                { taskId: 'T3', taskName: 'Interview blockchain security experts', completed: false },
                { taskId: 'T4', taskName: 'Write a security recommendations report', completed: false }
            ],
            submissionDeadline: new Date('2025-12-05'),
            difficulty: 4,
            resources: [
                {
                    name: 'Blockchain Security Guide',
                    url: 'https://www.consensys.io/diligence/blog/blockchain-security',
                    description: 'Article on securing blockchain applications.'
                },
                {
                    name: 'Blockchain Security Basics',
                    url: 'https://www.youtube.com/watch?v=3aX1zZ3v0Y0',
                    description: 'Video on blockchain security fundamentals.'
                }
            ],
            status: 'active',
            applicants: 0,
            completedBy: []
        },
        {
            companyId: '685cf74c5d6860e9e1b7bd0b',
            companyType: 'Startup',
            projectId: 'PRJ-LL-003',
            title: 'Hybrid Smart Contract Auditor',
            description: 'Develop a tool to audit smart contracts with automated and manual checks.',
            industry: 'Finance',
            projectType: 'Hybrid',
            preferredSkills: ['Solidity', 'JavaScript', 'Cybersecurity', 'UI Design'],
            minExperienceRequired: 3,
            tasks: [
                { taskId: 'T1', taskName: 'Research smart contract vulnerabilities', completed: false },
                { taskId: 'T2', taskName: 'Design UI for audit dashboard', completed: false },
                { taskId: 'T3', taskName: 'Implement automated audit logic', completed: false },
                { taskId: 'T4', taskName: 'Test tool with sample contracts', completed: false }
            ],
            submissionDeadline: new Date('2025-12-15'),
            difficulty: 4,
            resources: [
                {
                    name: 'Smart Contract Security',
                    url: 'https://consensys.github.io/smart-contract-best-practices/',
                    description: 'Best practices for securing smart contracts.'
                },
                {
                    name: 'Solidity Tutorial',
                    url: 'https://www.youtube.com/watch?v=ipwxYa-F1uY',
                    description: 'Tutorial on writing smart contracts with Solidity.'
                }
            ],
            status: 'active',
            applicants: 0,
            completedBy: []
        },
        // WealthBridge (Finance, Corporation)
        {
            companyId: '685cf74c5d6860e9e1b7bd0c',
            companyType: 'Private',
            projectId: 'PRJ-WB-001',
            title: 'Wealth Management App Prototype',
            description: 'Build a prototype for a mobile-friendly wealth management app.',
            industry: 'Finance',
            projectType: 'Prototype',
            preferredSkills: ['React Native', 'Node.js', 'MongoDB', 'UI/UX Design'],
            minExperienceRequired: 3,
            tasks: [
                { taskId: 'T1', taskName: 'Design mobile app UI', completed: false },
                { taskId: 'T2', taskName: 'Set up backend with Node.js', completed: false },
                { taskId: 'T3', taskName: 'Integrate portfolio tracking features', completed: false },
                { taskId: 'T4', taskName: 'Test app with sample users', completed: false }
            ],
            submissionDeadline: new Date('2025-11-25'),
            difficulty: 3,
            resources: [
                {
                    name: 'React Native Tutorial',
                    url: 'https://www.youtube.com/watch?v=0-S5a0eKi7k',
                    description: 'Tutorial on building mobile apps with React Native.'
                },
                {
                    name: 'UI/UX for Mobile Apps',
                    url: 'https://www.smashingmagazine.com/2021/06/mobile-app-ux-design/',
                    description: 'Guide to designing mobile app interfaces.'
                }
            ],
            status: 'active',
            applicants: 0,
            completedBy: []
        },
        {
            companyId: '685cf74c5d6860e9e1b7bd0c',
            companyType: 'Private',
            projectId: 'PRJ-WB-002',
            title: 'Client Advisory Trends Research',
            description: 'Study emerging trends in wealth management client advisory services.',
            industry: 'Finance',
            projectType: 'Research',
            preferredSkills: ['Financial Analysis', 'Market Research', 'Technical Writing'],
            minExperienceRequired: 4,
            tasks: [
                { taskId: 'T1', taskName: 'Review current advisory trends', completed: false },
                { taskId: 'T2', taskName: 'Survey clients on advisory preferences', completed: false },
                { taskId: 'T3', taskName: 'Analyze competitor advisory strategies', completed: false },
                { taskId: 'T4', taskName: 'Write a trends report', completed: false }
            ],
            submissionDeadline: new Date('2025-12-15'),
            difficulty: 4,
            resources: [
                {
                    name: 'Wealth Management Trends',
                    url: 'https://www2.deloitte.com/us/en/insights/industry/financial-services/wealth-management-trends.html',
                    description: 'Article on trends in wealth management.'
                },
                {
                    name: 'Market Research Techniques',
                    url: 'https://www.youtube.com/watch?v=3Qw6N2q7Y8Q',
                    description: 'Video on effective market research methods.'
                }
            ],
            status: 'active',
            applicants: 0,
            completedBy: []
        },
        {
            companyId: '685cf74c5d6860e9e1b7bd0c',
            companyType: 'Private',
            projectId: 'PRJ-WB-003',
            title: 'Hybrid Wealth Planning Tool',
            description: 'Develop a tool combining automated planning with advisor input.',
            industry: 'Finance',
            projectType: 'Hybrid',
            preferredSkills: ['Python', 'React', 'Machine Learning', 'UI Design'],
            minExperienceRequired: 3,
            tasks: [
                { taskId: 'T1', taskName: 'Research wealth planning algorithms', completed: false },
                { taskId: 'T2', taskName: 'Design UI for planning dashboard', completed: false },
                { taskId: 'T3', taskName: 'Implement automated planning logic', completed: false },
                { taskId: 'T4', taskName: 'Test tool with sample plans', completed: false }
            ],
            submissionDeadline: new Date('2025-12-20'),
            difficulty: 4,
            resources: [
                {
                    name: 'Building Financial Planning Tools',
                    url: 'https://www.youtube.com/watch?v=9vM4kD1vDJo',
                    description: 'Tutorial on creating financial planning tools.'
                },
                {
                    name: 'UI Design for Financial Apps',
                    url: 'https://uxdesign.cc/designing-financial-apps-8f6a6a3f7e3a',
                    description: 'Guide to designing user-friendly financial apps.'
                }
            ],
            status: 'active',
            applicants: 0,
            completedBy: []
        },
        // Shopnetic (Ecommerce, Startup)
        {
            companyId: '685cf74c5d6860e9e1b7bd0d',
            companyType: 'Startup',
            projectId: 'PRJ-SN-001',
            title: 'Personalized Shopping App Prototype',
            description: 'Create a prototype for a mobile app with personalized product recommendations.',
            industry: 'Ecommerce',
            projectType: 'Prototype',
            preferredSkills: ['React Native', 'Node.js', 'MongoDB', 'Machine Learning'],
            minExperienceRequired: 2,
            tasks: [
                { taskId: 'T1', taskName: 'Design mobile app UI', completed: false },
                { taskId: 'T2', taskName: 'Set up backend with Node.js', completed: false },
                { taskId: 'T3', taskName: 'Implement recommendation algorithm', completed: false },
                { taskId: 'T4', taskName: 'Test app with sample users', completed: false }
            ],
            submissionDeadline: new Date('2025-11-05'),
            difficulty: 3,
            resources: [
                {
                    name: 'React Native Ecommerce Tutorial',
                    url: 'https://www.youtube.com/watch?v=5f5k5z5z5zY',
                    description: 'Tutorial on building ecommerce apps with React Native.'
                },
                {
                    name: 'Recommendation Systems Guide',
                    url: 'https://www.towardsdatascience.com/recommendation-systems-a-review-3f5f5f5f5f5f',
                    description: 'Article on building recommendation systems.'
                }
            ],
            status: 'active',
            applicants: 0,
            completedBy: []
        },
        {
            companyId: '685cf74c5d6860e9e1b7bd0d',
            companyType: 'Startup',
            projectId: 'PRJ-SN-002',
            title: 'Ecommerce UX Research',
            description: 'Study user behavior to improve ecommerce platform usability.',
            industry: 'Ecommerce',
            projectType: 'Research',
            preferredSkills: ['User Research', 'Data Analysis', 'UX Design'],
            minExperienceRequired: 2,
            tasks: [
                { taskId: 'T1', taskName: 'Review current ecommerce UX trends', completed: false },
                { taskId: 'T2', taskName: 'Conduct user surveys on shopping habits', completed: false },
                { taskId: 'T3', taskName: 'Analyze user session data', completed: false },
                { taskId: 'T4', taskName: 'Write a UX improvement report', completed: false }
            ],
            submissionDeadline: new Date('2025-11-20'),
            difficulty: 3,
            resources: [
                {
                    name: 'Ecommerce UX Best Practices',
                    url: 'https://www.nngroup.com/articles/ecommerce-ux/',
                    description: 'Guide to ecommerce usability by Nielsen Norman Group.'
                },
                {
                    name: 'User Research Methods',
                    url: 'https://www.youtube.com/watch?v=3Qw6N2q7Y8Q',
                    description: 'Video on effective user research techniques.'
                }
            ],
            status: 'active',
            applicants: 0,
            completedBy: []
        },
        {
            companyId: '685cf74c5d6860e9e1b7bd0d',
            companyType: 'Startup',
            projectId: 'PRJ-SN-003',
            title: 'Hybrid Shopping Assistant',
            description: 'Develop a tool combining AI recommendations with manual search filters.',
            industry: 'Ecommerce',
            projectType: 'Hybrid',
            preferredSkills: ['JavaScript', 'React', 'Machine Learning', 'UI Design'],
            minExperienceRequired: 2,
            tasks: [
                { taskId: 'T1', taskName: 'Research AI recommendation algorithms', completed: false },
                { taskId: 'T2', taskName: 'Design UI for search and recommendations', completed: false },
                { taskId: 'T3', taskName: 'Implement hybrid search logic', completed: false },
                { taskId: 'T4', taskName: 'Test with sample product data', completed: false }
            ],
            submissionDeadline: new Date('2025-12-05'),
            difficulty: 3,
            resources: [
                {
                    name: 'Building Recommendation Systems',
                    url: 'https://www.towardsdatascience.com/recommendation-systems-a-review-3f5f5f5f5f5f',
                    description: 'Guide to creating recommendation systems.'
                },
                {
                    name: 'React for Ecommerce Apps',
                    url: 'https://www.youtube.com/watch?v=5f5k5z5z5zY',
                    description: 'Tutorial on building ecommerce apps with React.'
                }
            ],
            status: 'active',
            applicants: 0,
            completedBy: []
        },
        // CartVerse (Ecommerce, Corporation)
        {
            companyId: '685cf74c5d6860e9e1b7bd0e',
            companyType: 'Private',
            projectId: 'PRJ-CV-001',
            title: 'Sustainable Packaging Tracker Prototype',
            description: 'Create a prototype to track sustainable packaging usage in ecommerce.',
            industry: 'Ecommerce',
            projectType: 'Prototype',
            preferredSkills: ['React', 'Node.js', 'MongoDB', 'Data Visualization'],
            minExperienceRequired: 3,
            tasks: [
                { taskId: 'T1', taskName: 'Design UI for tracking dashboard', completed: false },
                { taskId: 'T2', taskName: 'Set up backend with Node.js', completed: false },
                { taskId: 'T3', taskName: 'Integrate packaging data tracking', completed: false },
                { taskId: 'T4', taskName: 'Test with sample supply chain data', completed: false }
            ],
            submissionDeadline: new Date('2025-11-15'),
            difficulty: 3,
            resources: [
                {
                    name: 'Building Dashboards with React',
                    url: 'https://www.youtube.com/watch?v=5yJ7e4v8W8M',
                    description: 'Tutorial on creating dashboards with React.'
                },
                {
                    name: 'Sustainable Ecommerce Practices',
                    url: 'https://www.shopify.com/blog/sustainable-ecommerce',
                    description: 'Guide to sustainable practices in ecommerce.'
                }
            ],
            status: 'active',
            applicants: 0,
            completedBy: []
        },
        {
            companyId: '685cf74c5d6860e9e1b7bd0e',
            companyType: 'Private',
            projectId: 'PRJ-CV-002',
            title: 'Sustainable Supply Chain Research',
            description: 'Study sustainable supply chain practices for ecommerce platforms.',
            industry: 'Ecommerce',
            projectType: 'Research',
            preferredSkills: ['Supply Chain Management', 'Data Analysis', 'Sustainability'],
            minExperienceRequired: 4,
            tasks: [
                { taskId: 'T1', taskName: 'Review sustainable supply chain trends', completed: false },
                { taskId: 'T2', taskName: 'Analyze supplier sustainability data', completed: false },
                { taskId: 'T3', taskName: 'Interview supply chain experts', completed: false },
                { taskId: 'T4', taskName: 'Write a sustainability report', completed: false }
            ],
            submissionDeadline: new Date('2025-12-10'),
            difficulty: 4,
            resources: [
                {
                    name: 'Sustainable Supply Chains',
                    url: 'https://www.mckinsey.com/business-functions/sustainability/our-insights/sustainability-in-supply-chains',
                    description: 'Article on sustainable supply chain strategies.'
                },
                {
                    name: 'Supply Chain Research Methods',
                    url: 'https://www.youtube.com/watch?v=3Qw6N2q7Y8Q',
                    description: 'Video on supply chain research techniques.'
                }
            ],
            status: 'active',
            applicants: 0,
            completedBy: []
        },
        {
            companyId: '685cf74c5d6860e9e1b7bd0e',
            companyType: 'Private',
            projectId: 'PRJ-CV-003',
            title: 'Hybrid Inventory Management Tool',
            description: 'Develop a tool for automated and manual inventory management in ecommerce.',
            industry: 'Ecommerce',
            projectType: 'Hybrid',
            preferredSkills: ['JavaScript', 'React', 'MongoDB', 'Supply Chain Management'],
            minExperienceRequired: 3,
            tasks: [
                { taskId: 'T1', taskName: 'Research inventory management systems', completed: false },
                { taskId: 'T2', taskName: 'Design UI for inventory dashboard', completed: false },
                { taskId: 'T3', taskName: 'Implement automated inventory tracking', completed: false },
                { taskId: 'T4', taskName: 'Test with sample inventory data', completed: false }
            ],
            submissionDeadline: new Date('2025-12-15'),
            difficulty: 4,
            resources: [
                {
                    name: 'Inventory Management Systems',
                    url: 'https://www.shopify.com/blog/inventory-management',
                    description: 'Guide to building inventory management systems.'
                },
                {
                    name: 'React for Ecommerce Apps',
                    url: 'https://www.youtube.com/watch?v=5f5k5z5z5zY',
                    description: 'Tutorial on building ecommerce apps with React.'
                }
            ],
            status: 'active',
            applicants: 0,
            completedBy: []
        },
        // BrandNest (Marketing, Startup)
        {
            companyId: '685cf74c5d6860e9e1b7bd0f',
            companyType: 'Startup',
            projectId: 'PRJ-BN-001',
            title: 'Social Media Campaign Tool Prototype',
            description: 'Create a prototype for a tool to manage social media campaigns.',
            industry: 'Marketing',
            projectType: 'Prototype',
            preferredSkills: ['React', 'Node.js', 'MongoDB', 'Social Media APIs'],
            minExperienceRequired: 2,
            tasks: [
                { taskId: 'T1', taskName: 'Design UI for campaign dashboard', completed: false },
                { taskId: 'T2', taskName: 'Integrate social media APIs', completed: false },
                { taskId: 'T3', taskName: 'Implement campaign scheduling logic', completed: false },
                { taskId: 'T4', taskName: 'Test with sample campaigns', completed: false }
            ],
            submissionDeadline: new Date('2025-11-10'),
            difficulty: 3,
            resources: [
                {
                    name: 'Social Media API Integration',
                    url: 'https://www.youtube.com/watch?v=5yJ7e4v8W8M',
                    description: 'Tutorial on integrating social media APIs.'
                },
                {
                    name: 'Building Marketing Tools',
                    url: 'https://www.hootsuite.com/resources/social-media-management-tools',
                    description: 'Guide to social media management tools.'
                }
            ],
            status: 'active',
            applicants: 0,
            completedBy: []
        },
        {
            companyId: '685cf74c5d6860e9e1b7bd0f',
            companyType: 'Startup',
            projectId: 'PRJ-BN-002',
            title: 'Social Media Engagement Research',
            description: 'Study strategies to boost engagement on social media platforms.',
            industry: 'Marketing',
            projectType: 'Research',
            preferredSkills: ['Social Media Marketing', 'Data Analysis', 'Content Strategy'],
            minExperienceRequired: 2,
            tasks: [
                { taskId: 'T1', taskName: 'Review social media engagement trends', completed: false },
                { taskId: 'T2', taskName: 'Analyze engagement metrics', completed: false },
                { taskId: 'T3', taskName: 'Interview social media managers', completed: false },
                { taskId: 'T4', taskName: 'Write an engagement strategy report', completed: false }
            ],
            submissionDeadline: new Date('2025-11-25'),
            difficulty: 3,
            resources: [
                {
                    name: 'Social Media Engagement Guide',
                    url: 'https://sproutsocial.com/insights/social-media-engagement/',
                    description: 'Article on boosting social media engagement.'
                },
                {
                    name: 'Social Media Analytics',
                    url: 'https://www.youtube.com/watch?v=3Qw6N2q7Y8Q',
                    description: 'Video on analyzing social media metrics.'
                }
            ],
            status: 'active',
            applicants: 0,
            completedBy: []
        },
        {
            companyId: '685cf74c5d6860e9e1b7bd0f',
            companyType: 'Startup',
            projectId: 'PRJ-BN-003',
            title: 'Hybrid Content Scheduler',
            description: 'Develop a tool for automated and manual social media content scheduling.',
            industry: 'Marketing',
            projectType: 'Hybrid',
            preferredSkills: ['JavaScript', 'React', 'Social Media APIs', 'UI Design'],
            minExperienceRequired: 2,
            tasks: [
                { taskId: 'T1', taskName: 'Research social media scheduling tools', completed: false },
                { taskId: 'T2', taskName: 'Design UI for scheduling dashboard', completed: false },
                { taskId: 'T3', taskName: 'Implement automated scheduling logic', completed: false },
                { taskId: 'T4', taskName: 'Test with sample content', completed: false }
            ],
            submissionDeadline: new Date('2025-12-05'),
            difficulty: 3,
            resources: [
                {
                    name: 'Building Social Media Tools',
                    url: 'https://www.hootsuite.com/resources/social-media-management-tools',
                    description: 'Guide to social media management tools.'
                },
                {
                    name: 'React for Marketing Apps',
                    url: 'https://www.youtube.com/watch?v=5f5k5z5z5zY',
                    description: 'Tutorial on building apps with React.'
                }
            ],
            status: 'active',
            applicants: 0,
            completedBy: []
        },
        // Marqly (Marketing, Corporation)
        {
            companyId: '685cf74c5d6860e9e1b7bd10',
            companyType: 'Private',
            projectId: 'PRJ-MQ-001',
            title: 'Ad Campaign Analytics Prototype',
            description: 'Create a prototype for a tool to analyze ad campaign performance.',
            industry: 'Marketing',
            projectType: 'Prototype',
            preferredSkills: ['React', 'Node.js', 'MongoDB', 'Data Visualization'],
            minExperienceRequired: 3,
            tasks: [
                { taskId: 'T1', taskName: 'Design UI for analytics dashboard', completed: false },
                { taskId: 'T2', taskName: 'Set up backend with Node.js', completed: false },
                { taskId: 'T3', taskName: 'Integrate ad performance metrics', completed: false },
                { taskId: 'T4', taskName: 'Test with sample ad data', completed: false }
            ],
            submissionDeadline: new Date('2025-11-15'),
            difficulty: 3,
            resources: [
                {
                    name: 'Building Analytics Dashboards',
                    url: 'https://www.youtube.com/watch?v=5yJ7e4v8W8M',
                    description: 'Tutorial on creating dashboards with React.'
                },
                {
                    name: 'Ad Campaign Analytics Guide',
                    url: 'https://www.hubspot.com/marketing-statistics',
                    description: 'Guide to analyzing ad campaign performance.'
                }
            ],
            status: 'active',
            applicants: 0,
            completedBy: []
        },
        {
            companyId: '685cf74c5d6860e9e1b7bd10',
            companyType: 'Private',
            projectId: 'PRJ-MQ-002',
            title: 'Digital Advertising Trends Research',
            description: 'Study emerging trends in digital advertising strategies.',
            industry: 'Marketing',
            projectType: 'Research',
            preferredSkills: ['Digital Marketing', 'Data Analysis', 'Market Research'],
            minExperienceRequired: 3,
            tasks: [
                { taskId: 'T1', taskName: 'Review digital advertising trends', completed: false },
                { taskId: 'T2', taskName: 'Analyze ad performance data', completed: false },
                { taskId: 'T3', taskName: 'Interview marketing professionals', completed: false },
                { taskId: 'T4', taskName: 'Write a trends report', completed: false }
            ],
            submissionDeadline: new Date('2025-12-10'),
            difficulty: 4,
            resources: [
                {
                    name: 'Digital Advertising Trends',
                    url: 'https://www.forbes.com/sites/forbesagencycouncil/2023/01/10/digital-advertising-trends-to-watch/',
                    description: 'Article on digital advertising trends.'
                },
                {
                    name: 'Market Research Techniques',
                    url: 'https://www.youtube.com/watch?v=3Qw6N2q7Y8Q',
                    description: 'Video on effective market research methods.'
                }
            ],
            status: 'active',
            applicants: 0,
            completedBy: []
        },
        {
            companyId: '685cf74c5d6860e9e1b7bd10',
            companyType: 'Private',
            projectId: 'PRJ-MQ-003',
            title: 'Hybrid Ad Optimization Tool',
            description: 'Develop a tool for automated and manual ad campaign optimization.',
            industry: 'Marketing',
            projectType: 'Hybrid',
            preferredSkills: ['JavaScript', 'React', 'Data Analysis', 'UI Design'],
            minExperienceRequired: 3,
            tasks: [
                { taskId: 'T1', taskName: 'Research ad optimization algorithms', completed: false },
                { taskId: 'T2', taskName: 'Design UI for optimization dashboard', completed: false },
                { taskId: 'T3', taskName: 'Implement automated optimization logic', completed: false },
                { taskId: 'T4', taskName: 'Test with sample ad campaigns', completed: false }
            ],
            submissionDeadline: new Date('2025-12-15'),
            difficulty: 4,
            resources: [
                {
                    name: 'Ad Optimization Strategies',
                    url: 'https://www.wordstream.com/blog/ws/2022/08/10/ad-optimization',
                    description: 'Guide to optimizing ad campaigns.'
                },
                {
                    name: 'React for Marketing Apps',
                    url: 'https://www.youtube.com/watch?v=5f5k5z5z5zY',
                    description: 'Tutorial on building apps with React.'
                }
            ],
            status: 'active',
            applicants: 0,
            completedBy: []
        }
    ];

    try {
        const insertedProjects = await Project.insertMany(projects);
        console.log('Inserted projects:', insertedProjects);
        insertedProjects.forEach(p => console.log('Project _id:', p._id.toString()));
    } catch (err) {
        console.error('Error inserting projects:', err);
    } finally {
        mongoose.connection.close();
    }
})();