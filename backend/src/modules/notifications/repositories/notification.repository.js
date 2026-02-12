/**
 * @fileoverview Notification repository
 * Data access layer for notification operations.
 */

const Notification = require('../Notification.model');

/**
 * @class NotificationRepository
 * @description Data access methods for Notification model
 */
class NotificationRepository {
    /**
     * Find notifications for a user with pagination
     * @param {string} userId - Recipient user ID
     * @param {Object} options - Query options
     * @returns {Promise<{notifications: Notification[], total: number}>}
     */
    async findByUser(userId, options = {}) {
        const {
            page = 1,
            limit = 20,
            isRead,
            type,
        } = options;

        const filter = { recipient: userId };

        if (typeof isRead === 'boolean') {
            filter.isRead = isRead;
        }

        if (type) {
            if (Array.isArray(type)) {
                filter.type = { $in: type };
            } else {
                filter.type = type;
            }
        }

        const skip = (page - 1) * limit;

        const [notifications, total] = await Promise.all([
            Notification.find(filter)
                .populate('sender', 'firstName lastName email avatar')
                .populate('project', 'name key')
                .sort({ createdAt: -1 })
                .skip(skip)
                .limit(limit),
            Notification.countDocuments(filter),
        ]);

        return { notifications, total };
    }

    /**
     * Get unread notification count for a user
     * @param {string} userId - User ID
     * @returns {Promise<number>}
     */
    async getUnreadCount(userId) {
        return Notification.countDocuments({ recipient: userId, isRead: false });
    }

    /**
     * Mark a single notification as read
     * @param {string} notificationId - Notification ID
     * @param {string} userId - User ID (must be the recipient)
     * @returns {Promise<Notification|null>}
     */
    async markAsRead(notificationId, userId) {
        return Notification.findOneAndUpdate(
            { _id: notificationId, recipient: userId },
            { isRead: true, readAt: new Date() },
            { new: true }
        )
            .populate('sender', 'firstName lastName email avatar')
            .populate('project', 'name key');
    }

    /**
     * Mark all notifications as read for a user
     * @param {string} userId - User ID
     * @returns {Promise<Object>} Update result
     */
    async markAllAsRead(userId) {
        return Notification.updateMany(
            { recipient: userId, isRead: false },
            { isRead: true, readAt: new Date() }
        );
    }

    /**
     * Delete a notification
     * @param {string} notificationId - Notification ID
     * @param {string} userId - User ID (must be the recipient)
     * @returns {Promise<Notification|null>}
     */
    async deleteById(notificationId, userId) {
        return Notification.findOneAndDelete({
            _id: notificationId,
            recipient: userId,
        });
    }

    /**
     * Delete all notifications for a user
     * @param {string} userId - User ID
     * @returns {Promise<Object>} Delete result
     */
    async deleteAllByUser(userId) {
        return Notification.deleteMany({ recipient: userId });
    }
}

module.exports = new NotificationRepository();
