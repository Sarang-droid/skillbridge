// C:\Users\saran\sb-vr-5\routes\registerRoutes.js

const express = require('express');
const router = express.Router();
const { registerUser } = require('../controllers/authController'); // Corrected path

// Route to handle user registration
// This now points to the secure registration logic in authController
router.post('/', registerUser);

module.exports = router;
