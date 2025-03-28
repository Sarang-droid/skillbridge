// Redirect to the login page when the login button is clicked
document.getElementById('loginButton').addEventListener('click', function() {
    window.location.href = '/login';
});

// Function to toggle the collapsible list
function toggleList(listId) {
    const listContent = document.getElementById(listId);
    const arrow = listContent.previousElementSibling.querySelector('.arrow');

    if (listContent.style.display === 'block') {
        listContent.style.display = 'none';
        arrow.style.transform = 'rotate(0deg)'; // Reset arrow
    } else {
        listContent.style.display = 'block';
        arrow.style.transform = 'rotate(180deg)'; // Rotate arrow
    }
}

// Password visibility toggle functionality
document.getElementById('togglePassword').addEventListener('click', function() {
    togglePasswordVisibility('password', 'togglePassword');
});

document.getElementById('toggleConfirmPassword').addEventListener('click', function() {
    togglePasswordVisibility('confirmPassword', 'toggleConfirmPassword');
});

function togglePasswordVisibility(fieldId, iconId) {
    const passwordField = document.getElementById(fieldId);
    const icon = document.getElementById(iconId);
    
    if (passwordField.type === 'password') {
        passwordField.type = 'text';
        icon.classList.remove('fa-eye');
        icon.classList.add('fa-eye-slash');
    } else {
        passwordField.type = 'password';
        icon.classList.remove('fa-eye-slash');
        icon.classList.add('fa-eye');
    }
}

// Get references to the checkboxes and selected items containers
const skillsCheckboxes = document.querySelectorAll('#skillsList input[type="checkbox"]');
const interestsCheckboxes = document.querySelectorAll('#interestsList input[type="checkbox"]');
const selectedSkills = document.getElementById('selectedSkills');
const selectedInterests = document.getElementById('selectedInterests');

// Function to update the selected items box
function updateSelectedItems(checkboxes, selectedItemsContainer) {
    selectedItemsContainer.innerHTML = ''; // Clear the container

    checkboxes.forEach(checkbox => {
        if (checkbox.checked) {
            const span = document.createElement('span');
            span.textContent = checkbox.value;
            selectedItemsContainer.appendChild(span);
        }
    });

    // Add a "+" sign if any checkbox is selected
    if (Array.from(checkboxes).some(checkbox => checkbox.checked)) {
        const plusSign = document.createElement('span');
        plusSign.textContent = ' +';
        plusSign.style.color = '#4CAF50';
        plusSign.style.fontWeight = 'bold';
        selectedItemsContainer.appendChild(plusSign);
    }
}

// Add event listeners to skills checkboxes
skillsCheckboxes.forEach(checkbox => {
    checkbox.addEventListener('change', () => updateSelectedItems(skillsCheckboxes, selectedSkills));
});

// Add event listeners to interests checkboxes
interestsCheckboxes.forEach(checkbox => {
    checkbox.addEventListener('change', () => updateSelectedItems(interestsCheckboxes, selectedInterests));
});

// Handle form submission
document.getElementById('registerForm').addEventListener('submit', async function(event) {
    event.preventDefault();

    // Get form values
    const name = document.getElementById('name').value.trim();
    const email = document.getElementById('email').value.trim();
    const phone = document.getElementById('phone').value.trim();
    const password = document.getElementById('password').value.trim();
    const confirmPassword = document.getElementById('confirmPassword').value.trim();
    const degree = document.getElementById('degree').value.trim();
    const experience = document.getElementById('experience').value.trim();
    const errorMessage = document.getElementById('errorMessage');

    // Get selected skills and interests
    const skills = Array.from(skillsCheckboxes)
        .filter(checkbox => checkbox.checked)
        .map(checkbox => checkbox.value);
    const interests = Array.from(interestsCheckboxes)
        .filter(checkbox => checkbox.checked)
        .map(checkbox => checkbox.value);

    // Clear previous errors
    errorMessage.textContent = '';

    // Basic validation
    if (!/\S+@\S+\.\S+/.test(email)) {
        errorMessage.textContent = 'Please enter a valid email address.';
        return;
    }

    if (password.length < 8) {
        errorMessage.textContent = 'Password must be at least 8 characters.';
        return;
    }

    if (password !== confirmPassword) {
        errorMessage.textContent = 'Passwords do not match.';
        return;
    }

    // Log the payload before sending the request
    console.log('Payload:', {
        name,
        email,
        phone,
        password,
        confirmPassword,
        skills,
        interests,
        degree,
        experience
    });

    try {
        // Send registration request to the server
        const response = await fetch('/api/register', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
                name,
                email,
                phone,
                password,
                confirmPassword,
                skills,
                interests,
                degree,
                experience
            })
        });

        const data = await response.json();

        if (response.ok) {
            alert('Registration successful! Please check your email for verification.');
            window.location.href = '/login';
        } else {
            errorMessage.textContent = data.message;
        }
    } catch (error) {
        errorMessage.textContent = 'Error occurred during registration.';
        console.error('Error:', error);
    }
});