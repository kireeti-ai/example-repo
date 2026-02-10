/**
 * @fileoverview Task controller
 * Handles HTTP requests for task endpoints.
 */

const taskService = require('../services/task.service');
const { ApiResponse, asyncHandler } = require('../../../utils');

/**
 * @class TaskController
 * @description Controller for task endpoints
 */
class TaskController {
    /**
     * Create a new task
     * @route POST /api/v1/tasks
     */
    createTask = asyncHandler(async (req, res) => {
        const task = await taskService.createTask(req.body, req.user.userId);

        ApiResponse.created(res, {
            message: 'Task created successfully',
            data: { task },
        });
    });

    /**
     * Get task by ID
     * @route GET /api/v1/tasks/:id
     */
    getTaskById = asyncHandler(async (req, res) => {
        const task = await taskService.getTaskById(req.params.id, req.user.userId);

        ApiResponse.success(res, {
            data: { task },
        });
    });

    /**
     * List tasks
     * @route GET /api/v1/tasks
     */
    listTasks = asyncHandler(async (req, res) => {
        const result = await taskService.listTasks(req.query);

        ApiResponse.paginated(res, {
            data: result.tasks,
            page: result.page,
            limit: result.limit,
            total: result.total,
        });
    });

    /**
     * Get task board (grouped by status)
     * @route GET /api/v1/tasks/board/:projectId
     */
    getTaskBoard = asyncHandler(async (req, res) => {
        const board = await taskService.getTaskBoard(req.params.projectId);

        ApiResponse.success(res, {
            data: { board },
        });
    });

    /**
     * Update task
     * @route PATCH /api/v1/tasks/:id
     */
    updateTask = asyncHandler(async (req, res) => {
        const task = await taskService.updateTask(
            req.params.id,
            req.body,
            req.user.userId
        );

        ApiResponse.success(res, {
            message: 'Task updated successfully',
            data: { task },
        });
    });

    /**
     * Delete task
     * @route DELETE /api/v1/tasks/:id
     */
    deleteTask = asyncHandler(async (req, res) => {
        await taskService.deleteTask(req.params.id, req.user.userId);

        ApiResponse.success(res, {
            message: 'Task deleted successfully',
        });
    });

    /**
     * Bulk update tasks
     * @route PATCH /api/v1/tasks/bulk
     */
    bulkUpdateTasks = asyncHandler(async (req, res) => {
        const result = await taskService.bulkUpdateTasks(
            req.body.taskIds,
            req.body.updates,
            req.user.userId
        );

        ApiResponse.success(res, {
            message: `${result.modifiedCount} tasks updated`,
            data: result,
        });
    });

    /**
     * Get my tasks
     * @route GET /api/v1/tasks/my-tasks
     */
    getMyTasks = asyncHandler(async (req, res) => {
        const result = await taskService.getUserTasks(req.user.userId, req.query);

        ApiResponse.paginated(res, {
            data: result.tasks,
            page: result.page,
            limit: result.limit,
            total: result.total,
        });
    });

    /**
     * Get project task statistics
     * @route GET /api/v1/tasks/stats/:projectId
     */
    getProjectTaskStats = asyncHandler(async (req, res) => {
        const stats = await taskService.getProjectTaskStats(req.params.projectId);

        ApiResponse.success(res, {
            data: { stats },
        });
    });
}

module.exports = new TaskController();
