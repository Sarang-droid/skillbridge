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
        // Check for token in Authorization header or cookies
        let token = req.headers.authorization?.split(' ')[1];
        if (!token && req.cookies && req.cookies.token) {
            token = req.cookies.token;
        }
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
            return res.status(401).json({ 
                message: 'User not found or session expired. Please log in again.',
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

        // Return 401 for all token-related errors
        return res.status(401).json({
            message: error.name === 'TokenExpiredError' 
                ? 'Token has expired. Please log in again.' 
                : 'Invalid token. Please log in again.',
            code: error.name === 'TokenExpiredError' ? 'TOKEN_EXPIRED' : 'INVALID_TOKEN'
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