const mongoose = require('mongoose');
const Project = require('../models/project');

exports.getCompanyProjects = async (req, res) => {
    const { companyId, projectId } = req.query;  // Extract companyId and projectId from query params

    // Log the incoming request details for debugging
    console.log(`Received request for company projects: companyId = ${companyId}, projectId = ${projectId}`);

    // Validate companyId
    if (!companyId || !mongoose.Types.ObjectId.isValid(companyId)) {
        console.error(`Invalid company ID format: ${companyId}`);
        return res.status(400).json({ message: 'Invalid company ID' });
    }

    // Convert companyId to ObjectId for querying
    const companyObjectId = new mongoose.Types.ObjectId(companyId);

    try {
        // Construct the query
        let query = { companyId: companyObjectId };
        
        // Add projectId to query if provided
        if (projectId) {
            // First try to find by MongoDB _id if it's a valid ObjectId
            if (mongoose.Types.ObjectId.isValid(projectId)) {
                query.$or = [
                    { _id: new mongoose.Types.ObjectId(projectId) },
                    { projectId: projectId }
                ];
            } else {
                // If not a valid ObjectId, search by projectId string
                query.projectId = projectId;
            }
        }

        console.log("Constructed query:", query);

        // Fetch projects from the database
        const projects = await Project.find(query)
            .populate('companyId', 'name')
            .populate('completedBy', 'name email'); // Also populate user details if needed

        // Log the number of projects found
        console.log(`Projects found: ${projects.length}`);

        if (!projects || projects.length === 0) {
            console.warn(`No projects found for company ID: ${companyId}`);
            return res.status(404).json({ message: 'No projects found for this company' });
        }

        // Send the response with the project data
        res.status(200).json(projects);
        console.log("Successfully returned projects data");

    } catch (error) {
        // Log any error that occurs during the fetch process
        console.error('Error fetching projects:', error);
        res.status(500).json({ message: 'Internal server error', error: error.message });
    }
};
