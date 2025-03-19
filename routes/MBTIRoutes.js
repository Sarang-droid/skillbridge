const express = require('express');
const router = express.Router();
const MBTIController = require('../controllers/MBTIController');

// Debugging: Log the MBTIController to ensure it's correct
console.log('MBTIController:', MBTIController);

// Route to submit MBTI test answers and get the result
router.post('/submit', MBTIController.storeResult); // Route to submit MBTI test answers

// Route to retrieve MBTI result using a token
router.get('/result/:token', MBTIController.getResult);

module.exports = router;
