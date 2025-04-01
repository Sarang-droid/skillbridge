const express = require('express');
const router = express.Router();
const PilotCompany = require('../models/pilotCompany');

router.post('/join', async (req, res) => {
    const { name, company, email, industry } = req.body;

    try {
        const newPilotCompany = new PilotCompany({ name, company, email, industry });
        await newPilotCompany.save();
        res.status(201).json({ message: 'Successfully joined pilot program' });
    } catch (error) {
        console.error('Error saving pilot company:', error);
        res.status(500).json({ message: 'Server error' });
    }
});

module.exports = router;