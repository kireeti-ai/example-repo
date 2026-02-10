/**
 * Tasks API service
 */

import apiClient from './api';

const taskService = {
    async getTasks(params = {}) {
        const { data } = await apiClient.get('/tasks', { params });
        return data;
    },

    async getMyTasks(params = {}) {
        const { data } = await apiClient.get('/tasks/my-tasks', { params });
        return data;
    },

    async getTaskById(id) {
        const { data } = await apiClient.get(`/tasks/${id}`);
        return data;
    },

    async getTaskBoard(projectId) {
        const { data } = await apiClient.get(`/tasks/board/${projectId}`);
        return data;
    },

    async createTask(taskData) {
        const { data } = await apiClient.post('/tasks', taskData);
        return data;
    },

    async updateTask(id, updateData) {
        const { data } = await apiClient.patch(`/tasks/${id}`, updateData);
        return data;
    },

    async deleteTask(id) {
        const { data } = await apiClient.delete(`/tasks/${id}`);
        return data;
    },

    async bulkUpdateTasks(taskIds, updates) {
        const { data } = await apiClient.patch('/tasks/bulk', { taskIds, updates });
        return data;
    },

    async getProjectTaskStats(projectId) {
        const { data } = await apiClient.get(`/tasks/stats/${projectId}`);
        return data;
    },
};

export default taskService;
