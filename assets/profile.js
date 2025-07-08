document.addEventListener('DOMContentLoaded', async () => {
    console.log('DOM fully loaded and parsed');
    const token = localStorage.getItem('accessToken');
    const refreshToken = localStorage.getItem('refreshToken');
    console.log('Retrieved token:', token);
    console.log('Retrieved refresh token:', refreshToken);

    if (!token || !refreshToken) {
        console.error('Token or refresh token missing');
        window.location.href = '/login';
        return;
    }

    await loadProfileData(token);
});

async function loadProfileData(token) {
    console.log('Loading profile data with token:', token);
    try {
        const response = await fetch('https://skillexa.in/api/profile/me', {
            method: 'GET',
            headers: {
                'Authorization': `Bearer ${token}`
            }
        });

        console.log('Fetch response status:', response.status);
        const data = await response.json();
        console.log('Response data:', data);

        if (response.ok) {
            console.log('Profile data fetched successfully');
            document.getElementById('profile-name').textContent = data.name || '';
            document.getElementById('profile-bio').textContent = data.bio || '';
            document.getElementById('profile-points').textContent = data.points || 0;
            document.getElementById('profile-badges-count').textContent = data.badges ? data.badges.length : 0;
            document.getElementById('profile-school').textContent = data.school || '';
            document.getElementById('profile-education').textContent = data.education || '';
            document.getElementById('profile-linkedin').innerHTML = data.linkedin ? `<a href="${data.linkedin}" target="_blank">${data.linkedin}</a>` : '<a href="#" target="_blank">Not set</a>';
            document.getElementById('profile-leetcode').innerHTML = data.leetcode ? `<a href="${data.leetcode}" target="_blank">${data.leetcode}</a>` : '<a href="#" target="_blank">Not set</a>';
            document.getElementById('profile-github').innerHTML = data.github ? `<a href="${data.github}" target="_blank">${data.github}</a>` : '<a href="#" target="_blank">Not set</a>';

            const profileImageElement = document.getElementById('profile-image');
            if (profileImageElement) {
                const profilePictureUrl = data.profilePicture 
                    ? `https://skillexa.in${data.profilePicture}?t=${Date.now()}` 
                    : 'https://skillexa.in/assets/default-profile.png';
                console.log('Profile picture URL set:', profilePictureUrl);
                profileImageElement.src = profilePictureUrl;
            }

            document.getElementById('badge-grid').innerHTML = (data.badges || []).map(badge => `
                <div class="badge-item">${badge}</div>
            `).join('');

            document.getElementById('completed-projects-list').innerHTML = (data.completedProjects || []).map(project => `
                <div class="completed-project">
                    <p><strong>${project.projectName}</strong></p>
                    <p>${new Date(project.submissionDate).toLocaleDateString()}</p>
                </div>
            `).join('');

            document.getElementById('name').value = data.name || '';
            document.getElementById('email').value = data.email || '';
            document.getElementById('bio').value = data.bio || '';
            document.getElementById('school').value = data.school || '';
            document.getElementById('education').value = data.education || '';
            document.getElementById('linkedin').value = data.linkedin || '';
            document.getElementById('leetcode').value = data.leetcode || '';
            document.getElementById('github').value = data.github || '';
            console.log('Form fields populated');
        } else if (response.status === 401) {
            console.log('Unauthorized, attempting token refresh');
            const newToken = await handleUnauthorized();
            if (newToken) await loadProfileData(newToken);
        } else {
            console.error('Error fetching profile data:', data.message);
            alert(`Error: ${data.message}`);
        }
    } catch (error) {
        console.error('Fetch error:', error);
        alert('An error occurred while loading your profile.');
        window.location.href = '/login';
    }
}

async function handleUnauthorized() {
    console.log('Handling unauthorized access...');
    const refreshToken = localStorage.getItem('refreshToken');
    if (!refreshToken) {
        console.log('No refresh token found, redirecting to login');
        alert('Session expired. Please log in again.');
        window.location.href = '/login';
        return null;
    }

    try {
        console.log('Attempting to refresh token...');
        const response = await fetch('https://skillexa.in/api/auth/refreshToken', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({ refreshToken })
        });

        const data = await response.json();
        console.log('Refresh token response:', data);

        if (response.ok) {
            console.log('Token refreshed successfully');
            localStorage.setItem('accessToken', data.token);
            return data.token;
        } else {
            console.error('Failed to refresh token:', data.message);
            alert(data.message);
            window.location.href = '/login';
            return null;
        }
    } catch (error) {
        console.error('Error during token refresh:', error);
        alert('An error occurred. Please log in again.');
        window.location.href = '/login';
        return null;
    }
}

function previewImage(event) {
    console.log('Previewing image...');
    const file = event.target.files[0];
    const preview = document.getElementById('image-preview');

    if (file) {
        const validTypes = ['image/jpeg', 'image/png', 'image/gif'];
        if (!validTypes.includes(file.type)) {
            console.log('Invalid file type');
            alert('Please upload a valid image (JPEG, PNG, GIF).');
            event.target.value = '';
            preview.style.display = 'none';
            return;
        }

        if (file.size > 2 * 1024 * 1024) {
            console.log('File size exceeds limit');
            alert('File size must be less than 2MB.');
            event.target.value = '';
            preview.style.display = 'none';
            return;
        }

        const reader = new FileReader();
        reader.onload = function(e) {
            preview.src = e.target.result;
            preview.style.display = 'block';
            console.log('Image preview displayed');
        };
        reader.readAsDataURL(file);
    }
}

