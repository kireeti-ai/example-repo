/**
 * @fileoverview Notification routes
 * Defines notification API routes with validation and authentication.
 * 
 * @swagger
 * tags:
 *   name: Notifications
 *   description: Notification management endpoints
 */

const express = require('express');
const notificationController = require('../controllers/notification.controller');
const { authenticate, validate, ValidationSource, schemas } = require('../../../middleware');
const { listNotificationsQuerySchema } = require('../validators/notification.validator');

const router = express.Router();

// All routes require authentication
router.use(authenticate);

/**
 * @swagger
 * /api/v1/notifications/unread-count:
 *   get:
 *     tags: [Notifications]
 *     summary: Get unread notification count
 *     description: Returns the total number of unread notifications for the current user
 *     operationId: getUnreadNotificationCount
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Unread notification count
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
 *                     unreadCount:
 *                       type: integer
 *       401:
 *         $ref: '#/components/responses/Unauthorized'
 */
router.get('/unread-count', notificationController.getUnreadCount);

/**
 * @swagger
 * /api/v1/notifications/read-all:
 *   patch:
 *     tags: [Notifications]
 *     summary: Mark all notifications as read
 *     description: Marks all unread notifications for the current user as read
 *     operationId: markAllNotificationsAsRead
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: All notifications marked as read
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
 *                     modifiedCount:
 *                       type: integer
 *       401:
 *         $ref: '#/components/responses/Unauthorized'
 */
router.patch('/read-all', notificationController.markAllAsRead);

/**
 * @swagger
 * /api/v1/notifications/all:
 *   delete:
 *     tags: [Notifications]
 *     summary: Delete all notifications
 *     description: Deletes all notifications for the current user
 *     operationId: deleteAllNotifications
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: All notifications deleted
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
 *                     deletedCount:
 *                       type: integer
 *       401:
 *         $ref: '#/components/responses/Unauthorized'
 */
router.delete('/all', notificationController.deleteAllNotifications);

/**
 * @swagger
 * /api/v1/notifications:
 *   get:
 *     tags: [Notifications]
 *     summary: Get current user's notifications
 *     description: Returns a paginated list of notifications for the authenticated user
 *     operationId: listNotifications
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
 *           maximum: 50
 *           default: 20
 *         description: Items per page
 *       - in: query
 *         name: isRead
 *         schema:
 *           type: boolean
 *         description: Filter by read status
 *       - in: query
 *         name: type
 *         schema:
 *           type: string
 *           enum: [task_assigned, task_unassigned, task_status_changed, task_priority_changed, task_due_soon, task_overdue, task_comment, task_mentioned, project_invited, project_role_changed, project_removed, comment_reply, comment_reaction, system_announcement]
 *         description: Filter by notification type
 *     responses:
 *       200:
 *         description: List of notifications
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/NotificationsListResponse'
 *       401:
 *         $ref: '#/components/responses/Unauthorized'
 */
router.get(
    '/',
    validate(listNotificationsQuerySchema, ValidationSource.QUERY),
    notificationController.getNotifications
);

/**
 * @swagger
 * /api/v1/notifications/{id}/read:
 *   patch:
 *     tags: [Notifications]
 *     summary: Mark notification as read
 *     description: Mark a specific notification as read
 *     operationId: markNotificationAsRead
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: Notification ID
 *     responses:
 *       200:
 *         description: Notification marked as read
 *       401:
 *         $ref: '#/components/responses/Unauthorized'
 *       404:
 *         $ref: '#/components/responses/NotFound'
 */
router.patch(
    '/:id/read',
    validate(schemas.idParam, ValidationSource.PARAMS),
    notificationController.markAsRead
);

/**
 * @swagger
 * /api/v1/notifications/{id}:
 *   delete:
 *     tags: [Notifications]
 *     summary: Delete a notification
 *     description: Delete a specific notification
 *     operationId: deleteNotification
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: Notification ID
 *     responses:
 *       200:
 *         description: Notification deleted
 *       401:
 *         $ref: '#/components/responses/Unauthorized'
 *       404:
 *         $ref: '#/components/responses/NotFound'
 */
router.delete(
    '/:id',
    validate(schemas.idParam, ValidationSource.PARAMS),
    notificationController.deleteNotification
);

module.exports = router;
