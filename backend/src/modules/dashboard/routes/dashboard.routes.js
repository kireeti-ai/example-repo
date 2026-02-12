/**
 * @fileoverview Dashboard routes
 * Defines dashboard analytics API routes with authentication and authorization.
 * 
 * @swagger
 * tags:
 *   name: Dashboard
 *   description: Dashboard analytics and statistics endpoints
 */

const express = require('express');
const dashboardController = require('../controllers/dashboard.controller');
const { authenticate, authorize, Roles } = require('../../../middleware');

const router = express.Router();

// All routes require authentication
router.use(authenticate);

/**
 * @swagger
 * /api/v1/dashboard/overview:
 *   get:
 *     tags: [Dashboard]
 *     summary: Get user dashboard overview
 *     description: Returns a comprehensive dashboard with personal task stats, project stats, recent activity, upcoming deadlines, and overdue task count
 *     operationId: getDashboardOverview
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Dashboard overview with task stats, project stats, recent activity, upcoming deadlines, and overdue count
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                 data:
 *                   type: object
 *                   properties:
 *                     overview:
 *                       type: object
 *                       properties:
 *                         tasks:
 *                           type: object
 *                           description: Task count breakdown by status
 *                         projects:
 *                           type: object
 *                           description: Project ownership and membership counts
 *                         recentActivity:
 *                           type: array
 *                           description: Recent user activities
 *                         upcomingDeadlines:
 *                           type: array
 *                           description: Tasks due within 7 days
 *                         overdueTaskCount:
 *                           type: integer
 *                           description: Count of overdue tasks
 *       401:
 *         $ref: '#/components/responses/Unauthorized'
 */
router.get('/overview', dashboardController.getOverview);

/**
 * @swagger
 * /api/v1/dashboard/admin:
 *   get:
 *     tags: [Dashboard]
 *     summary: Get admin system dashboard
 *     description: Returns system-wide statistics including user stats, project stats, task stats, registration trends, and task completion trends (admin only)
 *     operationId: getAdminDashboard
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: System-wide admin dashboard including users, projects, tasks, and trends
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                 data:
 *                   type: object
 *                   properties:
 *                     dashboard:
 *                       type: object
 *                       properties:
 *                         users:
 *                           type: object
 *                           description: User counts by role and activity status
 *                         projects:
 *                           type: object
 *                           description: Project counts by status
 *                         tasks:
 *                           type: object
 *                           description: Task counts by status
 *                         trends:
 *                           type: object
 *                           properties:
 *                             registrations:
 *                               type: array
 *                               description: Daily registration counts for the last 30 days
 *                             taskCompletions:
 *                               type: array
 *                               description: Daily task completion counts for the last 30 days
 *       401:
 *         $ref: '#/components/responses/Unauthorized'
 *       403:
 *         $ref: '#/components/responses/Forbidden'
 */
router.get('/admin', authorize(Roles.ADMIN), dashboardController.getAdminDashboard);

/**
 * @swagger
 * /api/v1/dashboard/workload/{projectId}:
 *   get:
 *     tags: [Dashboard]
 *     summary: Get project workload distribution
 *     description: Returns workload distribution across team members for a specific project, showing task counts, priority breakdown, and estimated hours per member
 *     operationId: getProjectWorkload
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
 *         description: Workload distribution per team member with priority and status breakdowns
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                 data:
 *                   type: object
 *                   properties:
 *                     workload:
 *                       type: array
 *                       items:
 *                         type: object
 *                         properties:
 *                           user:
 *                             type: object
 *                           totalTasks:
 *                             type: integer
 *                           totalEstimatedHours:
 *                             type: number
 *                           priorityBreakdown:
 *                             type: object
 *                           statusBreakdown:
 *                             type: object
 *       401:
 *         $ref: '#/components/responses/Unauthorized'
 *       404:
 *         $ref: '#/components/responses/NotFound'
 */
router.get('/workload/:projectId', dashboardController.getProjectWorkload);

module.exports = router;
