document.addEventListener("DOMContentLoaded", () => {
    console.log("DOM fully loaded and parsed");

    const searchForm = document.getElementById('searchForm');
    const searchInput = document.getElementById('searchInput');
    const suggestionsContainer = document.getElementById('suggestionsContainer');
    const clearButton = document.getElementById('clearButton');
    const industryFilter = document.getElementById('industryFilter');

    if (searchForm && searchInput && suggestionsContainer && industryFilter && clearButton) {
        const handleInputDebounced = debounce(handleInput, 300);
        searchInput.addEventListener('input', handleInputDebounced);
        searchForm.addEventListener('submit', fetchCompanies);
        industryFilter.addEventListener('change', fetchCompanies);
        clearButton.addEventListener('click', clearSearch);
        searchInput.addEventListener('keydown', handleKeyDown);
        searchInput.focus();
    } else {
        console.error("Required elements not found.");
        return;
    }

    fetchCompanyCards();
    checkNotifications();
    const notificationInterval = setInterval(checkNotifications, 60000);
});

// Debounce function to limit API calls
function debounce(func, delay) {
    let timeout;
    return function (...args) {
        clearTimeout(timeout);
        timeout = setTimeout(() => func.apply(this, args), delay);
    };
}

// Handle input for autocomplete suggestions (Companies Only)
async function handleInput(event) {
    const query = event.target.value.trim();
    const suggestionsContainer = document.getElementById('suggestionsContainer');

    if (query.length === 0) {
        clearSuggestions();
        return;
    }

    try {
        const response = await fetch(`/api/homepage/companies?search=${encodeURIComponent(query)}`);
        if (!response.ok) {
            throw new Error(`HTTP error! Status: ${response.status}`);
        }
        const companies = await response.json();
        displaySuggestions(companies, query);
    } catch (error) {
        console.error("Error fetching suggestions:", error);
        displayError("Failed to fetch suggestions. Please try again.");
    }
}

// Display company suggestions (limit to 5 for performance)
function displaySuggestions(companies, query) {
    const container = document.getElementById('suggestionsContainer');
    container.innerHTML = '';

    if (!companies || companies.length === 0) {
        container.innerHTML = '<div class="suggestion-item">No companies found</div>';
        return;
    }

    companies.slice(0, 5).forEach((company, index) => {
        const suggestionItem = document.createElement('div');
        suggestionItem.classList.add('suggestion-item');
        suggestionItem.innerHTML = highlightMatch(company.name || 'Unknown Company', query);
        suggestionItem.addEventListener('click', () => {
            document.getElementById('searchInput').value = company.name || '';
            clearSuggestions();
            fetchCompanies();
        });

        if (index === 0) {
            suggestionItem.classList.add('selected');
        }
        container.appendChild(suggestionItem);
    });
}

// Highlight matching text
function highlightMatch(text, query) {
    const regex = new RegExp(`(${query})`, 'gi');
    return text.replace(regex, '<span class="highlight">$1</span>');
}

// Clear suggestions
function clearSuggestions() {
    document.getElementById('suggestionsContainer').innerHTML = '';
}

// Clear search input and suggestions
function clearSearch() {
    document.getElementById('searchInput').value = '';
    document.getElementById('industryFilter').value = '';
    clearSuggestions();
    fetchCompanyCards();
}

// Keyboard navigation for suggestions
function handleKeyDown(event) {
    const suggestions = document.querySelectorAll('.suggestion-item');
    if (suggestions.length === 0) return;

    let selected = document.querySelector('.suggestion-item.selected');

    if (event.key === 'ArrowDown') {
        event.preventDefault();
        if (selected) {
            selected.classList.remove('selected');
            selected = selected.nextElementSibling || suggestions[0];
        } else {
            selected = suggestions[0];
        }
        selected.classList.add('selected');
    } else if (event.key === 'ArrowUp') {
        event.preventDefault();
        if (selected) {
            selected.classList.remove('selected');
            selected = selected.previousElementSibling || suggestions[suggestions.length - 1];
        } else {
            selected = suggestions[suggestions.length - 1];
        }
        selected.classList.add('selected');
    } else if (event.key === 'Enter' && selected) {
        event.preventDefault();
        document.getElementById('searchInput').value = selected.textContent;
        clearSuggestions();
        fetchCompanies();
    }
}

// Fetch companies based on search query
async function fetchCompanies(event) {
    if (event) event.preventDefault();

    const searchQuery = document.getElementById('searchInput').value.trim();
    const industry = document.getElementById('industryFilter').value;
    const container = document.getElementById('companyCardsContainer');
    container.innerHTML = '<div class="loading">Loading companies...</div>';

    let apiUrl = '/api/homepage/companies';
    let params = [];
    if (searchQuery) {
        params.push(`search=${encodeURIComponent(searchQuery)}`);
    }
    if (industry) {
        params.push(`industry=${encodeURIComponent(industry)}`);
    }
    if (params.length > 0) {
        apiUrl += `?${params.join('&')}`;
    }

    console.log("Fetching from URL:", apiUrl);

    try {
        const response = await fetch(apiUrl);
        if (!response.ok) {
            throw new Error(`HTTP error! Status: ${response.status}`);
        }
        const companies = await response.json();
        console.log("Fetched companies:", companies);
        renderCompanyCards(companies);
    } catch (error) {
        console.error("Error fetching companies:", error);
        container.innerHTML = '<div class="error">Failed to load companies. Please check your connection and try again.</div>';
    }
}

