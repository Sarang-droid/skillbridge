document.getElementById('loginForm').addEventListener('submit', async function (event) {
    event.preventDefault(); // Prevent the form from submitting the traditional way

    // Get the email and password from the form
    const email = document.getElementById('email').value.trim();
    const password = document.getElementById('password').value.trim();

    // Basic validation
    if (!email || !password) {
        alert('Please fill in both email and password fields.');
        return;
    }

    try {
        // Send a POST request to the login API endpoint
        const response = await fetch('/api/auth/login', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({ email, password }),
        });

        // Check if the response is OK (status code 200-299)
        if (!response.ok) {
            // Parse the error message from the response
            const errorData = await response.json();
            throw new Error(errorData.message || 'Login failed. Please try again.');
        }

        // Parse the successful response data
        const data = await response.json();
        console.log('Login Response:', data); 

        // Check if the response contains a token
        if (data.token) {
            // Store the access token and refresh token in localStorage
            localStorage.setItem('accessToken', data.token);
            console.log('Token saved:', data.token);  
            localStorage.setItem('refreshToken', data.refreshToken);

            // Redirect the user to the homepage or dashboard
            window.location.href = '/homepage';
        } else {
            // If no token is present, show an error message
            throw new Error('Login failed. No token received.');
        }
    } catch (error) {
        // Handle any errors that occur during the login process
        console.error('Error during login:', error);
        alert(error.message || 'An error occurred during login. Please try again.');
    }
});