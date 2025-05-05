const jwt = require('jsonwebtoken');
const User = require('../models/user');

const protect = async (req, res, next) => {
    console.log('Protect middleware triggered:', req.headers);

    // Skip authentication for static assets and specific paths
    if (req.path.startsWith('/assets') || req.path === '/company.js') {
        console.log('Skipping authentication for path:', req.path);
        return next();
    }

    try {
        const token = req.headers.authorization?.split(' ')[1];
        console.log('Token:', token);

        if (!token) {
            console.error('No token provided in request');
            return res.status(401).json({ 
                message: 'Access denied. No token provided.',
                code: 'NO_TOKEN'
            });
        }

        // Verify JWT and decode it
        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        console.log('Decoded token:', decoded);

        // Fetch user from database with required fields
        const user = await User.findById(decoded.id).select('_id name email');
        if (!user) {
            console.error('User not found for ID:', decoded.id);
            return res.status(404).json({ 
                message: 'User not found.',
                code: 'USER_NOT_FOUND'
            });
        }

        // Populate req.user
        req.user = {
            _id: user._id,
            name: user.name,
            email: user.email
        };
        console.log('User set in req.user:', req.user);

        next();
    } catch (error) {
        console.error('Token verification error:', error.message);
        console.error('Error stack:', error.stack);

        if (error.name === 'TokenExpiredError') {
            console.warn('Token has expired');
            return res.status(401).json({
                message: 'Token has expired. Please refresh your token or log in again.',
                code: 'TOKEN_EXPIRED'
            });
        } else if (error.name === 'JsonWebTokenError') {
            console.error('Invalid token received:', token);
            return res.status(401).json({ 
                message: 'Invalid token. Please log in again.',
                code: 'INVALID_TOKEN'
            });
        }

        console.error('Unexpected error during token verification:', error);
        return res.status(500).json({
            message: 'Internal server error during authentication',
            code: 'AUTH_ERROR',
            error: error.message
        });
    }
};

const isAdmin = (req, res, next) => {
    if (!req.user || !req.user.isAdmin) {
        console.error('Admin access denied for user:', req.user);
        return res.status(403).json({ 
            message: 'Access denied. Admin privileges required.',
            code: 'ADMIN_REQUIRED'
        });
    }
    console.log('Admin access granted for user:', req.user);
    next();
};

console.log('Auth middleware loaded');

module.exports = { protect, isAdmin };