const multer = require('multer');
const path = require('path');
const fs = require('fs');

// Ensure upload directory exists
const ensureDirectoryExists = (dir) => {
    if (!fs.existsSync(dir)) {
        fs.mkdirSync(dir, { recursive: true });
        console.log(`Directory created: ${dir}`);
    }
};

// Base upload directory
const BASE_UPLOAD_DIR = path.join(__dirname, '../uploads');

// Storage configuration for profile pictures
const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        const uploadPath = path.join(BASE_UPLOAD_DIR, 'profile-pictures');
        ensureDirectoryExists(uploadPath);
        cb(null, uploadPath);
    },
    filename: (req, file, cb) => {
        const ext = path.extname(file.originalname);
        cb(null, `${req.user._id}-${Date.now()}${ext}`); // Unique filename based on user ID
    },
});

// File filter for profile picture uploads
const fileFilter = (req, file, cb) => {
    const allowedImageTypes = /jpeg|jpg|png/;
    const extname = allowedImageTypes.test(path.extname(file.originalname).toLowerCase());
    const mimetype = allowedImageTypes.test(file.mimetype);

    if (extname && mimetype) {
        cb(null, true);
    } else {
        cb(new Error('Invalid file type. Allowed types: jpeg, jpg, png'));
    }
};

// Middleware for profile picture uploads
const profilePictureUpload = multer({
    storage,
    limits: { fileSize: 1024 * 1024 * 2 }, // 2 MB size limit
    fileFilter,
});

// Utility to handle Multer errors
const handleMulterErrors = (err, req, res, next) => {
    if (err instanceof multer.MulterError) {
        return res.status(400).json({ message: err.message });
    } else if (err) {
        return res.status(400).json({ message: err.message });
    }
    next();
};

module.exports = {
    profilePictureUpload,
    handleMulterErrors
};