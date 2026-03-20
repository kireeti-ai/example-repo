/**
 * Projects API service
 */

import apiClient from './api';

const projectService = {
    async getProjects(params = {}) {
        const { data } = await apiClient.get('/projects', { params });
        return data;
    },

    async getProjectById(id) {
        const { data } = await apiClient.get(`/projects/${id}`);
        return data;
    },

    async createProject(projectData) {
        const { data } = await apiClient.post('/projects', projectData);
        return data;
    },

    async updateProject(id, updateData) {
        const { data } = await apiClient.patch(`/projects/${id}`, updateData);
        return data;
    },

    async deleteProject(id) {
        const { data } = await apiClient.delete(`/projects/${id}`);
        return data;
    },

    async addMember(projectId, memberData) {
        const { data } = await apiClient.post(`/projects/${projectId}/members`, memberData);
        return data;
    },

    async removeMember(projectId, memberId) {
        const { data } = await apiClient.delete(`/projects/${projectId}/members/${memberId}`);
        return data;
    },

    async getProjectAnalytics(params = {}) {
        const { data } = await apiClient.get('/projects/analytics', { params });
        return data;
    },
};

export default projectService;
