/**
 * @fileoverview Task routes
 * Defines task API routes with validation and authorization.
 * 
 * @swagger
 * tags:
 *   name: Tasks
 *   description: Task management endpoints
 */

const express = require('express');
const taskController = require('../controllers/task.controller');
const {
    authenticate,
    authorizeMinRole,
    validate,
    ValidationSource,
    schemas,
    Roles,
} = require('../../../middleware');
const {
    createTaskSchema,
    updateTaskSchema,
    listTasksQuerySchema,
    bulkUpdateTasksSchema,
} = require('../validators/task.validator');

const router = express.Router();

// All routes require authentication
router.use(authenticate);

/**
 * @swagger
 * /api/v1/tasks/my-tasks:
 *   get:
 *     tags: [Tasks]
 *     summary: Get my tasks
 *     description: Get tasks assigned to the current user
 *     operationId: getMyTasks
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: query
 *         name: page
 *         schema:
 *           type: integer
 *         description: Page number
 *       - in: query
 *         name: limit
 *         schema:
 *           type: integer
 *         description: Items per page
 *       - in: query
 *         name: status
 *         schema:
 *           type: string
 *           enum: [backlog, todo, in_progress, in_review, done, cancelled]
 *         description: Filter by status
 *     responses:
 *       200:
 *         description: List of user's tasks
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/TasksListResponse'
 *       401:
 *         $ref: '#/components/responses/Unauthorized'
 */
router.get(
    '/my-tasks',
    validate(listTasksQuerySchema, ValidationSource.QUERY),
    taskController.getMyTasks
);

/**
 * @swagger
 * /api/v1/tasks/bulk:
 *   patch:
 *     tags: [Tasks]
 *     summary: Bulk update tasks
 *     description: Update multiple tasks at once
 *     operationId: bulkUpdateTasks
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/BulkUpdateTasksRequest'
 *           example:
 *             taskIds: ["507f1f77bcf86cd799439011", "507f1f77bcf86cd799439012"]
 *             updates:
 *               status: done
 *     responses:
 *       200:
 *         description: Tasks updated
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/BulkUpdateResponse'
 *       400:
 *         $ref: '#/components/responses/BadRequest'
 *       401:
 *         $ref: '#/components/responses/Unauthorized'
 */
router.patch(
    '/bulk',
    authorizeMinRole(Roles.MEMBER),
    validate(bulkUpdateTasksSchema),
    taskController.bulkUpdateTasks
);

/**
 * @swagger
 * /api/v1/tasks/board/{projectId}:
 *   get:
 *     tags: [Tasks]
 *     summary: Get task board
 *     description: Get tasks for a project grouped by status (Kanban view)
 *     operationId: getTaskBoard
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: projectId
 *         required: true
 *         schema:
 *           type: string
 *         description: Project ID
 *     responses:
 *       200:
 *         description: Task board
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/TaskBoardResponse'
 *       401:
 *         $ref: '#/components/responses/Unauthorized'
 *       404:
 *         $ref: '#/components/responses/NotFound'
 */
router.get(
    '/board/:projectId',
    taskController.getTaskBoard
);

/**
 * @swagger
 * /api/v1/tasks/stats/{projectId}:
 *   get:
 *     tags: [Tasks]
 *     summary: Get project task statistics
 *     description: Get aggregated statistics for tasks in a project
 *     operationId: getProjectTaskStats
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: projectId
 *         required: true
 *         schema:
 *           type: string
 *         description: Project ID
 *     responses:
 *       200:
 *         description: Task statistics
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/TaskStatsResponse'
 *       401:
 *         $ref: '#/components/responses/Unauthorized'
 */
router.get(
    '/stats/:projectId',
    taskController.getProjectTaskStats
);

