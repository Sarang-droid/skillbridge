document.addEventListener("DOMContentLoaded", function() {
    const projectsContainer = document.getElementById('projects-container');
    
    // Extract companyId from the URL path (e.g., /company/67d933ab0f4d75fd55de7159)
    const pathSegments = window.location.pathname.split('/');
    const companyId = pathSegments[pathSegments.length - 1]; // Last segment is the companyId
    console.log('Company ID:', companyId);
    
    // Check if the companyId is valid (24-character hexadecimal for MongoDB ObjectId)
    if (!companyId || !/^[0-9a-fA-F]{24}$/.test(companyId)) {
        projectsContainer.innerHTML = '<p>Invalid company ID. Please provide a valid company ID.</p>';
        console.error('Invalid company ID:', companyId);
        return;
    }

    const accessToken = localStorage.getItem('accessToken'); // Retrieve token from storage

    if (!accessToken) {
        projectsContainer.innerHTML = '<p>Please log in to view projects.</p>';
        console.error('No access token found.');
        return;
    }

    // Fetch projects from the server with Authorization header
    console.log('Fetching projects for company:', companyId);
    console.log('Access Token:', accessToken);
    fetch(`/api/company/projects?companyId=${encodeURIComponent(companyId)}`, {
        method: 'GET',
        headers: {
            'Authorization': `Bearer ${accessToken}`,
            'Content-Type': 'application/json'
        }
    })
    .then(response => {
        console.log('Response status:', response.status);
        if (!response.ok) {
            throw new Error(`HTTP error! Status: ${response.status}`);
        }
        return response.json();
    })
    .then(projects => {
        console.log('Received projects:', projects);
        if (!Array.isArray(projects)) {
            projectsContainer.innerHTML = '<p>Error loading projects.</p>';
            console.error('Expected an array but got:', projects);
            return;
        }

        if (projects.length === 0) {
            projectsContainer.innerHTML = '<p>No projects available.</p>';
            return;
        }

        // Populate the projects container with project cards
        projects.forEach(project => {
            const projectCard = document.createElement('div');
            projectCard.className = 'project-card';
            projectCard.innerHTML = `
                <div class="project-title">${project.title}</div>
                <div class="project-description">${project.description}</div>
                <div class="project-details">
                    Deadline: ${new Date(project.submissionDeadline).toLocaleDateString()}<br>
                    Applicants: ${project.applicants}
                </div>
                <button class="start-project" data-project-id="${project._id}">Start Project</button>
            `;
            projectsContainer.appendChild(projectCard);
        });

        // Event listener for 'Start Project' button click
        projectsContainer.addEventListener('click', function(e) {
            if (e.target.classList.contains('start-project')) {
                const projectId = e.target.getAttribute('data-project-id');
                
                // Debugging: Log the projectId
                console.log('Starting project with ID:', projectId);
                
                if (!projectId) {
                    console.error('Project ID is missing!');
                    return;
                }

                // Redirect to the workspace page with the projectId and companyId in the query string
                const redirectUrl = `/workspace?projectId=${encodeURIComponent(projectId)}&companyId=${encodeURIComponent(companyId)}`;
                console.log('Redirecting to:', redirectUrl); // Debugging: Log the redirect URL
                window.location.href = redirectUrl;
            }
        });
    })
    .catch(error => {
        console.error('Error fetching projects:', error.message, error.stack);
        projectsContainer.innerHTML = `<p>Error loading projects: ${error.message}</p>`;
    });
});