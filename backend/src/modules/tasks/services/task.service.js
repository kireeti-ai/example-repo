/**
 * @fileoverview Task service
 * Business logic for task operations.
 */

const taskRepository = require('../repositories/task.repository');
const Project = require('../../projects/Project.model');
const Activity = require('../../activity/Activity.model');
const { ApiError } = require('../../../utils');

/**
 * @class TaskService
 * @description Handles task business logic
 */
class TaskService {
    /**
     * Create a new task
     * @param {Object} taskData - Task data
     * @param {string} reporterId - ID of the user creating the task
     * @returns {Promise<Object>}
     * @throws {ApiError} If project not found or user doesn't have access
     */
    async createTask(taskData, reporterId) {
        const { projectId, assigneeId, parentTaskId, ...rest } = taskData;

        // Verify project exists and user has access
        const project = await Project.findById(projectId);
        if (!project) {
            throw ApiError.notFound('Project not found');
        }

        if (!project.isMember(reporterId) && project.visibility !== 'public') {
            throw ApiError.forbidden('You do not have access to this project');
        }

        // Verify parent task if provided
        if (parentTaskId) {
            const parentTask = await taskRepository.findById(parentTaskId);
            if (!parentTask) {
                throw ApiError.notFound('Parent task not found');
            }
            if (parentTask.project.toString() !== projectId) {
                throw ApiError.badRequest('Parent task must be in the same project');
            }
        }

        const task = await taskRepository.create({
            ...rest,
            project: projectId,
            assignee: assigneeId || null,
            reporter: reporterId,
            parentTask: parentTaskId || null,
        });

        // Log activity
        await Activity.log({
            action: 'task.create',
            actor: reporterId,
            entityType: 'task',
            entityId: task._id,
            project: projectId,
            metadata: {
                taskNumber: task.taskNumber,
                taskTitle: task.title,
            },
        });

        return task.toJSON();
    }

    /**
     * Get task by ID
     * @param {string} taskId - Task ID
     * @param {string} userId - ID of requesting user
     * @returns {Promise<Object>}
     * @throws {ApiError} If task not found
     */
    async getTaskById(taskId, userId) {
        const task = await taskRepository.findById(taskId, {
            populate: ['project', 'assignee', 'reporter', 'labels', 'subtasks'],
        });

        if (!task) {
            throw ApiError.notFound('Task not found');
        }

        return task.toJSON();
    }

    /**
     * List tasks with pagination and filtering
     * @param {Object} options - Query options
     * @returns {Promise<{tasks: Object[], total: number, page: number, limit: number}>}
     */
    async listTasks(options = {}) {
        const { tasks, total } = await taskRepository.findAll(options);

        return {
            tasks: tasks.map((task) => task.toJSON()),
            total,
            page: options.page || 1,
            limit: options.limit || 10,
        };
    }

    /**
     * Get tasks grouped by status (for Kanban board)
     * @param {string} projectId - Project ID
     * @returns {Promise<Object>}
     */
    async getTaskBoard(projectId) {
        return taskRepository.findByProject(projectId, { groupByStatus: true });
    }

    /**
     * Update task
     * @param {string} taskId - Task ID
     * @param {Object} updateData - Data to update
     * @param {string} userId - ID of user performing the update
     * @returns {Promise<Object>}
     * @throws {ApiError} If task not found
     */
    async updateTask(taskId, updateData, userId) {
        const task = await taskRepository.findById(taskId, { populate: ['project'] });

        if (!task) {
            throw ApiError.notFound('Task not found');
        }

        // Track changes for activity log
        const changes = {
            before: {},
            after: {},
        };

        // Determine action type based on changes
        let actionType = 'task.update';
        if (updateData.status && updateData.status !== task.status) {
            actionType = 'task.status_change';
            changes.before.status = task.status;
            changes.after.status = updateData.status;
        }
        if (updateData.assigneeId !== undefined) {
            if (updateData.assigneeId && !task.assignee) {
                actionType = 'task.assign';
            } else if (!updateData.assigneeId && task.assignee) {
                actionType = 'task.unassign';
            }
            changes.before.assignee = task.assignee?.toString();
            changes.after.assignee = updateData.assigneeId;
            updateData.assignee = updateData.assigneeId;
            delete updateData.assigneeId;
        }
        if (updateData.priority && updateData.priority !== task.priority) {
            actionType = 'task.priority_change';
            changes.before.priority = task.priority;
            changes.after.priority = updateData.priority;
        }

        const updatedTask = await taskRepository.updateById(taskId, updateData);

        // Log activity
        await Activity.log({
            action: actionType,
            actor: userId,
            entityType: 'task',
            entityId: taskId,
            project: task.project._id,
            changes,
            metadata: {
                taskNumber: task.taskNumber,
                taskTitle: task.title,
            },
        });

        return updatedTask.toJSON();
    }

    /**
     * Delete task
     * @param {string} taskId - Task ID
     * @param {string} userId - ID of user deleting the task
     * @returns {Promise<void>}
     * @throws {ApiError} If task not found
     */
    async deleteTask(taskId, userId) {
        const task = await taskRepository.findById(taskId, { populate: ['project'] });

        if (!task) {
            throw ApiError.notFound('Task not found');
        }

        await taskRepository.deleteById(taskId);

        // Update project task count
        await Project.findByIdAndUpdate(task.project._id, {
            $inc: { taskCount: -1 },
        });

        // Log activity
        await Activity.log({
            action: 'task.delete',
            actor: userId,
            entityType: 'task',
            entityId: taskId,
            project: task.project._id,
            metadata: {
                taskNumber: task.taskNumber,
                taskTitle: task.title,
            },
        });
    }

    /**
     * Bulk update tasks
     * @param {string[]} taskIds - Array of task IDs
     * @param {Object} updates - Data to update
     * @param {string} userId - ID of user performing the update
     * @returns {Promise<Object>}
     */
    async bulkUpdateTasks(taskIds, updates, userId) {
        const result = await taskRepository.bulkUpdate(taskIds, updates);

        return {
            modifiedCount: result.modifiedCount,
        };
    }

    /**
     * Get task statistics for a project
     * @param {string} projectId - Project ID
     * @returns {Promise<Object>}
     */
    async getProjectTaskStats(projectId) {
        return taskRepository.getProjectTaskStats(projectId);
    }

    /**
     * Get user's assigned tasks
     * @param {string} userId - User ID
     * @param {Object} options - Query options
     * @returns {Promise<Object>}
     */
    async getUserTasks(userId, options = {}) {
        return this.listTasks({ ...options, assigneeId: userId });
    }
}

module.exports = new TaskService();