/**
 * @swagger
 * /api/v1/tasks:
 *   get:
 *     tags: [Tasks]
 *     summary: List tasks
 *     description: Get a paginated list of tasks with optional filters
 *     operationId: listTasks
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: query
 *         name: page
 *         schema:
 *           type: integer
 *           minimum: 1
 *           default: 1
 *         description: Page number
 *       - in: query
 *         name: limit
 *         schema:
 *           type: integer
 *           minimum: 1
 *           maximum: 100
 *           default: 10
 *         description: Items per page
 *       - in: query
 *         name: projectId
 *         schema:
 *           type: string
 *         description: Filter by project ID
 *       - in: query
 *         name: status
 *         schema:
 *           type: string
 *           enum: [backlog, todo, in_progress, in_review, done, cancelled]
 *         description: Filter by status
 *       - in: query
 *         name: priority
 *         schema:
 *           type: string
 *           enum: [low, medium, high, urgent]
 *         description: Filter by priority
 *       - in: query
 *         name: assigneeId
 *         schema:
 *           type: string
 *         description: Filter by assignee
 *       - in: query
 *         name: search
 *         schema:
 *           type: string
 *         description: Search in title and description
 *       - in: query
 *         name: overdue
 *         schema:
 *           type: boolean
 *         description: Filter overdue tasks
 *     responses:
 *       200:
 *         description: List of tasks
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/TasksListResponse'
 *       401:
 *         $ref: '#/components/responses/Unauthorized'
 */
router.get(
    '/',
    validate(listTasksQuerySchema, ValidationSource.QUERY),
    taskController.listTasks
);

/**
 * @swagger
 * /api/v1/tasks:
 *   post:
 *     tags: [Tasks]
 *     summary: Create task
 *     description: Create a new task in a project
 *     operationId: createTask
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/CreateTaskRequest'
 *           example:
 *             title: Implement user authentication
 *             description: Add JWT-based authentication to the API
 *             projectId: 507f1f77bcf86cd799439011
 *             priority: high
 *             type: feature
 *     responses:
 *       201:
 *         description: Task created
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/TaskResponse'
 *       400:
 *         $ref: '#/components/responses/BadRequest'
 *       401:
 *         $ref: '#/components/responses/Unauthorized'
 *       404:
 *         $ref: '#/components/responses/NotFound'
 */
router.post(
    '/',
    authorizeMinRole(Roles.MEMBER),
    validate(createTaskSchema),
    taskController.createTask
);

/**
 * @swagger
 * /api/v1/tasks/{id}:
 *   get:
 *     tags: [Tasks]
 *     summary: Get task by ID
 *     description: Get details of a specific task
 *     operationId: getTaskById
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: Task ID
 *     responses:
 *       200:
 *         description: Task details
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/TaskResponse'
 *       401:
 *         $ref: '#/components/responses/Unauthorized'
 *       404:
 *         $ref: '#/components/responses/NotFound'
 */
router.get(
    '/:id',
    validate(schemas.idParam, ValidationSource.PARAMS),
    taskController.getTaskById
);

/**
 * @swagger
 * /api/v1/tasks/{id}:
 *   patch:
 *     tags: [Tasks]
 *     summary: Update task
 *     description: Update a task's details
 *     operationId: updateTask
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: Task ID
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/UpdateTaskRequest'
 *           example:
 *             status: in_progress
 *             priority: urgent
 *     responses:
 *       200:
 *         description: Task updated
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/TaskResponse'
 *       400:
 *         $ref: '#/components/responses/BadRequest'
 *       401:
 *         $ref: '#/components/responses/Unauthorized'
 *       404:
 *         $ref: '#/components/responses/NotFound'
 */
router.patch(
    '/:id',
    validate(schemas.idParam, ValidationSource.PARAMS),
    validate(updateTaskSchema),
    taskController.updateTask
);

/**
 * @swagger
 * /api/v1/tasks/{id}:
 *   delete:
 *     tags: [Tasks]
 *     summary: Delete task
 *     description: Delete a task
 *     operationId: deleteTask
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: Task ID
 *     responses:
 *       200:
 *         description: Task deleted
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/SuccessResponse'
 *       401:
 *         $ref: '#/components/responses/Unauthorized'
 *       404:
 *         $ref: '#/components/responses/NotFound'
 */
router.delete(
    '/:id',
    validate(schemas.idParam, ValidationSource.PARAMS),
    taskController.deleteTask
);

module.exports = router;
