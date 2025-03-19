const express = require('express');
const router = express.Router();
const homepageController = require('../controllers/homepageController');

// Route to get companies with optional search and industry filters
router.get('/companies', homepageController.getCompanies);

// Route to get projects for a specific company
router.get('/projects', homepageController.getProjects);

// Route to get search suggestions
router.get('/suggestions', homepageController.getSuggestions);

module.exports = router;