// Render company cards
function renderCompanyCards(companies) {
    const container = document.getElementById('companyCardsContainer');

    if (!container) {
        console.error("Element with ID 'companyCardsContainer' not found.");
        return;
    }

    container.innerHTML = '';

    if (!companies || companies.length === 0) {
        container.innerHTML = '<p>No companies found.</p>';
        return;
    }

    companies.forEach(company => {
        if (!company || !company._id) return;

        const card = document.createElement('div');
        card.classList.add('company-card');

        const title = document.createElement('h3');
        title.textContent = company.name || 'Unknown Company';

        const description = document.createElement('p');
        description.textContent = `Description: ${company.description || 'No description available'}`;

        const applicants = document.createElement('p');
        applicants.textContent = `Total Applicants: ${company.totalApplicants || 0}`;

        const button = document.createElement('button');
        button.textContent = 'View Projects';
        button.addEventListener('click', () => viewCompanyProjects(company._id));

        card.appendChild(title);
        card.appendChild(description);
        card.appendChild(applicants);
        card.appendChild(button);

        container.appendChild(card);
    });
}

// Fetch and display projects for a company
async function viewCompanyProjects(companyId) {
    if (!companyId) {
        console.error("Invalid company ID");
        displayError("Invalid company ID");
        return;
    }
    console.log(`Fetching projects for company ID: ${companyId}`);

    const projectsContainer = document.getElementById('projectsContainer');
    projectsContainer.innerHTML = '<div class="loading">Loading projects...</div>';

    try {
        // Log the full fetch URL for debugging
        const fetchUrl = `/api/homepage/projects?companyId=${encodeURIComponent(companyId)}`;
        console.log(`Fetching URL: ${fetchUrl}`);

        const response = await fetch(fetchUrl);
        
        // Log response details
        console.log('Response status:', response.status);
        console.log('Response headers:', Object.fromEntries(response.headers.entries()));

        if (!response.ok) {
            // Try to get error details from response
            const errorText = await response.text();
            console.error(`HTTP error! Status: ${response.status}, Details: ${errorText}`);
            throw new Error(`HTTP error! Status: ${response.status}, Details: ${errorText}`);
        }

        const projects = await response.json();
        console.log("Fetched projects:", projects);

        if (!projects || projects.length === 0) {
            projectsContainer.innerHTML = '<div class="error">No projects found for this company.</div>';
            return;
        }

        renderProjectCards(projects);
    } catch (error) {
        console.error("Error fetching projects:", error);
        displayError(`Failed to load projects: ${error.message}`);
    }
}

// Render project cards
function renderProjectCards(projects) {
    const container = document.getElementById('projectsContainer');

    if (!container) {
        console.error("Element with ID 'projectsContainer' not found.");
        return;
    }

    container.innerHTML = '';

    if (!projects || projects.length === 0) {
        container.innerHTML = '<p>No projects found for this company.</p>';
        return;
    }

    projects.forEach(project => {
        if (!project || !project._id) return;

        const card = document.createElement('div');
        card.classList.add('project-card');

        const title = document.createElement('h4');
        title.textContent = project.title || 'Untitled Project';

        const description = document.createElement('p');
        description.textContent = `Description: ${project.description || 'No description available'}`;

        const companyName = document.createElement('p');
        companyName.textContent = `Company: ${project.companyId?.name || 'Unknown Company'}`;

        const button = document.createElement('button');
        button.textContent = 'View Details';
        button.addEventListener('click', () => viewProjectDetails(project._id));

        card.appendChild(title);
        card.appendChild(description);
        card.appendChild(companyName);
        card.appendChild(button);

        container.appendChild(card);
    });
}

// Placeholder for viewing project details
function viewProjectDetails(projectId) {
    console.log(`Viewing details for project ID: ${projectId}`);
    // Implement navigation or modal display for project details
    // Example: window.location.href = `/projects/details/${projectId}`;
}

// Display error messages
function displayError(message, containerId = 'companyCardsContainer') {
    const container = document.getElementById(containerId);
    if (!container) {
        console.error(`Container with ID ${containerId} not found`);
        return;
    }
    container.innerHTML = `<div class="error">${message}</div>`;
}

// Fetch company cards when the page loads
async function fetchCompanyCards() {
    const container = document.getElementById('companyCardsContainer');
    container.innerHTML = '<div class="loading">Loading companies...</div>';

    try {
        const response = await fetch('/api/homepage/companies');
        if (!response.ok) {
            throw new Error(`HTTP error! Status: ${response.status}`);
        }
        const companies = await response.json();
        console.log("Fetched companies:", companies);
        renderCompanyCards(companies);
    } catch (error) {
        console.error("Error fetching companies:", error);
        container.innerHTML = '<div class="error">Failed to load companies. Please check your connection and try again.</div>';
    }
}

async function checkNotifications() {
    const token = localStorage.getItem('accessToken');
    if (!token) {
        console.error('No access token found');
        return;
    }

    try {
        const response = await fetch('/api/notification', {
            method: 'GET',
            headers: {
                'Authorization': `Bearer ${token}`,
                'Content-Type': 'application/json',
            }
        });

        if (!response.ok) {
            if (response.status === 401) {
                const newToken = await refreshToken();
                if (newToken) {
                    return checkNotifications();
                }
                return;
            }
            throw new Error(`HTTP error! Status: ${response.status}`);
        }

        const data = await response.json();
        updateNotificationBadge(data.notifications);
    } catch (error) {
        console.error('Error checking notifications:', error);
    }
}

function updateNotificationBadge(notifications) {
    const badge = document.getElementById('notificationBadge');
    if (!badge) return;

    const unreadCount = notifications ? notifications.length : 0;

    if (unreadCount > 0) {
        badge.style.display = 'block';
        badge.textContent = unreadCount > 99 ? '99+' : unreadCount;
    } else {
        badge.style.display = 'none';
    }
}

// Placeholder for refreshToken (assumed to exist elsewhere)
async function refreshToken() {
    console.warn('refreshToken not implemented');
    return null;
}