/**
 * Auth API service
 */

import apiClient from './api';

const authService = {
    async login(email, password) {
        const { data } = await apiClient.post('/auth/login', { email, password });
        return data;
    },

    async register(userData) {
        const { data } = await apiClient.post('/auth/register', userData);
        return data;
    },

    async logout() {
        try {
            await apiClient.post('/auth/logout');
        } finally {
            localStorage.removeItem('accessToken');
            localStorage.removeItem('refreshToken');
        }
    },

    async getCurrentUser() {
        const { data } = await apiClient.get('/auth/me');
        return data;
    },

    async changePassword(currentPassword, newPassword) {
        const { data } = await apiClient.post('/auth/change-password', {
            currentPassword,
            newPassword,
        });
        return data;
    },

    saveTokens(tokens) {
        localStorage.setItem('accessToken', tokens.accessToken);
        localStorage.setItem('refreshToken', tokens.refreshToken);
    },

    getAccessToken() {
        return localStorage.getItem('accessToken');
    },

    isAuthenticated() {
        return !!localStorage.getItem('accessToken');
    },
};

export default authService;
