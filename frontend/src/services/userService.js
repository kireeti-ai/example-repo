/**
 * Users API service
 */

import apiClient from './api';

const userService = {
    async getUsers(params = {}) {
        const { data } = await apiClient.get('/users', { params });
        return data;
    },

    async getUserById(id) {
        const { data } = await apiClient.get(`/users/${id}`);
        return data;
    },

    async updateProfile(id, updateData) {
        const { data } = await apiClient.patch(`/users/${id}`, updateData);
        return data;
    },

    async updateRole(id, role) {
        const { data } = await apiClient.patch(`/users/${id}/role`, { role });
        return data;
    },

    async deactivateUser(id) {
        const { data } = await apiClient.delete(`/users/${id}`);
        return data;
    },

    async getStatistics() {
        const { data } = await apiClient.get('/users/statistics');
        return data;
    },
};

export default userService;
