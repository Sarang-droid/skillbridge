const express = require('express');
const router = express.Router();
const { matchCandidates } = require('../controllers/matchController'); // Ensure matchController is correctly imported

// Ensure matchCandidates is a valid function
if (typeof matchCandidates !== 'function') {
    throw new Error('matchCandidates is not a function');
}

router.get('/match', matchCandidates); // This should be a valid function

module.exports = router;
