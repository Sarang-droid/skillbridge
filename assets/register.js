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

// --- Validation Regexes ---
const nameRegex = /^[A-Za-z\s]{2,30}$/;
const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
const phoneRegex = /^\+?\d{10,15}$/;
const passwordRegex = /^(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/;

// --- Helper to show error below a field ---
function showFieldError(fieldId, message) {
    let errorDiv = document.getElementById(fieldId + '-error');
    if (!errorDiv) {
        errorDiv = document.createElement('div');
        errorDiv.id = fieldId + '-error';
        errorDiv.className = 'error';
        errorDiv.style.marginTop = '-8px';
        errorDiv.style.marginBottom = '8px';
        const field = document.getElementById(fieldId);
        field.parentNode.insertBefore(errorDiv, field.nextSibling);
    }
    errorDiv.textContent = message;
}
function clearFieldError(fieldId) {
    const errorDiv = document.getElementById(fieldId + '-error');
    if (errorDiv) errorDiv.textContent = '';
}

// --- Instant Validation Handlers ---
document.getElementById('name').addEventListener('input', function() {
    if (!nameRegex.test(this.value.trim())) {
        showFieldError('name', 'Please enter a valid full name (only letters, 2-30 chars).');
    } else {
        clearFieldError('name');
    }
});
document.getElementById('email').addEventListener('input', function() {
    if (!emailRegex.test(this.value.trim())) {
        showFieldError('email', 'Please enter a valid email address.');
    } else {
        clearFieldError('email');
    }
});
document.getElementById('phone').addEventListener('input', function() {
    if (!phoneRegex.test(this.value.trim())) {
        showFieldError('phone', 'Please enter a valid phone number (10-15 digits, may start with +).');
    } else {
        clearFieldError('phone');
    }
});
document.getElementById('password').addEventListener('input', function() {
    if (!passwordRegex.test(this.value)) {
        showFieldError('password', 'Password must be 8+ chars, 1 uppercase, 1 number, 1 special.');
    } else {
        clearFieldError('password');
    }
});
document.getElementById('confirmPassword').addEventListener('input', function() {
    if (this.value !== document.getElementById('password').value) {
        showFieldError('confirmPassword', 'Passwords do not match.');
    } else {
        clearFieldError('confirmPassword');
    }
});
document.getElementById('degree').addEventListener('input', function() {
    if (!this.value.trim()) {
        showFieldError('degree', 'Degree is required.');
    } else {
        clearFieldError('degree');
    }
});
document.getElementById('experience').addEventListener('input', function() {
    const val = this.value.trim();
    if (val === '' || isNaN(val) || Number(val) < 0) {
        showFieldError('experience', 'Experience must be a non-negative number.');
    } else {
        clearFieldError('experience');
    }
});

// --- Skills/Interests Validation ---
function validateSkills() {
    const checked = Array.from(skillsCheckboxes).some(cb => cb.checked);
    if (!checked) {
        showFieldError('selectedSkills', 'Select at least one skill.');
    } else {
        clearFieldError('selectedSkills');
    }
}
function validateInterests() {
    const checked = Array.from(interestsCheckboxes).some(cb => cb.checked);
    if (!checked) {
        showFieldError('selectedInterests', 'Select at least one interest.');
    } else {
        clearFieldError('selectedInterests');
    }
}
skillsCheckboxes.forEach(cb => cb.addEventListener('change', validateSkills));
interestsCheckboxes.forEach(cb => cb.addEventListener('change', validateInterests));

// Handle form submission
document.getElementById('registerForm').addEventListener('submit', async function(event) {
    event.preventDefault();
    let valid = true;
    const name = document.getElementById('name').value.trim();
    const email = document.getElementById('email').value.trim();
    const phone = document.getElementById('phone').value.trim();
    const password = document.getElementById('password').value;
    const confirmPassword = document.getElementById('confirmPassword').value;
    const degree = document.getElementById('degree').value.trim();
    const experience = document.getElementById('experience').value.trim();
    // Validate all fields
    if (!nameRegex.test(name)) { showFieldError('name', 'Please enter a valid full name (only letters, 2-30 chars).'); valid = false; }
    if (!emailRegex.test(email)) { showFieldError('email', 'Please enter a valid email address.'); valid = false; }
    if (!phoneRegex.test(phone)) { showFieldError('phone', 'Please enter a valid phone number (10-15 digits, may start with +).'); valid = false; }
    if (!passwordRegex.test(password)) { showFieldError('password', 'Password must be 8+ chars, 1 uppercase, 1 number, 1 special.'); valid = false; }
    if (password !== confirmPassword) { showFieldError('confirmPassword', 'Passwords do not match.'); valid = false; }
    if (!degree) { showFieldError('degree', 'Degree is required.'); valid = false; }
    if (experience === '' || isNaN(experience) || Number(experience) < 0) { showFieldError('experience', 'Experience must be a non-negative number.'); valid = false; }
    if (!Array.from(skillsCheckboxes).some(cb => cb.checked)) { showFieldError('selectedSkills', 'Select at least one skill.'); valid = false; }
    if (!Array.from(interestsCheckboxes).some(cb => cb.checked)) { showFieldError('selectedInterests', 'Select at least one interest.'); valid = false; }
    if (!valid) return;

    // --- reCAPTCHA check ---
    const recaptchaResponse = grecaptcha.getResponse();
    if (!recaptchaResponse) {
        showFieldError('errorMessage', 'Please complete the reCAPTCHA.');
        return;
    }

    // Get selected skills and interests
    const skills = Array.from(skillsCheckboxes)
        .filter(checkbox => checkbox.checked)
        .map(checkbox => checkbox.value);
    const interests = Array.from(interestsCheckboxes)
        .filter(checkbox => checkbox.checked)
        .map(checkbox => checkbox.value);

    // Clear previous errors
    errorMessage.textContent = '';

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
            headers: { 
                'Content-Type': 'application/json',
                'Accept': 'application/json'
            },
            body: JSON.stringify({
                name,
                email,
                phone,
                password,
                confirmPassword,
                skills,
                interests,
                degree,
                experience: Number(experience),
                recaptchaToken: recaptchaResponse
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