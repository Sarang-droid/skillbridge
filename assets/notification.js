document.addEventListener('DOMContentLoaded', function () {
    const notificationList = document.getElementById('notification-list');

    // Function to refresh the token
    const refreshToken = async () => {
        try {
            const refreshToken = localStorage.getItem('refreshToken');
            if (!refreshToken) {
                console.error('No refresh token found in local storage');
                window.location.href = '/login';
                return null;
            }

            const response = await fetch('/api/auth/refreshToken', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ refreshToken }),
            });

            if (!response.ok) {
                const errorData = await response.json();
                console.error('Failed to refresh token:', errorData.message || 'Unknown error');
                localStorage.removeItem('token');
                localStorage.removeItem('refreshToken');
                window.location.href = '/login';
                return null;
            }

            const data = await response.json();
            if (!data.token) {
                throw new Error('No token received from refresh endpoint');
            }

            localStorage.setItem('token', data.token);
            if (data.refreshToken) {
                localStorage.setItem('refreshToken', data.refreshToken);
            }

            return data.token;
        } catch (error) {
            console.error('Error refreshing token:', error);
            localStorage.removeItem('token');
            localStorage.removeItem('refreshToken');
            window.location.href = '/login';
            return null;
        }
    };

    // Function to fetch notifications
    const fetchNotifications = async (token) => {
        try {
            if (!token) {
                console.error('No token provided for notification fetch');
                window.location.href = '/login';
                return;
            }

            const response = await fetch('/api/notification', {
                method: 'GET',
                headers: {
                    'Authorization': `Bearer ${token}`,
                    'Content-Type': 'application/json',
                },
            });

            if (!response.ok) {
                if (response.status === 401) {
                    const newToken = await refreshToken();
                    if (newToken) {
                        return fetchNotifications(newToken);
                    }
                    return;
                }
                
                const errorData = await response.json();
                console.error('Failed to fetch notifications:', errorData.message || 'Unknown error');
                notificationList.innerHTML = '<li>Failed to load notifications. Please try again later.</li>';
                return;
            }

            const data = await response.json();
            console.log('Fetched notifications:', data);

            notificationList.innerHTML = '';

            if (!data.notifications || data.notifications.length === 0) {
                notificationList.innerHTML = '<li>No new notifications</li>';
            } else {
                data.notifications.forEach(notification => {
                    // Filter to show only user-specific welcome messages
                    if (!notification.global && notification.title === 'Welcome to Skillexa! 🎉' && notification.message.includes(localStorage.getItem('userName'))) {
                        const notificationItem = document.createElement('li');
                        notificationItem.className = 'notification-item';
                        notificationItem.innerHTML = `
                            <strong>${notification.title}</strong><br>
                            ${notification.message}<br>
                            <small>${new Date(notification.date).toLocaleString()}</small>
                        `;
                        notificationList.appendChild(notificationItem);
                    }
                });
            }
        } catch (error) {
            console.error('Error fetching notifications:', error);
            notificationList.innerHTML = '<li>Failed to load notifications</li>';
        }
    };

    const token = localStorage.getItem('accessToken');
    const refreshTokenValue = localStorage.getItem('refreshToken');
    if (!token || !refreshTokenValue) {
        console.error('Token or refresh token missing');
        window.location.href = '/login';
    } else {
        // Ensure userName is stored during login or registration
        if (!localStorage.getItem('userName')) {
            const userData = JSON.parse(localStorage.getItem('userData') || '{}');
            localStorage.setItem('userName', userData.name || '');
        }
        fetchNotifications(token);
    }
});