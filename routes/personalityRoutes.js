const express = require('express');
const router = express.Router();

const MBTIController = require('../controllers/MBTIController'); // Import MBTIController

// Define routes for the personality test

router.get('/test', (req, res) => {
    res.send('Personality test endpoint');
});

router.get('/results/:token', MBTIController.getResult); // Route to get MBTI results


router.post('/submit', MBTIController.storeResult); // Route to submit MBTI test answers



module.exports = router;
