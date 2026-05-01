const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:8000';

class ApiService {
    constructor() {
        this.token = localStorage.getItem('token');
    }

    setToken(token) {
        this.token = token;
        if (token) {
            localStorage.setItem('token', token);
        } else {
            localStorage.removeItem('token');
        }
    }

    getHeaders() {
        const headers = {
            'Content-Type': 'application/json',
        };
        if (this.token) {
            headers['Authorization'] = `Bearer ${this.token}`;
            console.log('Adding auth header with token:', this.token.substring(0, 20) + '...');
        } else {
            console.log('No token available for auth header');
        }
        return headers;
    }

    async request(endpoint, options = {}) {
        const url = `${API_BASE_URL}${endpoint}`;
        const config = {
            ...options,
            headers: this.getHeaders(),
        };

        try {
            const response = await fetch(url, config);
            
            if (!response.ok) {
                const error = await response.json().catch(() => ({ detail: 'Request failed' }));
                throw new Error(error.detail || `HTTP ${response.status}`);
            }

            if (response.status === 204) {
                return null;
            }

            return await response.json();
        } catch (error) {
            console.error('API Error:', error);
            throw error;
        }
    }

    // Auth
    async login(username, password) {
        const response = await this.request('/api/auth/login', {
            method: 'POST',
            body: JSON.stringify({ username, password }),
        });
        this.setToken(response.access_token);
        console.log('Token set after login:', this.token ? 'YES' : 'NO');
        return response;
    }

    async register(userData) {
        const response = await this.request('/api/auth/register', {
            method: 'POST',
            body: JSON.stringify(userData),
        });
        console.log('Register response:', response);
        console.log('Access token from response:', response.access_token ? 'EXISTS' : 'MISSING');
        this.setToken(response.access_token);
        console.log('Token set after register:', this.token ? 'YES' : 'NO');
        console.log('Token value:', this.token?.substring(0, 20) + '...');
        return response;
    }

    logout() {
        this.setToken(null);
    }

    // Users
    async getCurrentUser() {
        return this.request('/api/users/me');
    }

    async updateProfile(data) {
        return this.request('/api/users/me', {
            method: 'PUT',
            body: JSON.stringify(data),
        });
    }

    async getUser(userId) {
        return this.request(`/api/users/${userId}`);
    }

    async searchPlayers(params = {}) {
        const query = new URLSearchParams(params).toString();
        const queryString = query ? `?${query}` : '';
        return this.request(`/api/users/${queryString}`);
    }

    async addUserSport(sportData) {
        return this.request('/api/users/me/sports', {
            method: 'POST',
            body: JSON.stringify(sportData),
        });
    }

    async getUserSports() {
        return this.request('/api/users/me/sports');
    }

    async updateUserLocation(latitude, longitude, sharingEnabled) {
        return this.request('/api/users/me/location', {
            method: 'PUT',
            body: JSON.stringify({
                latitude,
                longitude,
                sharing_enabled: sharingEnabled,
            }),
        });
    }

    async getNearbyPlayers(params = {}) {
        const query = new URLSearchParams(params).toString();
        return this.request(`/api/users/nearby?${query}`);
    }

    async getMapPlayers(params = {}) {
        const query = new URLSearchParams(params).toString();
        const suffix = query ? `?${query}` : '';
        return this.request(`/api/users/map-players${suffix}`);
    }

    async deleteUserSport(sportId) {
        return this.request(`/api/users/me/sports/${sportId}`, {
            method: 'DELETE',
        });
    }

    // Events
    async getEvents(params = {}) {
        const query = new URLSearchParams(params).toString();
        const queryString = query ? `?${query}` : '';
        return this.request(`/api/events/${queryString}`);
    }

    async getEvent(eventId) {
        return this.request(`/api/events/${eventId}`);
    }

    async createEvent(eventData) {
        return this.request('/api/events', {
            method: 'POST',
            body: JSON.stringify(eventData),
        });
    }

    async updateEvent(eventId, eventData) {
        return this.request(`/api/events/${eventId}`, {
            method: 'PUT',
            body: JSON.stringify(eventData),
        });
    }

    async deleteEvent(eventId) {
        return this.request(`/api/events/${eventId}`, {
            method: 'DELETE',
        });
    }

    async joinEvent(eventId) {
        return this.request(`/api/events/${eventId}/join`, {
            method: 'POST',
        });
    }

    async leaveEvent(eventId) {
        return this.request(`/api/events/${eventId}/leave`, {
            method: 'POST',
        });
    }

    async getEventParticipants(eventId) {
        return this.request(`/api/events/${eventId}/participants`);
    }

    // Messages
    async getMessages() {
        return this.request('/api/messages');
    }

    async sendMessage(receiverId, content) {
        return this.request('/api/messages', {
            method: 'POST',
            body: JSON.stringify({ receiver_id: receiverId, content }),
        });
    }

    async getConversations() {
        return this.request('/api/messages/conversations');
    }

    async markMessageAsRead(messageId) {
        return this.request(`/api/messages/${messageId}/read`, {
            method: 'PUT',
        });
    }

    // Dashboard
    async getDashboardStats() {
        return this.request('/api/dashboard/stats');
    }

    // Settings
    async changePassword(currentPassword, newPassword) {
        return this.request('/api/settings/password', {
            method: 'PUT',
            body: JSON.stringify({ current_password: currentPassword, new_password: newPassword }),
        });
    }

    async changeEmail(newEmail) {
        return this.request('/api/settings/email', {
            method: 'PUT',
            body: JSON.stringify({ new_email: newEmail }),
        });
    }

    async updateNotificationSettings(settings) {
        return this.request('/api/settings/notifications', {
            method: 'PUT',
            body: JSON.stringify(settings),
        });
    }

    async updatePrivacySettings(settings) {
        return this.request('/api/settings/privacy', {
            method: 'PUT',
            body: JSON.stringify(settings),
        });
    }

    async deleteAccount() {
        return this.request('/api/settings/account', {
            method: 'DELETE',
        });
    }
}

export default new ApiService();