document.getElementById('profile-form').addEventListener('submit', async (event) => {
    console.log('Profile form submission started');
    event.preventDefault();
    const submitButton = event.target.querySelector('button[type="submit"]');
    submitButton.disabled = true;

    const loadingIndicator = document.createElement('div');
    loadingIndicator.textContent = 'Uploading...';
    loadingIndicator.className = 'loading-indicator';
    document.body.appendChild(loadingIndicator);
    console.log('Loading indicator shown');

    const formData = new FormData();
    formData.append('name', document.getElementById('name').value);
    formData.append('email', document.getElementById('email').value);
    formData.append('bio', document.getElementById('bio').value);
    formData.append('school', document.getElementById('school').value);
    formData.append('education', document.getElementById('education').value);
    formData.append('linkedin', document.getElementById('linkedin').value);
    formData.append('leetcode', document.getElementById('leetcode').value);
    formData.append('github', document.getElementById('github').value);

    const profilePictureFile = document.getElementById('profile-picture-upload').files[0];
    if (profilePictureFile) {
        formData.append('profilePicture', profilePictureFile);
        console.log('Profile picture file added to form data');
    }

    const password = document.getElementById('password').value;
    if (password) {
        formData.append('password', password);
        console.log('Password added to form data');
    }

    try {
        console.log('Sending profile update request...');
        let token = localStorage.getItem('accessToken');
        const response = await fetch('https://skillexa.in/api/profile/update', {
            method: 'PUT',
            headers: {
                'Authorization': `Bearer ${token}`
            },
            body: formData
        });

        const data = await response.json();
        console.log('Profile update response:', data);

        if (response.ok) {
            console.log('Profile updated successfully');
            alert('Profile updated successfully!');
            await loadProfileData(token);
            document.getElementById('edit-profile-form').style.display = 'none';
        } else if (response.status === 401) {
            console.log('Unauthorized access detected during profile update');
            token = await handleUnauthorized();
            if (token) {
                const retryResponse = await fetch('https://skillexa.in/api/profile/update', {
                    method: 'PUT',
                    headers: {
                        'Authorization': `Bearer ${token}`
                    },
                    body: formData
                });
                const retryData = await retryResponse.json();
                if (retryResponse.ok) {
                    console.log('Profile updated successfully after token refresh');
                    alert('Profile updated successfully!');
                    await loadProfileData(token);
                    document.getElementById('edit-profile-form').style.display = 'none';
                } else {
                    console.error('Error updating profile after refresh:', retryData.message);
                    alert(`Error: ${retryData.message}`);
                }
            }
        } else {
            console.error('Error updating profile:', data.message);
            alert(`Error: ${data.message}`);
        }
    } catch (error) {
        console.error('Error updating profile:', error);
        alert(`Error: ${error.message || 'An error occurred while updating your profile.'}`);
    } finally {
        submitButton.disabled = false;
        document.body.removeChild(loadingIndicator);
        console.log('Loading indicator removed');
    }
});

async function shareProfile() {
    console.log('Share profile initiated');
    const token = localStorage.getItem('accessToken');
    if (!token) {
        console.error('No token found for sharing profile');
        alert('Please log in to share your profile.');
        return;
    }

    try {
        const profileResponse = await fetch('https://skillexa.in/api/profile/me', {
            method: 'GET',
            headers: {
                'Authorization': `Bearer ${token}`
            }
        });

        if (!profileResponse.ok) {
            console.error('Failed to fetch profile for sharing:', profileResponse.status);
            throw new Error('Failed to fetch profile data');
        }

        const profileData = await profileResponse.json();
        const userId = profileData._id; // Now _id should be present
        if (!userId) {
            console.error('User ID not found in profile data');
            throw new Error('User ID missing from profile data');
        }

        const publicProfileResponse = await fetch(`https://skillexa.in/api/profile/${userId}`, {
            method: 'GET'
        });

        if (!publicProfileResponse.ok) {
            console.error('Failed to fetch public profile:', publicProfileResponse.status);
            throw new Error('Failed to fetch public profile');
        }

        const publicProfileData = await publicProfileResponse.json();
        const shareableUrl = publicProfileData.shareableUrl || `https://skillexa.in/profile/${userId}`;

        if (navigator.share) {
            await navigator.share({
                title: `${publicProfileData.name || 'My'}'s Profile on SkillExa`,
                text: `Check out my profile on SkillExa: ${publicProfileData.bio || 'An awesome user profile!'}`,
                url: shareableUrl
            });
            console.log('Profile shared via Web Share API');
        } else {
            const shareText = encodeURIComponent(`Check out my profile on SkillExa: ${publicProfileData.bio || 'An awesome user profile!'}`);
            const shareUrl = encodeURIComponent(shareableUrl);

            const linkedinUrl = `https://www.linkedin.com/sharing/share-offsite/?url=${shareUrl}`;
            const instagramUrl = `https://www.instagram.com/?url=${shareUrl}`;

            const shareWindow = window.open('', '_blank', 'width=600,height=400');
            shareWindow.document.write(`
                <html>
                <head><title>Share Your SkillExa Profile</title></head>
                <body>
                    <h2>Share Your Profile</h2>
                    <p><a href="${linkedinUrl}" target="_blank">Share on LinkedIn</a></p>
                    <p><a href="${instagramUrl}" target="_blank">Share on Instagram</a></p>
                    <p>Or copy this link: <input type="text" value="${shareableUrl}" readonly> <button onclick="navigator.clipboard.writeText('${shareableUrl}')">Copy</button></p>
                </body>
                </html>
            `);
            console.log('Fallback share options displayed');
        }
    } catch (error) {
        console.error('Error sharing profile:', error);
        alert('An error occurred while preparing your profile for sharing.');
    }
}

document.getElementById('profile-picture-upload')?.addEventListener('change', previewImage);