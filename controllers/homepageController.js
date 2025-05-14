const mongoose = require('mongoose');
const Company = require('../models/company');
const Project = require('../models/project'); 

exports.getCompanies = async (req, res) => {
    const searchQuery = req.query.search || '';
    const industry = req.query.industry || '';
    console.log("Raw Industry Value:", JSON.stringify(industry)); // Log exact value with quotes
    console.log("Search Query:", searchQuery);
    console.log("Industry Filter:", industry);

    try {
        let query = {};
        if (searchQuery) {
            query.name = { $regex: searchQuery, $options: 'i' };
        }
        if (industry) {
            query.industry = industry.trim(); // Remove leading/trailing whitespace
        }
        console.log("Database Query:", query);
        const companies = await Company.find(query).lean();
        console.log("Fetched Companies:", companies);
        res.status(200).json(companies);
    } catch (error) {
        console.error("Error fetching companies:", error);
        res.status(500).json({ error: 'Internal server error' });
    }
};

exports.getProjects = async (req, res) => {
    const companyId = req.query.companyId;

    console.log("Received companyId:", companyId);

    if (!companyId) {
        return res.status(400).json({ error: "Company ID is required." });
    }

    try {
        const projects = await Project.find({ companyId: companyId }).populate('companyId', 'name');
        console.log("Found projects:", projects);
        res.status(200).json(projects);
    } catch (error) {
        console.error("Error fetching projects:", error);
        res.status(500).json({ error: 'Internal server error', details: error.message });
    }
};

exports.getSuggestions = async (req, res) => {
    const searchQuery = req.query.search || '';

    try {
        const companies = await Company.find({
            name: { $regex: searchQuery, $options: 'i' }
        }).limit(10).lean();
        res.status(200).json(companies);
    } catch (error) {
        console.error("Error fetching suggestions:", error);
        res.status(500).json({ error: 'Internal server error' });
    }
};
