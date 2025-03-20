const express = require('express');
const mongoose = require('mongoose');
const bodyParser = require('body-parser');
const cors = require('cors');
const session = require('express-session');
const WebSocket = require('ws');
const cookieParser = require('cookie-parser');
const path = require('path');
require('dotenv').config();

const { protect } = require('./middleware/authMiddleware');

const authRoutes = require('./routes/authRoutes');
const companyRoutes = require('./routes/companyRoutes');
const notificationRoutes = require('./routes/notificationRoutes');
const profileRoutes = require('./routes/profileRoutes');
const qaRoutes = require('./routes/qaRoutes');
const registerRoutes = require('./routes/registerRoutes');
const settingsRoutes = require('./routes/settingsRoutes');
const workspaceRoutes = require('./routes/workspaceRoutes');
const homepageRoutes = require('./routes/homepageRoutes');
const projectRoutes = require('./routes/projectRoutes');
const evaluationRoutes = require('./routes/evaluationRoutes');
const mbtiRoutes = require('./routes/MBTIRoutes');
const matchRoutes = require('./routes/matchRoutes');
const badgeRoutes = require('./routes/badgeRoutes');
const personalityRoutes = require('./routes/personalityRoutes');

const app = express();
const PORT = process.env.PORT || 5000;

const corsOptions = {
    origin: ['http://localhost:3000', 'http://127.0.0.1:3000'],
    methods: ['GET', 'POST', 'PUT', 'DELETE'],
    allowedHeaders: ['Content-Type', 'Authorization'],
    credentials: true,
};
app.use(cors(corsOptions));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(cookieParser());
app.use(
    session({
        secret: process.env.SESSION_SECRET || 'your_secret',
        resave: false,
        saveUninitialized: true,
    })
);

app.use((req, res, next) => {
    console.log(`Received request for: ${req.url}`);
    next();
});

// Serve static files
app.use('/assets', express.static(path.join(__dirname, 'assets')));
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));

// MongoDB Connection with Debugging
console.log('MONGO_URI loaded:', process.env.MONGO_URI); // Verify URI
if (!process.env.MONGO_URI) {
    console.error('MONGO_URI is not defined in .env file');
    process.exit(1);
}

mongoose.connect(process.env.MONGO_URI, {
    serverSelectionTimeoutMS: 10000,
    socketTimeoutMS: 45000,
    family: 4,
    maxPoolSize: 10,
    minPoolSize: 5,
    connectTimeoutMS: 10000,
    heartbeatFrequencyMS: 10000
})
.then(() => {
    console.log('Connected to MongoDB:', mongoose.connection.name);
    mongoose.connection.on('error', err => {
        console.error('MongoDB connection error:', err);
    });
    mongoose.connection.on('disconnected', () => {
        console.log('MongoDB disconnected. Attempting to reconnect...');
    });
})
.catch((error) => {
    console.error('MongoDB connection error:', error);
    process.exit(1);
});

// Routes
app.use('/api/auth', authRoutes);
app.use('/api/company', protect, companyRoutes);
app.use('/api/notification', notificationRoutes);
app.use('/api/profile', profileRoutes);
app.use('/api/qa', qaRoutes);
app.use('/api/register', registerRoutes);
app.use('/api/settings', settingsRoutes);
app.use('/api/workspace', workspaceRoutes);
app.use('/api/homepage', homepageRoutes);
app.use('/api/projects', projectRoutes);
app.use('/api/evaluation', evaluationRoutes);
app.use('/api/matches', matchRoutes);
app.use('/api/badges', badgeRoutes);
app.use('/api/mbti', mbtiRoutes);
app.use('/api/personality', personalityRoutes);

const pages = ['/', '/homepage', '/profile', '/register', '/login', '/settings', '/notification', '/personality', '/result'];
pages.forEach((route) => {
    app.get(route, (req, res) => {
        res.sendFile(path.join(__dirname, `assets${route === '/' ? '/register' : route}.html`));
    });
});

app.get('/workspace', (req, res) => {
    res.sendFile(path.join(__dirname, 'assets/workspace.html'));
});
app.get('/company/:id', (req, res) => {
    res.sendFile(path.join(__dirname, 'assets/company.html'));
});

const server = app.listen(PORT, () => {
    console.log(`Server is running on http://localhost:${PORT}`);
});

const wss = new WebSocket.Server({ server });
wss.on('connection', (ws) => {
    console.log('New WebSocket connection established');
    ws.on('message', (message) => {
        console.log('Received message:', message);
        ws.send(`Echo: ${message}`);
    });
    ws.on('close', () => {
        console.log('WebSocket connection closed');
    });
    ws.send('Welcome to the WebSocket server!');
});