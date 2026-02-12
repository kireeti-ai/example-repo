/**
 * @fileoverview Notification controller
 * Handles HTTP requests for notification endpoints.
 */

const notificationService = require('../services/notification.service');
const { ApiResponse, asyncHandler } = require('../../../utils');

/**
 * @class NotificationController
 * @description Controller for notification endpoints
 */
class NotificationController {
    /**
     * Get current user's notifications
     * @route GET /api/v1/notifications
     */
    getNotifications = asyncHandler(async (req, res) => {
        const result = await notificationService.getUserNotifications(
            req.user.userId,
            req.query
        );

        ApiResponse.paginated(res, {
            data: result.notifications,
            page: result.page,
            limit: result.limit,
            total: result.total,
        });
    });

    /**
     * Get unread notification count
     * @route GET /api/v1/notifications/unread-count
     */
    getUnreadCount = asyncHandler(async (req, res) => {
        const result = await notificationService.getUnreadCount(req.user.userId);

        ApiResponse.success(res, {
            data: result,
        });
    });

    /**
     * Mark a notification as read
     * @route PATCH /api/v1/notifications/:id/read
     */
    markAsRead = asyncHandler(async (req, res) => {
        const notification = await notificationService.markAsRead(
            req.params.id,
            req.user.userId
        );

        ApiResponse.success(res, {
            message: 'Notification marked as read',
            data: { notification },
        });
    });

    /**
     * Mark all notifications as read
     * @route PATCH /api/v1/notifications/read-all
     */
    markAllAsRead = asyncHandler(async (req, res) => {
        const result = await notificationService.markAllAsRead(req.user.userId);

        ApiResponse.success(res, {
            message: 'All notifications marked as read',
            data: result,
        });
    });

    /**
     * Delete a notification
     * @route DELETE /api/v1/notifications/:id
     */
    deleteNotification = asyncHandler(async (req, res) => {
        await notificationService.deleteNotification(
            req.params.id,
            req.user.userId
        );

        ApiResponse.success(res, {
            message: 'Notification deleted successfully',
        });
    });

    /**
     * Delete all notifications
     * @route DELETE /api/v1/notifications/all
     */
    deleteAllNotifications = asyncHandler(async (req, res) => {
        const result = await notificationService.deleteAllNotifications(req.user.userId);

        ApiResponse.success(res, {
            message: 'All notifications deleted',
            data: result,
        });
    });
}

module.exports = new NotificationController();
