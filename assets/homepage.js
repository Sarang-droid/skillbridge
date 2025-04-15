document.addEventListener("DOMContentLoaded", () => {
    console.log("DOM fully loaded and parsed");

    const searchForm = document.getElementById('searchForm');
    const searchInput = document.getElementById('searchInput');
    const suggestionsContainer = document.getElementById('suggestionsContainer');
    const clearButton = document.getElementById('clearButton');
    const industryFilter = document.getElementById('industryFilter');

    if (searchForm && searchInput && suggestionsContainer && industryFilter && clearButton) {
        searchInput.addEventListener('input', debounce(handleInput, 300));
        searchForm.addEventListener('submit', fetchCompanies);
        industryFilter.addEventListener('change', fetchCompanies);
        clearButton.addEventListener('click', clearSearch);
        searchInput.addEventListener('keydown', handleKeyDown);
        searchInput.focus();
    } else {
        console.error("Required elements not found.");
    }

    fetchCompanyCards(); // Fetch companies when the page loads
    checkNotifications();
    // Check for new notifications every minute
    setInterval(checkNotifications, 60000);
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

// Display company suggestions
function displaySuggestions(companies, query) {
    const container = document.getElementById('suggestionsContainer');
    container.innerHTML = '';

    if (companies.length === 0) {
        container.innerHTML = '<div class="suggestion-item">No companies found</div>';
        return;
    }

    companies.forEach((company, index) => {
        const suggestionItem = document.createElement('div');
        suggestionItem.classList.add('suggestion-item');
        suggestionItem.innerHTML = highlightMatch(company.name, query);
        suggestionItem.addEventListener('click', () => {
            document.getElementById('searchInput').value = company.name;
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
    fetchCompanyCards(); // Reset to initial state
}

// Keyboard navigation for suggestions
function handleKeyDown(event) {
    const suggestions = document.querySelectorAll('.suggestion-item');
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

    console.log("Fetching from URL:", apiUrl); // Log the URL

    try {
        const response = await fetch(apiUrl);
        console.log("Response Status:", response.status); // Log status
        if (!response.ok) {
            throw new Error(`HTTP error! Status: ${response.status}`);
        }
        const companies = await response.json();
        console.log("Raw API Response:", companies); // Log raw response
        console.log("Response Length:", companies.length); // Log length
        renderCompanyCards(companies);
    } catch (error) {
        console.error("Error fetching companies:", error);
        container.innerHTML = '<div class="error">Failed to load companies. Please try again later.</div>';
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
        const card = document.createElement('div');
        card.classList.add('company-card');

        // Create card content
        const title = document.createElement('h3');
        title.textContent = company.name;

        const description = document.createElement('p');
        description.textContent = `Description: ${company.description}`;

        const applicants = document.createElement('p');
        applicants.textContent = `Total Applicants: ${company.totalApplicants}`;

        const button = document.createElement('button');
        button.textContent = 'View Projects';
        button.addEventListener('click', () => viewCompanyProjects(company._id));

        // Append elements to card
        card.appendChild(title);
        card.appendChild(description);
        card.appendChild(applicants);
        card.appendChild(button);

        container.appendChild(card);
    });
}

// Redirect to view projects for a company
function viewCompanyProjects(companyId) {
    console.log(`Redirecting to projects for company ID: ${companyId}`);
    window.location.href = `/company/projects?companyId=${companyId}`;
}

// Display error messages
function displayError(message) {
    const container = document.getElementById('companyCardsContainer');
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
        container.innerHTML = '<div class="error">Failed to load companies. Please try again later.</div>';
    }
}

async function checkNotifications() {
    const token = localStorage.getItem('accessToken');
    if (!token) {
        console.error('No token found');
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
                // Token expired, try to refresh it
                const newToken = await refreshToken();
                if (newToken) {
                    return checkNotifications();
                }
                return;
            }
            throw new Error('Failed to fetch notifications');
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

    // Count unread notifications
    const unreadCount = notifications ? notifications.length : 0;

    if (unreadCount > 0) {
        badge.style.display = 'block';
        badge.textContent = unreadCount > 99 ? '99+' : unreadCount;
    } else {
        badge.style.display = 'none';
    }
}