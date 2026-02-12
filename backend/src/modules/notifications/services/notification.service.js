/**
 * @fileoverview Notification service
 * Business logic for notification operations.
 */

const notificationRepository = require('../repositories/notification.repository');
const { ApiError } = require('../../../utils');

/**
 * @class NotificationService
 * @description Handles notification business logic
 */
class NotificationService {
    /**
     * Get notifications for the authenticated user
     * @param {string} userId - User ID
     * @param {Object} options - Query options
     * @returns {Promise<Object>}
     */
    async getUserNotifications(userId, options = {}) {
        const { notifications, total } = await notificationRepository.findByUser(userId, options);

        return {
            notifications: notifications.map((n) => n.toJSON()),
            total,
            page: options.page || 1,
            limit: options.limit || 20,
        };
    }

    /**
     * Get unread notification count
     * @param {string} userId - User ID
     * @returns {Promise<Object>}
     */
    async getUnreadCount(userId) {
        const count = await notificationRepository.getUnreadCount(userId);
        return { unreadCount: count };
    }

    /**
     * Mark a notification as read
     * @param {string} notificationId - Notification ID
     * @param {string} userId - Requesting user ID
     * @returns {Promise<Object>}
     */
    async markAsRead(notificationId, userId) {
        const notification = await notificationRepository.markAsRead(notificationId, userId);

        if (!notification) {
            throw ApiError.notFound('Notification not found');
        }

        return notification.toJSON();
    }

    /**
     * Mark all notifications as read
     * @param {string} userId - User ID
     * @returns {Promise<Object>}
     */
    async markAllAsRead(userId) {
        const result = await notificationRepository.markAllAsRead(userId);
        return { modifiedCount: result.modifiedCount };
    }

    /**
     * Delete a notification
     * @param {string} notificationId - Notification ID
     * @param {string} userId - Requesting user ID
     * @returns {Promise<void>}
     */
    async deleteNotification(notificationId, userId) {
        const notification = await notificationRepository.deleteById(notificationId, userId);

        if (!notification) {
            throw ApiError.notFound('Notification not found');
        }
    }

    /**
     * Delete all notifications for a user
     * @param {string} userId - User ID
     * @returns {Promise<Object>}
     */
    async deleteAllNotifications(userId) {
        const result = await notificationRepository.deleteAllByUser(userId);
        return { deletedCount: result.deletedCount };
    }
}

module.exports = new NotificationService();
